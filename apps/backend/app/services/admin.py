"""Service for performing administrative operations."""

from typing import List, Dict, Any, Optional
from uuid import UUID

from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.exception_handlers import NotFoundException, ValidationError, PermissionError
from app.models.user import User, UserRole, UserStatus
from app.models.school import School
from app.models.course import Course
from app.models.purchase import CoursePurchase
from app.schemas.user import UserCreate, UserUpdate
from app.security.password import get_password_hash


class AdminService:
    """Service for performing administrative operations."""
    
    @staticmethod
    async def get_platform_stats(
        db: AsyncSession,
        current_user: User
    ) -> Dict[str, Any]:
        """Get platform-wide statistics."""
        # Check permissions
        if current_user.role != UserRole.SUPER_ADMIN:
            raise PermissionError("Only super admins can access platform statistics")
            
        # Get total users
        users_query = select(func.count()).select_from(User)
        users_result = await db.execute(users_query)
        total_users = users_result.scalar()
        
        # Get total schools
        schools_query = select(func.count()).select_from(School)
        schools_result = await db.execute(schools_query)
        total_schools = schools_result.scalar()

        # Get revenue from course purchases
        revenue_query = select(
            func.sum(CoursePurchase.amount_paid)
        ).select_from(CoursePurchase).where(
            CoursePurchase.payment_status == 'completed'
        )
        revenue_result = await db.execute(revenue_query)
        total_revenue = revenue_result.scalar() or 0

        # Get active users percentage
        active_users_query = select(
            func.count()
        ).select_from(User).where(
            User.is_active == True
        )
        active_users_result = await db.execute(active_users_query)
        active_users = active_users_result.scalar()
        active_users_percentage = round(
            (active_users / total_users * 100) if total_users > 0 else 0, 
            1
        )
        
        return {
            "totalUsers": total_users,
            "totalSchools": total_schools,
            "totalRevenue": f"${total_revenue:,.2f}",
            "activeUsers": f"{active_users_percentage}%",
        }
    
    @staticmethod
    async def get_system_health(
        db: AsyncSession,
        current_user: User
    ) -> Dict[str, Any]:
        """Get system health metrics."""
        # Check permissions
        if current_user.role != UserRole.SUPER_ADMIN:
            raise PermissionError("Only super admins can access system health metrics")
            
        # In a real application, these metrics would come from monitoring services
        # For now, we return mock data as the actual implementation would be dependent
        # on the specific monitoring setup
        return {
            "serverStatus": "Operational",
            "uptime": "99.9%",
            "responseTime": "120ms",
            "activeConnections": 1250,
            "cpuUsage": "45%",
            "memoryUsage": "60%",
            "storageUsed": "45%",
            "lastBackup": "2024-03-15 03:00 AM"
        }
    
    @staticmethod
    async def list_users(
        db: AsyncSession,
        current_user: User,
        skip: int = 0,
        limit: int = 100,
        role: Optional[UserRole] = None,
        search: Optional[str] = None
    ) -> List[User]:
        """List all users with optional filters."""
        # Check permissions
        if current_user.role != UserRole.SUPER_ADMIN:
            raise PermissionError("Only super admins can list all users")
            
        query = select(User)
        
        # Apply filters
        if role:
            query = query.where(User.role == role)
            
        if search:
            search_term = f"%{search}%"
            query = query.where(
                (User.email.ilike(search_term)) |
                (User.first_name.ilike(search_term)) |
                (User.last_name.ilike(search_term))
            )
            
        # Apply pagination
        query = query.offset(skip).limit(limit)
        
        result = await db.execute(query)
        return list(result.scalars().all())
    
    @staticmethod
    async def create_admin_user(
        db: AsyncSession,
        current_user: User,
        user_data: UserCreate
    ) -> User:
        """Create a new administrative user."""
        # Check permissions
        if current_user.role != UserRole.SUPER_ADMIN:
            raise PermissionError("Only super admins can create admin users")
            
        # Check if email already exists
        existing_user = await db.scalar(
            select(User).where(User.email == user_data.email)
        )
        if existing_user:
            raise ValidationError("Email already registered")
            
        # Create new user
        user_dict = user_data.model_dump(exclude={"password"})
        user = User(**user_dict)
        user.hashed_password = get_password_hash(user_data.password)
        
        # Ensure admin user has appropriate role
        if user.role not in [UserRole.SUPER_ADMIN, UserRole.SCHOOL_ADMIN]:
            raise ValidationError("Admin users must have SUPER_ADMIN or SCHOOL_ADMIN role")
            
        db.add(user)
        await db.flush()
        
        return user
    
    @staticmethod
    async def update_user_status(
        db: AsyncSession,
        current_user: User,
        user_id: UUID,
        new_status: UserStatus,
        active: bool = True
    ) -> User:
        """Update a user's status (suspend/reinstate)."""
        # Check permissions
        if current_user.role != UserRole.SUPER_ADMIN:
            raise PermissionError("Only super admins can update user status")
            
        # Get the user
        user = await db.get(User, user_id)
        if not user:
            raise NotFoundException("User not found")
            
        # Update status
        user.status = new_status
        user.is_active = active
        
        await db.flush()
        return user
    
    @staticmethod
    async def get_content_stats(
        db: AsyncSession,
        current_user: User
    ) -> Dict[str, Any]:
        """Get statistics about platform content."""
        # Check permissions
        if current_user.role not in [UserRole.SUPER_ADMIN, UserRole.SCHOOL_ADMIN]:
            raise PermissionError("Only admin users can access content statistics")
            
        # Get total courses
        courses_query = select(func.count()).select_from(Course)
        
        # For school admins, limit to their school
        if current_user.role == UserRole.SCHOOL_ADMIN and current_user.school_id:
            courses_query = courses_query.where(Course.school_id == current_user.school_id)
            
        courses_result = await db.execute(courses_query)
        total_courses = courses_result.scalar()
        
        # Get active courses
        active_courses_query = select(func.count()).select_from(Course).where(
            Course.is_active == True
        )
        
        draft_courses_query = select(func.count()).select_from(Course).where(
            Course.status == 'draft'
        )

        draft_courses_result = await db.execute(draft_courses_query)
        draft_courses = draft_courses_result.scalar()

        # For school admins, limit to their school
        if current_user.role == UserRole.SCHOOL_ADMIN and current_user.school_id:
            active_courses_query = active_courses_query.where(
                Course.school_id == current_user.school_id
            )
            
        active_courses_result = await db.execute(active_courses_query)
        active_courses = active_courses_result.scalar()
        
        # Calculate average course rating
        # In a real scenario, you'd join with the reviews table
        # Simplified version for now
        avg_rating = 4.2  # Mock value

        return {
            "total_courses": total_courses,
            "published_courses": active_courses,
            "draft_courses": draft_courses,
            "average_rating": avg_rating,
        } 