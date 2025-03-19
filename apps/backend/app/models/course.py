"""Course model for the LMS."""

from datetime import datetime
from typing import Optional, List
from uuid import UUID

from sqlalchemy import Boolean, DateTime, ForeignKey, String, Text, text, Integer
from sqlalchemy.dialects.postgresql import ENUM, JSONB, UUID as PgUUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base_model import BaseModel
from app.models.scoped_models import SuperAdminScopedModel
from app.models.enums import CourseStatus, DifficultyLevel


class Course(SuperAdminScopedModel):
    """Course model for managing course metadata and business rules."""
    
    __tablename__ = "courses"
    __mapper_args__ = {
        "polymorphic_identity": "course"
    }

    created_by = relationship(
        "User",
        back_populates="created_courses",
        primaryjoin="User.id==Course.created_by_id",
        viewonly=True
    )

    title: Mapped[str] = mapped_column(String(255), nullable=False)
    description: Mapped[Optional[str]] = mapped_column(Text, nullable=False)
    code: Mapped[str] = mapped_column(String(50), nullable=False, unique=True)
    status: Mapped[str] = mapped_column(
        ENUM(*[e.value for e in CourseStatus], name="course_status", create_type=False),
        nullable=False,
        index=True,
        comment="Status of the course: draft, published, or archived"
    )
    cover_image_url: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    settings: Mapped[Optional[dict]] = mapped_column(JSONB, nullable=True)

    # Enhanced metadata
    difficulty_level: Mapped[str] = mapped_column(
        ENUM(*[e.value for e in DifficultyLevel], name="difficulty_level", create_type=False),
        nullable=True,
        server_default=text("'beginner'")
    )
    tags: Mapped[Optional[List[str]]] = mapped_column(JSONB, nullable=True)
    estimated_duration: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)  # in hours
    learning_objectives: Mapped[Optional[List[str]]] = mapped_column(JSONB, nullable=True)
    target_audience: Mapped[Optional[List[str]]] = mapped_column(JSONB, nullable=True)
    
    # Business rules
    prerequisites: Mapped[Optional[List[str]]] = mapped_column(JSONB, nullable=True)
    completion_criteria: Mapped[Optional[dict]] = mapped_column(JSONB, nullable=True)
    grade_level: Mapped[str] = mapped_column(String(20), nullable=True)
    academic_year: Mapped[str] = mapped_column(String(20), nullable=True)
    sequence_number: Mapped[int] = mapped_column(Integer, nullable=True)

    # Pricing for D2C
    base_price: Mapped[Optional[float]] = mapped_column(nullable=True)
    currency: Mapped[Optional[str]] = mapped_column(String(3), nullable=True)
    pricing_type: Mapped[Optional[str]] = mapped_column(String(20), nullable=True)  # one-time, subscription
    
    # Relationships
    versions = relationship(
        "CourseVersion",
        back_populates="course",
        cascade="all, delete-orphan",
        foreign_keys="CourseVersion.course_id",
    )
    licenses = relationship(
        "CourseLicense",
        back_populates="course",
        cascade="all, delete-orphan",
        foreign_keys="CourseLicense.course_id"
    )
    enrollments = relationship(
        "CourseEnrollment",
        back_populates="course",
        cascade="all, delete-orphan",
        foreign_keys="CourseEnrollment.course_id"
    )
    purchases = relationship(
        "CoursePurchase",
        back_populates="course",
        cascade="all, delete-orphan",
        foreign_keys="CoursePurchase.course_id"
    ) 