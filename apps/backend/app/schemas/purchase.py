from datetime import datetime
from typing import Optional
from uuid import UUID

from pydantic import BaseModel, Field

from app.schemas.shared import BaseSchema

class CoursePurchaseBase(BaseModel):
    """Base schema for course purchase."""
    course_id: UUID
    user_id: UUID
    amount: float = Field(..., gt=0)
    currency: str = Field(..., min_length=3, max_length=3)
    payment_status: str = Field(..., pattern="^(pending|completed|failed|refunded)$")
    payment_method: str
    payment_id: Optional[str] = None
    transaction_id: Optional[str] = None
    refund_status: Optional[str] = None
    refund_amount: Optional[float] = None
    metadata: Optional[dict] = None

    class Config:
        from_attributes = True

class CoursePurchaseCreate(CoursePurchaseBase):
    """Schema for creating a course purchase."""
    pass

class CoursePurchaseUpdate(BaseModel):
    """Schema for updating a course purchase."""
    payment_status: Optional[str] = Field(None, pattern="^(pending|completed|failed|refunded)$")
    payment_id: Optional[str] = None
    transaction_id: Optional[str] = None
    refund_status: Optional[str] = None
    refund_amount: Optional[float] = Field(None, gt=0)
    metadata: Optional[dict] = None

class CoursePurchaseResponse(CoursePurchaseBase, BaseSchema):
    """Schema for course purchase response."""
    id: UUID
    created_at: datetime
    updated_at: datetime

    class Config:
        json_schema_extra = {
            "example": {
                "id": "123e4567-e89b-12d3-a456-426614174000",
                "course_id": "123e4567-e89b-12d3-a456-426614174001",
                "user_id": "123e4567-e89b-12d3-a456-426614174002",
                "amount": 99.99,
                "currency": "USD",
                "payment_status": "completed",
                "payment_method": "credit_card",
                "payment_id": "pay_123456",
                "transaction_id": "txn_123456",
                "refund_status": None,
                "refund_amount": None,
                "metadata": {"processor": "stripe"},
                "created_at": "2024-01-01T00:00:00Z",
                "updated_at": "2024-01-01T00:00:00Z"
            }
        } 