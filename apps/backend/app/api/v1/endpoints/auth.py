from datetime import timedelta, datetime
from typing import Any

from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from pydantic import BaseModel

from app.db.session import get_db
from app.security.authentication import AuthService
from app.core.config import settings
from app.models.user import User, UserStatus
from app.schemas.auth import (
    Token,
    TokenPayload,
    RefreshToken,
)

router = APIRouter()

class LoginRequest(BaseModel):
    username: str
    password: str

@router.post("/login", response_model=Token)
async def login(
    request: LoginRequest,
    db: AsyncSession = Depends(get_db),
) -> Any:
    """
    Login endpoint that accepts JSON data.
    """
    try:
        user = await AuthService.authenticate_user(
            db, request.username, request.password
        )
        if not user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Incorrect email or password",
                headers={"WWW-Authenticate": "Bearer"},
            )
        
        if user.is_active == False:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="User account is not active",
                headers={"WWW-Authenticate": "Bearer"},
            )

        access_token_expires = timedelta(
            minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES
        )
        refresh_token_expires = timedelta(
            minutes=settings.REFRESH_TOKEN_EXPIRE_MINUTES
        )
        
        # Calculate expiration datetime
        expires_at = datetime.utcnow() + access_token_expires
        
        # Create and return a Token object directly
        return Token(
            access_token=await AuthService.create_access_token(
                user.id, expires_delta=access_token_expires
            ),
            refresh_token=await AuthService.create_refresh_token(
                user.id, expires_delta=refresh_token_expires
            ),
            token_type="bearer",
            expires_at=expires_at
        )
    except Exception as e:
        print(e)
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=str(e),
            headers={"WWW-Authenticate": "Bearer"},
        )

@router.post("/refresh", response_model=Token)
async def refresh_token(
    db: AsyncSession = Depends(get_db),
    refresh_token: RefreshToken = None
) -> Any:
    """
    Refresh access token.
    """
    try:
        user_id = await AuthService.get_current_user_from_refresh_token(db, refresh_token.refresh_token)
        
        user = await db.scalar(select(User).where(User.id == user_id))
        if not user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="User not found",
                headers={"WWW-Authenticate": "Bearer"},
            )
        
        if user.status != UserStatus.ACTIVE:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="User account is not active",
                headers={"WWW-Authenticate": "Bearer"},
            )

        access_token_expires = timedelta(
            minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES
        )
        refresh_token_expires = timedelta(
            minutes=settings.REFRESH_TOKEN_EXPIRE_MINUTES
        )
        
        # Calculate expiration datetime
        expires_at = datetime.utcnow() + access_token_expires
        
        # Create and return a Token object directly
        return Token(
            access_token=await AuthService.create_access_token(
                user.id, expires_delta=access_token_expires
            ),
            refresh_token=await AuthService.create_refresh_token(
                user.id, expires_delta=refresh_token_expires
            ),
            token_type="bearer",
            expires_at=expires_at
        )
        
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid refresh token",
            headers={"WWW-Authenticate": "Bearer"},
        ) 
    

@router.post("/logout")
async def logout() -> Any:
    """
    Logout endpoint.
    """
    return {
        "message": "Logged out successfully",
    }