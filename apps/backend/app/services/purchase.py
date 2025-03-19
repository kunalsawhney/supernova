"""Service for managing course purchases and licenses."""

from datetime import datetime
from typing import List, Optional, Dict, Any
from uuid import UUID

from sqlalchemy import select, func, and_, or_
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import joinedload

from app.core.exception_handlers import NotFoundException, ValidationError, PermissionError
from app.models.purchase import CoursePurchase, CourseLicense
from app.models.course import Course
from app.models.school import School
from app.models.enrollment import CourseEnrollment
from app.models.user import User, UserRole
from app.models.enums import PaymentStatus
from app.schemas.purchase import (
    CoursePurchaseCreate, CoursePurchaseUpdate,
    CourseLicenseCreate, CourseLicenseUpdate, PurchaseSummary
)


class PurchaseService:
    """Service for managing course purchases and licenses."""
    
    @staticmethod
    async def get_purchase(
        db: AsyncSession,
        purchase_id: UUID
    ) -> Optional[CoursePurchase]:
        """Get a purchase by ID."""
        query = (
            select(CoursePurchase)
            .options(
                joinedload(CoursePurchase.course),
                joinedload(CoursePurchase.user)
            )
            .where(CoursePurchase.id == purchase_id)
        )
        result = await db.execute(query)
        return result.scalar_one_or_none()
    
    @staticmethod
    async def create_purchase(
        db: AsyncSession,
        current_user: User,
        purchase_data: CoursePurchaseCreate
    ) -> CoursePurchase:
        """Create a new course purchase."""
        # Check if course exists
        course = await db.get(Course, purchase_data.course_id)
        if not course:
            raise NotFoundException("Course not found")
            
        # Check if user exists
        user = await db.get(User, purchase_data.user_id)
        if not user:
            raise NotFoundException("User not found")
            
        # Check if current user is super admin or creating purchase for self
        if current_user.role != UserRole.SUPER_ADMIN and current_user.id != purchase_data.user_id:
            raise PermissionError("You don't have permission to create purchases for other users")
            
        # Check if user already has an active purchase for this course
        query = (
            select(CoursePurchase)
            .where(
                CoursePurchase.course_id == purchase_data.course_id,
                CoursePurchase.user_id == purchase_data.user_id,
                CoursePurchase.payment_status == PaymentStatus.completed,
                or_(
                    CoursePurchase.valid_until.is_(None),
                    CoursePurchase.valid_until > datetime.utcnow()
                )
            )
        )
        result = await db.execute(query)
        existing_purchase = result.scalar_one_or_none()
        
        if existing_purchase:
            raise ValidationError("User already has an active purchase for this course")
            
        # Create purchase
        purchase_dict = purchase_data.model_dump()
        purchase = CoursePurchase(**purchase_dict)
        db.add(purchase)
        await db.flush()
        
        return purchase
    
    @staticmethod
    async def update_purchase(
        db: AsyncSession,
        current_user: User,
        purchase_id: UUID,
        purchase_data: CoursePurchaseUpdate
    ) -> CoursePurchase:
        """Update a course purchase."""
        purchase = await PurchaseService.get_purchase(db, purchase_id)
        if not purchase:
            raise NotFoundException("Purchase not found")
            
        # Only super admin can update purchases
        if current_user.role != UserRole.SUPER_ADMIN:
            raise PermissionError("Only administrators can update purchases")
            
        # Update purchase
        purchase_dict = purchase_data.model_dump(exclude_unset=True)
        for key, value in purchase_dict.items():
            setattr(purchase, key, value)
            
        return purchase
    
    @staticmethod
    async def list_purchases_by_course(
        db: AsyncSession,
        course_id: UUID,
        status: Optional[PaymentStatus] = None,
        skip: int = 0,
        limit: int = 20
    ) -> List[CoursePurchase]:
        """List purchases for a course."""
        query = (
            select(CoursePurchase)
            .options(joinedload(CoursePurchase.user))
            .where(CoursePurchase.course_id == course_id)
        )
        
        if status:
            query = query.where(CoursePurchase.payment_status == status)
            
        query = query.order_by(CoursePurchase.purchase_date.desc()).offset(skip).limit(limit)
        
        result = await db.execute(query)
        return list(result.scalars().all())
    
    @staticmethod
    async def list_purchases_by_user(
        db: AsyncSession,
        user_id: UUID,
        status: Optional[PaymentStatus] = None,
        active_only: bool = False,
        skip: int = 0,
        limit: int = 20
    ) -> List[CoursePurchase]:
        """List purchases by a user."""
        query = (
            select(CoursePurchase)
            .options(joinedload(CoursePurchase.course))
            .where(CoursePurchase.user_id == user_id)
        )
        
        if status:
            query = query.where(CoursePurchase.payment_status == status)
            
        if active_only:
            query = query.where(
                CoursePurchase.payment_status == PaymentStatus.completed,
                or_(
                    CoursePurchase.valid_until.is_(None),
                    CoursePurchase.valid_until > datetime.utcnow()
                )
            )
            
        query = query.order_by(CoursePurchase.purchase_date.desc()).offset(skip).limit(limit)
        
        result = await db.execute(query)
        return list(result.scalars().all())
    
    @staticmethod
    async def get_purchase_summary(
        db: AsyncSession,
        user_id: UUID
    ) -> PurchaseSummary:
        """Get purchase summary for a user."""
        # Count active purchases
        active_query = (
            select(func.count(CoursePurchase.id))
            .where(
                CoursePurchase.user_id == user_id,
                CoursePurchase.payment_status == PaymentStatus.completed,
                or_(
                    CoursePurchase.valid_until.is_(None),
                    CoursePurchase.valid_until > datetime.utcnow()
                )
            )
        )
        active_result = await db.execute(active_query)
        active_count = active_result.scalar_one()
        
        # Count expired purchases
        expired_query = (
            select(func.count(CoursePurchase.id))
            .where(
                CoursePurchase.user_id == user_id,
                CoursePurchase.payment_status == PaymentStatus.completed,
                CoursePurchase.valid_until <= datetime.utcnow()
            )
        )
        expired_result = await db.execute(expired_query)
        expired_count = expired_result.scalar_one()
        
        # Get total spent
        total_query = (
            select(func.sum(CoursePurchase.amount_paid))
            .where(
                CoursePurchase.user_id == user_id,
                CoursePurchase.payment_status == PaymentStatus.completed
            )
        )
        total_result = await db.execute(total_query)
        total_spent = total_result.scalar_one() or 0.0
        
        # Get purchases by currency
        currency_query = (
            select(
                CoursePurchase.currency,
                func.sum(CoursePurchase.amount_paid)
            )
            .where(
                CoursePurchase.user_id == user_id,
                CoursePurchase.payment_status == PaymentStatus.completed
            )
            .group_by(CoursePurchase.currency)
        )
        currency_result = await db.execute(currency_query)
        by_currency = {str(currency): float(total) for currency, total in currency_result.all()}
        
        # Get recent purchases
        recent_query = (
            select(CoursePurchase)
            .options(joinedload(CoursePurchase.course))
            .where(
                CoursePurchase.user_id == user_id,
                CoursePurchase.payment_status == PaymentStatus.completed
            )
            .order_by(CoursePurchase.purchase_date.desc())
            .limit(5)
        )
        recent_result = await db.execute(recent_query)
        recent_purchases = list(recent_result.scalars().all())
        
        # Create summary
        summary = PurchaseSummary(
            user_id=user_id,
            active_purchases=active_count,
            expired_purchases=expired_count,
            total_spent=float(total_spent),
            purchases_by_currency=by_currency,
            recently_purchased_courses=recent_purchases
        )
        
        return summary
    
    # License methods
    
    @staticmethod
    async def get_license(
        db: AsyncSession,
        license_id: UUID
    ) -> Optional[CourseLicense]:
        """Get a license by ID."""
        query = (
            select(CourseLicense)
            .options(
                joinedload(CourseLicense.course),
                joinedload(CourseLicense.school),
                joinedload(CourseLicense.granted_by)
            )
            .where(CourseLicense.id == license_id)
        )
        result = await db.execute(query)
        return result.scalar_one_or_none()
    
    @staticmethod
    async def create_license(
        db: AsyncSession,
        current_user: User,
        license_data: CourseLicenseCreate
    ) -> CourseLicense:
        """Create a new course license."""
        # Check if course exists
        course = await db.get(Course, license_data.course_id)
        if not course:
            raise NotFoundException("Course not found")
            
        # Check if school exists
        school = await db.get(School, license_data.school_id)
        if not school:
            raise NotFoundException("School not found")
            
        # Check if user is super admin
        if current_user.role != UserRole.SUPER_ADMIN:
            raise PermissionError("Only administrators can create course licenses")
            
        # Create license
        license_dict = license_data.model_dump()
        license = CourseLicense(**license_dict)
        db.add(license)
        await db.flush()
        
        return license
    
    @staticmethod
    async def update_license(
        db: AsyncSession,
        current_user: User,
        license_id: UUID,
        license_data: CourseLicenseUpdate
    ) -> CourseLicense:
        """Update a course license."""
        license = await PurchaseService.get_license(db, license_id)
        if not license:
            raise NotFoundException("License not found")
            
        # Only super admin can update licenses
        if current_user.role != UserRole.SUPER_ADMIN:
            raise PermissionError("Only administrators can update licenses")
            
        # Update license
        license_dict = license_data.model_dump(exclude_unset=True)
        for key, value in license_dict.items():
            setattr(license, key, value)
            
        return license
    
    @staticmethod
    async def list_licenses_by_course(
        db: AsyncSession,
        course_id: UUID,
        active_only: bool = False,
        skip: int = 0,
        limit: int = 20
    ) -> List[CourseLicense]:
        """List licenses for a course."""
        query = (
            select(CourseLicense)
            .options(joinedload(CourseLicense.school))
            .where(CourseLicense.course_id == course_id)
        )
        
        if active_only:
            now = datetime.utcnow()
            query = query.where(
                CourseLicense.is_active == True,
                CourseLicense.valid_from <= now,
                or_(
                    CourseLicense.valid_until.is_(None),
                    CourseLicense.valid_until > now
                )
            )
            
        query = query.order_by(CourseLicense.valid_from.desc()).offset(skip).limit(limit)
        
        result = await db.execute(query)
        return list(result.scalars().all())
    
    @staticmethod
    async def list_licenses_by_school(
        db: AsyncSession,
        school_id: UUID,
        active_only: bool = False,
        skip: int = 0,
        limit: int = 20
    ) -> List[CourseLicense]:
        """List licenses for a school."""
        query = (
            select(CourseLicense)
            .options(joinedload(CourseLicense.course))
            .where(CourseLicense.school_id == school_id)
        )
        
        if active_only:
            now = datetime.utcnow()
            query = query.where(
                CourseLicense.is_active == True,
                CourseLicense.valid_from <= now,
                or_(
                    CourseLicense.valid_until.is_(None),
                    CourseLicense.valid_until > now
                )
            )
            
        query = query.order_by(CourseLicense.valid_from.desc()).offset(skip).limit(limit)
        
        result = await db.execute(query)
        return list(result.scalars().all())
    
    @staticmethod
    async def get_license_with_enrollment_count(
        db: AsyncSession,
        license_id: UUID
    ) -> Optional[Dict[str, Any]]:
        """Get a license with enrollment count."""
        # Get license
        license = await PurchaseService.get_license(db, license_id)
        if not license:
            return None
            
        # Count enrollments
        count_query = (
            select(func.count(CourseEnrollment.id))
            .where(
                CourseEnrollment.course_id == license.course_id,
                CourseEnrollment.school_id == license.school_id,
                CourseEnrollment.is_active == True
            )
        )
        count_result = await db.execute(count_query)
        enrollment_count = count_result.scalar_one()
        
        # Create response
        license_dict = {
            "license": license,
            "enrolled_student_count": enrollment_count
        }
        
        return license_dict
    
    @staticmethod
    async def check_license_validity(
        db: AsyncSession,
        course_id: UUID,
        school_id: UUID
    ) -> Optional[CourseLicense]:
        """Check if a school has a valid license for a course."""
        now = datetime.utcnow()
        query = (
            select(CourseLicense)
            .where(
                CourseLicense.course_id == course_id,
                CourseLicense.school_id == school_id,
                CourseLicense.is_active == True,
                CourseLicense.valid_from <= now,
                or_(
                    CourseLicense.valid_until.is_(None),
                    CourseLicense.valid_until > now
                )
            )
            .order_by(CourseLicense.valid_from.desc())
        )
        result = await db.execute(query)
        return result.scalar_one_or_none() 