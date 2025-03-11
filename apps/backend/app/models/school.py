from datetime import date, datetime
from enum import Enum
from typing import Optional, List
from uuid import UUID

from sqlalchemy import Boolean, DateTime, ForeignKey, String, Text, text, JSON, Integer, Date
from sqlalchemy.dialects.postgresql import ENUM, JSONB, UUID as PGUUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base_model import BaseModel
from app.models.scoped_models import SchoolScopedModel

class SubscriptionPlan(str, Enum):
    BASIC = "basic"
    STANDARD = "standard"
    PREMIUM = "premium"

class SubscriptionStatus(str, Enum):
    TRIAL = "trial"
    ACTIVE = "active"
    EXPIRED = "expired"
    CANCELLED = "cancelled"
    PAST_DUE = "past_due"

class School(BaseModel):
    """School model for managing school metadata."""
    
    __tablename__ = "schools"

    name: Mapped[str] = mapped_column(String(255), nullable=False)
    code: Mapped[str] = mapped_column(String(50), nullable=False, unique=True)
    description: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    domain: Mapped[str] = mapped_column(String(255), nullable=False, unique=True)
    contact_email: Mapped[str] = mapped_column(String(255), nullable=False)
    contact_phone: Mapped[Optional[str]] = mapped_column(String(50), nullable=True)
    timezone: Mapped[str] = mapped_column(String(50), nullable=False)
    address: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    settings: Mapped[Optional[dict]] = mapped_column(JSONB, nullable=True)
    logo_url: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    subscription_status: Mapped[str] = mapped_column(
        ENUM(*[e.value for e in SubscriptionStatus], name="subscription_status", create_type=False),
        nullable=False,
        index=True
    )
    trial_ends_at: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True), nullable=True)
    max_students: Mapped[int] = mapped_column(Integer, nullable=False)
    max_teachers: Mapped[int] = mapped_column(Integer, nullable=False)
    features_enabled: Mapped[Optional[dict]] = mapped_column(JSONB, nullable=True)

    # Relationships
    users = relationship(
        "User",
        back_populates="school",
        foreign_keys="User.school_id"
    )
    course_licenses = relationship(
        "CourseLicense",
        back_populates="school",
        foreign_keys="CourseLicense.school_id"
    )
    student_profiles = relationship("StudentProfile", back_populates="school", cascade="all, delete-orphan")
    teacher_profiles = relationship("TeacherProfile", back_populates="school", cascade="all, delete-orphan")
    subscriptions = relationship("Subscription", back_populates="school", cascade="all, delete-orphan")
    school_settings = relationship("SchoolSettings", back_populates="school", uselist=False, cascade="all, delete-orphan")

    def __repr__(self) -> str:
        """Return string representation of the school."""
        return f"<School {self.name}>"

class Subscription(BaseModel):
    """Subscription model."""
    
    __tablename__ = "subscriptions"

    school_id: Mapped[UUID] = mapped_column(
        PGUUID(as_uuid=True), ForeignKey("schools.id", ondelete="CASCADE"), nullable=False
    )
    plan_type: Mapped[str] = mapped_column(
        ENUM(*[e.value for e in SubscriptionPlan], name="subscription_plan", create_type=False),
        nullable=False
    )
    starts_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False)
    ends_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False)
    status: Mapped[str] = mapped_column(
        ENUM(*[e.value for e in SubscriptionStatus], name="subscription_status", create_type=False),
        nullable=False
    )
    billing_cycle: Mapped[str] = mapped_column(String(20), nullable=False, server_default=text("'monthly'"))
    payment_method: Mapped[Optional[dict]] = mapped_column(JSONB, nullable=True)
    billing_details: Mapped[Optional[dict]] = mapped_column(JSONB, nullable=True)

    # Relationships
    school = relationship("School", back_populates="subscriptions")

class SchoolSettings(BaseModel):
    """School settings model."""
    
    __tablename__ = "school_settings"

    school_id: Mapped[UUID] = mapped_column(
        PGUUID(as_uuid=True), ForeignKey("schools.id", ondelete="CASCADE"), nullable=False
    )
    academic_year_start: Mapped[date] = mapped_column(Date, nullable=False)
    grading_system: Mapped[Optional[dict]] = mapped_column(JSONB, nullable=True)
    attendance_rules: Mapped[Optional[dict]] = mapped_column(JSONB, nullable=True)
    class_schedule_settings: Mapped[Optional[dict]] = mapped_column(JSONB, nullable=True)
    notification_preferences: Mapped[Optional[dict]] = mapped_column(JSONB, nullable=True)

    # Relationships
    school = relationship("School", back_populates="school_settings") 