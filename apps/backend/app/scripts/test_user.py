"""Script to test user creation."""

import asyncio
import logging
from uuid import UUID, uuid4

from sqlalchemy import select

from app.db.session import AsyncSessionLocal
from app.models.user import User, UserStatus, UserRole
from app.security.password import get_password_hash

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

async def create_test_user() -> None:
    """Create a test user."""
    async with AsyncSessionLocal() as db:
        try:
            # Check if test user already exists
            existing_user = await db.scalar(
                select(User).where(User.email == "test@example.com")
            )
            
            if existing_user:
                logger.info("Test user already exists")
                return
            
            # Create test user
            test_user = User(
                id=uuid4(),
                email="test@example.com",
                password=get_password_hash("Test123!@#"),
                first_name="Test",
                last_name="User",
                role=UserRole.STUDENT.value,
                is_active=True
            )
            
            db.add(test_user)
            await db.commit()
            await db.refresh(test_user)
            
            logger.info(f"Created test user with ID: {test_user.id}")
            
            # Verify user was created
            created_user = await db.scalar(
                select(User).where(User.id == test_user.id)
            )
            
            if created_user:
                logger.info("Successfully verified user creation")
                logger.info(f"User details: {created_user.email}, {created_user.first_name} {created_user.last_name}")
            else:
                logger.error("Failed to verify user creation")
                
        except Exception as e:
            logger.error(f"Error creating test user: {e}")
            await db.rollback()
            raise

if __name__ == "__main__":
    asyncio.run(create_test_user()) 