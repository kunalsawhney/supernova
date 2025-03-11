"""Script to manage schools."""

import sys
import asyncio
from uuid import uuid4
from typing import Optional, Tuple

from sqlalchemy import select, and_

from base import BaseScript
from app.security.password import get_password_hash
from app.models.user import User, UserRole, UserStatus
from app.models.school import School

class SchoolScript(BaseScript):
    """Script for managing schools."""
    
    @classmethod
    async def create_school(
        cls,
        name: str,
        domain: str,
        admin_email: str,
        admin_password: str,
        admin_first_name: str,
        admin_last_name: str,
        max_users: int = 100,
        subscription_status: str = "active",
    ) -> Tuple[Optional[School], Optional[User]]:
        """Create a new school with its admin."""
        async with cls.get_db() as db:
            # Check if school with same domain exists
            existing_school = await db.scalar(
                select(School).where(School.domain == domain)
            )
            
            if existing_school:
                cls.print_error(f"School with domain {domain} already exists")
                return None, None

            # Check if admin email is available
            existing_user = await db.scalar(
                select(User).where(User.email == admin_email)
            )
            
            if existing_user:
                cls.print_error(f"User with email {admin_email} already exists")
                return None, None

            # Create school
            school = School(
                id=uuid4(),
                name=name,
                domain=domain,
                subscription_status=subscription_status,
                max_users=max_users
            )
            db.add(school)
            await db.flush()  # Get school ID
            
            # Create school admin
            admin = User(
                id=uuid4(),
                email=admin_email,
                password=get_password_hash(admin_password),
                first_name=admin_first_name,
                last_name=admin_last_name,
                role=UserRole.SCHOOL_ADMIN.value,
                school_id=school.id,
                status=UserStatus.ACTIVE.value,
                is_active=True
            )
            db.add(admin)
            
            await db.flush()
            await db.refresh(school)
            await db.refresh(admin)
            
            cls.print_success(f"Created school: {school.name}")
            cls.print_success(f"Created school admin: {admin.email}")
            return school, admin

    @classmethod
    async def list_schools(cls) -> None:
        """List all schools."""
        async with cls.get_db() as db:
            result = await db.execute(select(School))
            schools = result.scalars().all()
            
            if not schools:
                cls.print_info("No schools found")
                return
            
            cls.print_info(f"Found {len(schools)} schools:")
            for school in schools:
                admin_result = await db.execute(
                    select(User).where(
                        and_(
                            User.school_id == school.id,
                            User.role == UserRole.SCHOOL_ADMIN.value
                        )
                    )
                )
                admin = admin_result.scalar_one_or_none()
                
                cls.print_info(f"\nSchool: {school.name}")
                print(f"  Domain: {school.domain}")
                print(f"  Status: {school.subscription_status}")
                print(f"  Max Users: {school.max_users}")
                if admin:
                    print(f"  Admin: {admin.full_name} ({admin.email})")

    @classmethod
    async def create_from_input(cls) -> None:
        """Create school from user input."""
        cls.print_info("Creating a new school")
        name = cls.get_input("School name")
        domain = cls.get_input("Domain")
        max_users = int(cls.get_input("Max users", "100"))
        
        cls.print_info("\nSchool admin details:")
        admin_email = cls.get_input("Email")
        admin_password = cls.get_input("Password")
        admin_first_name = cls.get_input("First name")
        admin_last_name = cls.get_input("Last name")
        
        await cls.create_school(
            name=name,
            domain=domain,
            admin_email=admin_email,
            admin_password=admin_password,
            admin_first_name=admin_first_name,
            admin_last_name=admin_last_name,
            max_users=max_users
        )

async def main():
    """Main function."""
    script = SchoolScript()
    
    if len(sys.argv) == 1:
        # Interactive mode
        await script.create_from_input()
    elif len(sys.argv) == 2 and sys.argv[1] == "list":
        # List schools
        await script.list_schools()
    elif len(sys.argv) == 8:
        # Command line mode
        name = sys.argv[1]
        domain = sys.argv[2]
        max_users = int(sys.argv[3])
        admin_email = sys.argv[4]
        admin_password = sys.argv[5]
        admin_first_name = sys.argv[6]
        admin_last_name = sys.argv[7]
        
        await script.create_school(
            name=name,
            domain=domain,
            admin_email=admin_email,
            admin_password=admin_password,
            admin_first_name=admin_first_name,
            admin_last_name=admin_last_name,
            max_users=max_users
        )
    else:
        script.print_error(
            "Usage: python manage_school.py [name domain max_users admin_email admin_password admin_first_name admin_last_name]\n"
            "       python manage_school.py list"
        )
        sys.exit(1)

if __name__ == "__main__":
    asyncio.run(main()) 