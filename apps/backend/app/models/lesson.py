"""Lesson models for the LMS."""

from typing import Optional, Dict, Any, List
from uuid import UUID

from sqlalchemy import Boolean, ForeignKey, String, Text, Integer, text, CheckConstraint
from sqlalchemy.dialects.postgresql import ENUM, JSONB, UUID as PgUUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base_model import BaseModel
from app.models.enums import ContentType


class Lesson(BaseModel):
    """Lesson model."""
    
    __tablename__ = "lessons"

    id: Mapped[UUID] = mapped_column(
        PgUUID(as_uuid=True), primary_key=True, server_default=text("gen_random_uuid()")
    )
    module_id: Mapped[UUID] = mapped_column(
        PgUUID(as_uuid=True), ForeignKey("modules.id", ondelete="CASCADE"), nullable=False
    )
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    description: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    sequence_number: Mapped[int] = mapped_column(Integer, nullable=False)
    content_type: Mapped[str] = mapped_column(
        ENUM(*[e.value for e in ContentType], name="content_type", create_type=False),
        nullable=False
    )
    content: Mapped[Dict[str, Any]] = mapped_column(JSONB, nullable=False)
    duration_minutes: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)
    is_mandatory: Mapped[bool] = mapped_column(Boolean, nullable=False, server_default=text("true"))
    completion_criteria: Mapped[Optional[Dict[str, Any]]] = mapped_column(JSONB, nullable=True)

    # Relationships
    module = relationship("Module", back_populates="lessons", viewonly=True)
    quiz = relationship("LessonQuiz", back_populates="lesson", uselist=False)
    lesson_progresses = relationship("LessonProgress", back_populates="lesson", cascade="all, delete-orphan")


class LessonQuiz(BaseModel):
    """Quiz model for lessons."""
    
    __tablename__ = "lesson_quizzes"

    id: Mapped[UUID] = mapped_column(
        PgUUID(as_uuid=True), primary_key=True, server_default=text("gen_random_uuid()")
    )
    lesson_id: Mapped[UUID] = mapped_column(
        PgUUID(as_uuid=True), ForeignKey("lessons.id", ondelete="CASCADE"), nullable=False
    )
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    description: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    questions: Mapped[List[Dict[str, Any]]] = mapped_column(
        JSONB,
        nullable=False,
        comment="List of questions with their options and correct answers"
    )
    settings: Mapped[Optional[Dict[str, Any]]] = mapped_column(
        JSONB,
        nullable=True,
        comment="Quiz settings like time limit, passing score, etc."
    )
    is_mandatory: Mapped[bool] = mapped_column(
        Boolean,
        nullable=False,
        server_default=text("true"),
        comment="Whether passing this quiz is required for lesson completion"
    )
    passing_score: Mapped[float] = mapped_column(
        nullable=False,
        server_default=text("0.7"),
        comment="Minimum score (0.0-1.0) required to pass the quiz"
    )
    max_attempts: Mapped[Optional[int]] = mapped_column(
        Integer,
        nullable=True,
        comment="Maximum number of attempts allowed, null for unlimited"
    )

    # Relationships
    lesson = relationship("Lesson", back_populates="quiz", viewonly=True)

    __table_args__ = (
        CheckConstraint(
            'passing_score >= 0.0 AND passing_score <= 1.0',
            name='passing_score_range_check'
        ),
        CheckConstraint(
            'max_attempts IS NULL OR max_attempts > 0',
            name='max_attempts_check'
        ),
    ) 