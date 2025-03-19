"""Review models for the LMS."""

from datetime import datetime
from typing import Optional, List
from uuid import UUID

from sqlalchemy import Boolean, DateTime, ForeignKey, String, Text, Integer, CheckConstraint, text
from sqlalchemy.dialects.postgresql import ENUM, JSONB, UUID as PgUUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base_model import BaseModel
from app.models.enums import ReviewStatus


class CourseReview(BaseModel):
    """Course review and feedback from students."""
    
    __tablename__ = "course_reviews"

    id: Mapped[UUID] = mapped_column(
        PgUUID(as_uuid=True), primary_key=True, server_default=text("gen_random_uuid()")
    )
    enrollment_id: Mapped[UUID] = mapped_column(
        PgUUID(as_uuid=True), ForeignKey("course_enrollments.id", ondelete="CASCADE"), nullable=False
    )
    rating: Mapped[int] = mapped_column(Integer, nullable=False)  # 1-5 stars
    review_text: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    pros: Mapped[Optional[List[str]]] = mapped_column(JSONB, nullable=True)
    cons: Mapped[Optional[List[str]]] = mapped_column(JSONB, nullable=True)
    would_recommend: Mapped[Optional[bool]] = mapped_column(Boolean, nullable=True)
    difficulty_rating: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)  # 1-5 scale
    engagement_rating: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)  # 1-5 scale
    is_featured: Mapped[bool] = mapped_column(Boolean, nullable=False, server_default=text("false"))
    moderated_by_id: Mapped[Optional[UUID]] = mapped_column(
        PgUUID(as_uuid=True), ForeignKey("users.id", ondelete="SET NULL"), nullable=True
    )
    moderated_at: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True), nullable=True)
    status: Mapped[str] = mapped_column(
        ENUM(*[e.value for e in ReviewStatus], name="review_status", create_type=False),
        nullable=False,
        server_default=text("'pending'"),
        comment="Status of the review: pending, verified, approved, rejected, or hidden"
    )

    # Relationships
    enrollment = relationship("CourseEnrollment", back_populates="review", viewonly=True)
    moderated_by = relationship(
        "User",
        back_populates="moderated_reviews",
        foreign_keys=[moderated_by_id],
        viewonly=True
    )

    __table_args__ = (
        CheckConstraint('rating >= 1 AND rating <= 5', name='rating_range_check'),
        CheckConstraint(
            '(difficulty_rating IS NULL) OR (difficulty_rating >= 1 AND difficulty_rating <= 5)', 
            name='difficulty_rating_range_check'
        ),
        CheckConstraint(
            '(engagement_rating IS NULL) OR (engagement_rating >= 1 AND engagement_rating <= 5)',
            name='engagement_rating_range_check'
        ),
    ) 