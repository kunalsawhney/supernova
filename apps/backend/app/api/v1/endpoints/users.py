from typing import Any, List
from uuid import UUID, uuid4

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.dependencies.auth import (
    get_current_active_user,
    get_current_school,
    check_permissions,
)
from app.security.password import get_password_hash
from app.db.session import get_db
from app.models import School, User, UserRole
from app.schemas.user import (
    User as UserSchema,
    UserCreate,
    UserUpdate,
    UserWithSchool,
)

router = APIRouter()

@router.get("/me", response_model=UserWithSchool)
async def read_user_me(
    current_user: User = Depends(get_current_active_user),
) -> Any:
    """
    Get current user.
    """
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
    if user_in.password:
        current_user.hashed_password = get_password_hash(user_in.password)
        
    for field, value in user_in.model_dump(
        exclude={"password"}, exclude_unset=True
    ).items():
        setattr(current_user, field, value)

    await db.commit()
    await db.refresh(current_user)
    return current_user

@router.get("/", response_model=List[UserSchema])
async def list_users(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(check_permissions([UserRole.SCHOOL_ADMIN, UserRole.SUPER_ADMIN])),
    current_school: School = Depends(get_current_school),
    skip: int = 0,
    limit: int = 100,
    role: UserRole | None = None,
) -> Any:
    """
    Retrieve users.
    - Super admin can see all users across schools
    - School admin can only see users in their school
    """
    query = select(User)
    
    if current_user.role != UserRole.SUPER_ADMIN:
        query = query.where(User.school_id == current_school.id)
    
    if role:
        query = query.where(User.role == role)
        
    query = query.offset(skip).limit(limit)
    result = await db.execute(query)
    users = result.scalars().all()
    return users

@router.post("/", response_model=UserSchema)
async def create_user(
    *,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(check_permissions([UserRole.SCHOOL_ADMIN, UserRole.SUPER_ADMIN])),
    user_in: UserCreate,
) -> Any:
    """
    Create new user.
    - Super admin can create users for any school or super_admin users without a school
    - School admin can only create users for their school
    """
    # Check if email is already registered
    result = await db.execute(
        select(User).where(User.email == user_in.email)
    )
    if result.scalar_one_or_none():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered",
        )

    # Handle school_id based on role
    school_id = None
    if user_in.role == UserRole.SUPER_ADMIN:
        if current_user.role != UserRole.SUPER_ADMIN:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Only super admins can create other super admin users",
            )
    else:
        # For non-super_admin users, we need a school
        if current_user.role == UserRole.SUPER_ADMIN:
            # Super admin can specify any school
            if not user_in.school_id:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="school_id is required for non-super_admin users",
                )
            school = await db.get(School, user_in.school_id)
            if not school:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail="School not found",
                )
            school_id = school.id
        else:
            # School admin uses their own school
            school_id = current_user.school_id
            if user_in.school_id and user_in.school_id != school_id:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="School admin cannot specify different school_id",
                )

    # Validate role permissions
    if current_user.role != UserRole.SUPER_ADMIN:
        if user_in.role in [UserRole.SUPER_ADMIN, UserRole.SCHOOL_ADMIN]:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Cannot create user with higher privileges",
            )

    user = User(
        **user_in.model_dump(exclude={"password", "school_id"}),
        hashed_password=get_password_hash(user_in.password),
        school_id=school_id,
    )
    db.add(user)
    await db.commit()
    await db.refresh(user)
    return user

@router.get("/{user_id}", response_model=UserSchema)
async def get_user(
    user_id: UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(check_permissions([UserRole.SCHOOL_ADMIN, UserRole.SUPER_ADMIN])),
    current_school: School = Depends(get_current_school),
) -> Any:
    """
    Get user by ID.
    - Super admin can get any user
    - School admin can only get users in their school
    """
    user = await db.get(User, user_id)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found",
        )
        
    if (
        current_user.role != UserRole.SUPER_ADMIN
        and user.school_id != current_school.id
    ):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions",
        )
        
    return user

@router.put("/{user_id}", response_model=UserSchema)
async def update_user(
    user_id: UUID,
    *,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(check_permissions([UserRole.SCHOOL_ADMIN, UserRole.SUPER_ADMIN])),
    current_school: School = Depends(get_current_school),
    user_in: UserUpdate,
) -> Any:
    """
    Update user.
    - Super admin can update any user
    - School admin can only update users in their school
    """
    user = await db.get(User, user_id)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found",
        )
        
    if (
        current_user.role != UserRole.SUPER_ADMIN
        and user.school_id != current_school.id
    ):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions",
        )

    # Prevent role escalation
    if (
        current_user.role != UserRole.SUPER_ADMIN
        and user_in.role
        and user_in.role in [UserRole.SUPER_ADMIN, UserRole.SCHOOL_ADMIN]
    ):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cannot update user to higher privileges",
        )

    if user_in.password:
        user.hashed_password = get_password_hash(user_in.password)
        
    for field, value in user_in.model_dump(
        exclude={"password"}, exclude_unset=True
    ).items():
        setattr(user, field, value)

    await db.commit()
    await db.refresh(user)
    return user

@router.delete("/{user_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_user(
    user_id: UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(check_permissions([UserRole.SCHOOL_ADMIN, UserRole.SUPER_ADMIN])),
    current_school: School = Depends(get_current_school),
) -> None:
    """
    Delete user.
    - Super admin can delete any user
    - School admin can only delete users in their school
    This is a soft delete - user is marked as inactive.
    """
    user = await db.get(User, user_id)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found",
        )
        
    if (
        current_user.role != UserRole.SUPER_ADMIN
        and user.school_id != current_school.id
    ):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions",
        )

    user.is_active = False
    await db.commit() 