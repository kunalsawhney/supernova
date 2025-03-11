from typing import List, Optional
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.dependencies.auth import get_current_user
from app.db.session import get_db
from app.schemas.course import (
    CourseCreate, CourseUpdate, CourseResponse,
    CourseContentCreate, CourseContentResponse,
    ModuleCreate, ModuleResponse,
    LessonCreate, LessonResponse,
    CourseWithContentResponse
)
from app.models.user import User
from app.services.course import CourseService

router = APIRouter()

@router.post("/", response_model=CourseResponse)
async def create_course(
    *,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
    course_data: CourseCreate
) -> CourseResponse:
    """Create a new course."""
    try:
        course = await CourseService.create_course(db, current_user, course_data)
        await db.commit()
        return CourseResponse.model_validate(course)
    except Exception as e:
        await db.rollback()
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/", response_model=List[CourseResponse])
async def list_courses(
    *,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=100),
    status: Optional[str] = None,
    search: Optional[str] = None
) -> List[CourseResponse]:
    """List courses based on user role and filters."""
    try:
        courses = await CourseService.list_courses(
            db, current_user, skip=skip, limit=limit,
            status=status, search=search
        )
        return [CourseResponse.model_validate(course) for course in courses]
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/{course_id}", response_model=CourseWithContentResponse)
async def get_course(
    course_id: UUID,
    *,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
    with_content: bool = Query(False)
) -> CourseWithContentResponse:
    """Get course details with optional content."""
    try:
        course = await CourseService.get_course(
            db, current_user, course_id, with_content=with_content
        )
        return CourseWithContentResponse.model_validate(course)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.put("/{course_id}", response_model=CourseResponse)
async def update_course(
    course_id: UUID,
    *,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
    course_data: CourseUpdate
) -> CourseResponse:
    """Update course details."""
    try:
        course = await CourseService.update_course(
            db, current_user, course_id, course_data
        )
        await db.commit()
        return CourseResponse.model_validate(course)
    except Exception as e:
        await db.rollback()
        raise HTTPException(status_code=400, detail=str(e))

@router.delete("/{course_id}")
async def delete_course(
    course_id: UUID,
    *,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
) -> dict:
    """Soft delete a course."""
    try:
        success = await CourseService.delete_course(db, current_user, course_id)
        await db.commit()
        return {"success": success}
    except Exception as e:
        await db.rollback()
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/{course_id}/versions", response_model=CourseContentResponse)
async def create_course_version(
    course_id: UUID,
    *,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
    content_data: CourseContentCreate,
    version: str = Query(..., description="Version identifier")
) -> CourseContentResponse:
    """Create a new version of course content."""
    try:
        content, _ = await CourseService.create_course_version(
            db, current_user, course_id, content_data, version
        )
        await db.commit()
        return CourseContentResponse.model_validate(content)
    except Exception as e:
        await db.rollback()
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/content/{content_id}/modules", response_model=ModuleResponse)
async def add_module(
    content_id: UUID,
    *,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
    module_data: ModuleCreate
) -> ModuleResponse:
    """Add a module to course content."""
    try:
        module = await CourseService.add_module(
            db, current_user, content_id, module_data
        )
        await db.commit()
        return ModuleResponse.model_validate(module)
    except Exception as e:
        await db.rollback()
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/modules/{module_id}/lessons", response_model=LessonResponse)
async def add_lesson(
    module_id: UUID,
    *,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
    lesson_data: LessonCreate
) -> LessonResponse:
    """Add a lesson to a module."""
    try:
        lesson = await CourseService.add_lesson(
            db, current_user, module_id, lesson_data
        )
        await db.commit()
        return LessonResponse.model_validate(lesson)
    except Exception as e:
        await db.rollback()
        raise HTTPException(status_code=400, detail=str(e))