from typing import List, Optional, Dict, Any
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, Query, Path
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.dependencies.auth import get_current_user
from app.db.session import get_db
from app.models.user import User, UserRole
from app.models.enums import PaymentStatus
from app.schemas.purchase import (
    CoursePurchaseCreate, CoursePurchaseUpdate, CoursePurchaseResponse,
    CourseLicenseCreate, CourseLicenseUpdate, CourseLicenseResponse,
    PurchaseSummary
)
from app.services.purchase import PurchaseService

router = APIRouter()

# Purchase endpoints

@router.post("/", response_model=CoursePurchaseResponse)
async def create_purchase(
    *,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
    purchase_data: CoursePurchaseCreate
) -> CoursePurchaseResponse:
    """Create a new course purchase."""
    try:
        purchase = await PurchaseService.create_purchase(db, current_user, purchase_data)
        await db.commit()
        await db.refresh(purchase)
        return CoursePurchaseResponse.model_validate(purchase)
    except Exception as e:
        await db.rollback()
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/course/{course_id}", response_model=List[CoursePurchaseResponse])
async def list_purchases_by_course(
    course_id: UUID = Path(...),
    status: Optional[PaymentStatus] = None,
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
) -> List[CoursePurchaseResponse]:
    """List purchases for a course."""
    try:
        # Only admins can view purchases for a course
        if current_user.role != UserRole.SUPER_ADMIN:
            raise HTTPException(
                status_code=403,
                detail="Only administrators can view course purchases"
            )
            
        purchases = await PurchaseService.list_purchases_by_course(
            db, course_id, status=status, skip=skip, limit=limit
        )
        return [CoursePurchaseResponse.model_validate(purchase) for purchase in purchases]
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/user/{user_id}", response_model=List[CoursePurchaseResponse])
async def list_purchases_by_user(
    user_id: UUID = Path(...),
    status: Optional[PaymentStatus] = None,
    active_only: bool = Query(False),
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
) -> List[CoursePurchaseResponse]:
    """List purchases by a user."""
    try:
        # Check if user is viewing own purchases or is admin
        if current_user.id != user_id and current_user.role != UserRole.SUPER_ADMIN:
            raise HTTPException(
                status_code=403,
                detail="You don't have permission to view other users' purchases"
            )
            
        purchases = await PurchaseService.list_purchases_by_user(
            db, user_id, status=status, active_only=active_only, skip=skip, limit=limit
        )
        return [CoursePurchaseResponse.model_validate(purchase) for purchase in purchases]
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/summary/{user_id}", response_model=PurchaseSummary)
async def get_purchase_summary(
    user_id: UUID = Path(...),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
) -> PurchaseSummary:
    """Get purchase summary for a user."""
    try:
        # Check if user is viewing own summary or is admin
        if current_user.id != user_id and current_user.role != UserRole.SUPER_ADMIN:
            raise HTTPException(
                status_code=403,
                detail="You don't have permission to view other users' purchase summary"
            )
            
        summary = await PurchaseService.get_purchase_summary(db, user_id)
        return summary
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/{purchase_id}", response_model=CoursePurchaseResponse)
async def get_purchase(
    purchase_id: UUID = Path(...),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
) -> CoursePurchaseResponse:
    """Get a specific purchase."""
    try:
        purchase = await PurchaseService.get_purchase(db, purchase_id)
        if not purchase:
            raise HTTPException(status_code=404, detail="Purchase not found")
            
        # Check if user is viewing own purchase or is admin
        if current_user.id != purchase.user_id and current_user.role != UserRole.SUPER_ADMIN:
            raise HTTPException(
                status_code=403,
                detail="You don't have permission to view this purchase"
            )
            
        return CoursePurchaseResponse.model_validate(purchase)
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.patch("/{purchase_id}", response_model=CoursePurchaseResponse)
async def update_purchase(
    *,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
    purchase_id: UUID = Path(...),
    purchase_data: CoursePurchaseUpdate
) -> CoursePurchaseResponse:
    """Update a purchase."""
    try:
        # Only admins can update purchases
        if current_user.role != UserRole.SUPER_ADMIN:
            raise HTTPException(
                status_code=403,
                detail="Only administrators can update purchases"
            )
            
        purchase = await PurchaseService.update_purchase(db, current_user, purchase_id, purchase_data)
        await db.commit()
        await db.refresh(purchase)
        return CoursePurchaseResponse.model_validate(purchase)
    except HTTPException:
        raise
    except Exception as e:
        await db.rollback()
        raise HTTPException(status_code=400, detail=str(e))

# License endpoints

