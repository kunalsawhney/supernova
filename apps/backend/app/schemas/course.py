"""Course schemas for the LMS."""

from datetime import datetime
from typing import List, Optional, Dict, Any, Literal
from uuid import UUID

from pydantic import (
    BaseModel, 
    Field, 
    constr, 
    ConfigDict,
    model_validator
)

from app.models.enums import CourseStatus, DifficultyLevel
from app.schemas.shared import BaseSchema


class CourseBase(BaseModel):
    """Base schema for course data."""
    title: str = Field(..., min_length=1, max_length=255)
    description: str = Field(..., min_length=1)
    code: constr(min_length=2, max_length=50, pattern=r'^[a-zA-Z0-9_-]+$') = Field(
        ...,
        description="Unique course code using only letters, numbers, underscores, and hyphens"
    )
    status: CourseStatus = Field(..., description="Status of the course: draft, published, or archived")
    cover_image_url: Optional[str] = Field(None, max_length=255)
    settings: Optional[Dict[str, Any]] = None
    difficulty_level: DifficultyLevel = Field(DifficultyLevel.BEGINNER, description="Difficulty level of the course")
    tags: Optional[List[str]] = None
    estimated_duration: Optional[int] = Field(None, gt=0, description="Estimated duration in hours")
    learning_objectives: Optional[List[str]] = None
    target_audience: Optional[List[str]] = None
    prerequisites: Optional[List[str]] = None
    completion_criteria: Optional[Dict[str, Any]] = None
    grade_level: Optional[str] = Field(None, max_length=20)
    academic_year: Optional[str] = Field(None, max_length=20)
    sequence_number: Optional[int] = Field(None, gt=0)
    base_price: Optional[float] = Field(None, gt=0)
    currency: Optional[constr(min_length=3, max_length=3, pattern=r'^[A-Z]{3}$')] = None
    pricing_type: Optional[Literal["one-time", "subscription"]] = None

    model_config = ConfigDict(
        from_attributes=True,
        extra="forbid"
    )


class CourseCreate(CourseBase):
    """Schema for creating a new course."""
    version: Optional[str] = Field(default="1.0", min_length=1, description="Initial version identifier (e.g., '1.0')")

    model_config = ConfigDict(
        json_schema_extra={
            "example": {
                "title": "Introduction to Python Programming",
                "description": "A beginner-friendly course on Python programming",
                "code": "python-101",
                "status": "draft",
                "version": "1.0",
                "difficulty_level": "beginner",
                "tags": ["programming", "python", "beginner"],
                "estimated_duration": 20,
                "grade_level": "high-school",
                "academic_year": "2024-2025"
            }
        }
    )


class CourseUpdate(BaseModel):
    """Schema for updating an existing course."""
    title: Optional[str] = Field(None, min_length=1, max_length=255)
    description: Optional[str] = None
    code: Optional[constr(min_length=2, max_length=50, pattern=r'^[a-zA-Z0-9_-]+$')] = None
    grade_level: Optional[str] = Field(None, max_length=20)
    academic_year: Optional[str] = Field(None, max_length=20)
    difficulty_level: Optional[DifficultyLevel] = None
    tags: Optional[List[str]] = None
    estimated_duration: Optional[int] = Field(None, gt=0)
    learning_objectives: Optional[List[str]] = None
    target_audience: Optional[List[str]] = None
    prerequisites: Optional[List[str]] = None
    completion_criteria: Optional[Dict[str, Any]] = None
    cover_image_url: Optional[str] = None
    settings: Optional[Dict[str, Any]] = None
    status: Optional[CourseStatus] = None
    base_price: Optional[float] = Field(None, gt=0)
    currency: Optional[constr(min_length=3, max_length=3, pattern=r'^[A-Z]{3}$')] = None
    pricing_type: Optional[Literal["one-time", "subscription"]] = None
    sequence_number: Optional[int] = Field(None, gt=0)

    model_config = ConfigDict(
        extra="forbid"
    )


class CourseInDB(CourseBase, BaseSchema):
    """Schema for course data from database."""
    status: CourseStatus
    created_by_id: UUID
    sequence_number: int
    base_price: Optional[float] = None
    currency: Optional[str] = None
    pricing_type: Optional[str] = None

    model_config = ConfigDict(
        from_attributes=True,
        arbitrary_types_allowed=True,
        extra="forbid"
    )


class CourseResponse(CourseBase, BaseSchema):
    """Schema for course response."""
    status: CourseStatus
    created_by_id: UUID
    sequence_number: int
    base_price: Optional[float] = None
    currency: Optional[str] = None
    pricing_type: Optional[str] = None
    latest_version_id: Optional[UUID] = None

    model_config = ConfigDict(
        from_attributes=True,
        arbitrary_types_allowed=True,
        extra="forbid"
    ) 