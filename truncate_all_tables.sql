-- Disable foreign key constraints temporarily
SET session_replication_role = 'replica';

-- Truncate all tables
TRUNCATE TABLE schools CASCADE;
TRUNCATE TABLE school_settings CASCADE;
TRUNCATE TABLE subscriptions CASCADE;
TRUNCATE TABLE users CASCADE;
TRUNCATE TABLE course_contents CASCADE;
TRUNCATE TABLE courses CASCADE;
TRUNCATE TABLE student_profiles CASCADE;
TRUNCATE TABLE teacher_profiles CASCADE;
TRUNCATE TABLE course_licenses CASCADE;
TRUNCATE TABLE course_purchases CASCADE;
TRUNCATE TABLE course_versions CASCADE;
TRUNCATE TABLE modules CASCADE;
TRUNCATE TABLE course_enrollments CASCADE;
TRUNCATE TABLE course_reviews CASCADE;
TRUNCATE TABLE lesson_progress CASCADE;
TRUNCATE TABLE lesson_quizzes CASCADE;
TRUNCATE TABLE user_progress CASCADE;
TRUNCATE TABLE lessons CASCADE;

-- Re-enable foreign key constraints
SET session_replication_role = 'origin';
