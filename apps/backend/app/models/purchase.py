"""Purchase and license models for the LMS."""

from datetime import datetime
from typing import Optional, Dict, Any
from uuid import UUID

from sqlalchemy import Boolean, DateTime, ForeignKey, String, Integer, text
from sqlalchemy.dialects.postgresql import ENUM, JSONB, UUID as PgUUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base_model import BaseModel
from app.models.scoped_models import SchoolScopedModel
from app.models.enums import PaymentStatus


class CoursePurchase(BaseModel):
    """Track individual course purchases for D2C users."""
    
    __tablename__ = "course_purchases"

    id: Mapped[UUID] = mapped_column(
        PgUUID(as_uuid=True), primary_key=True, server_default=text("gen_random_uuid()")
    )
    course_id: Mapped[UUID] = mapped_column(
        PgUUID(as_uuid=True), ForeignKey("courses.id", ondelete="RESTRICT"), nullable=False
    )
    user_id: Mapped[UUID] = mapped_column(
        PgUUID(as_uuid=True), ForeignKey("users.id", ondelete="RESTRICT"), nullable=False
    )
    amount_paid: Mapped[float] = mapped_column(nullable=False)
    currency: Mapped[str] = mapped_column(String(3), nullable=False)
    payment_method: Mapped[Dict[str, Any]] = mapped_column(JSONB, nullable=False)
    payment_status: Mapped[str] = mapped_column(
        ENUM(*[e.value for e in PaymentStatus], name="payment_status", create_type=False),
        nullable=False,
        server_default=text("'pending'")
    )
    purchase_date: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False)
    valid_until: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True), nullable=True)

    # Relationships
    course = relationship("Course", back_populates="purchases", viewonly=True)
    user = relationship("User", back_populates="course_purchases", viewonly=True)


class CourseLicense(SchoolScopedModel):
    """Course license for schools."""
    
    __tablename__ = "course_licenses"

    id: Mapped[UUID] = mapped_column(
        PgUUID(as_uuid=True), primary_key=True, server_default=text("gen_random_uuid()")
    )
    course_id: Mapped[UUID] = mapped_column(
        PgUUID(as_uuid=True), ForeignKey("courses.id", ondelete="CASCADE"), nullable=False
    )
    school_id: Mapped[UUID] = mapped_column(
        PgUUID(as_uuid=True), ForeignKey("schools.id", ondelete="CASCADE"), nullable=False
    )
    granted_by_id: Mapped[UUID] = mapped_column(
        PgUUID(as_uuid=True), ForeignKey("users.id", ondelete="RESTRICT"), nullable=False
    )
    valid_from: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False)
    valid_until: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True), nullable=True)
    max_students: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)

    # Relationships
    course = relationship("Course", back_populates="licenses", viewonly=True)
    school = relationship("School", back_populates="course_licenses")
    granted_by = relationship(
        "User",
        back_populates="granted_licenses",
        foreign_keys=[granted_by_id],
        viewonly=True
    ) 