"""Module model for the LMS."""

from typing import Optional, Dict, Any
from uuid import UUID

from sqlalchemy import Boolean, ForeignKey, String, Text, Integer, text
from sqlalchemy.dialects.postgresql import ENUM, JSONB, UUID as PgUUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base_model import BaseModel
from app.models.enums import CourseStatus


class Module(BaseModel):
    """Module model."""
    
    __tablename__ = "modules"

    id: Mapped[UUID] = mapped_column(
        PgUUID(as_uuid=True), primary_key=True, server_default=text("gen_random_uuid()")
    )
    content_id: Mapped[UUID] = mapped_column(
        PgUUID(as_uuid=True), ForeignKey("course_contents.id", ondelete="CASCADE"), nullable=False
    )
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    description: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    sequence_number: Mapped[int] = mapped_column(Integer, nullable=False)
    duration_weeks: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)
    status: Mapped[str] = mapped_column(
        ENUM(*[e.value for e in CourseStatus], name="course_status", create_type=False),
        nullable=False,
        server_default=text("'draft'")
    )
    completion_criteria: Mapped[Optional[Dict[str, Any]]] = mapped_column(JSONB, nullable=True)
    is_mandatory: Mapped[bool] = mapped_column(Boolean, nullable=False, server_default=text("true"))

    # Relationships
    content = relationship("CourseContent", back_populates="modules", viewonly=True)
    lessons = relationship("Lesson", back_populates="module", cascade="all, delete-orphan") 