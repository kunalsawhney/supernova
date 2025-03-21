from typing import List, Optional
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.dependencies.auth import get_current_user
from app.db.session import get_db
from app.models.user import User
from app.models.enums import CourseStatus
from app.schemas.module import ModuleResponse, ModuleUpdate, ModuleCreate
from app.services.course import CourseService
from app.services.module import ModuleService

router = APIRouter()

@router.get("/", response_model=List[ModuleResponse])
async def list_modules(
    *,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=100),
    status: Optional[CourseStatus] = None,
    course_id: Optional[UUID] = None,
    search: Optional[str] = None
) -> List[ModuleResponse]:
    """
    List all modules with filtering options.
    
    Permissions:
    - Super admins can see all modules
    - School admins can see modules for courses their school has access to
    - Instructors can see modules for courses they teach
    - Students can see modules for courses they are enrolled in
    """
    try:
        modules = await CourseService.list_modules(
            db, current_user, skip=skip, limit=limit,
            status=status, course_id=course_id, search=search
        )
        return [ModuleResponse.model_validate(module) for module in modules]
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/{module_id}", response_model=ModuleResponse)
async def get_module(
    module_id: UUID,
    *,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
) -> ModuleResponse:
    """
    Get details for a specific module.
    
    Permissions:
    - Super admins can see any module
    - School admins can see modules for courses their school has access to
    - Instructors can see modules for courses they teach
    - Students can see modules for courses they are enrolled in
    """
    try:
        module = await CourseService.get_module(db, current_user, module_id)
        return ModuleResponse.model_validate(module)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.put("/{module_id}", response_model=ModuleResponse)
async def update_module(
    module_id: UUID,
    *,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
    module_data: ModuleUpdate
) -> ModuleResponse:
    """
    Update a module.
    
    Permissions:
    - Super admins can update any module
    - School admins can update modules for courses their school has access to
    - Instructors can update modules for courses they teach
    """
    try:
        module = await CourseService.update_module(db, current_user, module_id, module_data)
        await db.commit()
        return ModuleResponse.model_validate(module)
    except Exception as e:
        await db.rollback()
        raise HTTPException(status_code=400, detail=str(e))

@router.delete("/{module_id}")
async def delete_module(
    module_id: UUID,
    *,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
) -> dict:
    """
    Delete a module.
    
    Permissions:
    - Super admins can delete any module
    - School admins can delete modules for courses their school has access to
    """
    try:
        success = await CourseService.delete_module(db, current_user, module_id)
        await db.commit()
        return {"success": success}
    except Exception as e:
        await db.rollback()
        raise HTTPException(status_code=400, detail=str(e))

@router.put("/reorder", response_model=dict)
async def reorder_modules(
    *,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
    course_id: UUID,
    module_ids: List[UUID]
) -> dict:
    """
    Reorder modules within a course.
    
    Permissions:
    - Super admins can reorder any modules
    - School admins can reorder modules for courses their school has access to
    - Instructors can reorder modules for courses they teach
    """
    try:
        success = await ModuleService.reorder_modules(db, current_user, course_id, module_ids)
        await db.commit()
        return {"success": success}
    except Exception as e:
        await db.rollback()
        raise HTTPException(status_code=400, detail=str(e)) 