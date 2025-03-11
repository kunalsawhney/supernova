"""Shared schemas to avoid circular dependencies."""

from datetime import datetime
from typing import Optional, Dict, Any
from uuid import UUID

from pydantic import BaseModel


class BaseSchema(BaseModel):
    """Base schema with common fields."""
    id: UUID
    created_at: datetime
    updated_at: datetime
    is_active: bool
    is_deleted: bool
    deleted_at: Optional[datetime] = None

    class Config:
        from_attributes = True 