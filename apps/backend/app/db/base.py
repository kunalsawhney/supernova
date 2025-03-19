"""SQLAlchemy model imports for Alembic autogenerate support."""

from app.db.base_class import Base  # noqa

# Import all models for Alembic
from app.models.base_model import BaseModel  # noqa
from app.models.scoped_models import SchoolScopedModel, SuperAdminScopedModel  # noqa
from app.models.user import User, StudentProfile, TeacherProfile  # noqa
from app.models.school import School, Subscription, SchoolSettings  # noqa
from app.models.course import (  # noqa
    Course,
    # CourseVersion,
    # CourseContent,
    # CourseLicense,
    # CourseReview,
    # CourseEnrollment,
    # Module,
    # Lesson,
    # LessonProgress,
    # UserProgress,
    # CoursePurchase,
    # LessonQuiz
)
from app.models.course_version import CourseVersion, CourseContent
from app.models.module import Module
from app.models.lesson import Lesson
from app.models.enrollment import CourseEnrollment
from app.models.purchase import CoursePurchase
from app.models.review import CourseReview
from app.models.progress import LessonProgress, UserProgress
from app.models.purchase import CourseLicense

__all__ = ['Base', 'BaseModel'] 