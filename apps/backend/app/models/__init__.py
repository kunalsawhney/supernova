"""Model imports."""

from app.models.user import User, StudentProfile, TeacherProfile, UserRole, UserStatus
from app.models.school import School, Subscription, SchoolSettings
from app.models.course import (
    Course,
    CourseContent,
    Module,
    Lesson,
    CourseEnrollment,
    CourseVersion,
    LessonProgress
)
from app.models.base_model import BaseModel
from app.models.scoped_models import SchoolScopedModel, SuperAdminScopedModel

# For Alembic migrations
__all__ = [
    # User models and enums
    "User",
    "StudentProfile",
    "TeacherProfile",
    "UserRole",
    "UserStatus",
    
    # School models and enums
    "School",
    "Subscription",
    "SchoolSettings",
    
    # Course models and enums
    "Course",
    "CourseContent",
    "Module",
    "Lesson",
    "CourseEnrollment",
    "CourseVersion",
    "LessonProgress",
    
    # Base model
    "BaseModel",
    
    # Scoped models
    "SchoolScopedModel",
    "SuperAdminScopedModel"
] 