"""Progress tracking models for the LMS."""

from datetime import datetime
from typing import Optional, Dict, Any
from uuid import UUID

from sqlalchemy import ForeignKey, String, DateTime, Integer, text, CheckConstraint, Index
from sqlalchemy.dialects.postgresql import JSONB, UUID as PgUUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base_model import BaseModel


class LessonProgress(BaseModel):
    """Lesson progress model."""
    
    __tablename__ = "lesson_progress"

    id: Mapped[UUID] = mapped_column(
        PgUUID(as_uuid=True), primary_key=True, server_default=text("gen_random_uuid()")
    )
    lesson_id: Mapped[UUID] = mapped_column(
        PgUUID(as_uuid=True), ForeignKey("lessons.id", ondelete="CASCADE"), nullable=False
    )
    student_id: Mapped[Optional[UUID]] = mapped_column(
        PgUUID(as_uuid=True), ForeignKey("student_profiles.id", ondelete="CASCADE"), nullable=True
    )
    individual_user_id: Mapped[Optional[UUID]] = mapped_column(
        PgUUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=True
    )
    status: Mapped[str] = mapped_column(
        String(20), nullable=False, server_default=text("'not_started'")
    )
    progress: Mapped[float] = mapped_column(nullable=False, server_default=text("0.0"))
    started_at: Mapped[Optional[datetime]] = mapped_column(
        DateTime(timezone=True), nullable=True
    )
    completed_at: Mapped[Optional[datetime]] = mapped_column(
        DateTime(timezone=True), nullable=True
    )
    last_interaction: Mapped[Optional[datetime]] = mapped_column(
        DateTime(timezone=True), nullable=True
    )
    time_spent_seconds: Mapped[int] = mapped_column(Integer, nullable=False, server_default=text("0"))

    # Relationships
    lesson = relationship("Lesson", back_populates="lesson_progresses", viewonly=True)
    student = relationship(
        "StudentProfile",
        back_populates="lesson_progresses",
        foreign_keys=[student_id],
        viewonly=True
    )
    individual_user = relationship(
        "User",
        back_populates="lesson_progresses",
        foreign_keys=[individual_user_id],
        viewonly=True
    )

    __table_args__ = (
        # Ensure either student_id or individual_user_id is set, but not both
        CheckConstraint(
            "(student_id IS NOT NULL AND individual_user_id IS NULL) OR "
            "(student_id IS NULL AND individual_user_id IS NOT NULL)",
            name="student_or_individual_user_progress_check"
        ),
    )


class UserProgress(BaseModel):
    """Unified progress tracking for both B2B and D2C users.
    
    This model uses polymorphic relationships to track progress across different content types:
    - Courses: Overall course progress
    - Modules: Progress within a module
    - Lessons: Individual lesson progress
    
    The polymorphic relationship is managed through content_type and content_id fields.
    No foreign key constraints are added because the content could be in different tables,
    but application-level validation ensures referential integrity.
    """
    
    __tablename__ = "user_progress"

    id: Mapped[UUID] = mapped_column(
        PgUUID(as_uuid=True), primary_key=True, server_default=text("gen_random_uuid()")
    )
    enrollment_id: Mapped[UUID] = mapped_column(
        PgUUID(as_uuid=True), ForeignKey("course_enrollments.id", ondelete="CASCADE"), nullable=False
    )
    content_type: Mapped[str] = mapped_column(
        String(20), 
        nullable=False,
        comment="Type of content being tracked: 'course', 'module', or 'lesson'"
    )
    content_id: Mapped[UUID] = mapped_column(
        PgUUID(as_uuid=True), 
        nullable=False,
        comment="UUID of the content (course_id, module_id, or lesson_id)"
    )
    status: Mapped[str] = mapped_column(
        String(20), nullable=False, server_default=text("'not_started'")
    )
    progress: Mapped[float] = mapped_column(
        nullable=False, 
        server_default=text("0.0"),
        comment="Progress value between 0.0 and 1.0"
    )
    started_at: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True), nullable=True)
    completed_at: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True), nullable=True)
    last_interaction: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True), nullable=True)
    time_spent_seconds: Mapped[int] = mapped_column(Integer, nullable=False, server_default=text("0"))
    progress_metadata: Mapped[Optional[Dict[str, Any]]] = mapped_column(
        JSONB, 
        nullable=True,
        comment="Additional metadata specific to the content type"
    )

    # Relationships
    enrollment = relationship("CourseEnrollment", back_populates="lesson_progresses", viewonly=True)

    __table_args__ = (
        CheckConstraint(
            "content_type IN ('course', 'module', 'lesson')",
            name="valid_content_type_check"
        ),
        CheckConstraint(
            "progress >= 0.0 AND progress <= 1.0",
            name="progress_range_check"
        ),
        # Create an index on content_type and content_id for faster lookups
        Index('idx_user_progress_content', 'content_type', 'content_id'),
    ) 