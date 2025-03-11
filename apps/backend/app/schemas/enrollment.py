"""Enrollment schemas for request/response validation."""

from datetime import datetime
from typing import Optional, Dict, Any, List
from uuid import UUID

from pydantic import BaseModel, Field

from app.schemas.shared import BaseSchema
from app.schemas.course import CourseResponse
from app.schemas.user import User
from app.models.course import EnrollmentStatus, EnrollmentType


class ProgressBase(BaseModel):
    """Base schema for lesson progress data."""
    lesson_id: UUID
    status: str  # "not_started", "in_progress", "completed"
    progress: float = Field(0.0, ge=0.0, le=100.0)  # 0-100
    time_spent: int = Field(0, ge=0)  # seconds
    last_position: Optional[str] = None  # for video/audio content
    data: Optional[Dict[str, Any]] = None


class ProgressCreate(ProgressBase):
    """Schema for creating new progress."""
    enrollment_id: UUID


class ProgressUpdate(BaseModel):
    """Schema for updating progress."""
    status: Optional[str] = None
    progress: Optional[float] = Field(None, ge=0.0, le=100.0)
    time_spent: Optional[int] = Field(None, ge=0)
    last_position: Optional[str] = None
    data: Optional[Dict[str, Any]] = None


class ProgressResponse(ProgressBase, BaseSchema):
    """Schema for progress response."""
    enrollment_id: UUID


class EnrollmentBase(BaseModel):
    """Base schema for enrollment data."""
    course_id: UUID
    status: EnrollmentStatus = EnrollmentStatus.ENROLLED
    enrollment_type: EnrollmentType
    start_date: Optional[datetime] = None
    end_date: Optional[datetime] = None
    settings: Optional[dict] = None

    class Config:
        from_attributes = True


class StudentEnrollmentCreate(EnrollmentBase):
    """Schema for creating a student enrollment."""
    student_id: UUID
    enrollment_type: EnrollmentType = EnrollmentType.B2B


class IndividualEnrollmentCreate(EnrollmentBase):
    """Schema for creating an individual enrollment."""
    individual_user_id: UUID
    enrollment_type: EnrollmentType = EnrollmentType.D2C


class EnrollmentUpdate(BaseModel):
    """Schema for updating an enrollment."""
    status: Optional[EnrollmentStatus] = None
    start_date: Optional[datetime] = None
    end_date: Optional[datetime] = None
    settings: Optional[dict] = None


class EnrollmentResponse(EnrollmentBase, BaseSchema):
    """Schema for enrollment response."""
    id: UUID
    student_id: Optional[UUID] = None
    individual_user_id: Optional[UUID] = None
    enrolled_by_id: Optional[UUID] = None

    class Config:
        from_attributes = True
        json_schema_extra = {
            "example": {
                "id": "123e4567-e89b-12d3-a456-426614174000",
                "course_id": "123e4567-e89b-12d3-a456-426614174001",
                "status": "active",
                "enrollment_type": "b2b",
                "student_id": "123e4567-e89b-12d3-a456-426614174002",
                "individual_user_id": None,
                "enrolled_by_id": "123e4567-e89b-12d3-a456-426614174003",
                "start_date": "2024-01-01T00:00:00Z",
                "end_date": None,
                "settings": {}
            }
        }


class EnrollmentWithProgressResponse(EnrollmentResponse):
    """Schema for enrollment response with progress."""
    progress: List[ProgressResponse] = []
    completion_percentage: float = Field(0.0, ge=0.0, le=100.0)
    total_time_spent: int = Field(0, ge=0)  # seconds 