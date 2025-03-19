"""Module schemas for the LMS."""

from typing import List, Optional, Dict, Any
from uuid import UUID

from pydantic import (
    BaseModel,
    Field,
    ConfigDict
)

from app.models.enums import ModuleStatus, LessonStatus
from app.schemas.shared import BaseSchema


class ModuleBase(BaseModel):
    """Base schema for module."""
    title: str = Field(..., min_length=1, max_length=255)
    description: Optional[str] = None
    sequence_number: int = Field(..., ge=1)
    duration_weeks: Optional[int] = Field(None, ge=0)
    
    model_config = ConfigDict(
        from_attributes=True,
        extra="forbid"
    )


class ModuleCreate(ModuleBase):
    """Schema for creating a module."""
    content_id: str
    status: Optional[ModuleStatus] = ModuleStatus.DRAFT
    
    model_config = ConfigDict(
        extra="forbid",
        json_schema_extra={
            "example": {
                "title": "Getting Started with Python",
                "description": "Learn Python basics and setup your environment",
                "sequence_number": 1,
                "duration_minutes": 120,
                "content_id": "123e4567-e89b-12d3-a456-426614174000"
            }
        }
    )


class ModuleUpdate(BaseModel):
    """Schema for updating a module."""
    title: Optional[str] = None
    description: Optional[str] = None
    sequence_number: Optional[int] = None
    duration_minutes: Optional[int] = None
    status: Optional[ModuleStatus] = None
    settings: Optional[Dict[str, Any]] = None

    model_config = ConfigDict(
        from_attributes=True,
        arbitrary_types_allowed=True,
        extra="forbid"
    )


class ModuleInDB(ModuleBase, BaseSchema):
    """Schema for module from database."""
    content_id: UUID
    status: ModuleStatus = ModuleStatus.DRAFT
    
    model_config = ConfigDict(
        from_attributes=True,
        arbitrary_types_allowed=True,
        extra="forbid"
    )


class LessonSummary(BaseSchema):
    """Summary schema for lesson in module response."""
    id: UUID
    title: str
    duration_minutes: Optional[int] = None
    sequence_number: int
    status: LessonStatus
    
    model_config = ConfigDict(
        from_attributes=True,
        arbitrary_types_allowed=True,
        extra="forbid"
    )


class ModuleResponse(ModuleInDB):
    """Schema for module response."""
    # lessons: List[LessonSummary] = Field(default_factory=list)
    # lesson_count: int = Field(default=0, description="Number of lessons in this module")    
    
    model_config = ConfigDict(
        from_attributes=True,
        populate_by_name=True,
        arbitrary_types_allowed=True,
        extra="forbid"
    )
    
    # Custom property to calculate total duration of all lessons
    @property
    def total_lesson_duration(self) -> int:
        """Calculate total duration of all lessons in minutes."""
        return sum(lesson.duration_minutes or 0 for lesson in self.lessons) 