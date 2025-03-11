from datetime import datetime
from typing import List, Optional, Tuple
from uuid import UUID

from sqlalchemy import and_, or_
from sqlalchemy.orm import Session

from app.core.exception_handlers import NotFoundException, ValidationError, PermissionError
from app.models.course import (
    Course, CourseContent, CourseVersion, Module, Lesson,
    CourseStatus, EnrollmentType
)
from app.models.user import User, UserRole
from app.schemas.course import (
    CourseCreate, CourseUpdate, CourseContentCreate,
    ModuleCreate, LessonCreate
)

class CourseService:
    """Service for managing courses and their content."""

    @staticmethod
    async def create_course(
        db: Session,
        current_user: User,
        course_data: CourseCreate
    ) -> Course:
        """Create a new course."""
        if current_user.role != UserRole.SUPER_ADMIN:
            raise PermissionError("Only super admins can create courses")

        # Create course
        course = Course(
            **course_data.model_dump(exclude={'content'}),
            created_by_id=current_user.id,
            status=CourseStatus.DRAFT
        )
        db.add(course)
        db.flush()  # Get course ID without committing
        
        return course

    @staticmethod
    async def update_course(
        db: Session,
        current_user: User,
        course_id: UUID,
        course_data: CourseUpdate
    ) -> Course:
        """Update an existing course."""
        course = db.query(Course).filter(Course.id == course_id).first()
        if not course:
            raise NotFoundException("Course not found")

        if current_user.role != UserRole.SUPER_ADMIN:
            raise PermissionError("Only super admins can update courses")

        # Update course fields
        for field, value in course_data.model_dump(exclude_unset=True).items():
            setattr(course, field, value)

        db.add(course)
        return course

    @staticmethod
    async def create_course_version(
        db: Session,
        current_user: User,
        course_id: UUID,
        content_data: CourseContentCreate,
        version: str
    ) -> Tuple[CourseContent, CourseVersion]:
        """Create a new version of course content."""
        course = db.query(Course).filter(Course.id == course_id).first()
        if not course:
            raise NotFoundException("Course not found")

        if current_user.role != UserRole.SUPER_ADMIN:
            raise PermissionError("Only super admins can create course versions")

        # Create content
        content = CourseContent(
            **content_data.model_dump(),
            content_status=CourseStatus.DRAFT
        )
        db.add(content)
        db.flush()

        # Create version
        course_version = CourseVersion(
            course_id=course_id,
            content_id=content.id,
            version=version,
            valid_from=datetime.utcnow(),
            is_active=True
        )
        db.add(course_version)

        # Deactivate other versions
        db.query(CourseVersion).filter(
            and_(
                CourseVersion.course_id == course_id,
                CourseVersion.id != course_version.id
            )
        ).update({"is_active": False})

        return content, course_version

    @staticmethod
    async def add_module(
        db: Session,
        current_user: User,
        content_id: UUID,
        module_data: ModuleCreate
    ) -> Module:
        """Add a module to course content."""
        content = db.query(CourseContent).filter(CourseContent.id == content_id).first()
        if not content:
            raise NotFoundException("Course content not found")

        if current_user.role != UserRole.SUPER_ADMIN:
            raise PermissionError("Only super admins can add modules")

        module = Module(
            **module_data.model_dump(),
            content_id=content_id,
            status=CourseStatus.DRAFT
        )
        db.add(module)
        return module

    @staticmethod
    async def add_lesson(
        db: Session,
        current_user: User,
        module_id: UUID,
        lesson_data: LessonCreate
    ) -> Lesson:
        """Add a lesson to a module."""
        module = db.query(Module).filter(Module.id == module_id).first()
        if not module:
            raise NotFoundException("Module not found")

        if current_user.role != UserRole.SUPER_ADMIN:
            raise PermissionError("Only super admins can add lessons")

        lesson = Lesson(**lesson_data.model_dump(), module_id=module_id)
        db.add(lesson)
        return lesson

    @staticmethod
    async def get_course(
        db: Session,
        current_user: User,
        course_id: UUID,
        with_content: bool = False
    ) -> Course:
        """Get course details."""
        query = db.query(Course).filter(Course.id == course_id)
        
        if with_content:
            query = query.join(CourseVersion).join(CourseContent)
            
        course = query.first()
        if not course:
            raise NotFoundException("Course not found")

        # Check access permissions
        if current_user.role == UserRole.SUPER_ADMIN:
            return course

        # For B2B users
        if current_user.school_id:
            # Check if school has license
            has_license = db.query(CourseLicense).filter(
                and_(
                    CourseLicense.course_id == course_id,
                    CourseLicense.school_id == current_user.school_id,
                    CourseLicense.is_active == True
                )
            ).first()
            if has_license:
                return course

        # For D2C users
        if current_user.role == UserRole.INDIVIDUAL_USER:
            # Check if user has purchased or enrolled
            has_access = db.query(CourseEnrollment).filter(
                and_(
                    CourseEnrollment.course_id == course_id,
                    CourseEnrollment.individual_user_id == current_user.id,
                    CourseEnrollment.enrollment_type == EnrollmentType.D2C
                )
            ).first()
            if has_access:
                return course

        raise PermissionError("You don't have access to this course")

    @staticmethod
    async def list_courses(
        db: Session,
        current_user: User,
        skip: int = 0,
        limit: int = 100,
        status: Optional[CourseStatus] = None,
        search: Optional[str] = None
    ) -> List[Course]:
        """List courses based on user role and access."""
        query = db.query(Course).filter(Course.is_deleted == False)

        # Apply filters
        if status:
            query = query.filter(Course.status == status)
        
        if search:
            search_filter = or_(
                Course.title.ilike(f"%{search}%"),
                Course.description.ilike(f"%{search}%"),
                Course.code.ilike(f"%{search}%")
            )
            query = query.filter(search_filter)

        # Apply role-based filtering
        if current_user.role == UserRole.SUPER_ADMIN:
            pass  # Can see all courses
        elif current_user.role == UserRole.INDIVIDUAL_USER:
            # Show only D2C courses or enrolled courses
            query = query.filter(
                or_(
                    Course.id.in_(
                        db.query(CourseEnrollment.course_id).filter(
                            CourseEnrollment.individual_user_id == current_user.id
                        )
                    ),
                    Course.is_d2c_enabled == True
                )
            )
        else:
            # B2B users can see courses licensed to their school
            query = query.filter(
                Course.id.in_(
                    db.query(CourseLicense.course_id).filter(
                        and_(
                            CourseLicense.school_id == current_user.school_id,
                            CourseLicense.is_active == True
                        )
                    )
                )
            )

        return query.offset(skip).limit(limit).all()

    @staticmethod
    async def delete_course(
        db: Session,
        current_user: User,
        course_id: UUID
    ) -> bool:
        """Soft delete a course."""
        if current_user.role != UserRole.SUPER_ADMIN:
            raise PermissionError("Only super admins can delete courses")

        course = db.query(Course).filter(Course.id == course_id).first()
        if not course:
            raise NotFoundException("Course not found")

        course.is_deleted = True
        db.add(course)
        return True 