"""JWT handling utilities."""

from datetime import datetime
from typing import Any, Dict

from fastapi import HTTPException, status
from jose import jwt, JWTError

from app.core.config import settings

ALGORITHM = "HS256"

def create_token(*, data: Dict[str, Any], expires_delta: datetime) -> str:
    """Create a JWT token."""
    to_encode = data.copy()
    to_encode.update({"exp": expires_delta})
    return jwt.encode(to_encode, settings.SECRET_KEY, algorithm=ALGORITHM)

def decode_token(token: str) -> Dict[str, Any]:
    """Decode and validate a JWT token."""
    try:
        return jwt.decode(token, settings.SECRET_KEY, algorithms=[ALGORITHM])
    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )

def verify_token_type(payload: Dict[str, Any], expected_type: str) -> bool:
    """Verify token type."""
    return payload.get("type") == expected_type 