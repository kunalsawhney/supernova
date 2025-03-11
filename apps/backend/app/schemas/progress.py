from datetime import datetime
from typing import Optional
from uuid import UUID

from pydantic import BaseModel, Field

from app.schemas.shared import BaseSchema

class LessonProgressBase(BaseModel):
    """Base schema for lesson progress."""
    lesson_id: UUID
    status: str = Field(..., pattern="^(not_started|in_progress|completed)$")
    progress_data: Optional[dict] = None
    completed_at: Optional[datetime] = None

    class Config:
        from_attributes = True

class LessonProgressCreate(LessonProgressBase):
    """Schema for creating lesson progress."""
    student_id: Optional[UUID] = None
    individual_user_id: Optional[UUID] = None

    @validator('student_id', 'individual_user_id')
    def validate_user_ids(cls, v, values, **kwargs):
        """Ensure either student_id or individual_user_id is set, but not both."""
        field = kwargs.get('field')
        if field.name == 'individual_user_id':
            if v is not None and values.get('student_id') is not None:
                raise ValueError("Cannot set both student_id and individual_user_id")
            if v is None and values.get('student_id') is None:
                raise ValueError("Either student_id or individual_user_id must be set")
        return v

class LessonProgressUpdate(BaseModel):
    """Schema for updating lesson progress."""
    status: Optional[str] = Field(None, pattern="^(not_started|in_progress|completed)$")
    progress_data: Optional[dict] = None
    completed_at: Optional[datetime] = None

class LessonProgressResponse(LessonProgressBase, BaseSchema):
    """Schema for lesson progress response."""
    id: UUID
    student_id: Optional[UUID] = None
    individual_user_id: Optional[UUID] = None

    class Config:
        json_schema_extra = {
            "example": {
                "id": "123e4567-e89b-12d3-a456-426614174000",
                "lesson_id": "123e4567-e89b-12d3-a456-426614174001",
                "status": "in_progress",
                "student_id": "123e4567-e89b-12d3-a456-426614174002",
                "individual_user_id": None,
                "progress_data": {"time_spent": 3600, "score": 85},
                "completed_at": None
            }
        } 