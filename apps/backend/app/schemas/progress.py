"""Progress schemas for tracking student learning progress."""

from datetime import datetime
from typing import Optional, Dict, Any
from uuid import UUID

from pydantic import (
    BaseModel, 
    Field, 
    ConfigDict, 
    field_validator, 
    model_validator
)

from app.schemas.shared import BaseSchema


class LessonProgressBase(BaseModel):
    """Base schema for lesson progress."""
    lesson_id: UUID
    status: str = Field(
        ..., 
        pattern="^(not_started|in_progress|completed)$", 
        description="Progress status"
    )
    progress_percentage: float = Field(
        0.0, 
        ge=0.0, 
        le=100.0, 
        description="Progress percentage (0-100)"
    )
    time_spent_seconds: int = Field(
        0, 
        ge=0, 
        description="Time spent in seconds"
    )
    last_position: Optional[str] = Field(
        None, 
        description="Last position in content (e.g., page number, video timestamp)"
    )
    completed_at: Optional[datetime] = None

    model_config = ConfigDict(
        from_attributes=True,
        extra="forbid"
    )


class LessonProgressCreate(LessonProgressBase):
    """Schema for creating lesson progress."""
    student_id: Optional[UUID] = None
    individual_user_id: Optional[UUID] = None

    @model_validator(mode='after')
    def validate_user_ids(self) -> 'LessonProgressCreate':
        """Ensure either student_id or individual_user_id is set, but not both."""
        if self.individual_user_id is not None and self.student_id is not None:
            raise ValueError("Cannot set both student_id and individual_user_id")
        if self.individual_user_id is None and self.student_id is None:
            raise ValueError("Either student_id or individual_user_id must be set")
        return self


class LessonProgressUpdate(BaseModel):
    """Schema for updating lesson progress."""
    status: Optional[str] = Field(
        None, 
        pattern="^(not_started|in_progress|completed)$"
    )
    progress_percentage: Optional[float] = Field(
        None, 
        ge=0.0, 
        le=100.0
    )
    time_spent_seconds: Optional[int] = Field(
        None, 
        ge=0
    )
    last_position: Optional[str] = None
    completed_at: Optional[datetime] = None
    
    model_config = ConfigDict(
        extra="forbid"
    )
    
    @field_validator('completed_at')
    def validate_completed_at(cls, v, info):
        """Validate completed_at is only set when status is completed."""
        if v is not None and info.data.get('status') != 'completed':
            raise ValueError("completed_at can only be set when status is 'completed'")
        return v


class LessonProgressResponse(LessonProgressBase, BaseSchema):
    """Schema for lesson progress response."""
    id: UUID
    student_id: Optional[UUID] = None
    individual_user_id: Optional[UUID] = None

    model_config = ConfigDict(
        from_attributes=True,
        extra="forbid",
        json_schema_extra={
            "example": {
                "id": "123e4567-e89b-12d3-a456-426614174000",
                "lesson_id": "123e4567-e89b-12d3-a456-426614174001",
                "status": "in_progress",
                "student_id": "123e4567-e89b-12d3-a456-426614174002",
                "individual_user_id": None,
                "progress_percentage": 45.5,
                "time_spent_seconds": 3600,
                "last_position": "page_5",
                "completed_at": None,
                "created_at": "2024-01-01T00:00:00Z",
                "updated_at": "2024-01-02T00:00:00Z",
                "is_active": True,
                "is_deleted": False,
                "deleted_at": None
            }
        }
    )


class ModuleProgressResponse(BaseSchema):
    """Schema for module progress summary."""
    module_id: UUID
    total_lessons: int
    completed_lessons: int
    in_progress_lessons: int
    not_started_lessons: int
    overall_progress_percentage: float = Field(..., ge=0.0, le=100.0)
    total_time_spent_seconds: int = Field(..., ge=0)
    
    model_config = ConfigDict(
        from_attributes=True,
        extra="forbid"
    ) 


class UserProgressResponse(BaseSchema):
    """Schema for user progress response."""
    id: UUID
    enrollment_id: UUID
    content_type: str
    content_id: UUID
    status: str
    progress: float
    started_at: Optional[datetime] = None
    completed_at: Optional[datetime] = None
    last_interaction: Optional[datetime] = None
    time_spent_seconds: int
    progress_metadata: Optional[Dict[str, Any]] = None
    
    model_config = ConfigDict(
        from_attributes=True,
        extra="forbid"
    )
