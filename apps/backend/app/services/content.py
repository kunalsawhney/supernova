"""Service for managing course content and versions."""

from datetime import datetime
from typing import List, Optional, Dict, Any
from uuid import UUID

from app.models.enums import CourseStatus
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.core.exception_handlers import NotFoundException, ValidationError, PermissionError
from app.models.course import Course
from app.models.course_version import CourseContent, CourseVersion
from app.models.user import User, UserRole
from app.schemas.course_version import CourseContentCreate, CourseContentUpdate


class ContentService:
    """Service for managing course content and versions."""

    @staticmethod
    async def create_course_content(
        db: AsyncSession,
        current_user: User,
        course_id: UUID,
        content_data: CourseContentCreate
    ) -> CourseContent:
        """Create new course content."""
        # Check if course exists
        course = await db.get(Course, course_id)
        if not course:
            raise NotFoundException("Course not found")

        # Check permissions
        if current_user.role != UserRole.SUPER_ADMIN and current_user.id != course.created_by_id:
            raise PermissionError("You don't have permission to create content for this course")

        # Create content
        content_dict = content_data.model_dump(exclude={"course_id"})
        content = CourseContent(
            course_id=course_id,
            **content_dict,
            content_status=content_data.content_status if hasattr(content_data, "content_status") else CourseStatus.DRAFT,
            last_reviewed_by_id=None,
            last_reviewed_at=None
        )
        db.add(content)
        await db.flush()  # Get content ID without committing

        # Create version that references this content
        version = CourseVersion(
            course_id=course_id,
            content_id=content.id,
            version=content.version,
            valid_from=datetime.utcnow(),
            changelog={"initial": True, "created_by": str(current_user.id)}
        )
        db.add(version)
        await db.flush()

        return content

    @staticmethod
    async def get_course_content(
        db: AsyncSession,
        content_id: UUID
    ) -> Optional[CourseContent]:
        """Get course content by ID."""
        query = select(CourseContent).where(CourseContent.id == content_id)
        result = await db.execute(query)
        return result.scalar_one_or_none()

    @staticmethod
    async def get_course_content_with_modules(
        db: AsyncSession,
        content_id: UUID
    ) -> Optional[CourseContent]:
        """Get course content with related modules."""
        query = (
            select(CourseContent)
            .options(selectinload(CourseContent.modules))
            .where(CourseContent.id == content_id)
        )
        result = await db.execute(query)
        return result.scalar_one_or_none()

    @staticmethod
    async def update_course_content(
        db: AsyncSession,
        current_user: User,
        content_id: UUID,
        content_data: CourseContentUpdate
    ) -> CourseContent:
        """Update course content."""
        content = await ContentService.get_course_content(db, content_id)
        if not content:
            raise NotFoundException("Course content not found")

        # Check course ownership
        course = await db.get(Course, content.course_id)
        if not course:
            raise NotFoundException("Course not found")

        # Check permissions
        if current_user.role != UserRole.SUPER_ADMIN and current_user.id != course.created_by_id:
            raise PermissionError("You don't have permission to update this course content")

        # Update content
        content_dict = content_data.model_dump(exclude_unset=True)
        for key, value in content_dict.items():
            setattr(content, key, value)
            
        # If content status is being updated, track review information
        if content_data.content_status:
            content.last_reviewed_by_id = current_user.id
            content.last_reviewed_at = datetime.utcnow()
            
        return content

    @staticmethod
    async def get_latest_course_version(
        db: AsyncSession,
        course_id: UUID
    ) -> Optional[CourseVersion]:
        """Get the latest version of a course."""
        query = (
            select(CourseVersion)
            .where(CourseVersion.course_id == course_id)
            .order_by(CourseVersion.valid_from.desc())
        )
        result = await db.execute(query)
        return result.scalar_one_or_none()

    @staticmethod
    async def get_course_version(
        db: AsyncSession,
        course_id: UUID,
        version: str
    ) -> Optional[CourseVersion]:
        """Get specific version of a course."""
        query = (
            select(CourseVersion)
            .where(
                CourseVersion.course_id == course_id,
                CourseVersion.version == version
            )
        )
        result = await db.execute(query)
        return result.scalar_one_or_none()

    @staticmethod
    async def get_course_version_with_content(
        db: AsyncSession,
        course_id: UUID,
        version: Optional[str] = None
    ) -> Optional[CourseVersion]:
        """Get course version with related content."""
        if version:
            # Get specific version
            query = (
                select(CourseVersion)
                .options(selectinload(CourseVersion.content))
                .where(
                    CourseVersion.course_id == course_id,
                    CourseVersion.version == version
                )
            )
        else:
            # Get latest version
            query = (
                select(CourseVersion)
                .options(selectinload(CourseVersion.content))
                .where(CourseVersion.course_id == course_id)
                .order_by(CourseVersion.valid_from.desc())
            )
        
        result = await db.execute(query)
        return result.scalar_one_or_none()

    @staticmethod
    async def list_course_versions(
        db: AsyncSession,
        course_id: UUID
    ) -> List[CourseVersion]:
        """List all versions of a course."""
        query = (
            select(CourseVersion)
            .where(CourseVersion.course_id == course_id)
            .order_by(CourseVersion.valid_from.desc())
        )
        result = await db.execute(query)
        return list(result.scalars().all()) 