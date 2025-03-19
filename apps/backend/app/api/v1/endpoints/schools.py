from typing import Any, List, Optional
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.dependencies.auth import (
    get_current_active_superuser,
    get_current_active_user,
    get_current_school,
    check_permissions,
)
from app.db.session import get_db
from app.models import School, User, UserRole
from app.schemas.school import (
    School as SchoolSchema,
    SchoolCreate,
    SchoolUpdate,
    SchoolWithStats,
)
from app.services.school import SchoolService
from app.core.exception_handlers import NotFoundException, ValidationError, PermissionError

router = APIRouter()

@router.get("/", response_model=List[SchoolSchema])
async def get_schools(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
    skip: int = 0,
    limit: int = 100,
    search: Optional[str] = None,
    include_inactive: bool = False,
) -> List[SchoolSchema]:
    """
    Retrieve schools.
    """
    try:
        schools = await SchoolService.list_schools(
            db, 
            current_user, 
            skip=skip, 
            limit=limit, 
            search=search, 
            include_inactive=include_inactive
        )
        return schools
    except PermissionError as e:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=str(e),
        )

@router.post("/", response_model=SchoolSchema, status_code=status.HTTP_201_CREATED)
async def create_school(
    *,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
    school_in: SchoolCreate,
) -> SchoolSchema:
    """
    Create new school.
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

@router.get("/me", response_model=SchoolWithStats)
async def get_my_school(
    *,
    db: AsyncSession = Depends(get_db),
    current_school: School = Depends(get_current_school),
    current_user: User = Depends(get_current_active_user),
) -> Any:
    """
    Get current school with statistics.
    """
    try:
        if not current_user.school_id:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not associated with a school",
            )
            
        # Get statistics for the current school
        school_stats = await SchoolService.get_school_with_stats(db, current_user.school_id)
        return school_stats
    except NotFoundException as e:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(e),
        )

@router.put("/me", response_model=SchoolSchema)
async def update_my_school(
    *,
    db: AsyncSession = Depends(get_db),
    current_school: School = Depends(get_current_school),
    current_user: User = Depends(get_current_active_user),
    school_in: SchoolUpdate,
) -> Any:
    """
    Update school settings. Only school admin can update their school.
    """
    try:
        if not current_user.school_id:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not associated with a school",
            )
            
        school = await SchoolService.update_school(
            db, 
            current_user, 
            current_user.school_id, 
            school_in
        )
        return school
    except NotFoundException as e:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(e),
        )
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

@router.get("/{school_id}", response_model=SchoolWithStats)
async def get_school(
    school_id: UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
) -> SchoolWithStats:
    """
    Get school by ID.
    """
    try:
        school_stats = await SchoolService.get_school_with_stats(db, school_id)
        return school_stats
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

@router.put("/{school_id}", response_model=SchoolSchema)
async def update_school(
    *,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
    school_id: UUID,
    school_in: SchoolUpdate,
) -> SchoolSchema:
    """
    Update school.
    """
    try:
        school = await SchoolService.update_school(db, current_user, school_id, school_in)
        return school
    except NotFoundException as e:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(e),
        )
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

@router.delete("/{school_id}")
async def delete_school(
    *,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
    school_id: UUID,
) -> dict:
    """
    Delete school.
    """
    try:
        await SchoolService.delete_school(db, current_user, school_id)
        return {"status": "success", "message": "School deleted successfully"}
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

# School Members endpoints

@router.get("/{school_id}/members", response_model=List[dict])
async def get_school_members(
    school_id: UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
    role: Optional[str] = None,
    skip: int = 0,
    limit: int = 100,
) -> List[dict]:
    """
    Get school members.
    """
    try:
        # Convert string role to enum if provided
        school_role = None
        if role:
            try:
                from app.models.school import SchoolRole
                school_role = SchoolRole[role.upper()]
            except (KeyError, ValueError):
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=f"Invalid role: {role}",
                )
        
        members = await SchoolService.list_school_members(
            db, current_user, school_id, role=school_role, skip=skip, limit=limit
        )
        
        # Format response
        result = []
        for member in members:
            result.append({
                "id": member.id,
                "user_id": member.user_id,
                "school_id": member.school_id,
                "role": member.role.name,
                "user": {
                    "id": member.user.id,
                    "email": member.user.email,
                    "first_name": member.user.first_name,
                    "last_name": member.user.last_name,
                    "full_name": f"{member.user.first_name} {member.user.last_name}",
                }
            })
            
        return result
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

@router.post("/{school_id}/members", status_code=status.HTTP_201_CREATED)
async def add_school_member(
    *,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
    school_id: UUID,
    user_id: UUID,
    role: str,
) -> dict:
    """
    Add a user to a school.
    """
    try:
        # Convert string role to enum
        try:
            from app.models.school import SchoolRole
            school_role = SchoolRole[role.upper()]
        except (KeyError, ValueError):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Invalid role: {role}",
            )
        
        member = await SchoolService.add_school_member(
            db, current_user, school_id, user_id, school_role
        )
        
        return {
            "status": "success",
            "message": "User added to school successfully",
            "member_id": str(member.id)
        }
    except NotFoundException as e:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(e),
        )
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

@router.delete("/{school_id}/members/{user_id}")
async def remove_school_member(
    *,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
    school_id: UUID,
    user_id: UUID,
) -> dict:
    """
    Remove a user from a school.
    """
    try:
        await SchoolService.remove_school_member(db, current_user, school_id, user_id)
        return {
            "status": "success",
            "message": "User removed from school successfully"
        }
    except NotFoundException as e:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(e),
        )
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

@router.put("/{school_id}/members/{user_id}")
async def update_member_role(
    *,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
    school_id: UUID,
    user_id: UUID,
    role: str,
) -> dict:
    """
    Update a school member's role.
    """
    try:
        # Convert string role to enum
        try:
            from app.models.school import SchoolRole
            school_role = SchoolRole[role.upper()]
        except (KeyError, ValueError):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Invalid role: {role}",
            )
        
        await SchoolService.update_school_member_role(
            db, current_user, school_id, user_id, school_role
        )
        
        return {
            "status": "success",
            "message": "Member role updated successfully"
        }
    except NotFoundException as e:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(e),
        )
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