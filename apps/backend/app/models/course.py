from datetime import datetime
from enum import Enum
from typing import Optional, List
from uuid import UUID

from sqlalchemy import Boolean, DateTime, ForeignKey, String, Text, text, Integer, CheckConstraint, Index
from sqlalchemy.dialects.postgresql import ENUM, JSONB, UUID as PgUUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base_model import BaseModel
from app.models.scoped_models import SuperAdminScopedModel, SchoolScopedModel


class CourseStatus(str, Enum):
    DRAFT = "draft"
    PUBLISHED = "published"
    ARCHIVED = "archived"

class ContentType(str, Enum):
    TEXT = "text"
    PRESENTATION = "presentation"
    VIDEO = "video"
    AUDIO = "audio"

class DifficultyLevel(str, Enum):
    BEGINNER = "beginner"
    INTERMEDIATE = "intermediate"
    ADVANCED = "advanced"

class EnrollmentType(str, Enum):
    B2B = "b2b"
    D2C = "d2c"

class EnrollmentStatus(str, Enum):
    ENROLLED = "enrolled"
    IN_PROGRESS = "in_progress"
    COMPLETED = "completed"
    DROPPED = "dropped"
    SUSPENDED = "suspended"

class PaymentStatus(str, Enum):
    PENDING = "pending"
    COMPLETED = "completed"
    FAILED = "failed"
    REFUNDED = "refunded"
    CANCELLED = "cancelled"

class ReviewStatus(str, Enum):
    PENDING = "pending"
    VERIFIED = "verified"
    APPROVED = "approved"
    REJECTED = "rejected"
    HIDDEN = "hidden"

class Course(SuperAdminScopedModel):
    """Course model for managing course metadata and business rules."""
    
    __tablename__ = "courses"
    __mapper_args__ = {
        "polymorphic_identity": "course"
    }

    created_by = relationship(
        "User",
        back_populates="created_courses",
        primaryjoin="User.id==Course.created_by_id",
        viewonly=True
    )

    title: Mapped[str] = mapped_column(String(255), nullable=False)
    description: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    code: Mapped[str] = mapped_column(String(50), nullable=False, unique=True)
    status: Mapped[str] = mapped_column(
        ENUM(*[e.value for e in CourseStatus], name="course_status", create_type=False),
        nullable=False,
        index=True,
        comment="Status of the course: draft, published, or archived"
    )
    cover_image_url: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    settings: Mapped[Optional[dict]] = mapped_column(JSONB, nullable=True)

    # Enhanced metadata
    difficulty_level: Mapped[str] = mapped_column(
        ENUM(*[e.value for e in DifficultyLevel], name="difficulty_level", create_type=False),
        nullable=False,
        server_default=text("'beginner'")
    )
    tags: Mapped[Optional[List[str]]] = mapped_column(JSONB, nullable=True)
    estimated_duration: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)  # in hours
    learning_objectives: Mapped[Optional[List[str]]] = mapped_column(JSONB, nullable=True)
    target_audience: Mapped[Optional[List[str]]] = mapped_column(JSONB, nullable=True)
    
    # Business rules
    prerequisites: Mapped[Optional[List[str]]] = mapped_column(JSONB, nullable=True)
    completion_criteria: Mapped[Optional[dict]] = mapped_column(JSONB, nullable=True)
    grade_level: Mapped[str] = mapped_column(String(20), nullable=False)
    academic_year: Mapped[str] = mapped_column(String(20), nullable=False)
    sequence_number: Mapped[int] = mapped_column(Integer, nullable=False)

    # Pricing for D2C
    base_price: Mapped[Optional[float]] = mapped_column(nullable=True)
    currency: Mapped[Optional[str]] = mapped_column(String(3), nullable=True)
    pricing_type: Mapped[Optional[str]] = mapped_column(String(20), nullable=True)  # one-time, subscription
    
    # Relationships
    versions = relationship(
        "CourseVersion",
        back_populates="course",
        cascade="all, delete-orphan",
        foreign_keys="CourseVersion.course_id"
    )
    licenses = relationship(
        "CourseLicense",
        back_populates="course",
        cascade="all, delete-orphan",
        foreign_keys="CourseLicense.course_id"
    )
    enrollments = relationship(
        "CourseEnrollment",
        back_populates="course",
        cascade="all, delete-orphan",
        foreign_keys="CourseEnrollment.course_id"
    )
    purchases = relationship(
        "CoursePurchase",
        back_populates="course",
        cascade="all, delete-orphan",
        foreign_keys="CoursePurchase.course_id"
    )

