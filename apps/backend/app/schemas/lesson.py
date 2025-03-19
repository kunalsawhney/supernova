"""Lesson schemas for the LMS."""

from typing import List, Optional, Dict, Any
from uuid import UUID

from pydantic import (
    BaseModel,
    Field,
    ConfigDict
)

from app.models.enums import LessonStatus, ResourceType
from app.schemas.shared import BaseSchema


class ResourceBase(BaseModel):
    """Base schema for resource."""
    title: str = Field(..., min_length=1, max_length=255)
    resource_type: ResourceType
    url: str
    description: Optional[str] = None
    sequence_number: int = Field(..., ge=1)
    is_required: bool = True
    settings: Optional[Dict[str, Any]] = None
    
    model_config = ConfigDict(
        from_attributes=True,
        extra="forbid"
    )


class ResourceCreate(ResourceBase):
    """Schema for creating a resource."""
    lesson_id: UUID
    
    model_config = ConfigDict(
        extra="forbid",
        json_schema_extra={
            "example": {
                "title": "Installing Python",
                "resource_type": "video",
                "url": "https://example.com/videos/install-python",
                "description": "Step by step guide to installing Python",
                "sequence_number": 1,
                "is_required": True,
                "lesson_id": "123e4567-e89b-12d3-a456-426614174000"
            }
        }
    )


class ResourceInDB(ResourceBase, BaseSchema):
    """Schema for resource from database."""
    lesson_id: UUID
    
    model_config = ConfigDict(
        from_attributes=True,
        arbitrary_types_allowed=True,
        extra="forbid"
    )


class ResourceResponse(ResourceInDB):
    """Schema for resource response."""
    
    model_config = ConfigDict(
        from_attributes=True,
        arbitrary_types_allowed=True,
        extra="forbid"
    )


class LessonBase(BaseModel):
    """Base schema for lesson."""
    title: str = Field(..., min_length=1, max_length=255)
    description: Optional[str] = None
    sequence_number: int = Field(..., ge=1)
    duration_minutes: Optional[int] = Field(None, ge=0)
    settings: Optional[Dict[str, Any]] = None
    
    model_config = ConfigDict(
        from_attributes=True,
        extra="forbid"
    )


class LessonCreate(LessonBase):
    """Schema for creating a lesson."""
    module_id: UUID
    
    model_config = ConfigDict(
        extra="forbid",
        json_schema_extra={
            "example": {
                "title": "Python Variables and Data Types",
                "description": "Learn about Python variables and basic data types",
                "sequence_number": 1,
                "duration_minutes": 45,
                "module_id": "123e4567-e89b-12d3-a456-426614174000"
            }
        }
    )


class LessonUpdate(BaseModel):
    """Schema for updating a lesson."""
    title: Optional[str] = None
    description: Optional[str] = None
    sequence_number: Optional[int] = None
    duration_minutes: Optional[int] = None
    status: Optional[LessonStatus] = None
    settings: Optional[Dict[str, Any]] = None

    model_config = ConfigDict(
        from_attributes=True,
        arbitrary_types_allowed=True,
        extra="forbid"
    )


class LessonInDB(LessonBase, BaseSchema):
    """Schema for lesson from database."""
    module_id: UUID
    status: LessonStatus = LessonStatus.DRAFT
    
    model_config = ConfigDict(
        from_attributes=True,
        arbitrary_types_allowed=True,
        extra="forbid"
    )


class LessonResponse(LessonInDB):
    """Schema for lesson response."""
    resources: List[ResourceResponse] = []
    resource_count: int = Field(0, description="Number of resources in this lesson")
    
    model_config = ConfigDict(
        from_attributes=True,
        populate_by_name=True,
        arbitrary_types_allowed=True,
        extra="forbid"
    ) 