from datetime import datetime
from typing import List, Optional, Tuple
from uuid import UUID

from sqlalchemy import and_, or_, select
from sqlalchemy.orm import Session, joinedload, selectinload
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.exceptions import NotFoundException, ValidationError, PermissionError
from app.models.course import (
    Course
)
from app.models.enrollment import CourseEnrollment
from app.models.progress import UserProgress
from app.models.purchase import CourseLicense
from app.models.enums import EnrollmentStatus, EnrollmentType
from app.models.user import User, UserRole
from app.schemas.enrollment import (
    StudentEnrollmentCreate, IndividualEnrollmentCreate,
    EnrollmentUpdate, ProgressCreate
)

class EnrollmentService:
    """Service for managing course enrollments and progress."""

    @staticmethod
    async def create_student_enrollment(
        db: Session,
        current_user: User,
        enrollment_data: StudentEnrollmentCreate
    ) -> CourseEnrollment:
        """Create a new B2B student enrollment."""
        # Verify permissions
        if current_user.role not in [UserRole.SCHOOL_ADMIN, UserRole.TEACHER]:
            raise PermissionError("Only school admins and teachers can enroll students")

        # Verify course license
        license = db.query(CourseLicense).filter(
            and_(
                CourseLicense.course_id == enrollment_data.course_id,
                CourseLicense.school_id == current_user.school_id,
                CourseLicense.is_active == True
            )
        ).first()
        if not license:
            raise ValidationError("School does not have a license for this course")

        # Verify student belongs to school
        student = db.query(User).filter(
            and_(
                User.id == enrollment_data.student_id,
                User.school_id == current_user.school_id,
                User.role == UserRole.STUDENT
            )
        ).first()
        if not student:
            raise ValidationError("Student not found in school")

        # Check for existing enrollment
        existing = db.query(CourseEnrollment).filter(
            and_(
                CourseEnrollment.course_id == enrollment_data.course_id,
                CourseEnrollment.student_id == enrollment_data.student_id
            )
        ).first()
        if existing:
            raise ValidationError("Student is already enrolled in this course")

        # Create enrollment
        enrollment = CourseEnrollment(
            **enrollment_data.model_dump(),
            enrollment_type=EnrollmentType.B2B,
            status=EnrollmentStatus.ACTIVE,
            enrolled_by_id=current_user.id
        )
        db.add(enrollment)
        return enrollment

    @staticmethod
    async def create_individual_enrollment(
        db: Session,
        current_user: User,
        enrollment_data: IndividualEnrollmentCreate
    ) -> CourseEnrollment:
        """Create a new D2C individual enrollment."""
        if current_user.role != UserRole.INDIVIDUAL_USER:
            raise PermissionError("Only individual users can self-enroll in courses")

        # Verify course is available for D2C
        course = db.query(Course).filter(
            and_(
                Course.id == enrollment_data.course_id,
                Course.is_d2c_enabled == True
            )
        ).first()
        if not course:
            raise ValidationError("Course is not available for individual enrollment")

        # Check for existing enrollment
        existing = db.query(CourseEnrollment).filter(
            and_(
                CourseEnrollment.course_id == enrollment_data.course_id,
                CourseEnrollment.individual_user_id == current_user.id
            )
        ).first()
        if existing:
            raise ValidationError("You are already enrolled in this course")

        # Create enrollment
        enrollment = CourseEnrollment(
            course_id=enrollment_data.course_id,
            individual_user_id=current_user.id,
            enrollment_type=EnrollmentType.D2C,
            status=EnrollmentStatus.ACTIVE
        )
        db.add(enrollment)
        return enrollment

    @staticmethod
    async def update_enrollment_status(
        db: Session,
        current_user: User,
        enrollment_id: UUID,
        status: EnrollmentStatus
    ) -> CourseEnrollment:
        """Update enrollment status."""
        enrollment = db.query(CourseEnrollment).filter(
            CourseEnrollment.id == enrollment_id
        ).first()
        if not enrollment:
            raise NotFoundException("Enrollment not found")

        # Check permissions
        if current_user.role == UserRole.SUPER_ADMIN:
            pass  # Can update any enrollment
        elif current_user.role in [UserRole.SCHOOL_ADMIN, UserRole.TEACHER]:
            # Can only update B2B enrollments in their school
            student = db.query(User).filter(User.id == enrollment.student_id).first()
            if not student or student.school_id != current_user.school_id:
                raise PermissionError("Cannot update enrollments outside your school")
        elif current_user.role == UserRole.INDIVIDUAL_USER:
            # Can only update own D2C enrollments
            if enrollment.individual_user_id != current_user.id:
                raise PermissionError("Cannot update other users' enrollments")
        else:
            raise PermissionError("Insufficient permissions")

        enrollment.status = status
        db.add(enrollment)
        return enrollment

    @staticmethod
    async def update_progress(
        db: Session,
        current_user: User,
        progress_data: ProgressCreate
    ) -> UserProgress:
        """Update user progress in a course."""
        # Verify enrollment exists and user has access
        enrollment = db.query(CourseEnrollment).filter(
            CourseEnrollment.id == progress_data.enrollment_id
        ).first()
        if not enrollment:
            raise NotFoundException("Enrollment not found")

        if enrollment.student_id:
            if current_user.role == UserRole.STUDENT and enrollment.student_id != current_user.id:
                raise PermissionError("Cannot update progress for other students")
        else:
            if enrollment.individual_user_id != current_user.id:
                raise PermissionError("Cannot update progress for other users")

        # Create or update progress
        progress = db.query(UserProgress).filter(
            and_(
                UserProgress.enrollment_id == progress_data.enrollment_id,
                UserProgress.lesson_id == progress_data.lesson_id
            )
        ).first()

        if progress:
            # Update existing progress
            for field, value in progress_data.model_dump().items():
                setattr(progress, field, value)
        else:
            # Create new progress
            progress = UserProgress(**progress_data.model_dump())
            
        db.add(progress)
        return progress

    @staticmethod
    async def list_enrollments(
        db: AsyncSession,
        current_user: User,
        course_id: Optional[UUID] = None,
        status: Optional[EnrollmentStatus] = None,
        skip: int = 0,
        limit: int = 100
    ) -> List[CourseEnrollment]:
        """List enrollments based on user role and filters."""
        query = select(CourseEnrollment)
        
        # Apply filters
        if course_id:
            query = query.where(CourseEnrollment.course_id == course_id)
        if status:
            query = query.where(CourseEnrollment.status == status)

        # Apply role-based filtering
        if current_user.role == UserRole.SUPER_ADMIN:
            pass  # Can see all enrollments
        elif current_user.role in [UserRole.SCHOOL_ADMIN, UserRole.TEACHER]:
            # Can only see enrollments in their school
            query = query.join(User, CourseEnrollment.student_id == User.id).where(
                User.school_id == current_user.school_id
            )
        elif current_user.role == UserRole.STUDENT:
            # Can only see own enrollments
            query = query.where(CourseEnrollment.student_id == current_user.id)
        else:  # Individual user
            # Can only see own D2C enrollments
            query = query.where(CourseEnrollment.individual_user_id == current_user.id)

        result = await db.execute(query.offset(skip).limit(limit))
        enrollments = result.scalars().all()
        # for enrollment in enrollments:
        #     if with_progress:
        #         enrollment.progress = enrollment.lesson_progresses.all()
        return enrollments

    @staticmethod
    async def get_enrollment_progress(
        db: AsyncSession,
        current_user: User,
        enrollment_id: UUID
    ) -> Tuple[CourseEnrollment, List[UserProgress]]:
        """Get detailed progress for an enrollment."""

        # Fetch enrollment with related data eagerly
        result = await db.execute(
            select(CourseEnrollment)
            .where(CourseEnrollment.id == enrollment_id)
            .options(
                joinedload(CourseEnrollment.student),  # Ensure student info is preloaded
                selectinload(CourseEnrollment.lesson_progresses)  # Preload progress records
            )
        )
        enrollment = result.scalar_one_or_none()
        
        if not enrollment:
            raise NotFoundException("Enrollment not found")

        # Check access permissions
        if current_user.role == UserRole.SUPER_ADMIN:
            pass  # Can access any enrollment
        elif current_user.role in [UserRole.SCHOOL_ADMIN, UserRole.TEACHER]:
            if not enrollment.student or enrollment.student.school_id != current_user.school_id:
                raise PermissionError("Cannot access enrollments outside your school")
        elif enrollment.student_id == current_user.id or enrollment.individual_user_id == current_user.id:
            pass  # Can access own enrollment
        else:
            raise PermissionError("Cannot access this enrollment")

        return enrollment