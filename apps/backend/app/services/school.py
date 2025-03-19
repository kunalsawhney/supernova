"""Service for managing schools and school memberships."""

from typing import List, Optional, Dict, Any
from uuid import UUID

from sqlalchemy import select, and_, or_
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import joinedload

from app.core.exception_handlers import NotFoundException, ValidationError, PermissionError
from app.models.school import School
from app.models.user import User, UserRole
from app.schemas.school import SchoolCreate, SchoolUpdate
from app.security.authentication import get_password_hash


class SchoolService:
    """Service for managing schools and school memberships."""
    
    @staticmethod
    async def get_school(
        db: AsyncSession,
        school_id: UUID,
        with_members: bool = False
    ) -> Optional[School]:
        """Get a school by ID."""
        query = select(School).where(School.id == school_id)
        
        if with_members:
            query = query.options(
                joinedload(School.members)
            )
            
        result = await db.execute(query)
        return result.scalar_one_or_none()
    
    # @staticmethod
    # async def get_school_with_stats(
    #     db: AsyncSession,
    #     school_id: UUID
    # ) -> Dict[str, Any]:
    #     """Get a school with statistics."""
    #     school = await SchoolService.get_school(db, school_id, with_members=True)
    #     if not school:
    #         raise NotFoundException("School not found")
            
    #     # Count members by role
    #     role_counts = {}
    #     for role in SchoolRole:
    #         role_counts[role.name] = 0
            
    #     for member in school.members:
    #         if member.role.name in role_counts:
    #             role_counts[member.role.name] += 1
                
    #     # Get enrollment stats
    #     from app.services.enrollment import EnrollmentService
    #     enrollment_stats = await EnrollmentService.get_school_enrollment_stats(db, school_id)
        
    #     # Combine stats
    #     stats = {
    #         "school": school,
    #         "member_count": len(school.members),
    #         "member_roles": role_counts,
    #         "enrollment_stats": enrollment_stats
    #     }
        
    #     return stats
    
    @staticmethod
    async def create_school(
        db: AsyncSession,
        current_user: User,
        school_data: SchoolCreate
    ) -> School:
        """Create a new school."""
        # Only super admins can create schools
        if current_user.role != UserRole.SUPER_ADMIN:
            raise PermissionError("Only super admins can create schools")
            
        # Create school
        school_dict = school_data.model_dump()
        school = School(**school_dict)
        db.add(school)
        await db.flush()
        
        # Create school admin user
        admin_data = school_data.admin.model_dump()
        admin = User(
            email=admin_data["email"],
            hashed_password=get_password_hash(admin_data["password"]),
            first_name=admin_data["first_name"],
            last_name=admin_data["last_name"],
            role=UserRole.SCHOOL_ADMIN,
            school_id=school.id,
        )
        db.add(admin)
        await db.commit()
        await db.refresh(school)
        
        return school
    
    @staticmethod
    async def update_school(
        db: AsyncSession,
        current_user: User,
        school_id: UUID,
        school_data: SchoolUpdate
    ) -> School:
        """Update a school."""
        school = await SchoolService.get_school(db, school_id)
        if not school:
            raise NotFoundException("School not found")
            
        # Check permissions - either super admin or school admin
        if current_user.role != UserRole.SUPER_ADMIN:
            # Check if user is school admin
            # query = (
            #     select(SchoolMember)
            #     .where(
            #         SchoolMember.school_id == school_id,
            #         SchoolMember.user_id == current_user.id,
            #         SchoolMember.role == SchoolRole.ADMIN
            #     )
            # )
            # result = await db.execute(query)
            # is_school_admin = result.scalar_one_or_none() is not None
            
            # if not is_school_admin:
            raise PermissionError("Only admins can update school")
        
        # Update school
        school_dict = school_data.model_dump(exclude_unset=True)
        for field, value in school_dict.items():
            setattr(school, field, value)
            
        return school
    
    @staticmethod
    async def delete_school(
        db: AsyncSession,
        current_user: User,
        school_id: UUID
    ) -> bool:
        """Soft delete a school."""
        school = await SchoolService.get_school(db, school_id)
        if not school:
            raise NotFoundException("School not found")
            
        # Only super admins can delete schools
        if current_user.role != UserRole.SUPER_ADMIN:
            raise PermissionError("Only super admins can delete schools")
            
        # Soft delete - mark as inactive
        school.is_active = False
        
        return True
    
    @staticmethod
    async def list_schools(
        db: AsyncSession,
        current_user: User,
        skip: int = 0,
        limit: int = 100,
        search: Optional[str] = None,
        include_inactive: bool = False
    ) -> List[School]:
        """List schools with filters."""
        query = select(School)
        
        # Filter active schools unless specifically requested
        if not include_inactive:
            query = query.where(School.is_active == True)
            
        # Add search if provided
        if search:
            search_term = f"%{search}%"
            query = query.where(
                or_(
                    School.name.ilike(search_term),
                    School.description.ilike(search_term),
                    School.country.ilike(search_term),
                    School.city.ilike(search_term)
                )
            )
            
        # # For non-super-admins, limit to schools they belong to
        # if current_user.role != UserRole.SUPER_ADMIN:
        #     query = (
        #         select(School)
        #         .join(SchoolMember, School.id == SchoolMember.school_id)
        #         .where(SchoolMember.user_id == current_user.id)
        #     )
            
        #     if not include_inactive:
        #         query = query.where(School.is_active == True)
                
        #     if search:
        #         search_term = f"%{search}%"
        #         query = query.where(
        #             or_(
        #                 School.name.ilike(search_term),
        #                 School.description.ilike(search_term),
        #                 School.country.ilike(search_term),
        #                 School.city.ilike(search_term)
        #             )
        #         )
            
        # Limit results
        query = query.offset(skip).limit(limit)
        
        result = await db.execute(query)
        return list(result.scalars().all())
    
    # School membership methods
    
    # @staticmethod
    # async def add_school_member(
    #     db: AsyncSession,
    #     current_user: User,
    #     school_id: UUID,
    #     user_id: UUID,
    #     role: SchoolRole
    # ) -> SchoolMember:
    #     """Add a user to a school."""
    #     # Check if school exists
    #     school = await SchoolService.get_school(db, school_id)
    #     if not school:
    #         raise NotFoundException("School not found")
            
    #     # Check if user exists
    #     from app.services.user import UserService
    #     user = await UserService.get_user(db, user_id)
    #     if not user:
    #         raise NotFoundException("User not found")
            
    #     # Check permissions
    #     if current_user.role != UserRole.SUPER_ADMIN:
    #         # Check if current user is school admin
    #         query = (
    #             select(SchoolMember)
    #             .where(
    #                 SchoolMember.school_id == school_id,
    #                 SchoolMember.user_id == current_user.id,
    #                 SchoolMember.role == SchoolRole.ADMIN
    #             )
    #         )
    #         result = await db.execute(query)
    #         is_school_admin = result.scalar_one_or_none() is not None
            
    #         if not is_school_admin:
    #             raise PermissionError("Only school admins can add members")
                
    #         # School admins cannot add other admins
    #         if role == SchoolRole.ADMIN:
    #             raise PermissionError("School admins cannot add other admins")
                
    #     # Check if user is already a member
    #     query = (
    #         select(SchoolMember)
    #         .where(
    #             SchoolMember.school_id == school_id,
    #             SchoolMember.user_id == user_id
    #         )
    #     )
    #     result = await db.execute(query)
    #     existing_member = result.scalar_one_or_none()
        
    #     if existing_member:
    #         # Update role if needed
    #         if existing_member.role != role:
    #             existing_member.role = role
    #             return existing_member
    #         else:
    #             raise ValidationError("User is already a member of this school")
                
    #     # Create membership
    #     member = SchoolMember(
    #         school_id=school_id,
    #         user_id=user_id,
    #         role=role
    #     )
    #     db.add(member)
    #     await db.flush()
        
    #     return member
    
    # @staticmethod
    # async def remove_school_member(
    #     db: AsyncSession,
    #     current_user: User,
    #     school_id: UUID,
    #     user_id: UUID
    # ) -> bool:
    #     """Remove a user from a school."""
    #     # Check if school exists
    #     school = await SchoolService.get_school(db, school_id)
    #     if not school:
    #         raise NotFoundException("School not found")
            
    #     # Check if membership exists
    #     query = (
    #         select(SchoolMember)
    #         .where(
    #             SchoolMember.school_id == school_id,
    #             SchoolMember.user_id == user_id
    #         )
    #     )
    #     result = await db.execute(query)
    #     member = result.scalar_one_or_none()
        
    #     if not member:
    #         raise NotFoundException("User is not a member of this school")
            
    #     # Check permissions
    #     if current_user.role != UserRole.SUPER_ADMIN:
    #         # Check if current user is school admin
    #         query = (
    #             select(SchoolMember)
    #             .where(
    #                 SchoolMember.school_id == school_id,
    #                 SchoolMember.user_id == current_user.id,
    #                 SchoolMember.role == SchoolRole.ADMIN
    #             )
    #         )
    #         result = await db.execute(query)
    #         is_school_admin = result.scalar_one_or_none() is not None
            
    #         if not is_school_admin:
    #             raise PermissionError("Only school admins can remove members")
                
    #         # School admins cannot remove other admins
    #         if member.role == SchoolRole.ADMIN:
    #             raise PermissionError("School admins cannot remove other admins")
                
    #         # Cannot remove yourself
    #         if member.user_id == current_user.id:
    #             raise ValidationError("Cannot remove yourself from the school")
                
    #     # Remove membership
    #     await db.delete(member)
        
    #     return True
    
    # @staticmethod
    # async def update_school_member_role(
    #     db: AsyncSession,
    #     current_user: User,
    #     school_id: UUID,
    #     user_id: UUID,
    #     role: SchoolRole
    # ) -> SchoolMember:
    #     """Update a school member's role."""
    #     # Check if school exists
    #     school = await SchoolService.get_school(db, school_id)
    #     if not school:
    #         raise NotFoundException("School not found")
            
    #     # Check if membership exists
    #     query = (
    #         select(SchoolMember)
    #         .where(
    #             SchoolMember.school_id == school_id,
    #             SchoolMember.user_id == user_id
    #         )
    #     )
    #     result = await db.execute(query)
    #     member = result.scalar_one_or_none()
        
    #     if not member:
    #         raise NotFoundException("User is not a member of this school")
            
    #     # Check permissions
    #     if current_user.role != UserRole.SUPER_ADMIN:
    #         raise PermissionError("Only super admins can change member roles")
            
    #     # Update role
    #     member.role = role
        
    #     return member
    
    # @staticmethod
    # async def list_school_members(
    #     db: AsyncSession,
    #     current_user: User,
    #     school_id: UUID,
    #     role: Optional[SchoolRole] = None,
    #     skip: int = 0,
    #     limit: int = 100
    # ) -> List[SchoolMember]:
    #     """List members of a school."""
    #     # Check if school exists
    #     school = await SchoolService.get_school(db, school_id)
    #     if not school:
    #         raise NotFoundException("School not found")
            
    #     # Check permissions
    #     has_access = False
    #     if current_user.role == UserRole.SUPER_ADMIN:
    #         has_access = True
    #     else:
    #         # Check if current user is a member of this school
    #         query = (
    #             select(SchoolMember)
    #             .where(
    #                 SchoolMember.school_id == school_id,
    #                 SchoolMember.user_id == current_user.id
    #             )
    #         )
    #         result = await db.execute(query)
    #         member = result.scalar_one_or_none()
    #         has_access = member is not None
            
    #     if not has_access:
    #         raise PermissionError("You don't have access to this school")
            
    #     # Get members
    #     query = (
    #         select(SchoolMember)
    #         .options(joinedload(SchoolMember.user))
    #         .where(SchoolMember.school_id == school_id)
    #     )
        
    #     if role:
    #         query = query.where(SchoolMember.role == role)
            
    #     query = query.offset(skip).limit(limit)
        
    #     result = await db.execute(query)
    #     return list(result.scalars().all()) 