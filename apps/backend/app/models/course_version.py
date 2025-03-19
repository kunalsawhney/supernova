"""Course version and content models for the LMS."""

from datetime import datetime
from typing import Optional, List, Dict, Any
from uuid import UUID

from sqlalchemy import DateTime, ForeignKey, String, Text, text, Integer
from sqlalchemy.dialects.postgresql import ENUM, JSONB, UUID as PgUUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base_model import BaseModel
from app.models.enums import CourseStatus


class CourseVersion(BaseModel):
    """Course version model for managing different versions of course content."""
    
    __tablename__ = "course_versions"

    id: Mapped[UUID] = mapped_column(
        PgUUID(as_uuid=True), primary_key=True, server_default=text("gen_random_uuid()")
    )
    course_id: Mapped[UUID] = mapped_column(
        PgUUID(as_uuid=True), ForeignKey("courses.id", ondelete="CASCADE"), nullable=False
    )
    version: Mapped[str] = mapped_column(String(20), nullable=False)
    content_id: Mapped[UUID] = mapped_column(
        PgUUID(as_uuid=True), ForeignKey("course_contents.id", ondelete="RESTRICT"), nullable=False
    )
    valid_from: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False)
    valid_until: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True), nullable=True)
    changelog: Mapped[Optional[Dict[str, Any]]] = mapped_column(JSONB, nullable=True)

    # Relationships
    course = relationship("Course", back_populates="versions")
    content = relationship(
        "CourseContent", 
        back_populates="versions", 
        viewonly=True
    )
    enrollments = relationship("CourseEnrollment", back_populates="version")


class CourseContent(BaseModel):
    """Course content model for managing the actual course materials."""
    
    __tablename__ = "course_contents"

    id: Mapped[UUID] = mapped_column(
        PgUUID(as_uuid=True), primary_key=True, server_default=text("gen_random_uuid()")
    )
    syllabus_url: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    start_date: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False)
    end_date: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False)
    duration_weeks: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)
    
    # Enhanced content management
    content_status: Mapped[str] = mapped_column(
        ENUM(*[e.value for e in CourseStatus], name="course_status", create_type=False),
        nullable=False,
        server_default=text("'draft'")
    )
    last_reviewed_by_id: Mapped[Optional[UUID]] = mapped_column(
        PgUUID(as_uuid=True), ForeignKey("users.id", ondelete="SET NULL"), nullable=True
    )
    last_reviewed_at: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True), nullable=True)
    resources: Mapped[Optional[List[Dict[str, Any]]]] = mapped_column(JSONB, nullable=True)  # Additional materials
    
    # Relationships
    versions = relationship("CourseVersion", back_populates="content")
    modules = relationship("Module", back_populates="content", cascade="all, delete-orphan")
    last_reviewed_by = relationship(
        "User",
        back_populates="reviewed_course_contents",
        foreign_keys=[last_reviewed_by_id],
        viewonly=True
    ) 