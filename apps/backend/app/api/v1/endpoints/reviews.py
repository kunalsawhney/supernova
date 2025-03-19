from typing import List, Optional
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, Query, Path
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.dependencies.auth import get_current_user
from app.db.session import get_db
from app.models.user import User, UserRole
from app.models.review import ReviewStatus
from app.schemas.review import (
    ReviewCreate, ReviewUpdate, ReviewResponse, ReviewStats
)
from app.services.review import ReviewService

router = APIRouter()

@router.post("/", response_model=ReviewResponse)
async def create_review(
    *,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
    review_data: ReviewCreate
) -> ReviewResponse:
    """Create a new course review."""
    try:
        review = await ReviewService.create_review(db, current_user, review_data)
        await db.commit()
        await db.refresh(review)
        return ReviewResponse.model_validate(review)
    except Exception as e:
        await db.rollback()
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/course/{course_id}", response_model=List[ReviewResponse])
async def list_reviews_by_course(
    course_id: UUID = Path(...),
    status: Optional[ReviewStatus] = None,
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
) -> List[ReviewResponse]:
    """List reviews for a course."""
    try:
        # If not admin and status is provided, ignore it
        if current_user.role != UserRole.SUPER_ADMIN:
            status = None
            
        reviews = await ReviewService.list_reviews_by_course(
            db, course_id, skip=skip, limit=limit, status=status
        )
        return [ReviewResponse.model_validate(review) for review in reviews]
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/user/{user_id}", response_model=List[ReviewResponse])
async def list_reviews_by_user(
    user_id: UUID = Path(...),
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
) -> List[ReviewResponse]:
    """List reviews by a user."""
    try:
        # Check if user is viewing own reviews or is admin
        if current_user.id != user_id and current_user.role != UserRole.SUPER_ADMIN:
            raise HTTPException(
                status_code=403,
                detail="You don't have permission to view other users' reviews"
            )
            
        reviews = await ReviewService.list_reviews_by_user(
            db, user_id, skip=skip, limit=limit
        )
        return [ReviewResponse.model_validate(review) for review in reviews]
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/enrollment/{enrollment_id}", response_model=ReviewResponse)
async def get_review_by_enrollment(
    enrollment_id: UUID = Path(...),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
) -> ReviewResponse:
    """Get review for a specific enrollment."""
    try:
        review = await ReviewService.get_review_by_enrollment(db, enrollment_id)
        if not review:
            raise HTTPException(status_code=404, detail="Review not found")
            
        # Check if user is viewing own review or is admin
        if current_user.id != review.user_id and current_user.role != UserRole.SUPER_ADMIN:
            raise HTTPException(
                status_code=403,
                detail="You don't have permission to view this review"
            )
            
        return ReviewResponse.model_validate(review)
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/stats/{course_id}", response_model=ReviewStats)
async def get_review_stats(
    course_id: UUID = Path(...),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
) -> ReviewStats:
    """Get review statistics for a course."""
    try:
        stats = await ReviewService.get_review_stats(db, course_id)
        return stats
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/{review_id}", response_model=ReviewResponse)
async def get_review(
    review_id: UUID = Path(...),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
) -> ReviewResponse:
    """Get a specific review."""
    try:
        review = await ReviewService.get_review(db, review_id)
        if not review:
            raise HTTPException(status_code=404, detail="Review not found")
            
        # Check if user is viewing own review, is admin, or review is approved
        if (current_user.id != review.user_id 
                and current_user.role != UserRole.SUPER_ADMIN
                and review.status != ReviewStatus.approved):
            raise HTTPException(
                status_code=403,
                detail="You don't have permission to view this review"
            )
            
        return ReviewResponse.model_validate(review)
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.patch("/{review_id}", response_model=ReviewResponse)
async def update_review(
    *,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
    review_id: UUID = Path(...),
    review_data: ReviewUpdate
) -> ReviewResponse:
    """Update a review."""
    try:
        review = await ReviewService.update_review(db, current_user, review_id, review_data)
        await db.commit()
        await db.refresh(review)
        return ReviewResponse.model_validate(review)
    except Exception as e:
        await db.rollback()
        raise HTTPException(status_code=400, detail=str(e))

@router.delete("/{review_id}", response_model=dict)
async def delete_review(
    *,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
    review_id: UUID = Path(...)
) -> dict:
    """Delete a review."""
    try:
        result = await ReviewService.delete_review(db, current_user, review_id)
        if result:
            await db.commit()
            return {"success": True, "message": "Review deleted successfully"}
        return {"success": False, "message": "Failed to delete review"}
    except Exception as e:
        await db.rollback()
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/{review_id}/moderate", response_model=ReviewResponse)
async def moderate_review(
    *,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
    review_id: UUID = Path(...),
    status: ReviewStatus
) -> ReviewResponse:
    """Moderate a review (approve, reject, hide)."""
    try:
        if current_user.role != UserRole.SUPER_ADMIN:
            raise HTTPException(
                status_code=403,
                detail="Only administrators can moderate reviews"
            )
            
        review = await ReviewService.moderate_review(db, current_user, review_id, status)
        await db.commit()
        await db.refresh(review)
        return ReviewResponse.model_validate(review)
    except Exception as e:
        await db.rollback()
        raise HTTPException(status_code=400, detail=str(e)) 