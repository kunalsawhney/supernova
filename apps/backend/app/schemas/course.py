"""Course schemas for request/response validation."""

from datetime import datetime
from typing import List, Optional, Dict, Any
from uuid import UUID

from pydantic import BaseModel, Field, constr

from app.models.course import CourseStatus, DifficultyLevel
from app.schemas.shared import BaseSchema

class CourseBase(BaseModel):
    """Base schema for course data."""
    title: str = Field(..., min_length=1, max_length=255)
    description: str = Field(..., min_length=1)
    code: constr(min_length=2, max_length=50)
    status: CourseStatus = Field(..., description="Status of the course: draft, published, or archived")
    cover_image_url: Optional[str] = Field(None, max_length=255)
    settings: Optional[Dict[str, Any]] = None
    difficulty_level: DifficultyLevel = Field(None, description="Difficulty level of the course")
    tags: Optional[List[str]] = None
    estimated_duration: Optional[int] = Field(None, gt=0, description="Estimated duration in hours")
    learning_objectives: Optional[List[str]] = None
    target_audience: Optional[List[str]] = None
    prerequisites: Optional[List[str]] = None
    completion_criteria: Optional[Dict[str, Any]] = None
    grade_level: str = Field(None, max_length=20)
    academic_year: str = Field(None, max_length=20)
    sequence_number: int = Field(None, gt=0)
    base_price: Optional[float] = Field(None, gt=0)
    currency: Optional[constr(min_length=3, max_length=3)] = None
    pricing_type: Optional[constr(pattern="^(one-time|subscription)$")] = None

class CourseCreate(CourseBase):
    """Schema for creating a new course."""
    pass

class CourseUpdate(BaseModel):
    """Schema for updating an existing course."""
    title: Optional[str] = Field(None, min_length=1, max_length=255)
    description: Optional[str] = None
    code: Optional[constr(min_length=2, max_length=50)] = None
    grade_level: Optional[str] = Field(None, max_length=20)
    academic_year: Optional[str] = Field(None, max_length=20)
    difficulty_level: Optional[DifficultyLevel] = None
    tags: Optional[List[str]] = None
    estimated_duration: Optional[int] = Field(None, gt=0)
    learning_objectives: Optional[List[str]] = None
    target_audience: Optional[List[str]] = None
    prerequisites: Optional[List[UUID]] = None
    completion_criteria: Optional[dict] = None
    cover_image_url: Optional[str] = None
    settings: Optional[Dict[str, Any]] = None
    status: Optional[CourseStatus] = None
    base_price: Optional[float] = Field(None, gt=0)
    currency: Optional[str] = Field(None, min_length=3, max_length=3)
    pricing_type: Optional[str] = Field(None, pattern="^(one-time|subscription)$")
    sequence_number: Optional[int] = Field(None, gt=0)

class CourseInDB(CourseBase, BaseSchema):
    """Schema for course data from database."""
    status: CourseStatus
    created_by_id: UUID
    sequence_number: int
    base_price: Optional[float] = None
    currency: Optional[str] = None
    pricing_type: Optional[str] = None

    class Config:
        from_attributes = True
        # Enable arbitrary type conversion for complex nested models
        arbitrary_types_allowed = True

class CourseContentBase(BaseModel):
    """Base schema for course content."""
    version: str
    description: Optional[str] = None
    settings: Optional[Dict[str, Any]] = None

class CourseContentCreate(CourseContentBase):
    """Schema for creating course content."""
    course_id: UUID

class CourseContentUpdate(BaseModel):
    """Schema for updating course content."""
    version: Optional[str] = None
    description: Optional[str] = None
    settings: Optional[Dict[str, Any]] = None
    content_status: Optional[CourseStatus] = None

    class Config:
        from_attributes = True
        # Enable arbitrary type conversion for complex nested models
        arbitrary_types_allowed = True

class CourseContentInDB(CourseContentBase, BaseSchema):
    """Schema for course content from database."""
    course_id: UUID
    content_status: CourseStatus
    last_reviewed_by_id: Optional[UUID] = None
    last_reviewed_at: Optional[datetime] = None

    class Config:
        from_attributes = True
        # Enable arbitrary type conversion for complex nested models
        arbitrary_types_allowed = True

class LessonBase(BaseModel):
    """Base schema for lesson data."""
    title: str = Field(..., alias="name")
    description: Optional[str] = None
    content: Any
    order: int = Field(..., alias="sequence_number")
    settings: Optional[Dict[str, Any]] = None
    
    class Config:
        populate_by_name = True

class LessonCreate(LessonBase):
    """Schema for creating a lesson."""
    module_id: UUID

