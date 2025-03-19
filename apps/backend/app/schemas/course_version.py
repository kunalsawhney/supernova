"""Course version and content schemas for the LMS."""

from datetime import datetime
from typing import List, Optional, Dict, Any
from uuid import UUID

from pydantic import (
    BaseModel, 
    Field, 
    ConfigDict
)

from app.models.enums import CourseStatus
from app.schemas.shared import BaseSchema
from app.schemas.course import CourseResponse


class CourseContentBase(BaseModel):
    """Base schema for course content."""
    version: str = Field(..., min_length=1, description="Content version identifier (e.g., '1.0.0')")
    description: Optional[str] = None
    settings: Optional[Dict[str, Any]] = None
    
    model_config = ConfigDict(
        from_attributes=True,
        extra="forbid"
    )


class CourseContentCreate(CourseContentBase):
    """Schema for creating course content."""
    course_id: UUID
    
    model_config = ConfigDict(
        extra="forbid"
    )


class CourseContentUpdate(BaseModel):
    """Schema for updating course content."""
    version: Optional[str] = None
    description: Optional[str] = None
    settings: Optional[Dict[str, Any]] = None
    content_status: Optional[CourseStatus] = None

    model_config = ConfigDict(
        from_attributes=True,
        arbitrary_types_allowed=True,
        extra="forbid"
    )


class CourseContentInDB(CourseContentBase, BaseSchema):
    """Schema for course content from database."""
    course_id: UUID
    content_status: CourseStatus
    last_reviewed_by_id: Optional[UUID] = None
    last_reviewed_at: Optional[datetime] = None

    model_config = ConfigDict(
        from_attributes=True,
        arbitrary_types_allowed=True,
        extra="forbid"
    )


class CourseContentResponse(BaseSchema):
    """Schema for course content response."""
    version: str
    description: Optional[str] = None
    settings: Optional[Dict[str, Any]] = None
    content_status: CourseStatus
    syllabus_url: Optional[str] = None
    start_date: datetime
    end_date: datetime
    duration_weeks: Optional[int] = None
    course_id: UUID
    modules: List[Any] = []  # Will be populated with ModuleResponse objects

    model_config = ConfigDict(
        from_attributes=True,
        arbitrary_types_allowed=True,
        populate_by_name=True,
        extra="forbid"
    )


class CourseVersionResponse(BaseSchema):
    """Schema for course version response."""
    course_id: UUID
    version: str
    content_id: UUID
    valid_from: datetime
    valid_until: Optional[datetime] = None
    changelog: Optional[Dict[str, Any]] = None
    content: Optional[CourseContentResponse] = None

    model_config = ConfigDict(
        from_attributes=True,
        arbitrary_types_allowed=True,
        populate_by_name=True,
        extra="forbid"
    )


class CourseWithContentResponse(CourseResponse):
    """Schema for course response with all content versions."""
    content_versions: List[CourseVersionResponse] = Field([], alias="versions")
    
    model_config = ConfigDict(
        from_attributes=True,
        arbitrary_types_allowed=True,
        populate_by_name=True,
        extra="forbid",
        # json_schema_extra={
        #     "example": {
        #         "id": "123e4567-e89b-12d3-a456-426614174000",
        #         "title": "Introduction to Python Programming",
        #         "description": "A beginner-friendly course on Python programming",
        #         "code": "PYTHON-101",
        #         "status": "published",
        #         "created_by_id": "123e4567-e89b-12d3-a456-426614174001",
        #         "content_versions": [
        #             {
        #                 "id": "123e4567-e89b-12d3-a456-426614174002",
        #                 "course_id": "123e4567-e89b-12d3-a456-426614174000",
        #                 "version": "1.0.0",
        #                 "valid_from": "2024-01-01T00:00:00Z",
        #                 "valid_until": None
        #             }
        #         ]
        #     }
        # }
    )
    
    # Override model_dump to rename versions to content_versions during serialization
    def model_dump(self, **kwargs):
        data = super().model_dump(**kwargs)
        # If both versions and content_versions exist in the data somehow, prioritize content_versions
        if "versions" in data and "content_versions" not in data:
            data["content_versions"] = data.pop("versions")
        return data 