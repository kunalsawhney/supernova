"""User schemas for request/response validation."""

from datetime import datetime, date
from typing import Optional, Dict, Any, List
from uuid import UUID
import re

from pydantic import (
    BaseModel, 
    EmailStr, 
    Field, 
    constr, 
    ConfigDict, 
    model_validator,
    field_validator
)

from app.models.enums import UserRole, UserStatus
from app.schemas.shared import BaseSchema, EMAIL_PATTERN, PHONE_PATTERN


class UserBase(BaseModel):
    """Base schema for user data."""
    email: EmailStr = Field(..., description="User's email address")
    first_name: str = Field(..., min_length=1, max_length=255)
    last_name: str = Field(..., min_length=1, max_length=255)
    role: UserRole
    settings: Optional[Dict[str, Any]] = None
    
    model_config = ConfigDict(
        from_attributes=True,
        extra="forbid"
    )
    
    @property
    def full_name(self) -> str:
        """Return the user's full name."""
        return f"{self.first_name} {self.last_name}"


class UserCreate(UserBase):
    """Schema for creating a new user."""
    password: str = Field(
        ..., 
        min_length=8,
        description="Password must be at least 8 characters and include uppercase, lowercase, number and special character"
    )
    school_id: Optional[UUID] = None
    phone: Optional[constr(pattern=PHONE_PATTERN)] = None
    status: UserStatus = UserStatus.ACTIVE

    @field_validator('password')
    @classmethod
    def validate_password(cls, v):
        """Validate password complexity."""
        if not re.search(r'[a-z]', v):
            raise ValueError("Password must contain at least one lowercase letter")
        if not re.search(r'[A-Z]', v):
            raise ValueError("Password must contain at least one uppercase letter")
        if not re.search(r'\d', v):
            raise ValueError("Password must contain at least one digit")
        if not re.search(r'[@$!%*?&]', v):
            raise ValueError("Password must contain at least one special character (@$!%*?&)")
        return v

    model_config = ConfigDict(
        extra="forbid",
        json_schema_extra={
            "example": {
                "email": "user@example.com",
                "first_name": "John",
                "last_name": "Doe",
                "role": "student",
                "password": "Secure123!",
                "school_id": "123e4567-e89b-12d3-a456-426614174000",
                "phone": "+1234567890"
            }
        }
    )


class UserUpdate(BaseModel):
    """Schema for updating a user."""
    email: Optional[EmailStr] = None
    first_name: Optional[str] = Field(None, min_length=1, max_length=255)
    last_name: Optional[str] = Field(None, min_length=1, max_length=255)
    password: Optional[str] = Field(None, min_length=8)
    role: Optional[UserRole] = None
    avatar_url: Optional[str] = None
    phone: Optional[constr(pattern=PHONE_PATTERN)] = None
    settings: Optional[Dict[str, Any]] = None
    status: Optional[UserStatus] = None

    @field_validator('password')
    @classmethod
    def validate_password(cls, v):
        """Validate password complexity."""
        if v is None:
            return v
        if not re.search(r'[a-z]', v):
            raise ValueError("Password must contain at least one lowercase letter")
        if not re.search(r'[A-Z]', v):
            raise ValueError("Password must contain at least one uppercase letter")
        if not re.search(r'\d', v):
            raise ValueError("Password must contain at least one digit")
        if not re.search(r'[@$!%*?&]', v):
            raise ValueError("Password must contain at least one special character (@$!%*?&)")
        return v

    model_config = ConfigDict(
        extra="forbid"
    )


class User(UserBase, BaseSchema):
    """Schema for user response."""
    school_id: Optional[UUID] = None
    status: UserStatus
    phone: Optional[str] = None
    avatar_url: Optional[str] = None
    last_login: Optional[datetime] = None

    model_config = ConfigDict(
        from_attributes=True,
        extra="allow"
    )
    
    @field_validator("status", mode="before")
    @classmethod
    def validate_status(cls, v, info):
        """Convert is_active to status if needed."""
        if isinstance(v, bool) or v is None:
            # If is_active is True, return ACTIVE status, otherwise INACTIVE
            return UserStatus.ACTIVE if v else UserStatus.INACTIVE
        return v


class UserInDB(User):
    """Extended schema for user in database."""
    hashed_password: str


class UserWithSchool(User):
    """Schema for user response with school details."""
    school: Optional[Dict[str, Any]] = None  # Will contain School data



class UserResponse(User):
    """Schema for user response."""
    pass

class StudentProfileBase(BaseModel):
    """Base schema for student profile."""
    enrollment_number: str = Field(..., min_length=1, max_length=50)
    grade_level: str = Field(..., min_length=1, max_length=20)
    section: Optional[str] = Field(None, max_length=20)
    admission_date: date
    academic_status: str = Field("active", pattern="^(active|inactive|suspended|graduated)$")
    parent_details: Optional[Dict[str, Any]] = None

    model_config = ConfigDict(
        from_attributes=True,
        extra="forbid"
    )


class StudentProfileCreate(StudentProfileBase):
    """Schema for creating a student profile."""
    user_id: UUID
    school_id: UUID


class StudentProfileUpdate(BaseModel):
    """Schema for updating a student profile."""
    grade_level: Optional[str] = Field(None, min_length=1, max_length=20)
    section: Optional[str] = Field(None, max_length=20)
    academic_status: Optional[str] = Field(None, pattern="^(active|inactive|suspended|graduated)$")
    parent_details: Optional[Dict[str, Any]] = None

    model_config = ConfigDict(
        extra="forbid"
    )


class StudentProfile(StudentProfileBase, BaseSchema):
    """Schema for student profile response."""
    user_id: UUID
    school_id: UUID


class TeacherProfileBase(BaseModel):
    """Base schema for teacher profile."""
    employee_id: str = Field(..., min_length=1, max_length=50)
    subjects: Optional[List[str]] = None
    qualifications: Optional[Dict[str, Any]] = None
    joining_date: date
    department: Optional[str] = Field(None, max_length=100)

    model_config = ConfigDict(
        from_attributes=True,
        extra="forbid"
    )


class TeacherProfileCreate(TeacherProfileBase):
    """Schema for creating a teacher profile."""
    user_id: UUID
    school_id: UUID


class TeacherProfileUpdate(BaseModel):
    """Schema for updating a teacher profile."""
    subjects: Optional[List[str]] = None
    qualifications: Optional[Dict[str, Any]] = None
    department: Optional[str] = Field(None, max_length=100)

    model_config = ConfigDict(
        extra="forbid"
    )


class TeacherProfile(TeacherProfileBase, BaseSchema):
    """Schema for teacher profile response."""
    user_id: UUID
    school_id: UUID 