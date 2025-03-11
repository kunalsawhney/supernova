"""Script to create a super admin user."""

import sys
import asyncio
from uuid import uuid4

from sqlalchemy import select

from base import BaseScript
from app.security.password import get_password_hash
from app.models.user import User, UserRole, UserStatus

class SuperAdminScript(BaseScript):
    """Script for managing super admin users."""
    
    @classmethod
    async def create_super_admin(
        cls,
        email: str,
        password: str,
        first_name: str,
        last_name: str,
        force: bool = False
    ) -> User:
        """Create a super admin user."""
        async with cls.get_db() as db:
            # Check if super admin already exists
            existing_super_admin = await db.scalar(
                select(User).where(User.role == UserRole.SUPER_ADMIN.value)
            )
            
            if existing_super_admin and not force:
                cls.print_warning(f"Super admin already exists: {existing_super_admin.email}")
                if not cls.confirm("Do you want to create another super admin?"):
                    cls.print_info("Operation cancelled")
                    return existing_super_admin

            # Create super admin
            super_admin = User(
                id=uuid4(),
                email=email,
                password=get_password_hash(password),
                first_name=first_name,
                last_name=last_name,
                role=UserRole.SUPER_ADMIN.value,
                status=UserStatus.ACTIVE.value,
                is_active=True
            )
            
            db.add(super_admin)
            await db.flush()
            await db.refresh(super_admin)
            
            cls.print_success(f"Created super admin: {super_admin.email}")
            return super_admin

    @classmethod
    async def create_from_input(cls) -> None:
        """Create super admin from user input."""
        cls.print_info("Creating a new super admin user")
        email = cls.get_input("Email")
        password = cls.get_input("Password")
        first_name = cls.get_input("First name")
        last_name = cls.get_input("Last name")
        
        await cls.create_super_admin(email, password, first_name, last_name)

async def main():
    """Main function."""
    script = SuperAdminScript()
    
    if len(sys.argv) == 1:
        # Interactive mode
        await script.create_from_input()
    elif len(sys.argv) == 5:
        # Command line mode
        email = sys.argv[1]
        password = sys.argv[2]
        first_name = sys.argv[3]
        last_name = sys.argv[4]
        await script.create_super_admin(email, password, first_name, last_name)
    else:
        script.print_error("Usage: python create_super_admin.py [email password first_name last_name]")
        sys.exit(1)

if __name__ == "__main__":
    asyncio.run(main()) 