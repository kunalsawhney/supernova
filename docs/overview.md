## Project Overview: Supernova LMS

Supernova is a modern Learning Management System (LMS) with a comprehensive set of features designed for educational institutions and individual learners.

### Architecture
- **Backend**: Built with FastAPI (Python), SQLAlchemy ORM, and PostgreSQL database
- **Frontend**: Modern Next.js application with React, utilizing a component-based architecture
- **Multi-tenant**: School-based isolation where each school operates in its own environment
- **API-Driven**: RESTful API with comprehensive documentation and standardized responses
- **Database**: PostgreSQL with Alembic migrations for versioning

### Business Model
- **B2B (Business-to-Business)**: Schools can subscribe to the platform with different subscription tiers (Basic, Standard, Premium)
- **D2C (Direct-to-Consumer)**: Individual users can purchase courses directly
- **Licensing**: Schools can license specific courses for their students

### Key Features

1. **Role-Based Access Control**:
   - Super Admin: Manages the entire platform, schools, and system settings
   - School Admin: Manages a specific school, its users, and courses
   - Instructor: Creates and manages courses, reviews student progress
   - Student: Enrolls in and consumes courses, tracks personal progress
   - Individual User: Direct consumer who purchases and accesses courses

2. **Course Management**:
   - Course creation and versioning system to track content updates
   - Module and lesson organization with hierarchical structure
   - Content management with various media types
   - Live classes functionality
   - Course pricing and availability settings
   - Learning objectives and prerequisites
   - Difficulty level designation

3. **User Management**:
   - User registration and authentication with JWT tokens
   - Profile management with role-specific data
   - Role-based permissions and access control
   - Student and teacher specialized profiles

4. **Enrollment System**:
   - Course enrollment tracking for both B2B and D2C
   - Progress monitoring at course, module, and lesson levels
   - Completion certificates and badges
   - Detailed analytics on user engagement

5. **School Management**:
   - Multi-school support with isolated data
   - School-specific branding and settings
   - Administrator dashboard with analytics
   - Subscription management
   - Academic year and grading system configuration

6. **Dashboard Views**:
   - Student dashboard with enrolled courses, progress, and recommendations
   - Instructor dashboard with course analytics and student performance
   - Admin dashboard with user management, content moderation, and system metrics
   - School admin dashboard with school-specific controls

7. **Course Player**:
   - Interactive lesson viewer with multimedia support
   - Progress tracking and synchronization
   - Assessment capabilities with various question types
   - Bookmarking and note-taking features

8. **E-commerce Integration**:
   - Course purchases with various payment options
   - Payment processing and receipt generation
   - Review and rating system for courses
   - Purchase history and license management

9. **Content Versioning**:
   - Track course content changes over time
   - Ability to update courses while preserving student progress
   - Version comparison and rollback capabilities

10. **Analytics and Reporting**:
    - Detailed user engagement metrics
    - Course completion and performance statistics
    - School-level analytics for administrators
    - Exportable reports for stakeholders

### Technology Stack
- **Frontend**: Next.js, React, TypeScript, Tailwind CSS, Radix UI components
- **Backend**: FastAPI, SQLAlchemy, Alembic (migrations), PostgreSQL, JWT authentication
- **Infrastructure**: PNPM workspaces for monorepo management, Turbo for build optimization
- **State Management**: React Context API, React Query for data fetching
- **UI**: Custom design system with comprehensive color system and component library

The system follows modern web development practices with a clear separation of concerns, API standardization, and responsive UI design principles. It implements proper multi-tenancy through data isolation at the database level, with appropriate access controls for different user roles.
