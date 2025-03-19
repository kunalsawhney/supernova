from typing import Any, List, Optional
from uuid import UUID, uuid4

from fastapi import APIRouter, Depends, HTTPException, status, Query, Path
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.dependencies.auth import (
    get_current_active_user,
    get_current_school,
    check_permissions,
)
from app.db.session import get_db
from app.models.user import User, UserRole
from app.models.school import School
from app.schemas.user import (
    User as UserSchema,
    UserCreate,
    UserUpdate,
    UserWithSchool,
)
from app.services.user import UserService

router = APIRouter()

@router.get("/me", response_model=UserWithSchool)
async def read_user_me(
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db)
) -> Any:
    """
    Get current user.
    """
    # # Load the user in the current session to avoid DetachedInstanceError
    # user = await UserService.get_user(db, current_user.id, with_school=True)
    # if not user:
    #     raise HTTPException(
    #         status_code=status.HTTP_404_NOT_FOUND,
    #         detail="User not found"
    #     )
    return current_user

@router.put("/me", response_model=UserSchema)
async def update_user_me(
    *,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
    user_in: UserUpdate,
) -> Any:
    """
    Update current user.
    """
    try:
        # Using UserService for updating the user
        updated_user = await UserService.update_user(
            db, current_user, current_user.id, user_in
        )
        await db.commit()
        return updated_user
    except Exception as e:
        await db.rollback()
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/", response_model=List[UserSchema])
async def list_users(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(check_permissions([UserRole.SCHOOL_ADMIN, UserRole.SUPER_ADMIN])),
    current_school: School = Depends(get_current_school),
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=500),
    role: Optional[UserRole] = None,
    search: Optional[str] = None,
) -> Any:
    """
    Retrieve users.
    """
    try:
        # For school admin, limit to their school
        school_id = None
        if current_user.role == UserRole.SCHOOL_ADMIN and current_school:
            school_id = current_school.id
            
        users = await UserService.list_users(
            db, current_user, skip=skip, limit=limit, 
            role=role, school_id=school_id, search=search
        )
        return users
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/", response_model=UserSchema)
async def create_user(
    *,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(check_permissions([UserRole.SCHOOL_ADMIN, UserRole.SUPER_ADMIN])),
    current_school: School = Depends(get_current_school),
    user_in: UserCreate,
    school_role: Optional[Any] = Query(None),
) -> Any:
    """
    Create new user.
    """
    try:
        # Determine school ID based on user role
        school_id = None
        if current_user.role == UserRole.SCHOOL_ADMIN and current_school:
            school_id = current_school.id
            
        user = await UserService.create_user(
            db, current_user, user_in, 
            school_id=school_id, school_role=school_role
        )
        await db.commit()
        return user
    except Exception as e:
        await db.rollback()
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/{user_id}", response_model=UserSchema)
async def get_user(
    user_id: UUID = Path(...),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(check_permissions([UserRole.SCHOOL_ADMIN, UserRole.SUPER_ADMIN])),
    current_school: School = Depends(get_current_school),
) -> Any:
    """
    Get a specific user by ID.
    """
    try:
        user = await UserService.get_user(db, user_id, with_school=True)
        if not user:
            raise HTTPException(
                status_code=404,
                detail="User not found",
            )
            
        # If school admin, check if user belongs to their school
        if current_user.role == UserRole.SCHOOL_ADMIN and current_school:
            user_in_school = False
            for school_member in user.schools:
                if school_member.school_id == current_school.id:
                    user_in_school = True
                    break
                    
            if not user_in_school:
                raise HTTPException(
                    status_code=403,
                    detail="User not in your school",
                )
                
        return user
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.put("/{user_id}", response_model=UserSchema)
async def update_user(
    user_id: UUID = Path(...),
    *,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(check_permissions([UserRole.SCHOOL_ADMIN, UserRole.SUPER_ADMIN])),
    current_school: School = Depends(get_current_school),
    user_in: UserUpdate,
) -> Any:
    """
    Update a user.
    """
    try:
        user = await UserService.update_user(
            db, current_user, user_id, user_in, current_school=current_school
        )
        await db.commit()
        return user
    except Exception as e:
        await db.rollback()
        raise HTTPException(status_code=400, detail=str(e))

@router.delete("/{user_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_user(
    user_id: UUID = Path(...),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(check_permissions([UserRole.SCHOOL_ADMIN, UserRole.SUPER_ADMIN])),
    current_school: School = Depends(get_current_school),
) -> None:
    """
    Delete a user.
    """
    try:
        success = await UserService.delete_user(
            db, current_user, user_id, current_school=current_school
        )
        if success:
            await db.commit()
        else:
            await db.rollback()
            raise HTTPException(status_code=400, detail="Failed to delete user")
    except Exception as e:
        await db.rollback()
        raise HTTPException(status_code=400, detail=str(e)) 