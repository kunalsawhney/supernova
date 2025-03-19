from fastapi import APIRouter

from app.api.v1.endpoints import (
    auth,
    schools,
    users,
    courses,
    enrollments,
    admin,
    modules,
    lessons,
    reviews,
    purchases
)

api_router = APIRouter()

api_router.include_router(
    auth.router, 
    prefix="/auth", 
    tags=["authentication"],
    responses={404: {"description": "Not found"}},
)
api_router.include_router(
    schools.router, 
    prefix="/schools", 
    tags=["schools"],
    responses={404: {"description": "Not found"}},
)
api_router.include_router(
    users.router, 
    prefix="/users", 
    tags=["users"],
    responses={404: {"description": "Not found"}},
)
api_router.include_router(
    courses.router,
    prefix="/courses",
    tags=["courses"],
    responses={404: {"description": "Not found"}},
)
api_router.include_router(
    modules.router,
    prefix="/modules",
    tags=["modules"],
    responses={404: {"description": "Not found"}},
)
api_router.include_router(
    lessons.router,
    prefix="/lessons",
    tags=["lessons"],
    responses={404: {"description": "Not found"}},
)
api_router.include_router(
    enrollments.router,
    prefix="/enrollments",
    tags=["enrollments"],
    responses={404: {"description": "Not found"}},
)
api_router.include_router(
    reviews.router,
    prefix="/reviews",
    tags=["reviews"],
    responses={404: {"description": "Not found"}},
)
api_router.include_router(
    purchases.router,
    prefix="/purchases",
    tags=["purchases"],
    responses={404: {"description": "Not found"}},
)
api_router.include_router(
    admin.router,
    prefix="/admin",
    tags=["admin"],
    responses={404: {"description": "Not found"}},
) 