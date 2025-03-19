"""Purchase and license schemas for the Learning Management System."""

from datetime import datetime
from typing import Optional, Dict, Any, List
from uuid import UUID

from pydantic import (
    BaseModel,
    Field,
    ConfigDict
)

from app.models.enums import PaymentMethod, PaymentStatus, CurrencyCode
from app.schemas.shared import BaseSchema


class CoursePurchaseBase(BaseModel):
    """Base schema for course purchase."""
    course_id: UUID
    amount_paid: float = Field(..., ge=0)
    currency: CurrencyCode = CurrencyCode.USD
    payment_method: PaymentMethod
    payment_status: PaymentStatus = PaymentStatus.PENDING
    valid_until: Optional[datetime] = None
    metadata: Optional[Dict[str, Any]] = None
    
    model_config = ConfigDict(
        from_attributes=True,
        extra="forbid"
    )


class CoursePurchaseCreate(CoursePurchaseBase):
    """Schema for creating a course purchase."""
    user_id: UUID
    purchase_date: datetime = Field(default_factory=datetime.utcnow)
    
    model_config = ConfigDict(
        extra="forbid",
        json_schema_extra={
            "example": {
                "course_id": "123e4567-e89b-12d3-a456-426614174000",
                "user_id": "123e4567-e89b-12d3-a456-426614174001",
                "amount_paid": 49.99,
                "currency": "USD",
                "payment_method": "credit_card",
                "payment_status": "completed",
                "valid_until": "2025-12-31T23:59:59Z"
            }
        }
    )


class CoursePurchaseUpdate(BaseModel):
    """Schema for updating a course purchase."""
    payment_status: Optional[PaymentStatus] = None
    valid_until: Optional[datetime] = None
    metadata: Optional[Dict[str, Any]] = None

    model_config = ConfigDict(
        from_attributes=True,
        arbitrary_types_allowed=True,
        extra="forbid"
    )


class CoursePurchaseInDB(CoursePurchaseBase, BaseSchema):
    """Schema for course purchase from database."""
    user_id: UUID
    purchase_date: datetime
    
    model_config = ConfigDict(
        from_attributes=True,
        arbitrary_types_allowed=True,
        extra="forbid"
    )


class CoursePurchaseResponse(CoursePurchaseInDB):
    """Schema for course purchase response."""
    course_title: Optional[str] = None
    course_code: Optional[str] = None
    user_email: Optional[str] = None
    
    model_config = ConfigDict(
        from_attributes=True,
        arbitrary_types_allowed=True,
        populate_by_name=True,
        extra="forbid"
    )
    
    @property
    def is_valid(self) -> bool:
        """Check if purchase is still valid based on valid_until date."""
        return (
            self.payment_status == PaymentStatus.completed and 
            (self.valid_until is None or self.valid_until > datetime.utcnow())
        )


class CourseLicenseBase(BaseModel):
    """Base schema for course license."""
    course_id: UUID
    school_id: UUID
    valid_from: datetime = Field(default_factory=datetime.utcnow)
    valid_until: Optional[datetime] = None
    max_students: Optional[int] = Field(None, ge=1)
    metadata: Optional[Dict[str, Any]] = None
    
    model_config = ConfigDict(
        from_attributes=True,
        extra="forbid"
    )


class CourseLicenseCreate(CourseLicenseBase):
    """Schema for creating a course license."""
    granted_by_id: UUID
    
    model_config = ConfigDict(
        extra="forbid",
        json_schema_extra={
            "example": {
                "course_id": "123e4567-e89b-12d3-a456-426614174000",
                "school_id": "123e4567-e89b-12d3-a456-426614174002",
                "granted_by_id": "123e4567-e89b-12d3-a456-426614174001",
                "valid_from": "2024-01-01T00:00:00Z",
                "valid_until": "2024-12-31T23:59:59Z",
                "max_students": 50
            }
        }
    )


class CourseLicenseUpdate(BaseModel):
    """Schema for updating a course license."""
    valid_until: Optional[datetime] = None
    max_students: Optional[int] = Field(None, ge=1)
    is_active: Optional[bool] = None
    metadata: Optional[Dict[str, Any]] = None

    model_config = ConfigDict(
        from_attributes=True,
        arbitrary_types_allowed=True,
        extra="forbid"
    )


class CourseLicenseInDB(CourseLicenseBase, BaseSchema):
    """Schema for course license from database."""
    granted_by_id: UUID
    is_active: bool = True
    
    model_config = ConfigDict(
        from_attributes=True,
        arbitrary_types_allowed=True,
        extra="forbid"
    )


class CourseLicenseResponse(CourseLicenseInDB):
    """Schema for course license response."""
    course_title: Optional[str] = None
    course_code: Optional[str] = None
    school_name: Optional[str] = None
    granted_by_name: Optional[str] = None
    enrolled_student_count: int = 0
    
    model_config = ConfigDict(
        from_attributes=True,
        arbitrary_types_allowed=True,
        populate_by_name=True,
        extra="forbid"
    )
    
    @property
    def is_valid(self) -> bool:
        """Check if license is still valid based on active status, valid_until date, and student count."""
        now = datetime.utcnow()
        return (
            self.is_active and 
            self.valid_from <= now and
            (self.valid_until is None or self.valid_until > now) and
            (self.max_students is None or self.enrolled_student_count < self.max_students)
        )


class PurchaseSummary(BaseModel):
    """Summary schema for purchases by a user."""
    user_id: UUID
    active_purchases: int
    expired_purchases: int
    total_spent: float
    purchases_by_currency: Dict[str, float]
    recently_purchased_courses: List[CoursePurchaseResponse] = []
    
    model_config = ConfigDict(
        from_attributes=True,
        arbitrary_types_allowed=True,
        extra="forbid"
    ) 