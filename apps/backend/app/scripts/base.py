"""Base utilities for management scripts."""

import sys
import os
from pathlib import Path
from contextlib import asynccontextmanager
from typing import Any, AsyncGenerator

# Add the parent directory to Python path
sys.path.append(str(Path(__file__).parent.parent.parent))

from sqlalchemy.ext.asyncio import AsyncSession

from app.db.session import AsyncSessionLocal
from app.security.authentication import AuthService
from app.models.user import User, UserRole, UserStatus
from app.models.school import School
from app.models.scoped_models import SchoolScopedModel

class BaseScript:
    """Base class for management scripts."""
    
    @staticmethod
    @asynccontextmanager
    async def get_db() -> AsyncGenerator[AsyncSession, None]:
        """Get database session with context management."""
        async with AsyncSessionLocal() as session:
            try:
                yield session
                await session.commit()
            except Exception:
                await session.rollback()
                raise
            finally:
                await session.close()
    
    @staticmethod
    def print_success(message: str) -> None:
        """Print success message in green."""
        print(f"\033[92m✓ {message}\033[0m")
    
    @staticmethod
    def print_error(message: str) -> None:
        """Print error message in red."""
        print(f"\033[91m✗ {message}\033[0m")
    
    @staticmethod
    def print_info(message: str) -> None:
        """Print info message in blue."""
        print(f"\033[94mℹ {message}\033[0m")
    
    @staticmethod
    def print_warning(message: str) -> None:
        """Print warning message in yellow."""
        print(f"\033[93m⚠ {message}\033[0m")
    
    @staticmethod
    def get_input(prompt: str, default: Any = None) -> str:
        """Get user input with optional default value."""
        if default:
            prompt = f"{prompt} [{default}]: "
        else:
            prompt = f"{prompt}: "
        
        value = input(prompt).strip()
        if not value and default:
            return default
        return value
    
    @staticmethod
    def confirm(prompt: str) -> bool:
        """Get user confirmation."""
        response = input(f"{prompt} [y/N]: ").lower().strip()
        return response in ['y', 'yes'] 