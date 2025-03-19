"""Shared schemas to avoid circular dependencies."""

from datetime import datetime
from typing import Optional, Dict, Any, TypeVar, Generic, List, Type
from uuid import UUID
import re

from pydantic import BaseModel, Field, validator, model_validator, ConfigDict


# Common regex patterns
EMAIL_PATTERN = r"^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$"
PHONE_PATTERN = r"^\+?[0-9]{7,15}$"
URL_PATTERN = r"^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$"
TIMEZONE_PATTERN = r"^[A-Za-z_]+\/[A-Za-z_]+$"


class BaseSchema(BaseModel):
    """Base schema with common fields."""
    id: UUID
    created_at: datetime
    updated_at: datetime
    is_active: bool
    is_deleted: bool
    deleted_at: Optional[datetime] = None

    model_config = ConfigDict(
        from_attributes=True,
        extra="forbid"
    )


T = TypeVar('T')

class PaginatedResponse(BaseModel, Generic[T]):
    """Generic paginated response schema."""
    items: List[T]
    total: int
    page: int = Field(1, ge=1)
    size: int = Field(10, ge=1)
    pages: int

    model_config = ConfigDict(
        from_attributes=True,
        extra="forbid"
    )


class SortParams(BaseModel):
    """Sort parameters."""
    sort_by: str
    sort_dir: str = Field("asc", pattern="^(asc|desc)$")

    model_config = ConfigDict(
        extra="forbid"
    )


class DateRangeParams(BaseModel):
    """Date range filter parameters."""
    start_date: datetime
    end_date: datetime

    @model_validator(mode='after')
    def validate_date_range(self) -> 'DateRangeParams':
        if self.start_date > self.end_date:
            raise ValueError("start_date must be before end_date")
        return self


class MetadataSchema(BaseModel):
    """Generic metadata schema for JSON/JSONB fields."""
    # Using Dict[str, Any] but with extra validation methods
    data: Dict[str, Any] = Field(default_factory=dict)
    
    model_config = ConfigDict(
        extra="allow"
    ) 