"""School schemas for request/response validation."""

from datetime import datetime
from typing import Optional, Dict, Any, TYPE_CHECKING, Annotated
from uuid import UUID

from pydantic import BaseModel, constr, Field

from app.schemas.shared import BaseSchema


class SchoolBase(BaseModel):
    """Base schema for school data."""
    name: str
    domain: constr(pattern=r"^[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9]\.[a-zA-Z]{2,}$")
    logo_url: Optional[str] = None
    settings: Optional[Dict[str, Any]] = None


class SchoolCreate(SchoolBase):
    """Schema for creating a new school."""
    admin: Dict[str, Any]  # Will contain UserCreate data


class SchoolUpdate(SchoolBase):
    """Schema for updating a school."""
    name: Optional[str] = None
    domain: Optional[str] = None


class School(SchoolBase, BaseSchema):
    """Schema for school response."""
    pass


class SchoolInDB(School):
    """Extended schema for school in database."""
    pass


class SchoolWithStats(School):
    """Schema for school with additional statistics."""
    total_students: int
    total_teachers: int
    total_courses: int
    active_courses: int
    storage_used: int  # in bytes 