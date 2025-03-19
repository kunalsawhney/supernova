"""Service for managing course reviews."""

from datetime import datetime
from typing import List, Optional, Dict, Any
from uuid import UUID

from sqlalchemy import select, func, case, and_
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import joinedload

from app.core.exception_handlers import NotFoundException, ValidationError, PermissionError
from app.models.review import CourseReview, ReviewStatus
from app.models.enrollment import CourseEnrollment
from app.models.user import User, UserRole
from app.schemas.review import ReviewCreate, ReviewUpdate, ReviewStats


class ReviewService:
    """Service for managing course reviews."""
    
    @staticmethod
    async def get_review(
        db: AsyncSession,
        review_id: UUID
    ) -> Optional[CourseReview]:
        """Get a review by ID."""
        query = (
            select(CourseReview)
            .options(joinedload(CourseReview.user))
            .where(CourseReview.id == review_id)
        )
        result = await db.execute(query)
        return result.scalar_one_or_none()
    
    @staticmethod
    async def create_review(
        db: AsyncSession,
        current_user: User,
        review_data: ReviewCreate
    ) -> CourseReview:
        """Create a new course review."""
        # Check if enrollment exists and belongs to the current user
        enrollment = await db.get(CourseEnrollment, review_data.enrollment_id)
        if not enrollment:
            raise NotFoundException("Enrollment not found")
            
        if enrollment.user_id != current_user.id:
            raise PermissionError("You can only review courses you are enrolled in")
            
        # Check if the user has already reviewed this course
        query = (
            select(CourseReview)
            .where(
                CourseReview.enrollment_id == review_data.enrollment_id,
                CourseReview.user_id == current_user.id
            )
        )
        result = await db.execute(query)
        existing_review = result.scalar_one_or_none()
        
        if existing_review:
            raise ValidationError("You have already reviewed this course")
            
        # Create review
        review_dict = review_data.model_dump(exclude={"enrollment_id"})
        review = CourseReview(
            enrollment_id=review_data.enrollment_id,
            user_id=current_user.id,
            course_id=enrollment.course_id,
            status=ReviewStatus.pending,
            **review_dict
        )
        db.add(review)
        await db.flush()
        
        return review
    
    @staticmethod
    async def update_review(
        db: AsyncSession,
        current_user: User,
        review_id: UUID,
        review_data: ReviewUpdate
    ) -> CourseReview:
        """Update a course review."""
        review = await ReviewService.get_review(db, review_id)
        if not review:
            raise NotFoundException("Review not found")
            
        # Check if the review belongs to the current user or user is admin
        if review.user_id != current_user.id and current_user.role != UserRole.SUPER_ADMIN:
            raise PermissionError("You can only update your own reviews")
            
        # If user is updating own review, they cannot change status
        if review.user_id == current_user.id and hasattr(review_data, "status") and review_data.status:
            review_dict = review_data.model_dump(exclude={"status"}, exclude_unset=True)
        else:
            review_dict = review_data.model_dump(exclude_unset=True)
            
            # If admin is changing status, record moderation info
            if hasattr(review_data, "status") and review_data.status and current_user.role == UserRole.SUPER_ADMIN:
                review.moderated_by_id = current_user.id
                review.moderated_at = datetime.utcnow()
        
        # Update review
        for key, value in review_dict.items():
            setattr(review, key, value)
            
        return review
    
    @staticmethod
    async def delete_review(
        db: AsyncSession,
        current_user: User,
        review_id: UUID
    ) -> bool:
        """Delete a course review."""
        review = await ReviewService.get_review(db, review_id)
        if not review:
            raise NotFoundException("Review not found")
            
        # Check if the review belongs to the current user or user is admin
        if review.user_id != current_user.id and current_user.role != UserRole.SUPER_ADMIN:
            raise PermissionError("You can only delete your own reviews")
            
        # Delete review
        await db.delete(review)
        return True
    
    @staticmethod
    async def list_reviews_by_course(
        db: AsyncSession,
        course_id: UUID,
        skip: int = 0,
        limit: int = 20,
        status: Optional[ReviewStatus] = None
    ) -> List[CourseReview]:
        """List reviews for a course."""
        query = (
            select(CourseReview)
            .options(joinedload(CourseReview.user))
            .where(CourseReview.course_id == course_id)
        )
        
        # Filter by status if provided
        if status:
            query = query.where(CourseReview.status == status)
        else:
            # By default, only show approved reviews
            query = query.where(CourseReview.status == ReviewStatus.approved)
            
        # Apply pagination
        query = query.order_by(CourseReview.created_at.desc()).offset(skip).limit(limit)
        
        result = await db.execute(query)
        return list(result.scalars().all())
    
    @staticmethod
    async def list_reviews_by_user(
        db: AsyncSession,
        user_id: UUID,
        skip: int = 0,
        limit: int = 20
    ) -> List[CourseReview]:
        """List reviews by a user."""
        query = (
            select(CourseReview)
            .where(CourseReview.user_id == user_id)
            .order_by(CourseReview.created_at.desc())
            .offset(skip)
            .limit(limit)
        )
        result = await db.execute(query)
        return list(result.scalars().all())
    
    @staticmethod
    async def get_review_by_enrollment(
        db: AsyncSession,
        enrollment_id: UUID
    ) -> Optional[CourseReview]:
        """Get review for a specific enrollment."""
        query = select(CourseReview).where(CourseReview.enrollment_id == enrollment_id)
        result = await db.execute(query)
        return result.scalar_one_or_none()
    
    @staticmethod
    async def get_review_stats(
        db: AsyncSession,
        course_id: UUID
    ) -> ReviewStats:
        """Get review statistics for a course."""
        # Get average rating
        avg_query = (
            select(func.avg(CourseReview.rating).label("avg_rating"))
            .where(
                CourseReview.course_id == course_id,
                CourseReview.status == ReviewStatus.approved
            )
        )
        avg_result = await db.execute(avg_query)
        avg_rating = avg_result.scalar_one_or_none() or 0.0
        
        # Get count of reviews
        count_query = (
            select(func.count(CourseReview.id).label("total_reviews"))
            .where(
                CourseReview.course_id == course_id,
                CourseReview.status == ReviewStatus.approved
            )
        )
        count_result = await db.execute(count_query)
        total_reviews = count_result.scalar_one_or_none() or 0
        
        # Get distribution of ratings
        dist_query = (
            select(
                CourseReview.rating,
                func.count(CourseReview.id).label("count")
            )
            .where(
                CourseReview.course_id == course_id,
                CourseReview.status == ReviewStatus.approved
            )
            .group_by(CourseReview.rating)
        )
        dist_result = await db.execute(dist_query)
        distribution = {str(rating): count for rating, count in dist_result.all()}
        
        # Fill in missing ratings with zeros
        for i in range(1, 6):
            if str(i) not in distribution:
                distribution[str(i)] = 0
                
        # Get average difficulty
        diff_query = (
            select(func.avg(CourseReview.difficulty_rating).label("avg_difficulty"))
            .where(
                CourseReview.course_id == course_id,
                CourseReview.status == ReviewStatus.approved,
                CourseReview.difficulty_rating.isnot(None)
            )
        )
        diff_result = await db.execute(diff_query)
        avg_difficulty = diff_result.scalar_one_or_none()
        
        # Get average engagement
        eng_query = (
            select(func.avg(CourseReview.engagement_rating).label("avg_engagement"))
            .where(
                CourseReview.course_id == course_id,
                CourseReview.status == ReviewStatus.approved,
                CourseReview.engagement_rating.isnot(None)
            )
        )
        eng_result = await db.execute(eng_query)
        avg_engagement = eng_result.scalar_one_or_none()
        
        # Get recommendation percentage
        rec_query = (
            select(
                (func.sum(case((CourseReview.would_recommend == True, 1), else_=0)) * 100.0 / 
                 func.count(CourseReview.id)).label("recommendation_pct")
            )
            .where(
                CourseReview.course_id == course_id,
                CourseReview.status == ReviewStatus.approved,
                CourseReview.would_recommend.isnot(None)
            )
        )
        rec_result = await db.execute(rec_query)
        recommendation_pct = rec_result.scalar_one_or_none()
        
        # Create stats object
        stats = {
            "course_id": course_id,
            "average_rating": float(avg_rating),
            "total_reviews": total_reviews,
            "rating_distribution": distribution,
            "average_difficulty": float(avg_difficulty) if avg_difficulty is not None else None,
            "average_engagement": float(avg_engagement) if avg_engagement is not None else None,
            "recommendation_percentage": float(recommendation_pct) if recommendation_pct is not None else None
        }
        
        return ReviewStats(**stats)
    
    @staticmethod
    async def moderate_review(
        db: AsyncSession,
        current_user: User,
        review_id: UUID,
        status: ReviewStatus
    ) -> CourseReview:
        """Moderate a review (approve, reject, hide)."""
        # Check if user is admin
        if current_user.role != UserRole.SUPER_ADMIN:
            raise PermissionError("Only administrators can moderate reviews")
            
        # Get review
        review = await ReviewService.get_review(db, review_id)
        if not review:
            raise NotFoundException("Review not found")
            
        # Update status
        review.status = status
        review.moderated_by_id = current_user.id
        review.moderated_at = datetime.utcnow()
        
        return review 