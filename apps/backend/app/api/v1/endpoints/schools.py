from typing import Any, List, Optional
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.dependencies.auth import (
    get_current_active_superuser,
    get_current_active_user,
    get_current_school,
    check_permissions,
)
from app.security.password import get_password_hash
from app.db.session import get_db
from app.models import School, User, Course, UserRole
from app.schemas.school import (
    School as SchoolSchema,
    SchoolCreate,
    SchoolUpdate,
    SchoolInDB,
    SchoolWithStats,
)
from app.schemas.user import UserCreate

router = APIRouter()

@router.get("/", response_model=List[SchoolInDB])
async def get_schools(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_superuser),
    skip: int = 0,
    limit: int = 100,
) -> List[SchoolInDB]:
    """
    Retrieve schools.
    """
    query = select(School).offset(skip).limit(limit)
    result = await db.execute(query)
    schools = result.scalars().all()
    return schools

@router.post("/", response_model=SchoolInDB, status_code=status.HTTP_201_CREATED)
async def create_school(
    *,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_superuser),
    school_in: SchoolCreate,
) -> SchoolInDB:
    """
    Create new school.
    """
    # Check if school with same domain exists
    query = select(School).where(School.domain == school_in.domain)
    result = await db.execute(query)
    if result.scalar_one_or_none():
        raise HTTPException(
            status_code=400,
            detail="A school with this domain already exists.",
        )

    school = School(**school_in.model_dump(exclude={"admin"}))
    db.add(school)
    await db.flush()  # Flush to get the school ID

    # Create school admin user
    admin_data = school_in.admin.model_dump()
    admin = User(
        email=admin_data["email"],
        hashed_password=get_password_hash(admin_data["password"]),
        first_name=admin_data["first_name"],
        last_name=admin_data["last_name"],
        role=UserRole.SCHOOL_ADMIN,
        school_id=school.id,
    )
    db.add(admin)
    await db.commit()
    await db.refresh(school)
    
    return school

@router.get("/me", response_model=SchoolWithStats)
async def get_my_school(
    *,
    db: AsyncSession = Depends(get_db),
    current_school: School = Depends(get_current_school),
) -> Any:
    """
    Get current school with statistics.
    """
    # Get statistics
    stats = await db.execute(
        select(
            func.count(User.id).filter(User.role == UserRole.STUDENT).label("total_students"),
            func.count(User.id).filter(User.role == UserRole.TEACHER).label("total_teachers"),
            func.count(Course.id).label("total_courses"),
            func.count(Course.id).filter(Course.status == "active").label("active_courses"),
        )
        .select_from(School)
        .outerjoin(User, User.school_id == School.id)
        .outerjoin(Course, Course.school_id == School.id)
        .where(School.id == current_school.id)
        .group_by(School.id)
    )
    
    stats_row = stats.one()
    school_dict = SchoolSchema.model_validate(current_school).model_dump()
    school_dict.update({
        "total_students": stats_row.total_students,
        "total_teachers": stats_row.total_teachers,
        "total_courses": stats_row.total_courses,
        "active_courses": stats_row.active_courses,
        "storage_used": 0,  # TODO: Implement storage calculation
    })
    
    return school_dict

@router.put("/me", response_model=SchoolSchema)
async def update_school(
    *,
    db: AsyncSession = Depends(get_db),
    current_school: School = Depends(get_current_school),
    current_user: User = Depends(check_permissions([UserRole.SCHOOL_ADMIN])),
    school_in: SchoolUpdate,
) -> Any:
    """
    Update school settings. Only school admin can update their school.
    """
    # Check domain uniqueness if being updated
    if school_in.domain and school_in.domain != current_school.domain:
        result = await db.execute(
            select(School).where(School.domain == school_in.domain)
        )
        if result.scalar_one_or_none():
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Domain already registered",
            )

    for field, value in school_in.model_dump(exclude_unset=True).items():
        setattr(current_school, field, value)

    await db.commit()
    await db.refresh(current_school)
    return current_school

@router.get("/{school_id}", response_model=SchoolWithStats)
async def get_school(
    school_id: UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
) -> SchoolWithStats:
    """
    Get school by ID.
    """
    # Check permissions
    if current_user.role != UserRole.SUPER_ADMIN and current_user.school_id != school_id:
        raise HTTPException(
            status_code=403,
            detail="Not enough permissions to access this school",
        )

    query = select(School).where(School.id == school_id)
    result = await db.execute(query)
    school = result.scalar_one_or_none()
    
    if not school:
        raise HTTPException(
            status_code=404,
            detail="School not found",
        )

    # Get school stats
    users_query = select(User).where(User.school_id == school_id)
    users_result = await db.execute(users_query)
    users = users_result.scalars().all()

    courses_query = select(Course).where(Course.school_id == school_id)
    courses_result = await db.execute(courses_query)
    courses = courses_result.scalars().all()

    return SchoolWithStats(
        **school.__dict__,
        total_users=len(users),
        total_courses=len(courses),
        active_courses=len([c for c in courses if c.status == "active"]),
    )

@router.put("/{school_id}", response_model=SchoolInDB)
async def update_school(
    *,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
    school_id: UUID,
    school_in: SchoolUpdate,
) -> SchoolInDB:
    """
    Update school.
    """
    # Check permissions
    if current_user.role != UserRole.SUPER_ADMIN and current_user.school_id != school_id:
        raise HTTPException(
            status_code=403,
            detail="Not enough permissions to update this school",
        )

    query = select(School).where(School.id == school_id)
    result = await db.execute(query)
    school = result.scalar_one_or_none()
    
    if not school:
        raise HTTPException(
            status_code=404,
            detail="School not found",
        )

    # Update school attributes
    for field, value in school_in.model_dump(exclude_unset=True).items():
        setattr(school, field, value)

    await db.commit()
    await db.refresh(school)
    return school

@router.delete("/{school_id}")
async def delete_school(
    *,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_superuser),
    school_id: UUID,
) -> None:
    """
    Delete school.
    """
    query = select(School).where(School.id == school_id)
    result = await db.execute(query)
    school = result.scalar_one_or_none()
    
    if not school:
        raise HTTPException(
            status_code=404,
            detail="School not found",
        )

    await db.delete(school)
    await db.commit() 