class CourseVersion(BaseModel):
    """Course version model for managing different versions of course content."""
    
    __tablename__ = "course_versions"

    id: Mapped[UUID] = mapped_column(
        PgUUID(as_uuid=True), primary_key=True, server_default=text("gen_random_uuid()")
    )
    course_id: Mapped[UUID] = mapped_column(
        PgUUID(as_uuid=True), ForeignKey("courses.id", ondelete="CASCADE"), nullable=False
    )
    version: Mapped[str] = mapped_column(String(20), nullable=False)
    content_id: Mapped[UUID] = mapped_column(
        PgUUID(as_uuid=True), ForeignKey("course_contents.id", ondelete="RESTRICT"), nullable=False
    )
    valid_from: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False)
    valid_until: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True), nullable=True)
    changelog: Mapped[Optional[dict]] = mapped_column(JSONB, nullable=True)

    # Relationships
    course = relationship("Course", back_populates="versions")
    content = relationship("CourseContent", back_populates="versions", viewonly=True)
    enrollments = relationship("CourseEnrollment", back_populates="version")

class CourseContent(BaseModel):
    """Course content model for managing the actual course materials."""
    
    __tablename__ = "course_contents"

    id: Mapped[UUID] = mapped_column(
        PgUUID(as_uuid=True), primary_key=True, server_default=text("gen_random_uuid()")
    )
    syllabus_url: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    start_date: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False)
    end_date: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False)
    duration_weeks: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)
    
    # Enhanced content management
    content_status: Mapped[str] = mapped_column(
        ENUM(*[e.value for e in CourseStatus], name="course_status", create_type=False),
        nullable=False,
        server_default=text("'draft'")
    )
    last_reviewed_by_id: Mapped[Optional[UUID]] = mapped_column(
        PgUUID(as_uuid=True), ForeignKey("users.id", ondelete="SET NULL"), nullable=True
    )
    last_reviewed_at: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True), nullable=True)
    resources: Mapped[Optional[List[dict]]] = mapped_column(JSONB, nullable=True)  # Additional materials
    
    # Relationships
    versions = relationship("CourseVersion", back_populates="content")
    modules = relationship("Module", back_populates="content", cascade="all, delete-orphan")
    last_reviewed_by = relationship(
        "User",
        back_populates="reviewed_courses",
        foreign_keys=[last_reviewed_by_id],
        viewonly=True
    )

class CourseLicense(SchoolScopedModel):
    """Course license for schools."""
    
    __tablename__ = "course_licenses"

    id: Mapped[UUID] = mapped_column(
        PgUUID(as_uuid=True), primary_key=True, server_default=text("gen_random_uuid()")
    )
    course_id: Mapped[UUID] = mapped_column(
        PgUUID(as_uuid=True), ForeignKey("courses.id", ondelete="CASCADE"), nullable=False
    )
    school_id: Mapped[UUID] = mapped_column(
        PgUUID(as_uuid=True), ForeignKey("schools.id", ondelete="CASCADE"), nullable=False
    )
    granted_by_id: Mapped[UUID] = mapped_column(
        PgUUID(as_uuid=True), ForeignKey("users.id", ondelete="RESTRICT"), nullable=False
    )
    valid_from: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False)
    valid_until: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True), nullable=True)
    max_students: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)

    # Relationships
    course = relationship("Course", back_populates="licenses", viewonly=True)
    school = relationship("School", back_populates="course_licenses")
    granted_by = relationship(
        "User",
        back_populates="granted_licenses",
        foreign_keys=[granted_by_id],
        viewonly=True
    )

