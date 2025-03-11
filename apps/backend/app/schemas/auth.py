"""Authentication schemas for request/response validation."""

from typing import Optional
from pydantic import BaseModel

class Token(BaseModel):
    """Schema for access token response."""
    access_token: str
    refresh_token: str
    token_type: str = "bearer"

class TokenPayload(BaseModel):
    """Schema for JWT token payload."""
    sub: str  # user_id
    type: str  # "access" or "refresh"
    exp: Optional[int] = None  # expiration time

class RefreshToken(BaseModel):
    """Refresh token schema."""
    refresh_token: str 