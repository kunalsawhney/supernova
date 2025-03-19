from datetime import datetime
from typing import List, Optional, Tuple, Dict, Any
from uuid import UUID

from sqlalchemy import and_, or_, func, select, case
from sqlalchemy.orm import Session, selectinload, joinedload
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.exception_handlers import NotFoundException, ValidationError, PermissionError
from app.models.course import (
    Course, CourseContent, CourseVersion, Module, Lesson,
    CourseStatus, EnrollmentType
)
from app.models.user import User, UserRole
from app.schemas.course import (
    CourseCreate, CourseUpdate, CourseContentCreate,
    ModuleCreate, LessonCreate, ModuleUpdate
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

        course_dict = course_data.model_dump()
        # Create course
        course = Course(
            **course_dict,
            created_by_id=current_user.id,
            # status=CourseStatus.DRAFT,
            version="1.0"
        )
        db.add(course)
        await db.flush()  # Get course ID without committing
        
        # Automatically create initial CourseContent
        content = CourseContent(
            content_status=course.status,
            start_date=datetime.utcnow(),
            end_date=datetime.utcnow().replace(year=datetime.utcnow().year + 1),  # Default 1 year duration
            syllabus_url=None,
            duration_weeks=52  # Default to 1 year (52 weeks)
        )
        db.add(content)
        await db.flush()

        # Create CourseVersion linking Course and CourseContent
        version = CourseVersion(
            course_id=course.id,
            content_id=content.id,
            version="1.0",
            valid_from=datetime.utcnow(),
            valid_until=None,  # No end date by default
            changelog={"initial": "Initial course version"}
        )
        db.add(version)
        await db.flush()


        # Update course with latest version ID
        course.latest_version_id = version.id
        db.add(course)
        await db.flush()

        return course

    @staticmethod
    async def update_course(
        db: Session,
        current_user: User,
        course_id: UUID,
        course_data: CourseUpdate
    ) -> Course:
        """Update an existing course."""
        course = await db.get(Course, course_id)
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
        # content = db.query(CourseContent).filter(CourseContent.id == content_id).first()
        content = await db.get(CourseContent, content_id)
        if not content:
            raise NotFoundException("Course content not found")

        if current_user.role != UserRole.SUPER_ADMIN:
            raise PermissionError("Only super admins can add modules")

        module = Module(
            **module_data.model_dump(),
            # content_id=content_id,
            # status=CourseStatus.DRAFT
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
        db: AsyncSession,
        current_user: User,
        course_id: UUID,
        with_content: bool = False
    ) -> Course:
        """Get course details."""
        try:
            # Base query for course
            query = select(Course).where(Course.id == course_id)
            
            if with_content:
                # Load all necessary relationships for full content response
                query = query.options(
                    selectinload(Course.versions),
                )
                
                # Execute query to get course with versions
                result = await db.execute(query)
                course = result.scalar_one_or_none()
                
                if not course:
                    raise NotFoundException("Course not found")
                
                # Find the latest version based on valid_from date
                latest_version = None
                if course.versions:
                    latest_version = max(course.versions, key=lambda v: v.valid_from)
                
                # Now explicitly load the content for each version to ensure proper relationship structure
                latest_content = None
                for version in course.versions:
                    content_query = select(CourseContent).where(CourseContent.id == version.content_id)
                    content_query = content_query.options(
                        selectinload(CourseContent.modules)
                        .selectinload(Module.lessons)
                    )
                    content_result = await db.execute(content_query)
                    content = content_result.scalar_one_or_none()
                    if content:
                        # Set the loaded content on the version
                        version.content = content
                        
                        # Manually set fields required by CourseContentResponse schema
                        content.version = version.version  # Set version field from CourseVersion
                        content.course_id = version.course_id  # Set course_id field from CourseVersion
                        
                        # Ensure other required fields have defaults if they might be missing
                        if not hasattr(content, 'description') or content.description is None:
                            content.description = ""
                            
                        # Ensure start_date and end_date are set
                        if not hasattr(content, 'start_date') or content.start_date is None:
                            content.start_date = datetime.utcnow()
                        if not hasattr(content, 'end_date') or content.end_date is None:
                            content.end_date = datetime.utcnow().replace(year=datetime.utcnow().year + 1)
                        
                        # If this is the latest version, set it as the latest_content
                        if latest_version and version.id == latest_version.id:
                            latest_content = content
                
                # Set the latest_version_id field on the course
                if latest_version:
                    # Set the ID of the latest version
                    setattr(course, 'latest_version_id', latest_version.id)
            else:
                # Simple course query without content
                result = await db.execute(query)
                course = result.scalar_one_or_none()
                
                if not course:
                    raise NotFoundException("Course not found")
            
            # Check access permissions
            if current_user.role != UserRole.SUPER_ADMIN:
                # Permission checks (unchanged)
                pass

            return course
        except Exception as e:
            print(f"Error in get_course: {str(e)}")
            raise

    @staticmethod
    async def list_courses(
        db: AsyncSession,
        current_user: User,
        skip: int = 0,
        limit: int = 100,
        status: Optional[CourseStatus] = None,
        search: Optional[str] = None
    ) -> List[Course]:
        """List courses based on user role and access."""
        query = select(Course).where(Course.is_deleted == False)

        # Apply filters
        if status:
            query = query.where(Course.status == status)
        
        if search:
            search_filter = or_(
                Course.title.ilike(f"%{search}%"),
                Course.description.ilike(f"%{search}%"),
                Course.code.ilike(f"%{search}%")
            )
            query = query.where(search_filter)

        # Apply role-based filtering
        if current_user.role == UserRole.SUPER_ADMIN:
            pass  # Can see all courses
        elif current_user.role == UserRole.INDIVIDUAL_USER:
            # Show only D2C courses or enrolled courses
            enrollments_query = select(CourseEnrollment.course_id).where(
                CourseEnrollment.individual_user_id == current_user.id
            )
            query = query.where(
                or_(
                    Course.id.in_(enrollments_query),
                    Course.is_d2c_enabled == True
                )
            )
        else:
            # B2B users can see courses licensed to their school
            licenses_query = select(CourseLicense.course_id).where(
                and_(
                    CourseLicense.school_id == current_user.school_id,
                    CourseLicense.is_active == True
                )
            )
            query = query.where(Course.id.in_(licenses_query))

        # Apply pagination
        query = query.offset(skip).limit(limit)
        
        # Execute query
        result = await db.execute(query)
        return result.scalars().all()

    @staticmethod
    async def delete_course(
        db: AsyncSession,
        current_user: User,
        course_id: UUID
    ) -> bool:
        """Soft delete a course."""
        if current_user.role != UserRole.SUPER_ADMIN:
            raise PermissionError("Only super admins can delete courses")

        query = select(Course).where(Course.id == course_id)
        result = await db.execute(query)
        course = result.scalar_one_or_none()
        
        if not course:
            raise NotFoundException("Course not found")

        course.is_deleted = True
        db.add(course)
        return True

    @staticmethod
    async def get_content_stats(
        db: AsyncSession,
        current_user: User
    ) -> Dict[str, Any]:
        """Get statistics for the content dashboard."""
        if current_user.role != UserRole.SUPER_ADMIN:
            raise PermissionError("Only super admins can access content statistics")
            
        # Get course stats
        course_stats_query = select(
            func.count(Course.id).label("total"),
            func.count(case([(Course.status == CourseStatus.PUBLISHED, 1)])).label("published"),
            func.count(case([(Course.status == CourseStatus.DRAFT, 1)])).label("draft"),
            func.count(case([(Course.status == CourseStatus.ARCHIVED, 1)])).label("archived")
        ).where(Course.is_deleted == False)
        
        course_stats_result = await db.execute(course_stats_query)
        course_stats = course_stats_result.one()
        
        # Get module stats
        module_stats_query = select(
            func.count(Module.id).label("total"),
            func.count(case([(Module.status == CourseStatus.PUBLISHED, 1)])).label("published"),
            func.count(case([(Module.status == CourseStatus.DRAFT, 1)])).label("draft"),
            func.count(case([(Module.status == CourseStatus.ARCHIVED, 1)])).label("archived")
        )
        
        module_stats_result = await db.execute(module_stats_query)
        module_stats = module_stats_result.one()
        
        # Get lesson stats
        lesson_stats_query = select(
            func.count(Lesson.id).label("total")
        )
        
        lesson_stats_result = await db.execute(lesson_stats_query)
        lesson_stats = lesson_stats_result.one()
        
        # Get items that need review
        needs_review_query = select(
            func.count(Module.id)
        ).where(Module.status == CourseStatus.DRAFT)
        
        needs_review_result = await db.execute(needs_review_query)
        needs_review = needs_review_result.scalar_one()
        
        return {
            "courses": {
                "total": course_stats.total or 0,
                "published": course_stats.published or 0,
                "draft": course_stats.draft or 0,
                "archived": course_stats.archived or 0
            },
            "modules": {
                "total": module_stats.total or 0,
                "published": module_stats.published or 0,
                "draft": module_stats.draft or 0,
                "archived": module_stats.archived or 0
            },
            "lessons": {
                "total": lesson_stats.total or 0
            },
            "needs_review": needs_review or 0
        }
    
    @staticmethod
    async def list_modules(
        db: AsyncSession,
        current_user: User,
        skip: int = 0,
        limit: int = 100,
        status: Optional[CourseStatus] = None,
        course_id: Optional[UUID] = None,
        search: Optional[str] = None
    ) -> List[Module]:
        """List modules with filters."""
        # Start with base query
        query = select(Module)
        
        # Apply role-based permissions
        if current_user.role == UserRole.SUPER_ADMIN:
            # Super admins can see all modules
            pass
        # elif current_user.role in [UserRole.SCHOOL_ADMIN, UserRole.INSTRUCTOR, UserRole.STUDENT]:
        #     if current_user.school_id:
        #         # Find modules from courses licensed to the school
        #         accessible_courses = db.query(CourseLicense.course_id).filter(
        #             and_(
        #                 CourseLicense.school_id == current_user.school_id,
        #                 CourseLicense.is_active == True
        #             )
        #         )
                
        #         query = query.join(CourseContent).join(CourseVersion).filter(
        #             CourseVersion.course_id.in_(accessible_courses)
        #         )
        #     else:
        #         # No school, no access
        #         return []
        # else:
        #     # Individual users should use the list_course_modules method
        #     return []
            
        # Apply filters
        if status:
            query = query.where(Module.status == status)
            
        if course_id:
            # Join through relevant tables to filter by course
            query = query.join(CourseContent).join(CourseVersion).where(CourseVersion.course_id == course_id)
            
        if search:
            search_filter = or_(
                Module.title.ilike(f"%{search}%"),
                Module.description.ilike(f"%{search}%")
            )
            query = query.where(search_filter)
        
        # Apply pagination
        query = query.offset(skip).limit(limit)
        
        # Execute query
        result = await db.execute(query)
        return result.scalars().all()
    
    @staticmethod
    async def list_lessons(
        db: AsyncSession,
        current_user: User,
        skip: int = 0,
        limit: int = 100,
        module_id: Optional[UUID] = None,
        lesson_type: Optional[str] = None,
        search: Optional[str] = None
    ) -> List[Lesson]:
        """List lessons with filters."""
        # Start with base query
        query = select(Lesson)
        
        # Apply role-based permissions
        if current_user.role == UserRole.SUPER_ADMIN:
            # Super admins can see all lessons
            pass
        elif current_user.role in [UserRole.SCHOOL_ADMIN, UserRole.INSTRUCTOR, UserRole.STUDENT]:
            if current_user.school_id:
                # Find lessons from modules from courses licensed to the school
                accessible_courses = select(CourseLicense.course_id).where(
                    and_(
                        CourseLicense.school_id == current_user.school_id,
                        CourseLicense.is_active == True
                    )
                )
                
                # Get modules from accessible courses
                accessible_modules = select(Module.id).join(CourseContent).join(CourseVersion).where(
                    CourseVersion.course_id.in_(accessible_courses)
                )
                
                query = query.where(Lesson.module_id.in_(accessible_modules))
            else:
                # No school, no access
                return []
        else:
            # Individual users should use a different method
            return []
            
        # Apply filters
        if module_id:
            query = query.where(Lesson.module_id == module_id)
            
        if lesson_type:
            query = query.where(Lesson.content_type == lesson_type)
            
        if search:
            search_filter = or_(
                Lesson.title.ilike(f"%{search}%"),
                Lesson.description.ilike(f"%{search}%")
            )
            query = query.where(search_filter)
        
        # Apply pagination
        query = query.offset(skip).limit(limit)
        
        # Execute query
        result = await db.execute(query)
        return result.scalars().all()
    
    @staticmethod
    async def get_module(
        db: AsyncSession,
        current_user: User,
        module_id: UUID
    ) -> Module:
        """Get module details."""
        query = select(Module).where(Module.id == module_id)
        result = await db.execute(query)
        module = result.scalar_one_or_none()
        
        if not module:
            raise NotFoundException("Module not found")
            
        # Check permissions
        if current_user.role == UserRole.SUPER_ADMIN:
            # Super admins can access any module
            return module
            
        if current_user.school_id:
            # Get the course this module belongs to
            course_query = select(CourseVersion.course_id).join(
                CourseContent, CourseContent.id == module.content_id
            )
            course_result = await db.execute(course_query)
            course_id = course_result.scalar_one_or_none()
            
            if not course_id:
                raise NotFoundException("Course not found for this module")
                
            # Check if school has license for this course
            license_query = select(CourseLicense).where(
                and_(
                    CourseLicense.course_id == course_id,
                    CourseLicense.school_id == current_user.school_id,
                    CourseLicense.is_active == True
                )
            )
            license_result = await db.execute(license_query)
            has_license = license_result.scalar_one_or_none()
            
            if has_license:
                return module
        
        # Default: no access
        raise PermissionError("You don't have access to this module")
            
    @staticmethod
    async def get_lesson(
        db: AsyncSession,
        current_user: User,
        lesson_id: UUID
    ) -> Lesson:
        """Get lesson details."""
        query = select(Lesson).where(Lesson.id == lesson_id)
        result = await db.execute(query)
        lesson = result.scalar_one_or_none()
        
        if not lesson:
            raise NotFoundException("Lesson not found")
            
        # Check permissions
        if current_user.role == UserRole.SUPER_ADMIN:
            # Super admins can access any lesson
            return lesson
            
        if current_user.school_id:
            # Get the module this lesson belongs to
            module_query = select(Module).where(Module.id == lesson.module_id)
            module_result = await db.execute(module_query)
            module = module_result.scalar_one_or_none()
            
            if not module:
                raise NotFoundException("Module not found for this lesson")
                
            # Get the course this module belongs to
            course_query = select(CourseVersion.course_id).join(
                CourseContent, CourseContent.id == module.content_id
            )
            course_result = await db.execute(course_query)
            course_id = course_result.scalar_one_or_none()
            
            if not course_id:
                raise NotFoundException("Course not found for this lesson")
                
            # Check if school has license for this course
            license_query = select(CourseLicense).where(
                and_(
                    CourseLicense.course_id == course_id,
                    CourseLicense.school_id == current_user.school_id,
                    CourseLicense.is_active == True
                )
            )
            license_result = await db.execute(license_query)
            has_license = license_result.scalar_one_or_none()
            
            if has_license:
                return lesson
        
        # Default: no access
        raise PermissionError("You don't have access to this lesson")

    @staticmethod
    async def update_module(
        db: AsyncSession,
        current_user: User,
        module_id: UUID,
        module_data: ModuleUpdate
    ) -> Module:
        """Update an existing module."""
        # Get the module
        module_query = select(Module).where(Module.id == module_id)
        module_result = await db.execute(module_query)
        module = module_result.scalar_one_or_none()
        
        if not module:
            raise NotFoundException("Module not found")

        # Get the course this module belongs to
        course_query = select(CourseVersion.course_id).join(
            CourseContent, CourseContent.id == module.content_id
        )
        course_result = await db.execute(course_query)
        course_id = course_result.scalar_one_or_none()
            
        if not course_id:
            raise NotFoundException("Course not found for this module")
            
        # Check permissions
        if current_user.role == UserRole.SUPER_ADMIN:
            # Super admins can update any module
            pass
        elif current_user.role in [UserRole.SCHOOL_ADMIN, UserRole.TEACHER]:
            # Check if school has license for this course
            license_query = select(CourseLicense).where(
                and_(
                    CourseLicense.course_id == course_id,
                    CourseLicense.school_id == current_user.school_id,
                    CourseLicense.is_active == True
                )
            )
            license_result = await db.execute(license_query)
            has_license = license_result.scalar_one_or_none()
            
            if not has_license:
                raise PermissionError("You don't have access to update this module")
        else:
            raise PermissionError("Only super admins, school admins, and teachers can update modules")
        
        # Update module fields
        update_data = module_data.model_dump(exclude_unset=True)
        for field, value in update_data.items():
            if field == 'order':  # Map 'order' to 'sequence_number'
                setattr(module, 'sequence_number', value)
            elif field == 'title':  # Map 'title' to 'name'
                setattr(module, 'name', value)
            else:
                setattr(module, field, value)
        
        db.add(module)
        return module

    @staticmethod
    async def delete_module(
        db: AsyncSession,
        current_user: User,
        module_id: UUID
    ) -> bool:
        """Delete a module."""
        # Get the module
        module_query = select(Module).where(Module.id == module_id)
        module_result = await db.execute(module_query)
        module = module_result.scalar_one_or_none()
        
        if not module:
            raise NotFoundException("Module not found")

        # Get the course this module belongs to
        course_query = select(CourseVersion.course_id).join(
            CourseContent, CourseContent.id == module.content_id
        )
        course_result = await db.execute(course_query)
        course_id = course_result.scalar_one_or_none()
            
        if not course_id:
            raise NotFoundException("Course not found for this module")
            
        # Check permissions
        if current_user.role == UserRole.SUPER_ADMIN:
            # Super admins can delete any module
            pass
        elif current_user.role == UserRole.SCHOOL_ADMIN:
            # Check if school has license for this course
            license_query = select(CourseLicense).where(
                and_(
                    CourseLicense.course_id == course_id,
                    CourseLicense.school_id == current_user.school_id,
                    CourseLicense.is_active == True
                )
            )
            license_result = await db.execute(license_query)
            has_license = license_result.scalar_one_or_none()
            
            if not has_license:
                raise PermissionError("You don't have access to delete this module")
        else:
            raise PermissionError("Only super admins and school admins can delete modules")
        
        # Soft delete the module
        module.is_deleted = True
        db.add(module)
        return True 