@router.post("/licenses/", response_model=CourseLicenseResponse)
async def create_license(
    *,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
    license_data: CourseLicenseCreate
) -> CourseLicenseResponse:
    """Create a new course license."""
    try:
        # Only admins can create licenses
        if current_user.role != UserRole.SUPER_ADMIN:
            raise HTTPException(
                status_code=403,
                detail="Only administrators can create licenses"
            )
            
        license = await PurchaseService.create_license(db, current_user, license_data)
        await db.commit()
        await db.refresh(license)
        return CourseLicenseResponse.model_validate(license)
    except HTTPException:
        raise
    except Exception as e:
        await db.rollback()
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/licenses/course/{course_id}", response_model=List[CourseLicenseResponse])
async def list_licenses_by_course(
    course_id: UUID = Path(...),
    active_only: bool = Query(False),
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
) -> List[CourseLicenseResponse]:
    """List licenses for a course."""
    try:
        # Only admins can view licenses for a course
        if current_user.role != UserRole.SUPER_ADMIN:
            raise HTTPException(
                status_code=403,
                detail="Only administrators can view course licenses"
            )
            
        licenses = await PurchaseService.list_licenses_by_course(
            db, course_id, active_only=active_only, skip=skip, limit=limit
        )
        
        # Get enrollment counts for each license
        license_responses = []
        for license in licenses:
            license_with_count = await PurchaseService.get_license_with_enrollment_count(db, license.id)
            if license_with_count:
                license_obj = license_with_count["license"]
                license_obj.enrolled_student_count = license_with_count["enrolled_student_count"]
                license_responses.append(CourseLicenseResponse.model_validate(license_obj))
                
        return license_responses
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/licenses/school/{school_id}", response_model=List[CourseLicenseResponse])
async def list_licenses_by_school(
    school_id: UUID = Path(...),
    active_only: bool = Query(False),
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
) -> List[CourseLicenseResponse]:
    """List licenses for a school."""
    try:
        # Only admins can view licenses for a school
        if current_user.role != UserRole.SUPER_ADMIN:
            # TO-DO: Add check for school admin (when implemented)
            raise HTTPException(
                status_code=403,
                detail="Only administrators can view school licenses"
            )
            
        licenses = await PurchaseService.list_licenses_by_school(
            db, school_id, active_only=active_only, skip=skip, limit=limit
        )
        
        # Get enrollment counts for each license
        license_responses = []
        for license in licenses:
            license_with_count = await PurchaseService.get_license_with_enrollment_count(db, license.id)
            if license_with_count:
                license_obj = license_with_count["license"]
                license_obj.enrolled_student_count = license_with_count["enrolled_student_count"]
                license_responses.append(CourseLicenseResponse.model_validate(license_obj))
                
        return license_responses
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/licenses/{license_id}", response_model=CourseLicenseResponse)
async def get_license(
    license_id: UUID = Path(...),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
) -> CourseLicenseResponse:
    """Get a specific license."""
    try:
        # Only admins can view licenses
        if current_user.role != UserRole.SUPER_ADMIN:
            # TO-DO: Add check for school admin (when implemented)
            raise HTTPException(
                status_code=403,
                detail="Only administrators can view licenses"
            )
            
        license_with_count = await PurchaseService.get_license_with_enrollment_count(db, license_id)
        if not license_with_count:
            raise HTTPException(status_code=404, detail="License not found")
            
        license_obj = license_with_count["license"]
        license_obj.enrolled_student_count = license_with_count["enrolled_student_count"]
        return CourseLicenseResponse.model_validate(license_obj)
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.patch("/licenses/{license_id}", response_model=CourseLicenseResponse)
async def update_license(
    *,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
    license_id: UUID = Path(...),
    license_data: CourseLicenseUpdate
) -> CourseLicenseResponse:
    """Update a license."""
    try:
        # Only admins can update licenses
        if current_user.role != UserRole.SUPER_ADMIN:
            raise HTTPException(
                status_code=403,
                detail="Only administrators can update licenses"
            )
            
        license = await PurchaseService.update_license(db, current_user, license_id, license_data)
        await db.commit()
        await db.refresh(license)
        return CourseLicenseResponse.model_validate(license)
    except HTTPException:
        raise
    except Exception as e:
        await db.rollback()
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/licenses/check/{course_id}/{school_id}", response_model=Dict[str, Any])
async def check_license_validity(
    course_id: UUID = Path(...),
    school_id: UUID = Path(...),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
) -> Dict[str, Any]:
    """Check if a school has a valid license for a course."""
    try:
        license = await PurchaseService.check_license_validity(db, course_id, school_id)
        if license:
            return {
                "valid": True,
                "license_id": license.id,
                "valid_until": license.valid_until,
                "max_students": license.max_students
            }
        return {"valid": False}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e)) 