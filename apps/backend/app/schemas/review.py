"""Review schemas for the Learning Management System."""

from typing import List, Optional
from uuid import UUID
from datetime import datetime

from pydantic import (
    BaseModel, 
    Field, 
    ConfigDict,
    field_validator
)

from app.models.enums import ReviewStatus
from app.schemas.shared import BaseSchema


class ReviewBase(BaseModel):
    """Base schema for course reviews."""
    rating: int = Field(..., ge=1, le=5, description="Overall rating from 1-5")
    review_text: Optional[str] = Field(None, max_length=2000, description="Main review text")
    pros: Optional[List[str]] = Field(None, description="List of positive aspects")
    cons: Optional[List[str]] = Field(None, description="List of negative aspects")
    difficulty_rating: Optional[int] = Field(None, ge=1, le=5, description="Difficulty rating from 1-5")
    engagement_rating: Optional[int] = Field(None, ge=1, le=5, description="Engagement rating from 1-5")
    would_recommend: Optional[bool] = Field(None, description="Whether the user would recommend this course")

    model_config = ConfigDict(
        from_attributes=True,
        extra="forbid"
    )
    
    # Validator to ensure at least one of pros or cons is provided if review_text is missing
    @field_validator('pros', 'cons')
    @classmethod
    def validate_pros_cons(cls, v, info):
        # Only apply this validation if we're validating a complete model
        if not info.context or info.context.get('_is_update_model'):
            return v
            
        # Get all the values so far
        values = info.data
        
        # If review_text is empty and we're validating 'cons', check if either pros or cons has content
        if info.field_name == 'cons' and not values.get('review_text'):
            if not (values.get('pros') or v):
                raise ValueError("At least one of review_text, pros, or cons must be provided")
                
        return v


class ReviewCreate(ReviewBase):
    """Schema for creating a course review."""
    enrollment_id: UUID
    
    model_config = ConfigDict(
        extra="forbid",
        json_schema_extra={
            "example": {
                "enrollment_id": "123e4567-e89b-12d3-a456-426614174000",
                "rating": 4,
                "review_text": "This course was very helpful for beginners.",
                "pros": ["Clear explanations", "Good examples"],
                "cons": ["Could use more practice exercises"],
                "difficulty_rating": 3,
                "engagement_rating": 4,
                "would_recommend": True
            }
        }
    )


class ReviewUpdate(BaseModel):
    """Schema for updating a course review."""
    rating: Optional[int] = Field(None, ge=1, le=5)
    review_text: Optional[str] = Field(None, max_length=2000)
    pros: Optional[List[str]] = None
    cons: Optional[List[str]] = None
    difficulty_rating: Optional[int] = Field(None, ge=1, le=5)
    engagement_rating: Optional[int] = Field(None, ge=1, le=5)
    would_recommend: Optional[bool] = None
    status: Optional[ReviewStatus] = None

    model_config = ConfigDict(
        from_attributes=True,
        arbitrary_types_allowed=True,
        extra="forbid",
        _is_update_model=True  # Custom context for validation
    )


class ReviewInDB(ReviewBase, BaseSchema):
    """Schema for course review from database."""
    enrollment_id: UUID
    user_id: UUID
    course_id: UUID
    status: ReviewStatus = ReviewStatus.PENDING
    moderated_at: Optional[datetime] = None
    moderated_by_id: Optional[UUID] = None
    
    model_config = ConfigDict(
        from_attributes=True,
        arbitrary_types_allowed=True,
        extra="forbid"
    )


class ReviewResponse(ReviewInDB):
    """Schema for course review response."""
    user_name: Optional[str] = None
    user_avatar_url: Optional[str] = None
    course_title: Optional[str] = None
    
    model_config = ConfigDict(
        from_attributes=True,
        arbitrary_types_allowed=True,
        populate_by_name=True,
        extra="forbid"
    )


class ReviewStats(BaseModel):
    """Schema for course review statistics."""
    course_id: UUID
    average_rating: float = Field(..., ge=0, le=5, description="Average overall rating")
    total_reviews: int = Field(..., ge=0, description="Total number of approved reviews")
    rating_distribution: dict = Field(..., description="Distribution of ratings (count per rating 1-5)")
    average_difficulty: Optional[float] = Field(None, ge=0, le=5, description="Average difficulty rating")
    average_engagement: Optional[float] = Field(None, ge=0, le=5, description="Average engagement rating")
    recommendation_percentage: Optional[float] = Field(None, ge=0, le=100, description="Percentage who would recommend")
    
    model_config = ConfigDict(
        from_attributes=True,
        arbitrary_types_allowed=True,
        extra="forbid",
        json_schema_extra={
            "example": {
                "course_id": "123e4567-e89b-12d3-a456-426614174000",
                "average_rating": 4.2,
                "total_reviews": 45,
                "rating_distribution": {"1": 2, "2": 3, "3": 8, "4": 15, "5": 17},
                "average_difficulty": 3.1,
                "average_engagement": 4.0,
                "recommendation_percentage": 87.5
            }
        }
    ) 