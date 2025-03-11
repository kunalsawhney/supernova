from datetime import datetime
from typing import List, Optional, Tuple
from uuid import UUID

from sqlalchemy import and_, or_
from sqlalchemy.orm import Session

from app.core.exceptions import NotFoundException, ValidationError, PermissionError
from app.models.course import (
    Course, CourseEnrollment, UserProgress,
    EnrollmentStatus, EnrollmentType
)
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
        db: Session,
        current_user: User,
        course_id: Optional[UUID] = None,
        status: Optional[EnrollmentStatus] = None,
        skip: int = 0,
        limit: int = 100
    ) -> List[CourseEnrollment]:
        """List enrollments based on user role and filters."""
        query = db.query(CourseEnrollment)

        # Apply filters
        if course_id:
            query = query.filter(CourseEnrollment.course_id == course_id)
        if status:
            query = query.filter(CourseEnrollment.status == status)

        # Apply role-based filtering
        if current_user.role == UserRole.SUPER_ADMIN:
            pass  # Can see all enrollments
        elif current_user.role in [UserRole.SCHOOL_ADMIN, UserRole.TEACHER]:
            # Can only see enrollments in their school
            query = query.join(User, CourseEnrollment.student_id == User.id).filter(
                User.school_id == current_user.school_id
            )
        elif current_user.role == UserRole.STUDENT:
            # Can only see own enrollments
            query = query.filter(CourseEnrollment.student_id == current_user.id)
        else:  # Individual user
            # Can only see own D2C enrollments
            query = query.filter(CourseEnrollment.individual_user_id == current_user.id)

        return query.offset(skip).limit(limit).all()

    @staticmethod
    async def get_enrollment_progress(
        db: Session,
        current_user: User,
        enrollment_id: UUID
    ) -> Tuple[CourseEnrollment, List[UserProgress]]:
        """Get detailed progress for an enrollment."""
        enrollment = db.query(CourseEnrollment).filter(
            CourseEnrollment.id == enrollment_id
        ).first()
        if not enrollment:
            raise NotFoundException("Enrollment not found")

        # Check access permissions
        if current_user.role == UserRole.SUPER_ADMIN:
            pass  # Can access any enrollment
        elif current_user.role in [UserRole.SCHOOL_ADMIN, UserRole.TEACHER]:
            # Can access enrollments in their school
            student = db.query(User).filter(User.id == enrollment.student_id).first()
            if not student or student.school_id != current_user.school_id:
                raise PermissionError("Cannot access enrollments outside your school")
        elif enrollment.student_id == current_user.id or enrollment.individual_user_id == current_user.id:
            pass  # Can access own enrollment
        else:
            raise PermissionError("Cannot access this enrollment")

        # Get progress records
        progress = db.query(UserProgress).filter(
            UserProgress.enrollment_id == enrollment_id
        ).all()

        return enrollment, progress 