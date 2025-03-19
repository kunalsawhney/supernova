"""Model imports."""

# Base models
from app.models.base_model import BaseModel, TimestampMixin, SoftDeleteMixin
from app.models.scoped_models import SchoolScopedModel, SuperAdminScopedModel

# User and school models
from app.models.user import User, StudentProfile, TeacherProfile
from app.models.school import School, Subscription, SchoolSettings, SubscriptionPlan, SubscriptionStatus

# Enums
from app.models.enums import (
    UserRole, 
    UserStatus, 
    CourseStatus, 
    ContentType,
    DifficultyLevel,
    EnrollmentType,
    EnrollmentStatus,
    PaymentStatus,
    ReviewStatus
)

# Course models
from app.models.course import Course
from app.models.course_version import CourseVersion, CourseContent
from app.models.module import Module
from app.models.lesson import Lesson, LessonQuiz
from app.models.enrollment import CourseEnrollment
from app.models.progress import LessonProgress, UserProgress
from app.models.review import CourseReview
from app.models.purchase import CoursePurchase, CourseLicense

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
    "SubscriptionPlan",
    "SubscriptionStatus",
    
    # Course models and enums
    "Course",
    "CourseContent",
    "Module",
    "Lesson",
    "CourseEnrollment",
    "CourseVersion",
    "LessonProgress",
    "CourseStatus",
    "ContentType",
    "DifficultyLevel",
    "EnrollmentType",
    "EnrollmentStatus",
    "PaymentStatus",
    "ReviewStatus",
    "CourseReview",
    "CourseLicense",
    "LessonQuiz",
    "UserProgress",
    
    # Base model and mixins
    "BaseModel",
    "TimestampMixin",
    "SoftDeleteMixin",
    
    # Scoped models
    "SchoolScopedModel",
    "SuperAdminScopedModel"
] 