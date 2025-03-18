from typing import Any, List, Dict
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.dependencies.auth import get_current_active_superuser, get_current_user
from app.api.dependencies.admin import admin_required
from app.db.session import get_db
from app.models import User, School, Course
from app.models.user import UserRole, UserStatus
from app.schemas.user import User as UserSchema, UserCreate, UserUpdate
from app.schemas.school import School as SchoolSchema, SchoolCreate
from app.services.course import CourseService

from app.security.password import get_password_hash

router = APIRouter()

@router.get("/stats")
async def get_platform_stats(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_superuser),
) -> Any:
    """
    Get platform-wide statistics.
    Only accessible by super admin.
    """
    # Get total users
    users_query = select(func.count()).select_from(User)
    users_result = await db.execute(users_query)
    total_users = users_result.scalar()
    
    # Get total schools
    schools_query = select(func.count()).select_from(School)
    schools_result = await db.execute(schools_query)
    total_schools = schools_result.scalar()

    # # Get total revenue (from course purchases)
    # revenue_query = select(func.sum(CoursePurchase.amount_paid)).select_from(CoursePurchase).where(
    #     CoursePurchase.payment_status == 'completed'
    # )
    # revenue_result = await db.execute(revenue_query)
    # total_revenue = revenue_result.scalar() or 0

    # Get active users percentage
    active_users_query = select(func.count()).select_from(User).where(User.is_active == True)
    active_users_result = await db.execute(active_users_query)
    active_users = active_users_result.scalar()
    active_users_percentage = round((active_users / total_users * 100) if total_users > 0 else 0, 1)
    
    return {
        "totalUsers": total_users,
        "totalSchools": total_schools,
        # "totalRevenue": f"${total_revenue:,.2f}",
        "totalRevenue": "$ 100,000.00",
        "activeUsers": f"{active_users_percentage}%",
    }

@router.get("/health")
async def get_system_health(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_superuser),
) -> Any:
    """
    Get system health metrics.
    Only accessible by super admin.
    """
    # In a real application, these metrics would come from monitoring services
    # For now, we'll return mock data
    return {
        "serverStatus": "Operational",
        "uptime": "99.9%",
        "responseTime": "120ms",
        "activeConnections": 1250,
        "cpuUsage": "45%",
        "memoryUsage": "60%",
        "storageUsed": "45%",
        "lastBackup": "2024-03-15 03:00 AM"
    }

@router.get("/users", response_model=List[UserSchema])
async def list_users(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_superuser),
    skip: int = 0,
    limit: int = 100,
    role: UserRole | None = None,
) -> Any:
    """
    List all users.
    Only accessible by super admin.
    """
    query = select(User)
    if role:
        query = query.where(User.role == role)
    query = query.offset(skip).limit(limit)
    
    result = await db.execute(query)
    users = result.scalars().all()
    return users

@router.post("/users", response_model=UserSchema)
async def create_user(
    *,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_superuser),
    user_in: UserCreate,
) -> Any:
    """
    Create new user.
    Only accessible by super admin.
    """
    # Check if user with this email exists
    user = await db.scalar(select(User).where(User.email == user_in.email))
    if user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered",
        )
    
    # Create new user
    user = User(**user_in.model_dump(exclude={"password"}))
    user.password = get_password_hash(user_in.password)
    
    db.add(user)
    await db.commit()
    await db.refresh(user)
    return user

@router.get("/users/{user_id}", response_model=UserSchema)
async def get_user(
    user_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_superuser),
) -> Any:
    """
    Get user by ID.
    Only accessible by super admin.
    """
    user = await db.get(User, user_id)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found",
        )
    return user

@router.put("/users/{user_id}", response_model=UserSchema)
async def update_user(
    user_id: str,
    *,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_superuser),
    user_in: UserUpdate,
) -> Any:
    """
    Update user.
    Only accessible by super admin.
    """
    user = await db.get(User, user_id)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found",
        )
    
    # Update user fields
    for field, value in user_in.model_dump(exclude_unset=True).items():
        if field == "password" and value:
            user.password = get_password_hash(value)
        else:
            setattr(user, field, value)
    
    await db.commit()
    await db.refresh(user)
    return user

@router.delete("/users/{user_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_user(
    user_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_superuser),
) -> None:
    """
    Delete user.
    Only accessible by super admin.
    """
    user = await db.get(User, user_id)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found",
        )
    
    await db.delete(user)
    await db.commit()

@router.post("/users/{user_id}/suspend", response_model=UserSchema)
async def suspend_user(
    user_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_superuser),
) -> Any:
    """
    Suspend a user account.
    This is an admin-specific operation that deactivates the account and sets its status to suspended.
    Only accessible by super admin.
    """
    user = await db.get(User, user_id)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found",
        )
    
    user.is_active = False
    user.status = UserStatus.SUSPENDED
    await db.commit()
    await db.refresh(user)
    return user

@router.post("/users/{user_id}/reinstate", response_model=UserSchema)
async def reinstate_user(
    user_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_superuser),
) -> Any:
    """
    Reinstate a suspended user account.
    This is an admin-specific operation that reactivates the account and sets its status back to active.
    Only accessible by super admin.
    """
    user = await db.get(User, user_id)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found",
        )
    
    user.is_active = True
    user.status = UserStatus.ACTIVE
    await db.commit()
    await db.refresh(user)
    return user 


@router.get("/schools", response_model=List[SchoolSchema])
async def list_schools(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_superuser),
) -> Any:
    """
    List all schools.
    Only accessible by super admin.
    """
    query = select(School)
    result = await db.execute(query)
    schools = result.scalars().all()
    return schools


@router.post("/schools", response_model=SchoolSchema)
async def create_school(
    *,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_superuser),
    school_in: SchoolCreate,
) -> Any:
    """
    Create a new school.
    Only accessible by super admin.
    """
    try:
        print(f"School in: {school_in.model_dump()}")
        school = School(**school_in.model_dump(exclude={"admin"}))
        db.add(school)
        await db.commit()
        await db.refresh(school)

        print(f"School added: {school}")

    except Exception as e:
        print(f"Error adding school: {e}")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e),
        )

    # Create admin user
    try:
        print("Creating admin user")
        print(f"School in: {school_in.model_dump()}")
        user = await db.scalar(select(User).where(User.email == school_in.admin["email"]))
        if user:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email already registered",
            )
        user = User(
            email=school_in.admin["email"],
            password=get_password_hash(school_in.admin["password"]),
            role=UserRole.SCHOOL_ADMIN,
            school_id=school.id,
            first_name=school_in.admin["first_name"],
            last_name=school_in.admin["last_name"],
            settings=None,
        )   
        db.add(user)
        await db.commit()
        await db.refresh(user)

    except Exception as e:
        print(f"Error adding admin user: {e}")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e),
        )

    return school

@router.get("/content/stats", response_model=Dict[str, Any])
async def get_content_stats(
    *,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(admin_required)
) -> Dict[str, Any]:
    """Get stats for the content dashboard."""
    try:
        stats = await CourseService.get_content_stats(db, current_user)
        return stats
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
