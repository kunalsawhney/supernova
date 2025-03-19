"""Schema modules for the Learning Management System."""

# Import all schemas for easier access
from app.schemas.auth import (
    Token, TokenData, Login, PasswordReset, PasswordResetRequest
)
from app.schemas.shared import BaseSchema
from app.schemas.user import (
    UserBase, UserCreate, UserUpdate, UserInDB
)
from app.schemas.course import (
    CourseBase, CourseCreate, CourseUpdate, CourseInDB, CourseResponse
)
from app.schemas.course_version import (
    CourseContentBase, CourseContentCreate, CourseContentUpdate, CourseContentInDB, CourseContentResponse,
    CourseVersionResponse, CourseWithContentResponse
)
from app.schemas.module import (
    ModuleBase, ModuleCreate, ModuleUpdate, ModuleInDB, ModuleResponse, LessonSummary
)
from app.schemas.lesson import (
    LessonBase, LessonCreate, LessonUpdate, LessonInDB, LessonResponse,
    ResourceBase, ResourceCreate, ResourceInDB, ResourceResponse
)
from app.schemas.school import (
    SchoolBase, SchoolCreate, SchoolUpdate
)
from app.schemas.enrollment import (
    EnrollmentBase, EnrollmentUpdate, EnrollmentResponse
)
from app.schemas.progress import (
    ModuleProgressResponse, LessonProgressResponse
)
from app.schemas.purchase import (
    CoursePurchaseBase, CoursePurchaseCreate, CoursePurchaseUpdate, 
    CoursePurchaseInDB, CoursePurchaseResponse, PurchaseSummary,
    CourseLicenseBase, CourseLicenseCreate, CourseLicenseUpdate,
    CourseLicenseInDB, CourseLicenseResponse
)
from app.schemas.review import (
    ReviewBase, ReviewCreate, ReviewUpdate, ReviewInDB,
    ReviewResponse, ReviewStats
)

# Define __all__ for explicit exports
__all__ = [
    # Auth schemas
    'Token', 'TokenData', 'Login', 'PasswordReset', 'PasswordResetRequest',
    
    # Base schema
    'BaseSchema',
    
    # User schemas
    'UserBase', 'UserCreate', 'UserUpdate', 'UserInDB',
    
    # Course schemas
    'CourseBase', 'CourseCreate', 'CourseUpdate', 'CourseInDB', 'CourseResponse',
    
    # Course version/content schemas
    'CourseContentBase', 'CourseContentCreate', 'CourseContentUpdate', 'CourseContentInDB', 
    'CourseContentResponse', 'CourseVersionResponse', 'CourseWithContentResponse',
    
    # Module schemas
    'ModuleBase', 'ModuleCreate', 'ModuleUpdate', 'ModuleInDB', 'ModuleResponse', 'LessonSummary',
    
    # Lesson schemas
    'LessonBase', 'LessonCreate', 'LessonUpdate', 'LessonInDB', 'LessonResponse',
    'ResourceBase', 'ResourceCreate', 'ResourceInDB', 'ResourceResponse',
    
    # School schemas
    'SchoolBase', 'SchoolCreate', 'SchoolUpdate',
    
    # Enrollment schemas
    'EnrollmentBase', 'EnrollmentUpdate', 'EnrollmentResponse',
    
    # Progress schemas
    'ModuleProgressResponse', 'LessonProgressResponse',
    
    # Purchase schemas
    'CoursePurchaseBase', 'CoursePurchaseCreate', 'CoursePurchaseUpdate', 
    'CoursePurchaseInDB', 'CoursePurchaseResponse', 'PurchaseSummary',
    'CourseLicenseBase', 'CourseLicenseCreate', 'CourseLicenseUpdate',
    'CourseLicenseInDB', 'CourseLicenseResponse',
    
    # Review schemas
    'ReviewBase', 'ReviewCreate', 'ReviewUpdate', 'ReviewInDB',
    'ReviewResponse', 'ReviewStats',
] 