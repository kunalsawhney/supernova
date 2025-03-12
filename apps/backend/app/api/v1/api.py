from fastapi import APIRouter

from app.api.v1.endpoints import auth, schools, users, courses, enrollments, admin

api_router = APIRouter()

api_router.include_router(auth.router, prefix="/auth", tags=["authentication"])
api_router.include_router(schools.router, prefix="/schools", tags=["schools"])
api_router.include_router(users.router, prefix="/users", tags=["users"])
api_router.include_router(
    courses.router,
    prefix="/courses",
    tags=["courses"],
    responses={404: {"description": "Not found"}},
)
api_router.include_router(
    enrollments.router,
    prefix="/enrollments",
    tags=["enrollments"],
    responses={404: {"description": "Not found"}},
)
api_router.include_router(
    admin.router,
    prefix="/admin",
    tags=["admin"],
    responses={404: {"description": "Not found"}},
) 