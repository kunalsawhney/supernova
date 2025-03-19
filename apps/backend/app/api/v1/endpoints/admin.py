from typing import Any, List, Dict
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.dependencies.auth import get_current_active_superuser, get_current_active_user
from app.api.dependencies.admin import admin_required
from app.db.session import get_db
from app.models import User
from app.models.user import UserRole, UserStatus
from app.schemas.user import User as UserSchema, UserCreate, UserUpdate
from app.schemas.school import School as SchoolSchema, SchoolCreate
from app.services.user import UserService
from app.services.school import SchoolService
from app.services.admin import AdminService
from app.services.course import CourseService
from app.core.exception_handlers import NotFoundException, ValidationError, PermissionError

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
    try:
        stats = await AdminService.get_platform_stats(db, current_user)
        return stats
    except PermissionError as e:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=str(e),
        )

@router.get("/health")
async def get_system_health(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_superuser),
) -> Any:
    """
    Get system health metrics.
    Only accessible by super admin.
    """
    try:
        health_metrics = await AdminService.get_system_health(db, current_user)
        return health_metrics
    except PermissionError as e:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=str(e),
        )

@router.get("/users", response_model=List[UserSchema])
async def list_users(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_superuser),
    skip: int = 0,
    limit: int = 100,
    role: UserRole | None = None,
    search: str | None = None,
) -> Any:
    """
    List all users.
    Only accessible by super admin.
    """
    try:
        users = await AdminService.list_users(
            db, current_user, skip, limit, role, search
        )
        return users
    except PermissionError as e:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=str(e),
        )

@router.post("/users", response_model=UserSchema)
async def create_admin_user(
    *,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_superuser),
    user_in: UserCreate,
) -> Any:
    """
    Create new admin user.
    Only accessible by super admin.
    """
    try:
        user = await AdminService.create_admin_user(db, current_user, user_in)
        return user
    except ValidationError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e),
        )
    except PermissionError as e:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=str(e),
        )

@router.get("/users/{user_id}", response_model=UserSchema)
async def get_user(
    user_id: UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_superuser),
) -> Any:
    """
    Get user by ID.
    Only accessible by super admin.
    """
    try:
        user = await UserService.get_user(db, user_id)
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found",
            )
        return user
    except NotFoundException as e:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(e),
        )

@router.put("/users/{user_id}", response_model=UserSchema)
async def update_user(
    user_id: UUID,
    *,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_superuser),
    user_in: UserUpdate,
) -> Any:
    """
    Update user.
    Only accessible by super admin.
    """
    try:
        user = await UserService.update_user(db, current_user, user_id, user_in)
        return user
    except NotFoundException as e:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(e),
        )
    except PermissionError as e:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=str(e),
        )
    except ValidationError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e),
        )

@router.delete("/users/{user_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_user(
    user_id: UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_superuser),
) -> None:
    """
    Delete user.
    Only accessible by super admin.
    """
    try:
        await UserService.delete_user(db, current_user, user_id)
    except NotFoundException as e:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(e),
        )
    except PermissionError as e:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=str(e),
        )

@router.post("/users/{user_id}/suspend", response_model=UserSchema)
async def suspend_user(
    user_id: UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_superuser),
) -> Any:
    """
    Suspend a user account.
    This is an admin-specific operation that deactivates the account and sets its status to suspended.
    Only accessible by super admin.
    """
    try:
        user = await AdminService.update_user_status(
            db, current_user, user_id, UserStatus.SUSPENDED, active=False
        )
        return user
    except NotFoundException as e:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(e),
        )
    except PermissionError as e:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=str(e),
        )

@router.post("/users/{user_id}/reinstate", response_model=UserSchema)
async def reinstate_user(
    user_id: UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_superuser),
) -> Any:
    """
    Reinstate a suspended user account.
    This is an admin-specific operation that reactivates the account and sets its status back to active.
    Only accessible by super admin.
    """
    try:
        user = await AdminService.update_user_status(
            db, current_user, user_id, UserStatus.ACTIVE, active=True
        )
        return user
    except NotFoundException as e:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(e),
        )
    except PermissionError as e:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=str(e),
        )

@router.get("/schools", response_model=List[SchoolSchema])
async def list_schools(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_superuser),
    skip: int = 0,
    limit: int = 100,
    search: str | None = None,
    include_inactive: bool = False,
) -> Any:
    """
    List all schools.
    Only accessible by super admin.
    """
    try:
        schools = await SchoolService.list_schools(
            db, current_user, skip, limit, search, include_inactive
        )
        return schools
    except Exception as e:
        import traceback
        traceback_str = traceback.format_exc()
        print(f"Error in /admin/schools: {str(e)}")
        print(traceback_str)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error retrieving schools: {str(e)}",
        )

@router.post("/schools", response_model=SchoolSchema)
async def create_school(
    *,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_superuser),
    school_in: SchoolCreate,
) -> Any:
    """
    Create new school.
    Only accessible by super admin.
    """
    try:
        school = await SchoolService.create_school(db, current_user, school_in)
        return school
    except ValidationError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e),
        )
    except PermissionError as e:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=str(e),
        )

@router.get("/content/stats", response_model=Dict[str, Any])
async def get_content_stats(
    *,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(admin_required)
) -> Dict[str, Any]:
    """
    Get statistics about platform content.
    This includes total courses, active courses, popular categories, etc.
    Accessible by super admin and school admins.
    """
    try:
        stats = await AdminService.get_content_stats(db, current_user)
        return stats
    except PermissionError as e:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=str(e),
        )
