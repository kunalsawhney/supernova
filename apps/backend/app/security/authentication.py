"""Authentication utilities."""

from datetime import datetime, timedelta
from typing import Optional
from uuid import UUID

from fastapi import HTTPException, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.config import settings
from app.models.user import User, UserStatus
from app.security.jwt import create_token, decode_token, verify_token_type
from app.security.password import get_password_hash, verify_password

class AuthService:
    """Service for handling authentication."""

    @staticmethod
    async def authenticate_user(
        db: AsyncSession,
        email: str,
        password: str
    ) -> Optional[User]:
        """Authenticate user."""
        user = await db.scalar(select(User).where(User.email == email))
        if not user:
            return None
        if not verify_password(password, user.hashed_password):
            return None
        if user.status != UserStatus.ACTIVE:
            return None
        return user

    @staticmethod
    async def create_access_token(
        user_id: UUID,
        expires_delta: Optional[timedelta] = None
    ) -> str:
        """Create access token."""
        if expires_delta:
            expire = datetime.utcnow() + expires_delta
        else:
            expire = datetime.utcnow() + timedelta(
                minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES
            )
        return create_token(
            data={"sub": str(user_id), "type": "access"},
            expires_delta=expire
        )

    @staticmethod
    async def create_refresh_token(
        user_id: UUID,
        expires_delta: Optional[timedelta] = None
    ) -> str:
        """Create refresh token."""
        if expires_delta:
            expire = datetime.utcnow() + expires_delta
        else:
            expire = datetime.utcnow() + timedelta(
                minutes=settings.REFRESH_TOKEN_EXPIRE_MINUTES
            )
        return create_token(
            data={"sub": str(user_id), "type": "refresh"},
            expires_delta=expire
        )

    @staticmethod
    async def get_current_user(
        db: AsyncSession,
        token: str
    ) -> User:
        """Get current user from token."""
        credentials_exception = HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )

        try:
            payload = decode_token(token)
            if not verify_token_type(payload, "access"):
                raise credentials_exception

            user_id = UUID(payload["sub"])
            if not user_id:
                raise credentials_exception
        except Exception:
            raise credentials_exception

        user = await db.scalar(select(User).where(User.id == user_id))
        if not user:
            raise credentials_exception
        if user.status != UserStatus.ACTIVE:
            raise credentials_exception
        return user

    @staticmethod
    async def get_current_user_from_refresh_token(
        db: AsyncSession,
        token: str
    ) -> UUID:
        """Get user ID from refresh token."""
        credentials_exception = HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )

        try:
            payload = decode_token(token)
            if not verify_token_type(payload, "refresh"):
                raise credentials_exception

            user_id = UUID(payload["sub"])
            if not user_id:
                raise credentials_exception
            return user_id
        except Exception:
            raise credentials_exception 