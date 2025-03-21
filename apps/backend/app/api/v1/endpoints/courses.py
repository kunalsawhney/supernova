from typing import List, Optional, Union
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, Query, Path
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.dependencies.auth import get_current_user
from app.db.session import get_db
from app.models.user import User, UserRole
from app.models.course import CourseStatus

# Import from our new schema structure
from app.schemas.course import (
    CourseCreate, CourseUpdate, CourseResponse
)
from app.schemas.course_version import (
    CourseContentCreate, CourseContentResponse, CourseVersionResponse,
    CourseWithContentResponse
)
from app.schemas.module import ModuleCreate, ModuleUpdate, ModuleResponse
from app.schemas.lesson import LessonCreate, LessonResponse

# Import our new services
from app.services.course import CourseService
from app.services.content import ContentService 
from app.services.module import ModuleService
from app.services.lesson import LessonService

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
        # Refresh the course to get the latest data including relationships
        await db.refresh(course)
        return CourseResponse.model_validate(course)
    except Exception as e:
        print(e)
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
        # print("Courses fetched", courses)
        return [CourseResponse.model_validate(course) for course in courses]
    except Exception as e:
        print(e)
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/{course_id}", response_model=Union[CourseResponse, CourseWithContentResponse])
async def get_course(
    *,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
    course_id: UUID,
    with_content: bool = Query(False, description="Include content information"),
) -> Union[CourseResponse, CourseWithContentResponse]:
    """Get a specific course, optionally with content versions."""
    try:
        # Get basic course info
        course = await CourseService.get_course(db, current_user, course_id, with_content)
        if not course:
            raise HTTPException(status_code=404, detail="Course not found")
        # print("Found course: ", course.__dict__)
        # If content requested, get versions using ContentService
        if with_content:
            # versions = await ContentService.list_course_versions(db, course_id)
            # print("Found versions: ", versions)
            # # Convert to dict for easier manipulation
            # course_dict = course.__dict__.copy()
            # course_dict["versions"] = versions
            # print("Course dict: ", course_dict)
            # # Create response with content
            # response = CourseWithContentResponse.model_validate(course_dict)
            # print("Response: ", response)
            # # Workaround for model_dump always using alias
            # if isinstance(response, CourseWithContentResponse):
            #     response_dict = response.model_dump()
            #     # Make sure we have content_versions instead of versions in the output
            #     if "versions" in response_dict and "content_versions" not in response_dict:
            #         response_dict["content_versions"] = response_dict.pop("versions")
            #     return response_dict
            
            # return response
            return CourseWithContentResponse.model_validate(course)
        
        # Otherwise return basic course info
        return CourseResponse.model_validate(course)
    except HTTPException:
        raise
    except Exception as e:
        print(e)
        raise HTTPException(status_code=400, detail=str(e))

@router.put("/{course_id}/", response_model=CourseResponse)
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
        await db.refresh(course)
        return CourseResponse.model_validate(course)
    except Exception as e:
        print(e)
        await db.rollback()
        raise HTTPException(status_code=400, detail=str(e))

@router.delete("/{course_id}/")
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
        print(e)
        await db.rollback()
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/{course_id}/versions", response_model=CourseContentResponse)
async def create_course_version(
    *,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
    course_id: UUID,
    content_data: CourseContentCreate,
    version: Optional[str] = None
) -> CourseContentResponse:
    """Create a new version of course content."""
    try:
        # Updated to use ContentService
        content = await ContentService.create_course_content(
            db, current_user, course_id, content_data
        )
        await db.commit()
        await db.refresh(content)
        return CourseContentResponse.model_validate(content)
    except Exception as e:
        await db.rollback()
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/{course_id}/versions", response_model=List[CourseVersionResponse])
async def list_course_versions(
    *,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
    course_id: UUID = Path(...)
) -> List[CourseVersionResponse]:
    """List all versions of a course."""
    try:
        versions = await ContentService.list_course_versions(db, course_id)
        return [CourseVersionResponse.model_validate(version) for version in versions]
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/{course_id}/versions/{version}", response_model=CourseVersionResponse)
async def get_course_version(
    *,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
    course_id: UUID = Path(...),
    version: str = Path(...)
) -> CourseVersionResponse:
    """Get specific version of a course."""
    try:
        course_version = await ContentService.get_course_version_with_content(db, course_id, version)
        if not course_version:
            raise HTTPException(status_code=404, detail="Course version not found")
        return CourseVersionResponse.model_validate(course_version)
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/content/{content_id}/modules", response_model=ModuleResponse)
async def add_module_to_content(
    *,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
    content_id: UUID,
    module_data: ModuleCreate
) -> ModuleResponse:
    """Add a module to course content."""
    try:
        # Updated to use ModuleService
        module = await ModuleService.create_module(
            db, current_user, module_data
        )
        await db.commit()
        await db.refresh(module)
        return ModuleResponse.model_validate(module)
    except Exception as e:
        print(e)
        await db.rollback()
        raise HTTPException(status_code=400, detail=str(e))

@router.put("/modules/{module_id}/", response_model=ModuleResponse)
async def update_module(
    *,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
    module_id: UUID = Path(...),
    module_data: ModuleUpdate
) -> ModuleResponse:
    """Update a module."""
    try:
        # Updated to use ModuleService
        module = await ModuleService.update_module(
            db, current_user, module_id, module_data
        )
        await db.commit()
        await db.refresh(module)
        return ModuleResponse.model_validate(module)
    except Exception as e:
        await db.rollback()
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/modules/{module_id}/lessons", response_model=LessonResponse)
async def add_lesson_to_module(
    *,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
    module_id: UUID = Path(...),
    lesson_data: LessonCreate
) -> LessonResponse:
    """Add a lesson to a module."""
    try:
        # Updated to use LessonService
        lesson = await LessonService.create_lesson(
            db, current_user, lesson_data
        )
        await db.commit()
        await db.refresh(lesson)
        return LessonResponse.model_validate(lesson)
    except Exception as e:
        print(e)
        await db.rollback()
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/{course_id}/modules/", response_model=List[ModuleResponse])
async def get_course_modules(
    *,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
    course_id: UUID = Path(...),
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=100),
    status: Optional[str] = None,
    content_version: Optional[str] = Query(None, description="Specific content version")
) -> List[ModuleResponse]:
    """
    Get all modules for a specific course.
    
    Access control:
    - Super admins can see all modules
    - School admins can see modules for courses their school has access to
    - Instructors can see modules for courses they teach
    - Students can see modules for courses they are enrolled in
    """
    # try:
    #     # First get the content ID for the specified version (or latest)
    #     version = await ContentService.get_course_version_with_content(
    #         db, course_id, content_version
    #     )
    #     if not version or not version.content:
    #         raise HTTPException(status_code=404, detail="Course content not found")
            
    #     # Get modules for this content
    #     modules = await ModuleService.list_modules_with_lessons(db, version.content_id)
    #     return [ModuleResponse.model_validate(module) for module in modules]
    # except HTTPException:
    #     raise
    # except Exception as e:
    #     print(e)
    #     raise HTTPException(status_code=400, detail=str(e))
    try:
        modules = await CourseService.list_modules(
            db, current_user, skip=skip, limit=limit,
            status=status, course_id=course_id
        )
        for module in modules:
            print("Found module: ", module.__dict__)

        return [ModuleResponse.model_validate(module) for module in modules]
    except Exception as e:
        print(e)
        raise HTTPException(status_code=400, detail=str(e))