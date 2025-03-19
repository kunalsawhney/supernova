"""School schemas for request/response validation."""

from datetime import datetime
from typing import Optional, Dict, Any, List
from uuid import UUID

from pydantic import (
    BaseModel, 
    Field, 
    EmailStr, 
    constr, 
    ConfigDict,
    model_validator
)

from app.schemas.shared import BaseSchema, PHONE_PATTERN, TIMEZONE_PATTERN
from app.schemas.user import UserCreate
from app.models.school import SubscriptionStatus, SubscriptionPlan


class SchoolBase(BaseModel):
    """Base schema for school data."""
    name: str = Field(..., min_length=1, max_length=255)
    domain: str = Field(
        ..., 
        description="School domain name, e.g. 'school.edu'"
    )
    subscription_status: SubscriptionStatus
    max_students: int = Field(..., gt=0)
    max_teachers: int = Field(..., gt=0)
    contact_email: EmailStr

    model_config = ConfigDict(
        from_attributes=True,
        extra="forbid"
    )


class SchoolCreate(SchoolBase):
    """Schema for creating a new school."""
    admin: UserCreate = Field(..., description="Admin user to be created with the school")
    code: constr(min_length=2, max_length=50, pattern=r'^[A-Z0-9_-]+$') = Field(
        ..., 
        description="Unique school code using only uppercase letters, numbers, underscores, and hyphens"
    )
    description: Optional[str] = None
    contact_phone: Optional[constr(pattern=PHONE_PATTERN)] = None
    timezone: constr(pattern=TIMEZONE_PATTERN) = Field(..., description="Timezone in format 'Area/Location'")
    address: Optional[str] = Field(None, max_length=255)
    settings: Optional[Dict[str, Any]] = None
    logo_url: Optional[str] = None
    features_enabled: Optional[Dict[str, bool]] = Field(
        default_factory=lambda: {"discussion_board": True, "assignment_submission": True}
    )

    model_config = ConfigDict(
        extra="forbid",
        json_schema_extra={
            "example": {
                "name": "Example School",
                "domain": "example.edu",
                "code": "EX-SCHOOL",
                "subscription_status": "trial",
                "max_students": 500,
                "max_teachers": 50,
                "contact_email": "admin@example.edu",
                "contact_phone": "+1234567890",
                "timezone": "America/New_York",
                "address": "123 Education St, Example City",
                "admin": {
                    "email": "admin@example.edu",
                    "first_name": "School",
                    "last_name": "Admin",
                    "password": "SecureP@ss123",
                    "role": "school_admin"
                }
            }
        }
    )


class SchoolUpdate(BaseModel):
    """Schema for updating a school."""
    name: Optional[str] = Field(None, min_length=1, max_length=255)
    domain: Optional[str] = None
    description: Optional[str] = None
    contact_email: Optional[EmailStr] = None
    contact_phone: Optional[constr(pattern=PHONE_PATTERN)] = None
    timezone: Optional[constr(pattern=TIMEZONE_PATTERN)] = None
    address: Optional[str] = Field(None, max_length=255)
    max_students: Optional[int] = Field(None, gt=0)
    max_teachers: Optional[int] = Field(None, gt=0)
    logo_url: Optional[str] = None
    settings: Optional[Dict[str, Any]] = None
    subscription_status: Optional[SubscriptionStatus] = None
    features_enabled: Optional[Dict[str, bool]] = None

    model_config = ConfigDict(
        extra="forbid"
    )


class School(SchoolBase, BaseSchema):
    """Schema for school response."""
    code: str
    description: Optional[str] = None
    contact_phone: Optional[str] = None
    timezone: str
    address: Optional[str] = None
    logo_url: Optional[str] = None
    trial_ends_at: Optional[datetime] = None
    features_enabled: Optional[Dict[str, bool]] = None


class SubscriptionBase(BaseModel):
    """Base schema for subscription."""
    plan_type: SubscriptionPlan
    status: SubscriptionStatus
    starts_at: datetime
    ends_at: datetime
    billing_cycle: str = Field(..., pattern="^(monthly|quarterly|annual)$")
    
    model_config = ConfigDict(
        from_attributes=True,
        extra="forbid"
    )

    @model_validator(mode='after')
    def validate_date_range(self) -> 'SubscriptionBase':
        if self.starts_at >= self.ends_at:
            raise ValueError("starts_at must be before ends_at")
        return self


class SubscriptionCreate(SubscriptionBase):
    """Schema for creating a subscription."""
    school_id: UUID
    payment_method: Optional[Dict[str, Any]] = None
    billing_details: Optional[Dict[str, Any]] = None


class SubscriptionUpdate(BaseModel):
    """Schema for updating a subscription."""
    plan_type: Optional[SubscriptionPlan] = None
    status: Optional[SubscriptionStatus] = None
    ends_at: Optional[datetime] = None
    billing_cycle: Optional[str] = Field(None, pattern="^(monthly|quarterly|annual)$")
    payment_method: Optional[Dict[str, Any]] = None
    billing_details: Optional[Dict[str, Any]] = None

    model_config = ConfigDict(
        extra="forbid"
    )


class Subscription(SubscriptionBase, BaseSchema):
    """Schema for subscription response."""
    school_id: UUID
    payment_method: Optional[Dict[str, Any]] = None
    billing_details: Optional[Dict[str, Any]] = None


class SchoolWithStats(School):
    """Schema for school with additional statistics."""
    total_students: int = Field(..., ge=0)
    total_teachers: int = Field(..., ge=0)
    total_courses: int = Field(..., ge=0)
    active_courses: int = Field(..., ge=0)
    storage_used: int = Field(..., ge=0, description="Storage used in bytes")
    subscription: Optional[Subscription] = None 