class CourseReview(BaseModel):
    """Course review and feedback from students."""
    
    __tablename__ = "course_reviews"

    id: Mapped[UUID] = mapped_column(
        PgUUID(as_uuid=True), primary_key=True, server_default=text("gen_random_uuid()")
    )
    enrollment_id: Mapped[UUID] = mapped_column(
        PgUUID(as_uuid=True), ForeignKey("course_enrollments.id", ondelete="CASCADE"), nullable=False
    )
    rating: Mapped[int] = mapped_column(Integer, nullable=False)  # 1-5 stars
    review_text: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    pros: Mapped[Optional[List[str]]] = mapped_column(JSONB, nullable=True)
    cons: Mapped[Optional[List[str]]] = mapped_column(JSONB, nullable=True)
    would_recommend: Mapped[Optional[bool]] = mapped_column(Boolean, nullable=True)
    difficulty_rating: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)  # 1-5 scale
    engagement_rating: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)  # 1-5 scale
    is_featured: Mapped[bool] = mapped_column(Boolean, nullable=False, server_default=text("false"))
    moderated_by_id: Mapped[Optional[UUID]] = mapped_column(
        PgUUID(as_uuid=True), ForeignKey("users.id", ondelete="SET NULL"), nullable=True
    )
    moderated_at: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True), nullable=True)
    status: Mapped[str] = mapped_column(
        ENUM(*[e.value for e in ReviewStatus], name="review_status", create_type=False),
        nullable=False,
        server_default=text("'pending'"),
        comment="Status of the review: pending, verified, approved, rejected, or hidden"
    )

    # Relationships
    enrollment = relationship("CourseEnrollment", back_populates="review", viewonly=True)
    moderated_by = relationship(
        "User",
        back_populates="moderated_reviews",
        foreign_keys=[moderated_by_id],
        viewonly=True
    )

    __table_args__ = (
        CheckConstraint('rating >= 1 AND rating <= 5', name='rating_range_check'),
        CheckConstraint(
            '(difficulty_rating IS NULL) OR (difficulty_rating >= 1 AND difficulty_rating <= 5)', 
            name='difficulty_rating_range_check'
        ),
        CheckConstraint(
            '(engagement_rating IS NULL) OR (engagement_rating >= 1 AND engagement_rating <= 5)',
            name='engagement_rating_range_check'
        ),
    )

