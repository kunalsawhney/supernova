"""Script to manage users."""

import sys
import asyncio
from uuid import UUID, uuid4
from typing import Optional

from sqlalchemy import select

from base import BaseScript
from app.security.password import get_password_hash
from app.models.user import User, UserRole, UserStatus
from app.models.school import School

class UserScript(BaseScript):
    """Script for managing users."""
    
    @classmethod
    async def create_user(
        cls,
        email: str,
        password: str,
        first_name: str,
        last_name: str,
        role: str,
        school_domain: Optional[str] = None,
    ) -> Optional[User]:
        """Create a new user."""
        async with cls.get_db() as db:
            # Check if user exists
            existing_user = await db.scalar(
                select(User).where(User.email == email)
            )
            
            if existing_user:
                cls.print_error(f"User with email {email} already exists")
                return None

            # Handle school assignment
            school_id = None
            if role != UserRole.SUPER_ADMIN.value:
                if not school_domain:
                    cls.print_error("School domain is required for non-super admin users")
                    return None
                
                school = await db.scalar(
                    select(School).where(School.domain == school_domain)
                )
                
                if not school:
                    cls.print_error(f"School with domain {school_domain} not found")
                    return None
                
                school_id = school.id

            # Create user
            user = User(
                id=uuid4(),
                email=email,
                password=get_password_hash(password),
                first_name=first_name,
                last_name=last_name,
                role=role,
                school_id=school_id,
                is_active=True
            )
            
            db.add(user)
            await db.flush()
            await db.refresh(user)
            
            cls.print_success(f"Created user: {user.email} ({role})")
            return user

    @classmethod
    async def list_users(cls, school_domain: str = None, role: str = None) -> None:
        """List users with optional filters."""
        async with cls.get_db() as db:
            query = select(User)
            
            if school_domain:
                school = await db.scalar(
                    select(School).where(School.domain == school_domain)
                )
                if not school:
                    cls.print_error(f"School with domain {school_domain} not found")
                    return
                query = query.where(User.school_id == school.id)
            
            if role:
                query = query.where(User.role == role)
            
            result = await db.execute(query)
            users = result.scalars().all()
            
            if not users:
                cls.print_info("No users found")
                return
            
            cls.print_info(f"Found {len(users)} users:")
            for user in users:
                school = user.school
                cls.print_info(f"\nUser: {user.full_name}")
                print(f"  Email: {user.email}")
                print(f"  Role: {user.role}")
                print(f"  Active: {'Yes' if user.is_active else 'No'}")
                if school:
                    print(f"  School: {school.name} ({school.domain})")

    @classmethod
    async def update_user(
        cls,
        email: str,
        **kwargs
    ) -> None:
        """Update user attributes."""
        async with cls.get_db() as db:
            user = await db.scalar(
                select(User).where(User.email == email)
            )
            if not user:
                cls.print_error(f"User with email {email} not found")
                return
            
            # Handle password separately
            if 'password' in kwargs:
                kwargs['password'] = get_password_hash(kwargs.pop('password'))
            
            # Handle school domain
            if 'school_domain' in kwargs:
                school_domain = kwargs.pop('school_domain')
                if school_domain:
                    school = await db.scalar(
                        select(School).where(School.domain == school_domain)
                    )
                    if not school:
                        cls.print_error(f"School with domain {school_domain} not found")
                        return
                    kwargs['school_id'] = school.id
                else:
                    kwargs['school_id'] = None
            
            # Update attributes
            for key, value in kwargs.items():
                if hasattr(user, key):
                    setattr(user, key, value)
            
            await db.flush()
            await db.refresh(user)
            
            cls.print_success(f"Updated user: {user.email}")

    @classmethod
    async def create_from_input(cls) -> None:
        """Create user from user input."""
        cls.print_info("Creating a new user")
        email = cls.get_input("Email")
        password = cls.get_input("Password")
        first_name = cls.get_input("First name")
        last_name = cls.get_input("Last name")
        
        # Show available roles
        print("\nAvailable roles:")
        for role in UserRole:
            print(f"  - {role.value}")
        role = cls.get_input("Role")
        
        school_domain = None
        if role != UserRole.SUPER_ADMIN.value:
            school_domain = cls.get_input("School domain")
        
        await cls.create_user(
            email=email,
            password=password,
            first_name=first_name,
            last_name=last_name,
            role=role,
            school_domain=school_domain
        )

async def main():
    """Main function."""
    script = UserScript()
    
    if len(sys.argv) == 1:
        # Interactive mode
        await script.create_from_input()
    elif len(sys.argv) == 2 and sys.argv[1] == "list":
        # List all users
        await script.list_users()
    elif len(sys.argv) >= 3 and sys.argv[1] == "list":
        # List users with filters
        filters = {}
        if "--school" in sys.argv:
            idx = sys.argv.index("--school")
            filters["school_domain"] = sys.argv[idx + 1]
        if "--role" in sys.argv:
            idx = sys.argv.index("--role")
            filters["role"] = sys.argv[idx + 1]
        await script.list_users(**filters)
    elif len(sys.argv) >= 6:
        # Command line mode
        email = sys.argv[2]
        password = sys.argv[3]
        first_name = sys.argv[4]
        last_name = sys.argv[5]
        role = sys.argv[6]
        school_domain = sys.argv[7] if len(sys.argv) > 7 else None
        
        await script.create_user(
            email=email,
            password=password,
            first_name=first_name,
            last_name=last_name,
            role=role,
            school_domain=school_domain
        )
    else:
        script.print_error(
            "Usage: python manage_users.py create [email password first_name last_name role school_domain]\n"
            "       python manage_users.py list [--school domain] [--role role]"
        )
        sys.exit(1)

if __name__ == "__main__":
    asyncio.run(main()) 