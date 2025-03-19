from typing import List, Optional, Tuple
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.dependencies.auth import get_current_user
from app.db.session import get_db
from app.schemas.enrollment import (
    StudentEnrollmentCreate, IndividualEnrollmentCreate,
    EnrollmentUpdate, ProgressCreate,
    EnrollmentResponse, EnrollmentWithProgressResponse,
    ProgressResponse
)
from app.models.user import User
from app.models.enums import EnrollmentStatus
from app.services.enrollment import EnrollmentService

router = APIRouter()

@router.post("/student", response_model=EnrollmentResponse)
async def create_student_enrollment(
    *,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
    enrollment_data: StudentEnrollmentCreate
) -> EnrollmentResponse:
    """Create a new student enrollment."""
    try:
        enrollment = await EnrollmentService.create_student_enrollment(
            db, current_user, enrollment_data
        )
        await db.commit()
        return EnrollmentResponse.model_validate(enrollment)
    except Exception as e:
        await db.rollback()
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/individual", response_model=EnrollmentResponse)
async def create_individual_enrollment(
    *,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
    enrollment_data: IndividualEnrollmentCreate
) -> EnrollmentResponse:
    """Create a new individual enrollment."""
    try:
        enrollment = await EnrollmentService.create_individual_enrollment(
            db, current_user, enrollment_data
        )
        await db.commit()
        return EnrollmentResponse.model_validate(enrollment)
    except Exception as e:
        await db.rollback()
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/", response_model=List[EnrollmentResponse])
async def list_enrollments(
    *,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
    course_id: Optional[UUID] = None,
    status: Optional[EnrollmentStatus] = None,
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=100)
) -> List[EnrollmentResponse]:
    """List enrollments with optional filters."""
    enrollments = await EnrollmentService.list_enrollments(
        db, current_user, course_id, status, skip, limit
    )
    return [EnrollmentResponse.model_validate(e) for e in enrollments]

@router.put("/{enrollment_id}/status", response_model=EnrollmentResponse)
async def update_enrollment_status(
    enrollment_id: UUID,
    *,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
    status: EnrollmentStatus
) -> EnrollmentResponse:
    """Update enrollment status."""
    try:
        enrollment = await EnrollmentService.update_enrollment_status(
            db, current_user, enrollment_id, status
        )
        await db.commit()
        return EnrollmentResponse.model_validate(enrollment)
    except Exception as e:
        await db.rollback()
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/progress", response_model=ProgressResponse)
async def update_progress(
    *,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
    progress_data: ProgressCreate
) -> ProgressResponse:
    """Update progress for an enrollment."""
    try:
        progress = await EnrollmentService.update_progress(
            db, current_user, progress_data
        )
        await db.commit()
        return ProgressResponse.model_validate(progress)
    except Exception as e:
        await db.rollback()
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/{enrollment_id}/progress", response_model=EnrollmentWithProgressResponse)
async def get_enrollment_progress(
    enrollment_id: UUID,
    *,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
) -> EnrollmentWithProgressResponse:
    """Get enrollment progress."""
    enrollment = await EnrollmentService.get_enrollment_progress(
        db, current_user, enrollment_id
    )
    return EnrollmentWithProgressResponse.model_validate(enrollment) 