class CourseEnrollment(BaseModel):
    """Course enrollment model."""
    
    __tablename__ = "course_enrollments"

    id: Mapped[UUID] = mapped_column(
        PgUUID(as_uuid=True), primary_key=True, server_default=text("gen_random_uuid()")
    )
    course_id: Mapped[UUID] = mapped_column(
        PgUUID(as_uuid=True), ForeignKey("courses.id", ondelete="CASCADE"), nullable=False
    )
    version_id: Mapped[UUID] = mapped_column(
        PgUUID(as_uuid=True), ForeignKey("course_versions.id", ondelete="RESTRICT"), nullable=False
    )
    student_id: Mapped[Optional[UUID]] = mapped_column(
        PgUUID(as_uuid=True), ForeignKey("student_profiles.id", ondelete="CASCADE"), nullable=True
    )
    individual_user_id: Mapped[Optional[UUID]] = mapped_column(
        PgUUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=True
    )
    enrolled_by_id: Mapped[UUID] = mapped_column(
        PgUUID(as_uuid=True), ForeignKey("users.id", ondelete="RESTRICT"), nullable=False
    )
    enrollment_type: Mapped[str] = mapped_column(
        ENUM(*[e.value for e in EnrollmentType], name="enrollment_type", create_type=False),
        nullable=False
    )
    status: Mapped[str] = mapped_column(
        ENUM(*[e.value for e in EnrollmentStatus], name="enrollment_status", create_type=False),
        nullable=False,
        server_default=text("'enrolled'")
    )
    enrolled_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), nullable=False, server_default=text("now()")
    )
    completed_at: Mapped[Optional[datetime]] = mapped_column(
        DateTime(timezone=True), nullable=True
    )
    progress: Mapped[float] = mapped_column(nullable=False, server_default=text("0.0"))
    last_activity_at: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True), nullable=True)

    # Completion details
    certificate_id: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)
    certificate_url: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    completion_score: Mapped[Optional[float]] = mapped_column(nullable=True)
    badges_earned: Mapped[Optional[List[dict]]] = mapped_column(JSONB, nullable=True)
    completion_metadata: Mapped[Optional[dict]] = mapped_column(JSONB, nullable=True)

    # Relationships
    course = relationship("Course", back_populates="enrollments", viewonly=True)
    version = relationship("CourseVersion", back_populates="enrollments", viewonly=True)
    student = relationship("StudentProfile", back_populates="enrollments", viewonly=True)
    individual_user = relationship(
        "User",
        back_populates="individual_enrollments",
        foreign_keys=[individual_user_id],
        viewonly=True
    )
    enrolled_by = relationship(
        "User",
        back_populates="enrollments_created",
        foreign_keys=[enrolled_by_id],
        viewonly=True
    )
    progress_records = relationship("UserProgress", back_populates="enrollment", cascade="all, delete-orphan")
    review = relationship("CourseReview", back_populates="enrollment", uselist=False, cascade="all, delete-orphan")

    __table_args__ = (
        # Ensure either student_id or individual_user_id is set, but not both
        CheckConstraint(
            "(student_id IS NOT NULL AND individual_user_id IS NULL AND enrollment_type = 'b2b') OR "
            "(student_id IS NULL AND individual_user_id IS NOT NULL AND enrollment_type = 'd2c')",
            name="enrollment_type_check"
        ),
    )

class Module(BaseModel):
    """Module model."""
    
    __tablename__ = "modules"

    id: Mapped[UUID] = mapped_column(
        PgUUID(as_uuid=True), primary_key=True, server_default=text("gen_random_uuid()")
    )
    content_id: Mapped[UUID] = mapped_column(
        PgUUID(as_uuid=True), ForeignKey("course_contents.id", ondelete="CASCADE"), nullable=False
    )
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    description: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    sequence_number: Mapped[int] = mapped_column(Integer, nullable=False)
    duration_weeks: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)
    status: Mapped[str] = mapped_column(
        ENUM(*[e.value for e in CourseStatus], name="course_status", create_type=False),
        nullable=False,
        server_default=text("'draft'")
    )
    completion_criteria: Mapped[Optional[dict]] = mapped_column(JSONB, nullable=True)
    is_mandatory: Mapped[bool] = mapped_column(Boolean, nullable=False, server_default=text("true"))

    # Relationships
    content = relationship("CourseContent", back_populates="modules", viewonly=True)
    lessons = relationship("Lesson", back_populates="module", cascade="all, delete-orphan")

class Lesson(BaseModel):
    """Lesson model."""
    
    __tablename__ = "lessons"

    id: Mapped[UUID] = mapped_column(
        PgUUID(as_uuid=True), primary_key=True, server_default=text("gen_random_uuid()")
    )
    module_id: Mapped[UUID] = mapped_column(
        PgUUID(as_uuid=True), ForeignKey("modules.id", ondelete="CASCADE"), nullable=False
    )
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    description: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    sequence_number: Mapped[int] = mapped_column(Integer, nullable=False)
    content_type: Mapped[str] = mapped_column(
        ENUM(*[e.value for e in ContentType], name="content_type", create_type=False),
        nullable=False
    )
    content: Mapped[dict] = mapped_column(JSONB, nullable=False)
    duration_minutes: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)
    is_mandatory: Mapped[bool] = mapped_column(Boolean, nullable=False, server_default=text("true"))
    completion_criteria: Mapped[Optional[dict]] = mapped_column(JSONB, nullable=True)

    # Relationships
    module = relationship("Module", back_populates="lessons", viewonly=True)
    quiz = relationship("LessonQuiz", back_populates="lesson", uselist=False)
    progress_records = relationship("LessonProgress", back_populates="lesson", cascade="all, delete-orphan")

