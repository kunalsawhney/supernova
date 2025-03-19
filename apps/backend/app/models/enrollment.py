"""Enrollment models for the LMS."""

from datetime import datetime
from typing import Optional, Dict, Any, List
from uuid import UUID

from sqlalchemy import Boolean, ForeignKey, String, DateTime, Integer, text, CheckConstraint
from sqlalchemy.dialects.postgresql import ENUM, JSONB, UUID as PgUUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base_model import BaseModel
from app.models.enums import EnrollmentStatus, EnrollmentType


class CourseEnrollment(BaseModel):
    """Course enrollment model."""
    
    __tablename__ = "course_enrollments"

    id: Mapped[UUID] = mapped_column(
        PgUUID(as_uuid=True), primary_key=True, server_default=text("gen_random_uuid()")
    )
    course_id: Mapped[UUID] = mapped_column(
        PgUUID(as_uuid=True), ForeignKey("courses.id", ondelete="CASCADE"), nullable=False
    )
    version_id: Mapped[UUID] = mapped_column(
        PgUUID(as_uuid=True), ForeignKey("course_versions.id", ondelete="RESTRICT"), nullable=False
    )
    student_id: Mapped[Optional[UUID]] = mapped_column(
        PgUUID(as_uuid=True), ForeignKey("student_profiles.id", ondelete="CASCADE"), nullable=True
    )
    individual_user_id: Mapped[Optional[UUID]] = mapped_column(
        PgUUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=True
    )
    enrolled_by_id: Mapped[UUID] = mapped_column(
        PgUUID(as_uuid=True), ForeignKey("users.id", ondelete="RESTRICT"), nullable=False
    )
    enrollment_type: Mapped[str] = mapped_column(
        ENUM(*[e.value for e in EnrollmentType], name="enrollment_type", create_type=False),
        nullable=False
    )
    status: Mapped[str] = mapped_column(
        ENUM(*[e.value for e in EnrollmentStatus], name="enrollment_status", create_type=False),
        nullable=False,
        server_default=text("'enrolled'")
    )
    enrolled_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), nullable=False, server_default=text("now()")
    )
    completed_at: Mapped[Optional[datetime]] = mapped_column(
        DateTime(timezone=True), nullable=True
    )
    progress: Mapped[float] = mapped_column(nullable=False, server_default=text("0.0"))
    last_activity_at: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True), nullable=True)

    # Completion details
    certificate_id: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)
    certificate_url: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    completion_score: Mapped[Optional[float]] = mapped_column(nullable=True)
    badges_earned: Mapped[Optional[List[Dict[str, Any]]]] = mapped_column(JSONB, nullable=True)
    completion_metadata: Mapped[Optional[Dict[str, Any]]] = mapped_column(JSONB, nullable=True)

    # Relationships
    course = relationship("Course", back_populates="enrollments", viewonly=True)
    version = relationship("CourseVersion", back_populates="enrollments", viewonly=True)
    student = relationship("StudentProfile", back_populates="enrollments", viewonly=True)
    individual_user = relationship(
        "User",
        back_populates="individual_enrollments",
        foreign_keys=[individual_user_id],
        viewonly=True
    )
    enrolled_by = relationship(
        "User",
        back_populates="created_enrollments",
        foreign_keys=[enrolled_by_id],
        viewonly=True
    )
    lesson_progresses = relationship("UserProgress", back_populates="enrollment", cascade="all, delete-orphan")
    review = relationship("CourseReview", back_populates="enrollment", uselist=False, cascade="all, delete-orphan")

    __table_args__ = (
        # Ensure either student_id or individual_user_id is set, but not both
        CheckConstraint(
            "(student_id IS NOT NULL AND individual_user_id IS NULL AND enrollment_type = 'b2b') OR "
            "(student_id IS NULL AND individual_user_id IS NOT NULL AND enrollment_type = 'd2c')",
            name="enrollment_type_check"
        ),
    ) 