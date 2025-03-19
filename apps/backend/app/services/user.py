"""Service for managing users."""

from typing import List, Optional, Any
from uuid import UUID

from sqlalchemy import select, and_, or_
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import joinedload

from app.core.exception_handlers import NotFoundException, ValidationError, PermissionError
from app.models.user import User, UserRole
from app.models.school import School
from app.security.password import get_password_hash
from app.schemas.user import UserCreate, UserUpdate


class UserService:
    """Service for managing users."""
    
    @staticmethod
    async def get_user(
        db: AsyncSession,
        user_id: UUID,
        with_school: bool = False
    ) -> Optional[User]:
        """Get a user by ID."""
        query = select(User).where(User.id == user_id)
        
        if with_school:
            query = query.options(
                joinedload(User.schools)
            )
            
        result = await db.execute(query)
        return result.scalar_one_or_none()
    
    @staticmethod
    async def get_user_by_email(
        db: AsyncSession,
        email: str
    ) -> Optional[User]:
        """Get a user by email."""
        query = select(User).where(User.email == email)
        result = await db.execute(query)
        return result.scalar_one_or_none()
    
    @staticmethod
    async def create_user(
        db: AsyncSession,
        current_user: User,
        user_data: UserCreate,
        school_id: Optional[UUID] = None,
        school_role: Optional[Any] = None
    ) -> User:
        """Create a new user."""
        # Check if email already exists
        existing_user = await UserService.get_user_by_email(db, user_data.email)
        if existing_user:
            raise ValidationError("Email already registered")
            
        # Only super admins can create other super admins
        if user_data.role == UserRole.SUPER_ADMIN and current_user.role != UserRole.SUPER_ADMIN:
            raise PermissionError("Only super admins can create super admin users")
            
        # # School admins can only create users for their school
        # if current_user.role == UserRole.SCHOOL_ADMIN:
        #     if not school_id:
        #         # Find current user's school
        #         query = (
        #             select(SchoolMember)
        #             .where(SchoolMember.user_id == current_user.id)
        #             .where(SchoolMember.role == SchoolRole.ADMIN)
        #         )
        #         result = await db.execute(query)
        #         school_member = result.scalar_one_or_none()
                
        #         if not school_member:
        #             raise PermissionError("School admin must belong to a school")
                    
        #         school_id = school_member.school_id
                
        #     # Make sure the user is assigned to the school
        #     school = await db.get(School, school_id)
        #     if not school:
        #         raise NotFoundException("School not found")
        
        # Create user
        user_dict = user_data.model_dump(exclude={"password"})
        user = User(
            **user_dict,
            hashed_password=get_password_hash(user_data.password) if user_data.password else None,
            is_active=True,
            school_id=school_id
        )
        db.add(user)
        await db.flush()
        
        return user
    
    @staticmethod
    async def update_user(
        db: AsyncSession,
        current_user: User,
        user_id: UUID,
        user_data: UserUpdate,
        current_school: Optional[School] = None
    ) -> User:
        """Update a user."""
        user = await UserService.get_user(db, user_id)
        if not user:
            raise NotFoundException("User not found")
            
        # If school admin, check if user belongs to their school
        if current_user.role == UserRole.SCHOOL_ADMIN:
            if not current_school:
                raise PermissionError("School admin must have an associated school")
                
            # # Check if user belongs to the admin's school
            # query = (
            #     select(SchoolMember)
            #     .where(
            #         SchoolMember.user_id == user_id,
            #         SchoolMember.school_id == current_school.id
            #     )
            # )
            # result = await db.execute(query)
            # membership = result.scalar_one_or_none()
            
            # if not membership:
            #     raise PermissionError("User does not belong to your school")
                
            # # School admin cannot change user's role
            # if hasattr(user_data, "role") and user_data.role:
            #     raise PermissionError("School admin cannot change user role")
        
        # Only super admin can change user role
        if hasattr(user_data, "role") and user_data.role and current_user.role != UserRole.SUPER_ADMIN:
            raise PermissionError("Only super admin can change user role")
            
        # Update user fields
        update_data = user_data.model_dump(exclude_unset=True)
        
        # Handle password update
        if "password" in update_data and update_data["password"]:
            user.hashed_password = get_password_hash(update_data.pop("password"))
            
        # Update other fields
        for field, value in update_data.items():
            setattr(user, field, value)
            
        return user
    
    @staticmethod
    async def delete_user(
        db: AsyncSession,
        current_user: User,
        user_id: UUID,
        current_school: Optional[School] = None
    ) -> bool:
        """Soft delete a user."""
        user = await UserService.get_user(db, user_id)
        if not user:
            raise NotFoundException("User not found")
            
        # If school admin, check if user belongs to their school
        if current_user.role == UserRole.SCHOOL_ADMIN:
            if not current_school:
                raise PermissionError("School admin must have an associated school")
                
            # # Check if user belongs to the admin's school
            # query = (
            #     select(SchoolMember)
            #     .where(
            #         SchoolMember.user_id == user_id,
            #         SchoolMember.school_id == current_school.id
            #     )
            # )
            # result = await db.execute(query)
            # membership = result.scalar_one_or_none()
            
            # if not membership:
            #     raise PermissionError("User does not belong to your school")
                
            # # A school admin cannot delete another school admin
            # if membership.role == SchoolRole.ADMIN:
            #     raise PermissionError("School admin cannot delete another school admin")
        
        # Cannot delete yourself
        if user_id == current_user.id:
            raise ValidationError("Cannot delete your own account")
            
        # Soft delete
        user.is_active = False
        
        return True
    
    @staticmethod
    async def list_users(
        db: AsyncSession,
        current_user: User,
        skip: int = 0,
        limit: int = 100,
        role: Optional[UserRole] = None,
        school_id: Optional[UUID] = None,
        search: Optional[str] = None
    ) -> List[User]:
        """List users with filters."""
        query = select(User)
        
        # Filter by role if provided
        if role:
            query = query.where(User.role == role)
            
        # # Filter by school if provided
        # if school_id:
        #     query = (
        #         select(User)
        #         .join(SchoolMember, User.id == SchoolMember.user_id)
        #         .where(SchoolMember.school_id == school_id)
        #         .where(User.is_active == True)
        #     )
            
        # # Add search if provided
        # if search:
        #     search_term = f"%{search}%"
        #     query = query.where(
        #         or_(
        #             User.email.ilike(search_term),
        #             User.first_name.ilike(search_term),
        #             User.last_name.ilike(search_term)
        #         )
        #     )
            
        # Limit results
        query = query.offset(skip).limit(limit)
        
        result = await db.execute(query)
        return list(result.scalars().all()) 