class LessonProgress(BaseModel):
    """Lesson progress model."""
    
    __tablename__ = "lesson_progress"

    id: Mapped[UUID] = mapped_column(
        PgUUID(as_uuid=True), primary_key=True, server_default=text("gen_random_uuid()")
    )
    lesson_id: Mapped[UUID] = mapped_column(
        PgUUID(as_uuid=True), ForeignKey("lessons.id", ondelete="CASCADE"), nullable=False
    )
    student_id: Mapped[Optional[UUID]] = mapped_column(
        PgUUID(as_uuid=True), ForeignKey("student_profiles.id", ondelete="CASCADE"), nullable=True
    )
    individual_user_id: Mapped[Optional[UUID]] = mapped_column(
        PgUUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=True
    )
    status: Mapped[str] = mapped_column(
        String(20), nullable=False, server_default=text("'not_started'")
    )
    progress: Mapped[float] = mapped_column(nullable=False, server_default=text("0.0"))
    started_at: Mapped[Optional[datetime]] = mapped_column(
        DateTime(timezone=True), nullable=True
    )
    completed_at: Mapped[Optional[datetime]] = mapped_column(
        DateTime(timezone=True), nullable=True
    )
    last_interaction: Mapped[Optional[datetime]] = mapped_column(
        DateTime(timezone=True), nullable=True
    )
    time_spent_seconds: Mapped[int] = mapped_column(Integer, nullable=False, server_default=text("0"))

    # Relationships
    lesson = relationship("Lesson", back_populates="progress_records", viewonly=True)
    student = relationship(
        "StudentProfile",
        back_populates="progress_records",
        foreign_keys=[student_id],
        viewonly=True
    )
    individual_user = relationship(
        "User",
        back_populates="lesson_progress",
        foreign_keys=[individual_user_id],
        viewonly=True
    )

    __table_args__ = (
        # Ensure either student_id or individual_user_id is set, but not both
        CheckConstraint(
            "(student_id IS NOT NULL AND individual_user_id IS NULL) OR "
            "(student_id IS NULL AND individual_user_id IS NOT NULL)",
            name="student_or_individual_user_progress_check"
        ),
    )

class UserProgress(BaseModel):
    """Unified progress tracking for both B2B and D2C users.
    
    This model uses polymorphic relationships to track progress across different content types:
    - Courses: Overall course progress
    - Modules: Progress within a module
    - Lessons: Individual lesson progress
    
    The polymorphic relationship is managed through content_type and content_id fields.
    No foreign key constraints are added because the content could be in different tables,
    but application-level validation ensures referential integrity.
    """
    
    __tablename__ = "user_progress"

    id: Mapped[UUID] = mapped_column(
        PgUUID(as_uuid=True), primary_key=True, server_default=text("gen_random_uuid()")
    )
    enrollment_id: Mapped[UUID] = mapped_column(
        PgUUID(as_uuid=True), ForeignKey("course_enrollments.id", ondelete="CASCADE"), nullable=False
    )
    content_type: Mapped[str] = mapped_column(
        String(20), 
        nullable=False,
        comment="Type of content being tracked: 'course', 'module', or 'lesson'"
    )
    content_id: Mapped[UUID] = mapped_column(
        PgUUID(as_uuid=True), 
        nullable=False,
        comment="UUID of the content (course_id, module_id, or lesson_id)"
    )
    status: Mapped[str] = mapped_column(
        String(20), nullable=False, server_default=text("'not_started'")
    )
    progress: Mapped[float] = mapped_column(
        nullable=False, 
        server_default=text("0.0"),
        comment="Progress value between 0.0 and 1.0"
    )
    started_at: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True), nullable=True)
    completed_at: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True), nullable=True)
    last_interaction: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True), nullable=True)
    time_spent_seconds: Mapped[int] = mapped_column(Integer, nullable=False, server_default=text("0"))
    progress_metadata: Mapped[Optional[dict]] = mapped_column(
        JSONB, 
        nullable=True,
        comment="Additional metadata specific to the content type"
    )

    # Relationships
    enrollment = relationship("CourseEnrollment", back_populates="progress_records", viewonly=True)

    __table_args__ = (
        CheckConstraint(
            "content_type IN ('course', 'module', 'lesson')",
            name="valid_content_type_check"
        ),
        CheckConstraint(
            "progress >= 0.0 AND progress <= 1.0",
            name="progress_range_check"
        ),
        # Create an index on content_type and content_id for faster lookups
        Index('idx_user_progress_content', 'content_type', 'content_id'),
    )

