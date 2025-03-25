"""Enrollment schemas for request/response validation."""

from datetime import datetime
from typing import Optional, Dict, Any, List
from uuid import UUID

from app.schemas.progress import LessonProgressResponse, ModuleProgressResponse, UserProgressResponse
from pydantic import (
    BaseModel, 
    Field, 
    ConfigDict, 
    model_validator
)

from app.schemas.shared import BaseSchema
from app.schemas.course import CourseResponse
from app.schemas.user import User
from app.models.enums import EnrollmentStatus, EnrollmentType


# Keep this class for backwards compatibility but mark as deprecated
class ProgressBase(BaseModel):
    """
    Base schema for lesson progress data. (Deprecated: Use LessonProgressBase from progress.py instead)
    """
    lesson_id: UUID
    status: str = Field(..., pattern="^(not_started|in_progress|completed)$")
    progress: float = Field(0.0, ge=0.0, le=100.0)  # 0-100
    time_spent: int = Field(0, ge=0)  # seconds
    last_position: Optional[str] = None  # for video/audio content
    data: Optional[Dict[str, Any]] = None

    model_config = ConfigDict(
        from_attributes=True,
        extra="forbid",
        deprecated=True
    )


# Keep this class for backwards compatibility but mark as deprecated
class ProgressCreate(ProgressBase):
    """
    Schema for creating new progress. (Deprecated: Use LessonProgressCreate from progress.py instead)
    """
    enrollment_id: UUID


# Keep this class for backwards compatibility but mark as deprecated
class ProgressUpdate(BaseModel):
    """
    Schema for updating progress. (Deprecated: Use LessonProgressUpdate from progress.py instead)
    """
    status: Optional[str] = Field(None, pattern="^(not_started|in_progress|completed)$")
    progress: Optional[float] = Field(None, ge=0.0, le=100.0)
    time_spent: Optional[int] = Field(None, ge=0)
    last_position: Optional[str] = None
    data: Optional[Dict[str, Any]] = None

    model_config = ConfigDict(
        extra="forbid",
        deprecated=True
    )


# Keep this class for backwards compatibility but mark as deprecated
class ProgressResponse(ProgressBase, BaseSchema):
    """
    Schema for progress response. (Deprecated: Use LessonProgressResponse from progress.py instead)
    """
    enrollment_id: UUID
    
    model_config = ConfigDict(
        from_attributes=True,
        extra="forbid",
        deprecated=True
    )


class EnrollmentBase(BaseModel):
    """Base schema for enrollment data."""
    course_id: UUID
    status: EnrollmentStatus = EnrollmentStatus.ENROLLED
    enrollment_type: EnrollmentType
    start_date: Optional[datetime] = None
    end_date: Optional[datetime] = None
    settings: Optional[Dict[str, Any]] = None

    model_config = ConfigDict(
        from_attributes=True,
        extra="forbid"
    )
    
    @model_validator(mode='after')
    def validate_dates(self) -> 'EnrollmentBase':
        """Validate that start_date is before end_date if both are provided."""
        if (self.start_date and self.end_date and 
            self.start_date > self.end_date):
            raise ValueError("start_date must be before end_date")
        return self


class StudentEnrollmentCreate(EnrollmentBase):
    """Schema for creating a student enrollment."""
    student_id: UUID
    enrollment_type: EnrollmentType = EnrollmentType.B2B

    model_config = ConfigDict(
        extra="forbid",
        json_schema_extra={
            "example": {
                "course_id": "123e4567-e89b-12d3-a456-426614174000",
                "student_id": "123e4567-e89b-12d3-a456-426614174001",
                "status": "enrolled",
                "enrollment_type": "b2b",
                "start_date": "2024-01-01T00:00:00Z",
                "end_date": "2024-06-30T00:00:00Z"
            }
        }
    )


class IndividualEnrollmentCreate(EnrollmentBase):
    """Schema for creating an individual enrollment."""
    individual_user_id: UUID
    enrollment_type: EnrollmentType = EnrollmentType.D2C
    
    model_config = ConfigDict(
        extra="forbid",
        json_schema_extra={
            "example": {
                "course_id": "123e4567-e89b-12d3-a456-426614174000",
                "individual_user_id": "123e4567-e89b-12d3-a456-426614174001",
                "status": "enrolled",
                "enrollment_type": "d2c",
                "start_date": "2024-01-01T00:00:00Z"
            }
        }
    )


class EnrollmentUpdate(BaseModel):
    """Schema for updating an enrollment."""
    status: Optional[EnrollmentStatus] = None
    start_date: Optional[datetime] = None
    end_date: Optional[datetime] = None
    settings: Optional[Dict[str, Any]] = None
    
    model_config = ConfigDict(
        extra="forbid"
    )
    
    @model_validator(mode='after')
    def validate_dates(self) -> 'EnrollmentUpdate':
        """Validate that start_date is before end_date if both are provided."""
        start_date = self.start_date
        end_date = self.end_date
        
        if start_date is not None and end_date is not None:
            if start_date > end_date:
                raise ValueError("start_date must be before end_date")
        return self


class EnrollmentResponse(EnrollmentBase, BaseSchema):
    """Schema for enrollment response."""
    student_id: Optional[UUID] = None
    individual_user_id: Optional[UUID] = None
    enrolled_by_id: UUID
    progress_percentage: float = Field(0.0, ge=0.0, le=100.0)
    
    model_config = ConfigDict(
        from_attributes=True,
        extra="forbid",
        json_schema_extra={
            "example": {
                "id": "123e4567-e89b-12d3-a456-426614174000",
                "course_id": "123e4567-e89b-12d3-a456-426614174001",
                "status": "enrolled",
                "enrollment_type": "b2b",
                "student_id": "123e4567-e89b-12d3-a456-426614174002",
                "individual_user_id": None,
                "enrolled_by_id": "123e4567-e89b-12d3-a456-426614174003",
                "start_date": "2024-01-01T00:00:00Z",
                "end_date": "2024-06-30T00:00:00Z",
                "progress_percentage": 35.5,
                "settings": {},
                "created_at": "2024-01-01T00:00:00Z",
                "updated_at": "2024-01-01T00:00:00Z",
                "is_active": True,
                "is_deleted": False,
                "deleted_at": None
            }
        }
    )


class EnrollmentWithProgressResponse(EnrollmentResponse):
    """Schema for enrollment response with detailed progress."""
    lesson_progresses: List[UserProgressResponse] = []
    # user_progresses: List[UserProgressResponse] = []
    # completion_percentage: float = Field(0.0, ge=0.0, le=100.0)
    # total_time_spent_seconds: int = Field(0, ge=0)
    # last_activity_at: Optional[datetime] = None
    # module_progresses: List['ModuleProgressResponse'] = []
    # course_progress: List[CourseProgressResponse] = []

    model_config = ConfigDict(
        from_attributes=True,
        extra="forbid"
    )