class LessonUpdate(BaseModel):
    """Schema for updating a lesson."""
    title: Optional[str] = Field(None, alias="name")
    description: Optional[str] = None
    content: Optional[Any] = None
    order: Optional[int] = Field(None, alias="sequence_number")
    settings: Optional[Dict[str, Any]] = None
    
    class Config:
        populate_by_name = True

class LessonInDB(LessonBase, BaseSchema):
    """Schema for lesson data from database."""
    module_id: UUID

class LessonResponse(LessonBase, BaseSchema):
    """Schema for lesson response."""
    module_id: UUID

class ModuleBase(BaseModel):
    """Base schema for module data."""
    title: str = Field(..., alias="name")
    description: Optional[str] = None
    order: int = Field(..., alias="sequence_number")
    settings: Optional[Dict[str, Any]] = None

    class Config:
        populate_by_name = True

class ModuleCreate(ModuleBase):
    """Schema for creating a module."""
    content_id: UUID

class ModuleUpdate(BaseModel):
    """Schema for updating a module."""
    title: Optional[str] = Field(None, alias="name")
    description: Optional[str] = None
    order: Optional[int] = Field(None, alias="sequence_number")
    settings: Optional[Dict[str, Any]] = None
    status: Optional[CourseStatus] = None
    
    class Config:
        populate_by_name = True

class ModuleInDB(ModuleBase, BaseSchema):
    """Schema for module data from database."""
    content_id: UUID
    status: CourseStatus

class ModuleResponse(ModuleBase, BaseSchema):
    """Schema for module response."""
    content_id: UUID
    status: CourseStatus
    lessons: List[LessonResponse] = []

    class Config:
        from_attributes = True
        arbitrary_types_allowed = True
        populate_by_name = True

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
    modules: List[ModuleResponse] = []

    class Config:
        from_attributes = True
        arbitrary_types_allowed = True
        populate_by_name = True

class CourseVersionResponse(BaseSchema):
    """Schema for course version response."""
    course_id: UUID
    version: str
    content_id: UUID
    valid_from: datetime
    valid_until: Optional[datetime] = None
    changelog: Optional[Dict[str, Any]] = None
    content: Optional[CourseContentResponse] = None

    class Config:
        from_attributes = True
        arbitrary_types_allowed = True
        populate_by_name = True

class CourseResponse(CourseBase, BaseSchema):
    """Schema for course response."""
    status: CourseStatus
    created_by_id: UUID
    sequence_number: int
    base_price: Optional[float] = None
    currency: Optional[str] = None
    pricing_type: Optional[str] = None
    latest_version_id: Optional[UUID] = None

    class Config:
        from_attributes = True
        arbitrary_types_allowed = True

class CourseWithContentResponse(CourseResponse):
    """Schema for course response with all content versions."""
    content_versions: List[CourseVersionResponse] = Field([], alias="versions")
    
    class Config:
        from_attributes = True
        arbitrary_types_allowed = True
        populate_by_name = True
        # This makes the response use the field names, not the aliases
        json_schema_extra = {"examples": []}
        
    # Override model_dump to rename versions to content_versions during serialization
    def model_dump(self, **kwargs):
        data = super().model_dump(**kwargs)
        # If both versions and content_versions exist in the data somehow, prioritize content_versions
        if "versions" in data and "content_versions" not in data:
            data["content_versions"] = data.pop("versions")
        return data

# Review schemas
class CourseReviewBase(BaseModel):
    """Base schema for course review."""
    rating: int = Field(..., ge=1, le=5)
    comment: str = Field(..., min_length=1, max_length=1000)
    moderated_by_id: Optional[UUID] = None
    moderation_status: Optional[str] = None
    moderation_comment: Optional[str] = None

    class Config:
        from_attributes = True
        json_schema_extra = {
            "example": {
                "rating": 5,
                "comment": "Great course!",
                "moderated_by_id": None,
                "moderation_status": None,
                "moderation_comment": None
            }
        }

class CourseReviewCreate(CourseReviewBase):
    """Schema for creating a course review."""
    enrollment_id: UUID

class CourseReviewUpdate(BaseModel):
    """Schema for updating a course review."""
    rating: Optional[int] = Field(None, ge=1, le=5)
    review_text: Optional[str] = None
    pros: Optional[List[str]] = None
    cons: Optional[List[str]] = None
    would_recommend: Optional[bool] = None
    difficulty_rating: Optional[int] = Field(None, ge=1, le=5)
    engagement_rating: Optional[int] = Field(None, ge=1, le=5)

class CourseReviewInDB(CourseReviewBase, BaseSchema):
    """Schema for course review from database."""
    enrollment_id: UUID
    is_verified: bool
    is_featured: bool
    status: str
    moderated_by_id: Optional[UUID] = None
    moderated_at: Optional[datetime] = None

    class Config:
        from_attributes = True
        arbitrary_types_allowed = True 