class CoursePurchase(BaseModel):
    """Track individual course purchases for D2C users."""
    
    __tablename__ = "course_purchases"

    id: Mapped[UUID] = mapped_column(
        PgUUID(as_uuid=True), primary_key=True, server_default=text("gen_random_uuid()")
    )
    course_id: Mapped[UUID] = mapped_column(
        PgUUID(as_uuid=True), ForeignKey("courses.id", ondelete="RESTRICT"), nullable=False
    )
    user_id: Mapped[UUID] = mapped_column(
        PgUUID(as_uuid=True), ForeignKey("users.id", ondelete="RESTRICT"), nullable=False
    )
    amount_paid: Mapped[float] = mapped_column(nullable=False)
    currency: Mapped[str] = mapped_column(String(3), nullable=False)
    payment_method: Mapped[dict] = mapped_column(JSONB, nullable=False)
    payment_status: Mapped[str] = mapped_column(
        ENUM(*[e.value for e in PaymentStatus], name="payment_status", create_type=False),
        nullable=False,
        server_default=text("'pending'")
    )
    purchase_date: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False)
    valid_until: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True), nullable=True)

    # Relationships
    course = relationship("Course", back_populates="purchases", viewonly=True)
    user = relationship("User", back_populates="course_purchases", viewonly=True)

class LessonQuiz(BaseModel):
    """Quiz model for lessons."""
    
    __tablename__ = "lesson_quizzes"

    id: Mapped[UUID] = mapped_column(
        PgUUID(as_uuid=True), primary_key=True, server_default=text("gen_random_uuid()")
    )
    lesson_id: Mapped[UUID] = mapped_column(
        PgUUID(as_uuid=True), ForeignKey("lessons.id", ondelete="CASCADE"), nullable=False
    )
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    description: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    questions: Mapped[List[dict]] = mapped_column(
        JSONB,
        nullable=False,
        comment="List of questions with their options and correct answers"
    )
    settings: Mapped[Optional[dict]] = mapped_column(
        JSONB,
        nullable=True,
        comment="Quiz settings like time limit, passing score, etc."
    )
    is_mandatory: Mapped[bool] = mapped_column(
        Boolean,
        nullable=False,
        server_default=text("true"),
        comment="Whether passing this quiz is required for lesson completion"
    )
    passing_score: Mapped[float] = mapped_column(
        nullable=False,
        server_default=text("0.7"),
        comment="Minimum score (0.0-1.0) required to pass the quiz"
    )
    max_attempts: Mapped[Optional[int]] = mapped_column(
        Integer,
        nullable=True,
        comment="Maximum number of attempts allowed, null for unlimited"
    )

    # Relationships
    lesson = relationship("Lesson", back_populates="quiz", viewonly=True)

    __table_args__ = (
        CheckConstraint(
            'passing_score >= 0.0 AND passing_score <= 1.0',
            name='passing_score_range_check'
        ),
        CheckConstraint(
            'max_attempts IS NULL OR max_attempts > 0',
            name='max_attempts_check'
        ),
    ) 