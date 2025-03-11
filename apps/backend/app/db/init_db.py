import logging
from uuid import uuid4
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.core.auth import Auth
from app.models.user import User, UserRole, UserStatus
from app.models.school import School, SubscriptionStatus
from app.core.config import settings

logger = logging.getLogger(__name__)

async def init_db(db: AsyncSession) -> None:
    """Initialize database with required data."""
    try:
        # Create super admin if it doesn't exist
        super_admin = await db.scalar(
            select(User).where(User.role == UserRole.SUPER_ADMIN)
        )
        
        if not super_admin:
            super_admin = User(
                id=uuid4(),
                email=settings.FIRST_SUPERUSER_EMAIL,
                hashed_password=Auth.get_password_hash(settings.FIRST_SUPERUSER_PASSWORD),
                first_name="Super",
                last_name="Admin",
                role=UserRole.SUPER_ADMIN,
                status=UserStatus.ACTIVE,
                is_verified=True
            )
            db.add(super_admin)
            await db.commit()
            logger.info(f"Created super admin: {super_admin.email}")

        # Create a demo school if it doesn't exist
        demo_school = await db.scalar(
            select(School).where(School.name == "Demo School")
        )
        
        if not demo_school:
            demo_school = School(
                id=uuid4(),
                name="Demo School",
                domain="demo.school.com",
                subscription_status=SubscriptionStatus.ACTIVE,
                max_users=100
            )
            db.add(demo_school)
            await db.commit()
            logger.info(f"Created demo school: {demo_school.name}")

            # Create demo users for the school
            school_admin = User(
                id=uuid4(),
                email="school.admin@demo.school.com",
                hashed_password=Auth.get_password_hash("school123"),  # Change in production
                first_name="School",
                last_name="Admin",
                role=UserRole.SCHOOL_ADMIN,
                school_id=demo_school.id,
                status=UserStatus.ACTIVE,
                is_verified=True
            )
            db.add(school_admin)

            teacher = User(
                id=uuid4(),
                email="teacher@demo.school.com",
                hashed_password=Auth.get_password_hash("teacher123"),  # Change in production
                first_name="Demo",
                last_name="Teacher",
                role=UserRole.TEACHER,
                school_id=demo_school.id,
                status=UserStatus.ACTIVE,
                is_verified=True
            )
            db.add(teacher)

            student = User(
                id=uuid4(),
                email="student@demo.school.com",
                hashed_password=Auth.get_password_hash("student123"),  # Change in production
                first_name="Demo",
                last_name="Student",
                role=UserRole.STUDENT,
                school_id=demo_school.id,
                status=UserStatus.ACTIVE,
                is_verified=True
            )
            db.add(student)

            await db.commit()
            logger.info("Created demo users for the school")

    except Exception as e:
        logger.error(f"Error initializing database: {e}")
        await db.rollback()
        raise 