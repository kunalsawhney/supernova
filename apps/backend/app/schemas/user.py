"""User schemas for request/response validation."""

from datetime import datetime
from typing import Optional, Dict, Any, TYPE_CHECKING
from uuid import UUID

from pydantic import BaseModel, EmailStr, constr

from app.schemas.shared import BaseSchema


class UserBase(BaseModel):
    """Base schema for user data."""
    email: EmailStr
    first_name: str
    last_name: str
    role: str
    settings: Optional[Dict[str, Any]] = None


class UserCreate(UserBase):
    """Schema for creating a new user."""
    password: constr(min_length=8)
    school_id: Optional[UUID] = None


class UserUpdate(BaseModel):
    """Schema for updating a user."""
    email: Optional[EmailStr] = None
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    password: Optional[constr(min_length=8)] = None
    role: Optional[str] = None
    avatar_url: Optional[str] = None
    settings: Optional[Dict[str, Any]] = None


class User(UserBase, BaseSchema):
    """Schema for user response."""
    school_id: Optional[UUID] = None


class UserInDB(User):
    """Extended schema for user in database."""
    hashed_password: str


class UserWithSchool(User):
    """Schema for user response with school details."""
    school: Optional[Dict[str, Any]] = None  # Will contain School data 