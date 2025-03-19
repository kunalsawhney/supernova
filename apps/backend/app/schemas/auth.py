"""Authentication schemas for request/response validation."""

from typing import Optional, List
from datetime import datetime
from pydantic import BaseModel, Field, EmailStr, ConfigDict, constr, field_validator
import re

class LoginRequest(BaseModel):
    """Schema for login request."""
    email: EmailStr
    password: str = Field(..., min_length=8)
    
    model_config = ConfigDict(
        extra="forbid"
    )

class Login(BaseModel):
    """Schema for successful login response."""
    access_token: str
    refresh_token: str
    token_type: str = "bearer"
    expires_at: datetime
    user_id: str
    
    model_config = ConfigDict(
        extra="forbid"
    )

class Token(BaseModel):
    """Schema for access token response."""
    access_token: str
    refresh_token: str
    token_type: str = "bearer"
    expires_at: datetime

    model_config = ConfigDict(
        extra="allow"
    )
    
class TokenPayload(BaseModel):
    """Schema for JWT token payload."""
    sub: str  # user_id
    type: str = Field(..., pattern="^(access|refresh)$")  # "access" or "refresh"
    exp: int  # expiration time
    # iat: int  # issued at time
    # role: str  # user role
    # school_id: Optional[str] = None  # school ID if applicable
    # permissions: Optional[List[str]] = None  # user permissions
    
    model_config = ConfigDict(
        extra="forbid"
    )

class TokenData(BaseModel):
    """Schema for decoded token data."""
    user_id: str
    role: str
    school_id: Optional[str] = None
    permissions: Optional[List[str]] = None
    
    model_config = ConfigDict(
        extra="forbid"
    )

class RefreshToken(BaseModel):
    """Refresh token schema."""
    refresh_token: str
    
    model_config = ConfigDict(
        extra="forbid"
    )

class PasswordResetRequest(BaseModel):
    """Password reset request schema."""
    email: EmailStr
    
    model_config = ConfigDict(
        extra="forbid"
    )

class PasswordReset(BaseModel):
    """Password reset schema."""
    token: str
    password: str = Field(..., min_length=8)
    
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
                "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
                "password": "NewSecure123!"
            }
        }
    ) 