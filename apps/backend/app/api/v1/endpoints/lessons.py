from typing import List, Optional
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.dependencies.auth import get_current_user
from app.db.session import get_db
from app.models.user import User
from app.schemas.lesson import LessonResponse, LessonUpdate, LessonCreate
from app.services.course import CourseService

router = APIRouter()

@router.get("/", response_model=List[LessonResponse])
async def list_lessons(
    *,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=100),
    module_id: Optional[UUID] = None,
    lesson_type: Optional[str] = None,
    search: Optional[str] = None
) -> List[LessonResponse]:
    """
    List all lessons with filtering options.
    
    Permissions:
    - Super admins can see all lessons
    - School admins can see lessons for courses their school has access to
    - Instructors can see lessons for courses they teach
    - Students can see lessons for courses they are enrolled in
    """
    try:
        lessons = await CourseService.list_lessons(
            db, current_user, skip=skip, limit=limit,
            module_id=module_id, lesson_type=lesson_type, search=search
        )
        return [LessonResponse.model_validate(lesson) for lesson in lessons]
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/{lesson_id}", response_model=LessonResponse)
async def get_lesson(
    lesson_id: UUID,
    *,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
) -> LessonResponse:
    """
    Get details for a specific lesson.
    
    Permissions:
    - Super admins can see any lesson
    - School admins can see lessons for courses their school has access to
    - Instructors can see lessons for courses they teach
    - Students can see lessons for courses they are enrolled in
    """
    try:
        lesson = await CourseService.get_lesson(db, current_user, lesson_id)
        return LessonResponse.model_validate(lesson)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.put("/{lesson_id}", response_model=LessonResponse)
async def update_lesson(
    lesson_id: UUID,
    *,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
    lesson_data: LessonUpdate
) -> LessonResponse:
    """
    Update a lesson.
    
    Permissions:
    - Super admins can update any lesson
    - School admins can update lessons for courses their school has access to
    - Instructors can update lessons for courses they teach
    """
    try:
        # TODO: Implement update_lesson in CourseService
        # lesson = await CourseService.update_lesson(db, current_user, lesson_id, lesson_data)
        # await db.commit()
        # return LessonResponse.model_validate(lesson)
        raise HTTPException(status_code=501, detail="Not implemented yet")
    except Exception as e:
        await db.rollback()
        raise HTTPException(status_code=400, detail=str(e))

@router.delete("/{lesson_id}")
async def delete_lesson(
    lesson_id: UUID,
    *,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
) -> dict:
    """
    Delete a lesson.
    
    Permissions:
    - Super admins can delete any lesson
    - School admins can delete lessons for courses their school has access to
    """
    try:
        # TODO: Implement delete_lesson in CourseService
        # success = await CourseService.delete_lesson(db, current_user, lesson_id)
        # await db.commit()
        # return {"success": success}
        raise HTTPException(status_code=501, detail="Not implemented yet")
    except Exception as e:
        await db.rollback()
        raise HTTPException(status_code=400, detail=str(e)) 