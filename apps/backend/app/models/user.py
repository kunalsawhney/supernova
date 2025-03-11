"""User model and related models."""

from datetime import date, datetime
from typing import Optional, List
from uuid import UUID

from sqlalchemy import Boolean, DateTime, ForeignKey, String, Text, text, JSON, Date
from sqlalchemy.dialects.postgresql import ENUM, JSONB, UUID as PGUUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base_model import BaseModel
from app.models.enums import UserRole, UserStatus
from app.models.scoped_models import SuperAdminScopedModel
from app.models.course import Course

class User(BaseModel):
    """User model for managing user metadata and authentication."""
    
    __tablename__ = "users"

    id: Mapped[UUID] = mapped_column(
        PGUUID(as_uuid=True), primary_key=True, server_default=text("gen_random_uuid()")
    )
    email: Mapped[str] = mapped_column(String(255), nullable=False, unique=True)
    password: Mapped[str] = mapped_column(String(255), nullable=False)
    first_name: Mapped[str] = mapped_column(String(255), nullable=False)
    last_name: Mapped[str] = mapped_column(String(255), nullable=False)
    is_active: Mapped[bool] = mapped_column(Boolean, nullable=False, server_default=text("true"))
    role: Mapped[str] = mapped_column(
        ENUM(*[e.value for e in UserRole], name="user_role", create_type=False),
        nullable=False,
        index=True
    )
    school_id: Mapped[Optional[UUID]] = mapped_column(
        PGUUID(as_uuid=True), 
        ForeignKey("schools.id"), 
        nullable=True
    )
    settings: Mapped[Optional[dict]] = mapped_column(JSONB, nullable=True)

    # Relationships
    school = relationship("School", back_populates="users")
    created_courses = relationship(
        "Course",
        back_populates="created_by",
        primaryjoin="User.id==Course.created_by_id",
        viewonly=True
    )
    granted_licenses = relationship(
        "CourseLicense",
        back_populates="granted_by",
        foreign_keys="CourseLicense.granted_by_id"
    )
    student_profile = relationship("StudentProfile", back_populates="user", uselist=False)
    teacher_profile = relationship("TeacherProfile", back_populates="user", uselist=False)
    individual_enrollments = relationship(
        "CourseEnrollment", 
        back_populates="individual_user",
        primaryjoin="and_(User.id==CourseEnrollment.individual_user_id, User.role=='individual_user')",
        foreign_keys="CourseEnrollment.individual_user_id"
    )
    lesson_progress = relationship(
        "LessonProgress", 
        back_populates="individual_user",
        primaryjoin="and_(User.id==LessonProgress.individual_user_id, User.role=='individual_user')",
        foreign_keys="LessonProgress.individual_user_id"
    )
    # New relationships
    reviewed_courses = relationship(
        "CourseContent",
        back_populates="last_reviewed_by",
        foreign_keys="CourseContent.last_reviewed_by_id",
        viewonly=True
    )
    moderated_reviews = relationship(
        "CourseReview",
        back_populates="moderated_by",
        foreign_keys="CourseReview.moderated_by_id"
    )
    course_purchases = relationship(
        "CoursePurchase",
        back_populates="user",
        foreign_keys="CoursePurchase.user_id"
    )
    enrollments_created = relationship(
        "CourseEnrollment",
        back_populates="enrolled_by",
        foreign_keys="CourseEnrollment.enrolled_by_id"
    )

    @property
    def full_name(self) -> str:
        """Return user's full name."""
        return f"{self.first_name} {self.last_name}"

    def __repr__(self) -> str:
        """Return string representation of the user."""
        return f"<User {self.email}>"

class StudentProfile(BaseModel):
    """Student profile model."""
    
    __tablename__ = "student_profiles"

    user_id: Mapped[UUID] = mapped_column(
        PGUUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False
    )
    school_id: Mapped[UUID] = mapped_column(
        PGUUID(as_uuid=True), ForeignKey("schools.id", ondelete="CASCADE"), nullable=False
    )
    enrollment_number: Mapped[str] = mapped_column(String(50), nullable=False)
    grade_level: Mapped[str] = mapped_column(String(20), nullable=False)
    section: Mapped[Optional[str]] = mapped_column(String(20), nullable=True)
    parent_details: Mapped[Optional[dict]] = mapped_column(JSONB, nullable=True)
    admission_date: Mapped[date] = mapped_column(Date, nullable=False)
    academic_status: Mapped[str] = mapped_column(
        String(20), nullable=False, server_default=text("'active'")
    )

    # Relationships
    user = relationship("User", back_populates="student_profile")
    school = relationship("School", back_populates="student_profiles")
    enrollments = relationship("CourseEnrollment", back_populates="student")
    progress_records = relationship("LessonProgress", back_populates="student")

class TeacherProfile(BaseModel):
    """Teacher profile model."""
    
    __tablename__ = "teacher_profiles"

    user_id: Mapped[UUID] = mapped_column(
        PGUUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False
    )
    school_id: Mapped[UUID] = mapped_column(
        PGUUID(as_uuid=True), ForeignKey("schools.id", ondelete="CASCADE"), nullable=False
    )
    employee_id: Mapped[str] = mapped_column(String(50), nullable=False)
    subjects: Mapped[Optional[List[str]]] = mapped_column(JSONB, nullable=True)
    qualifications: Mapped[Optional[dict]] = mapped_column(JSONB, nullable=True)
    joining_date: Mapped[date] = mapped_column(Date, nullable=False)
    department: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)

    # Relationships
    user = relationship("User", back_populates="teacher_profile")
    school = relationship("School", back_populates="teacher_profiles") 