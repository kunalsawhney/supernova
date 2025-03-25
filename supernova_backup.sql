--
-- PostgreSQL database dump
--

-- Dumped from database version 14.2
-- Dumped by pg_dump version 14.17 (Homebrew)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: content_type; Type: TYPE; Schema: public; Owner: kunal.sawhney
--

CREATE TYPE public.content_type AS ENUM (
    'text',
    'presentation',
    'video',
    'audio'
);


ALTER TYPE public.content_type OWNER TO "kunal.sawhney";

--
-- Name: course_status; Type: TYPE; Schema: public; Owner: kunal.sawhney
--

CREATE TYPE public.course_status AS ENUM (
    'draft',
    'published',
    'archived'
);


ALTER TYPE public.course_status OWNER TO "kunal.sawhney";

--
-- Name: difficulty_level; Type: TYPE; Schema: public; Owner: kunal.sawhney
--

CREATE TYPE public.difficulty_level AS ENUM (
    'beginner',
    'intermediate',
    'advanced'
);


ALTER TYPE public.difficulty_level OWNER TO "kunal.sawhney";

--
-- Name: enrollment_status; Type: TYPE; Schema: public; Owner: kunal.sawhney
--

CREATE TYPE public.enrollment_status AS ENUM (
    'enrolled',
    'in_progress',
    'completed',
    'dropped',
    'suspended'
);


ALTER TYPE public.enrollment_status OWNER TO "kunal.sawhney";

--
-- Name: enrollment_type; Type: TYPE; Schema: public; Owner: kunal.sawhney
--

CREATE TYPE public.enrollment_type AS ENUM (
    'b2b',
    'd2c'
);


ALTER TYPE public.enrollment_type OWNER TO "kunal.sawhney";

--
-- Name: payment_status; Type: TYPE; Schema: public; Owner: kunal.sawhney
--

CREATE TYPE public.payment_status AS ENUM (
    'pending',
    'completed',
    'failed',
    'refunded',
    'cancelled'
);


ALTER TYPE public.payment_status OWNER TO "kunal.sawhney";

--
-- Name: review_status; Type: TYPE; Schema: public; Owner: kunal.sawhney
--

CREATE TYPE public.review_status AS ENUM (
    'pending',
    'approved',
    'rejected',
    'hidden'
);


ALTER TYPE public.review_status OWNER TO "kunal.sawhney";

--
-- Name: subscription_plan; Type: TYPE; Schema: public; Owner: kunal.sawhney
--

CREATE TYPE public.subscription_plan AS ENUM (
    'basic',
    'standard',
    'premium'
);


ALTER TYPE public.subscription_plan OWNER TO "kunal.sawhney";

--
-- Name: subscription_status; Type: TYPE; Schema: public; Owner: kunal.sawhney
--

CREATE TYPE public.subscription_status AS ENUM (
    'trial',
    'active',
    'expired',
    'cancelled',
    'past_due'
);


ALTER TYPE public.subscription_status OWNER TO "kunal.sawhney";

--
-- Name: user_role; Type: TYPE; Schema: public; Owner: kunal.sawhney
--

CREATE TYPE public.user_role AS ENUM (
    'super_admin',
    'school_admin',
    'teacher',
    'student',
    'individual_user'
);


ALTER TYPE public.user_role OWNER TO "kunal.sawhney";

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: alembic_version; Type: TABLE; Schema: public; Owner: kunal.sawhney
--

CREATE TABLE public.alembic_version (
    version_num character varying(32) NOT NULL
);


ALTER TABLE public.alembic_version OWNER TO "kunal.sawhney";

--
-- Name: course_contents; Type: TABLE; Schema: public; Owner: kunal.sawhney
--

CREATE TABLE public.course_contents (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    syllabus_url character varying(255),
    start_date timestamp with time zone NOT NULL,
    end_date timestamp with time zone NOT NULL,
    duration_weeks integer,
    content_status public.course_status DEFAULT 'draft'::public.course_status NOT NULL,
    last_reviewed_by_id uuid,
    last_reviewed_at timestamp with time zone,
    resources jsonb,
    is_active boolean NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone,
    is_deleted boolean NOT NULL
);


ALTER TABLE public.course_contents OWNER TO "kunal.sawhney";

--
-- Name: course_enrollments; Type: TABLE; Schema: public; Owner: kunal.sawhney
--

CREATE TABLE public.course_enrollments (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    course_id uuid NOT NULL,
    version_id uuid NOT NULL,
    student_id uuid,
    individual_user_id uuid,
    enrolled_by_id uuid NOT NULL,
    enrollment_type public.enrollment_type NOT NULL,
    status public.enrollment_status DEFAULT 'enrolled'::public.enrollment_status NOT NULL,
    enrolled_at timestamp with time zone DEFAULT now() NOT NULL,
    completed_at timestamp with time zone,
    progress double precision DEFAULT 0.0 NOT NULL,
    last_activity_at timestamp with time zone,
    certificate_id character varying(100),
    certificate_url character varying(255),
    completion_score double precision,
    badges_earned jsonb,
    completion_metadata jsonb,
    is_active boolean NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone,
    is_deleted boolean NOT NULL,
    CONSTRAINT enrollment_type_check CHECK ((((student_id IS NOT NULL) AND (individual_user_id IS NULL) AND (enrollment_type = 'b2b'::public.enrollment_type)) OR ((student_id IS NULL) AND (individual_user_id IS NOT NULL) AND (enrollment_type = 'd2c'::public.enrollment_type))))
);


ALTER TABLE public.course_enrollments OWNER TO "kunal.sawhney";

--
-- Name: course_licenses; Type: TABLE; Schema: public; Owner: kunal.sawhney
--

CREATE TABLE public.course_licenses (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    course_id uuid NOT NULL,
    school_id uuid NOT NULL,
    granted_by_id uuid NOT NULL,
    valid_from timestamp with time zone NOT NULL,
    valid_until timestamp with time zone,
    max_students integer,
    is_active boolean DEFAULT true NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone,
    is_deleted boolean NOT NULL
);


ALTER TABLE public.course_licenses OWNER TO "kunal.sawhney";

--
-- Name: course_purchases; Type: TABLE; Schema: public; Owner: kunal.sawhney
--

CREATE TABLE public.course_purchases (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    course_id uuid NOT NULL,
    user_id uuid NOT NULL,
    amount_paid double precision NOT NULL,
    currency character varying(3) NOT NULL,
    payment_method jsonb NOT NULL,
    payment_status public.payment_status DEFAULT 'pending'::public.payment_status NOT NULL,
    purchase_date timestamp with time zone NOT NULL,
    valid_until timestamp with time zone,
    is_active boolean NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone,
    is_deleted boolean NOT NULL
);


ALTER TABLE public.course_purchases OWNER TO "kunal.sawhney";

--
-- Name: course_reviews; Type: TABLE; Schema: public; Owner: kunal.sawhney
--

CREATE TABLE public.course_reviews (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    enrollment_id uuid NOT NULL,
    rating integer NOT NULL,
    review_text text,
    pros jsonb,
    cons jsonb,
    would_recommend boolean,
    difficulty_rating integer,
    engagement_rating integer,
    is_featured boolean DEFAULT false NOT NULL,
    moderated_by_id uuid,
    moderated_at timestamp with time zone,
    status public.review_status DEFAULT 'pending'::public.review_status NOT NULL,
    is_active boolean NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone,
    is_deleted boolean NOT NULL,
    CONSTRAINT difficulty_rating_range_check CHECK (((difficulty_rating IS NULL) OR ((difficulty_rating >= 1) AND (difficulty_rating <= 5)))),
    CONSTRAINT engagement_rating_range_check CHECK (((engagement_rating IS NULL) OR ((engagement_rating >= 1) AND (engagement_rating <= 5)))),
    CONSTRAINT rating_range_check CHECK (((rating >= 1) AND (rating <= 5)))
);


ALTER TABLE public.course_reviews OWNER TO "kunal.sawhney";

--
-- Name: COLUMN course_reviews.status; Type: COMMENT; Schema: public; Owner: kunal.sawhney
--

COMMENT ON COLUMN public.course_reviews.status IS 'Status of the review: pending, verified, approved, rejected, or hidden';


--
-- Name: course_versions; Type: TABLE; Schema: public; Owner: kunal.sawhney
--

CREATE TABLE public.course_versions (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    course_id uuid NOT NULL,
    version character varying(20) NOT NULL,
    content_id uuid NOT NULL,
    valid_from timestamp with time zone NOT NULL,
    valid_until timestamp with time zone,
    changelog jsonb,
    is_active boolean DEFAULT true NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone,
    is_deleted boolean NOT NULL
);


ALTER TABLE public.course_versions OWNER TO "kunal.sawhney";

--
-- Name: courses; Type: TABLE; Schema: public; Owner: kunal.sawhney
--

CREATE TABLE public.courses (
    title character varying(255) NOT NULL,
    description text NOT NULL,
    code character varying(50) NOT NULL,
    status public.course_status NOT NULL,
    cover_image_url character varying(255),
    settings jsonb,
    difficulty_level public.difficulty_level DEFAULT 'beginner'::public.difficulty_level,
    tags jsonb,
    estimated_duration integer,
    learning_objectives jsonb,
    target_audience jsonb,
    prerequisites jsonb,
    completion_criteria jsonb,
    grade_level character varying(20),
    academic_year character varying(20),
    sequence_number integer,
    base_price double precision,
    currency character varying(3),
    pricing_type character varying(20),
    created_by_id uuid NOT NULL,
    version character varying(50) NOT NULL,
    is_d2c_enabled boolean DEFAULT false NOT NULL,
    is_b2b_enabled boolean DEFAULT true NOT NULL,
    id uuid NOT NULL,
    is_active boolean NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone,
    is_deleted boolean NOT NULL
);


ALTER TABLE public.courses OWNER TO "kunal.sawhney";

--
-- Name: COLUMN courses.status; Type: COMMENT; Schema: public; Owner: kunal.sawhney
--

COMMENT ON COLUMN public.courses.status IS 'Status of the course: draft, published, or archived';


--
-- Name: lesson_progress; Type: TABLE; Schema: public; Owner: kunal.sawhney
--

CREATE TABLE public.lesson_progress (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    lesson_id uuid NOT NULL,
    student_id uuid,
    individual_user_id uuid,
    status character varying(20) DEFAULT 'not_started'::character varying NOT NULL,
    progress double precision DEFAULT 0.0 NOT NULL,
    started_at timestamp with time zone,
    completed_at timestamp with time zone,
    last_interaction timestamp with time zone,
    time_spent_seconds integer DEFAULT 0 NOT NULL,
    is_active boolean NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone,
    is_deleted boolean NOT NULL,
    CONSTRAINT student_or_individual_user_progress_check CHECK ((((student_id IS NOT NULL) AND (individual_user_id IS NULL)) OR ((student_id IS NULL) AND (individual_user_id IS NOT NULL))))
);


ALTER TABLE public.lesson_progress OWNER TO "kunal.sawhney";

--
-- Name: lesson_quizzes; Type: TABLE; Schema: public; Owner: kunal.sawhney
--

CREATE TABLE public.lesson_quizzes (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    lesson_id uuid NOT NULL,
    title character varying(255) NOT NULL,
    description text,
    questions jsonb NOT NULL,
    settings jsonb,
    is_mandatory boolean DEFAULT true NOT NULL,
    passing_score double precision DEFAULT 0.7 NOT NULL,
    max_attempts integer,
    is_active boolean NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone,
    is_deleted boolean NOT NULL,
    CONSTRAINT max_attempts_check CHECK (((max_attempts IS NULL) OR (max_attempts > 0))),
    CONSTRAINT passing_score_range_check CHECK (((passing_score >= (0.0)::double precision) AND (passing_score <= (1.0)::double precision)))
);


ALTER TABLE public.lesson_quizzes OWNER TO "kunal.sawhney";

--
-- Name: COLUMN lesson_quizzes.questions; Type: COMMENT; Schema: public; Owner: kunal.sawhney
--

COMMENT ON COLUMN public.lesson_quizzes.questions IS 'List of questions with their options and correct answers';


--
-- Name: COLUMN lesson_quizzes.settings; Type: COMMENT; Schema: public; Owner: kunal.sawhney
--

COMMENT ON COLUMN public.lesson_quizzes.settings IS 'Quiz settings like time limit, passing score, etc.';


--
-- Name: COLUMN lesson_quizzes.is_mandatory; Type: COMMENT; Schema: public; Owner: kunal.sawhney
--

COMMENT ON COLUMN public.lesson_quizzes.is_mandatory IS 'Whether passing this quiz is required for lesson completion';


--
-- Name: COLUMN lesson_quizzes.passing_score; Type: COMMENT; Schema: public; Owner: kunal.sawhney
--

COMMENT ON COLUMN public.lesson_quizzes.passing_score IS 'Minimum score (0.0-1.0) required to pass the quiz';


--
-- Name: COLUMN lesson_quizzes.max_attempts; Type: COMMENT; Schema: public; Owner: kunal.sawhney
--

COMMENT ON COLUMN public.lesson_quizzes.max_attempts IS 'Maximum number of attempts allowed, null for unlimited';


--
-- Name: lessons; Type: TABLE; Schema: public; Owner: kunal.sawhney
--

CREATE TABLE public.lessons (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    module_id uuid NOT NULL,
    description text,
    sequence_number integer NOT NULL,
    content_type public.content_type NOT NULL,
    content jsonb NOT NULL,
    duration_minutes integer,
    is_mandatory boolean DEFAULT true NOT NULL,
    completion_criteria jsonb,
    is_active boolean NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone,
    is_deleted boolean NOT NULL,
    title character varying(255) NOT NULL
);


ALTER TABLE public.lessons OWNER TO "kunal.sawhney";

--
-- Name: modules; Type: TABLE; Schema: public; Owner: kunal.sawhney
--

CREATE TABLE public.modules (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    content_id uuid NOT NULL,
    description text,
    sequence_number integer NOT NULL,
    duration_weeks integer,
    status public.course_status DEFAULT 'draft'::public.course_status NOT NULL,
    completion_criteria jsonb,
    is_mandatory boolean DEFAULT true NOT NULL,
    is_active boolean NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone,
    is_deleted boolean NOT NULL,
    title character varying(255) NOT NULL
);


ALTER TABLE public.modules OWNER TO "kunal.sawhney";

--
-- Name: school_settings; Type: TABLE; Schema: public; Owner: kunal.sawhney
--

CREATE TABLE public.school_settings (
    school_id uuid NOT NULL,
    academic_year_start date NOT NULL,
    grading_system jsonb,
    attendance_rules jsonb,
    class_schedule_settings jsonb,
    notification_preferences jsonb,
    id uuid NOT NULL,
    is_active boolean NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone,
    is_deleted boolean NOT NULL
);


ALTER TABLE public.school_settings OWNER TO "kunal.sawhney";

--
-- Name: schools; Type: TABLE; Schema: public; Owner: kunal.sawhney
--

CREATE TABLE public.schools (
    name character varying(255) NOT NULL,
    code character varying(50) NOT NULL,
    description text,
    domain character varying(255) NOT NULL,
    contact_email character varying(255) NOT NULL,
    contact_phone character varying(50),
    timezone character varying(50) NOT NULL,
    address character varying(255),
    settings jsonb,
    logo_url character varying(255),
    subscription_status public.subscription_status NOT NULL,
    trial_ends_at timestamp with time zone,
    max_students integer NOT NULL,
    max_teachers integer NOT NULL,
    features_enabled jsonb,
    id uuid NOT NULL,
    is_active boolean NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone,
    is_deleted boolean NOT NULL
);


ALTER TABLE public.schools OWNER TO "kunal.sawhney";

--
-- Name: student_profiles; Type: TABLE; Schema: public; Owner: kunal.sawhney
--

CREATE TABLE public.student_profiles (
    user_id uuid NOT NULL,
    school_id uuid NOT NULL,
    enrollment_number character varying(50) NOT NULL,
    grade_level character varying(20) NOT NULL,
    section character varying(20),
    parent_details jsonb,
    admission_date date NOT NULL,
    academic_status character varying(20) DEFAULT 'active'::character varying NOT NULL,
    id uuid NOT NULL,
    is_active boolean NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone,
    is_deleted boolean NOT NULL
);


ALTER TABLE public.student_profiles OWNER TO "kunal.sawhney";

--
-- Name: subscriptions; Type: TABLE; Schema: public; Owner: kunal.sawhney
--

CREATE TABLE public.subscriptions (
    school_id uuid NOT NULL,
    plan_type public.subscription_plan NOT NULL,
    starts_at timestamp with time zone NOT NULL,
    ends_at timestamp with time zone NOT NULL,
    status public.subscription_status NOT NULL,
    billing_cycle character varying(20) DEFAULT 'monthly'::character varying NOT NULL,
    payment_method jsonb,
    billing_details jsonb,
    id uuid NOT NULL,
    is_active boolean NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone,
    is_deleted boolean NOT NULL
);


ALTER TABLE public.subscriptions OWNER TO "kunal.sawhney";

--
-- Name: teacher_profiles; Type: TABLE; Schema: public; Owner: kunal.sawhney
--

CREATE TABLE public.teacher_profiles (
    user_id uuid NOT NULL,
    school_id uuid NOT NULL,
    employee_id character varying(50) NOT NULL,
    subjects jsonb,
    qualifications jsonb,
    joining_date date NOT NULL,
    department character varying(100),
    id uuid NOT NULL,
    is_active boolean NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone,
    is_deleted boolean NOT NULL
);


ALTER TABLE public.teacher_profiles OWNER TO "kunal.sawhney";

--
-- Name: user_progress; Type: TABLE; Schema: public; Owner: kunal.sawhney
--

CREATE TABLE public.user_progress (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    enrollment_id uuid NOT NULL,
    content_type character varying(20) NOT NULL,
    content_id uuid NOT NULL,
    status character varying(20) DEFAULT 'not_started'::character varying NOT NULL,
    progress double precision DEFAULT 0.0 NOT NULL,
    started_at timestamp with time zone,
    completed_at timestamp with time zone,
    last_interaction timestamp with time zone,
    time_spent_seconds integer DEFAULT 0 NOT NULL,
    progress_metadata jsonb,
    is_active boolean NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone,
    is_deleted boolean NOT NULL,
    CONSTRAINT progress_range_check CHECK (((progress >= (0.0)::double precision) AND (progress <= (1.0)::double precision))),
    CONSTRAINT valid_content_type_check CHECK (((content_type)::text = ANY ((ARRAY['course'::character varying, 'module'::character varying, 'lesson'::character varying])::text[])))
);


ALTER TABLE public.user_progress OWNER TO "kunal.sawhney";

--
-- Name: COLUMN user_progress.content_type; Type: COMMENT; Schema: public; Owner: kunal.sawhney
--

COMMENT ON COLUMN public.user_progress.content_type IS 'Type of content being tracked: ''course'', ''module'', or ''lesson''';


--
-- Name: COLUMN user_progress.content_id; Type: COMMENT; Schema: public; Owner: kunal.sawhney
--

COMMENT ON COLUMN public.user_progress.content_id IS 'UUID of the content (course_id, module_id, or lesson_id)';


--
-- Name: COLUMN user_progress.progress; Type: COMMENT; Schema: public; Owner: kunal.sawhney
--

COMMENT ON COLUMN public.user_progress.progress IS 'Progress value between 0.0 and 1.0';


--
-- Name: COLUMN user_progress.progress_metadata; Type: COMMENT; Schema: public; Owner: kunal.sawhney
--

COMMENT ON COLUMN public.user_progress.progress_metadata IS 'Additional metadata specific to the content type';


--
-- Name: users; Type: TABLE; Schema: public; Owner: kunal.sawhney
--

CREATE TABLE public.users (
    email character varying(255) NOT NULL,
    password character varying(255) NOT NULL,
    first_name character varying(255) NOT NULL,
    last_name character varying(255) NOT NULL,
    role public.user_role NOT NULL,
    school_id uuid,
    id uuid NOT NULL,
    is_active boolean NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone,
    is_deleted boolean NOT NULL,
    settings jsonb
);


ALTER TABLE public.users OWNER TO "kunal.sawhney";

--
-- Data for Name: alembic_version; Type: TABLE DATA; Schema: public; Owner: kunal.sawhney
--

COPY public.alembic_version (version_num) FROM stdin;
282a7ba7357b
\.


--
-- Data for Name: course_contents; Type: TABLE DATA; Schema: public; Owner: kunal.sawhney
--

COPY public.course_contents (id, syllabus_url, start_date, end_date, duration_weeks, content_status, last_reviewed_by_id, last_reviewed_at, resources, is_active, created_at, updated_at, deleted_at, is_deleted) FROM stdin;
4138231f-75d0-42ef-8d5c-66ca524fe8dd	\N	2025-03-18 18:53:56.983576+05:30	2026-03-18 18:53:56.983582+05:30	52	draft	\N	\N	\N	t	2025-03-19 00:23:56.971428+05:30	2025-03-19 00:23:56.971428+05:30	\N	f
60f198c9-b6e5-4f44-b854-d067cdc3d65b	\N	2025-03-18 18:59:38.444673+05:30	2026-03-18 18:59:38.444676+05:30	52	draft	\N	\N	\N	t	2025-03-19 00:29:38.441787+05:30	2025-03-19 00:29:38.441787+05:30	\N	f
984c732d-32cf-487c-a7d2-b4963befe268	\N	2025-03-19 11:02:24.834014+05:30	2026-03-19 11:02:24.834019+05:30	52	draft	\N	\N	\N	t	2025-03-19 16:32:24.828452+05:30	2025-03-19 16:32:24.828452+05:30	\N	f
f0e472e6-dafe-491f-9068-c2da7518d427	\N	2025-03-19 11:06:46.944019+05:30	2026-03-19 11:06:46.944024+05:30	52	draft	\N	\N	\N	t	2025-03-19 16:36:46.941483+05:30	2025-03-19 16:36:46.941483+05:30	\N	f
7210b4b4-bf8d-4db2-8444-25670776e770	\N	2025-03-19 11:09:22.540672+05:30	2026-03-19 11:09:22.540677+05:30	52	draft	\N	\N	\N	t	2025-03-19 16:39:22.519383+05:30	2025-03-19 16:39:22.519383+05:30	\N	f
7531e9f1-ec66-4342-9cf8-32be0965d502	\N	2025-03-19 11:10:54.8777+05:30	2026-03-19 11:10:54.877706+05:30	52	draft	\N	\N	\N	t	2025-03-19 16:40:54.871554+05:30	2025-03-19 16:40:54.871554+05:30	\N	f
d57bf4fa-7a3e-4146-a009-8dbf9d9128e4	\N	2025-03-19 11:16:07.506911+05:30	2026-03-19 11:16:07.506917+05:30	52	draft	\N	\N	\N	t	2025-03-19 16:46:07.504502+05:30	2025-03-19 16:46:07.504502+05:30	\N	f
5ce7d8fc-f08b-4a3c-b20f-9c8e336a52f5	\N	2025-03-19 20:44:26.175359+05:30	2026-03-19 20:44:26.175364+05:30	52	draft	\N	\N	\N	t	2025-03-20 02:14:26.160196+05:30	2025-03-20 02:14:26.160196+05:30	\N	f
885db119-c1c1-4f74-a0cc-b9c84381edc4	\N	2025-03-21 16:38:09.26914+05:30	2026-03-21 16:38:09.269147+05:30	52	draft	\N	\N	\N	t	2025-03-21 22:08:09.255011+05:30	2025-03-21 22:08:09.255011+05:30	\N	f
e9d61095-90ad-465c-abc8-307cb3ec4e9d	\N	2025-03-21 16:40:18.805376+05:30	2026-03-21 16:40:18.805381+05:30	52	draft	\N	\N	\N	t	2025-03-21 22:10:18.801188+05:30	2025-03-21 22:10:18.801188+05:30	\N	f
72e49450-763a-437b-a0fc-0979e931b7f3	\N	2025-03-21 16:52:49.509953+05:30	2026-03-21 16:52:49.509957+05:30	52	draft	\N	\N	\N	t	2025-03-21 22:22:49.508223+05:30	2025-03-21 22:22:49.508223+05:30	\N	f
fca81c84-5a0d-459a-88b5-a0ab64338ac6	\N	2025-03-21 16:57:02.270315+05:30	2026-03-21 16:57:02.27032+05:30	52	draft	\N	\N	\N	t	2025-03-21 22:27:02.266668+05:30	2025-03-21 22:27:02.266668+05:30	\N	f
1c43c089-aeeb-413a-8407-08d21339b216	\N	2025-03-21 16:57:59.380094+05:30	2026-03-21 16:57:59.3801+05:30	52	draft	\N	\N	\N	t	2025-03-21 22:27:59.377655+05:30	2025-03-21 22:27:59.377655+05:30	\N	f
1f072a25-4cf4-417c-949e-c2d59caca146	\N	2025-03-21 17:01:01.732044+05:30	2026-03-21 17:01:01.73205+05:30	52	draft	\N	\N	\N	t	2025-03-21 22:31:01.693719+05:30	2025-03-21 22:31:01.693719+05:30	\N	f
c684b21d-53f4-4143-b027-bb76f2812612	\N	2025-03-21 21:55:40.320857+05:30	2026-03-21 21:55:40.320863+05:30	52	draft	\N	\N	\N	t	2025-03-22 03:25:40.310427+05:30	2025-03-22 03:25:40.310427+05:30	\N	f
\.


--
-- Data for Name: course_enrollments; Type: TABLE DATA; Schema: public; Owner: kunal.sawhney
--

COPY public.course_enrollments (id, course_id, version_id, student_id, individual_user_id, enrolled_by_id, enrollment_type, status, enrolled_at, completed_at, progress, last_activity_at, certificate_id, certificate_url, completion_score, badges_earned, completion_metadata, is_active, created_at, updated_at, deleted_at, is_deleted) FROM stdin;
\.


--
-- Data for Name: course_licenses; Type: TABLE DATA; Schema: public; Owner: kunal.sawhney
--

COPY public.course_licenses (id, course_id, school_id, granted_by_id, valid_from, valid_until, max_students, is_active, created_at, updated_at, deleted_at, is_deleted) FROM stdin;
\.


--
-- Data for Name: course_purchases; Type: TABLE DATA; Schema: public; Owner: kunal.sawhney
--

COPY public.course_purchases (id, course_id, user_id, amount_paid, currency, payment_method, payment_status, purchase_date, valid_until, is_active, created_at, updated_at, deleted_at, is_deleted) FROM stdin;
\.


--
-- Data for Name: course_reviews; Type: TABLE DATA; Schema: public; Owner: kunal.sawhney
--

COPY public.course_reviews (id, enrollment_id, rating, review_text, pros, cons, would_recommend, difficulty_rating, engagement_rating, is_featured, moderated_by_id, moderated_at, status, is_active, created_at, updated_at, deleted_at, is_deleted) FROM stdin;
\.


--
-- Data for Name: course_versions; Type: TABLE DATA; Schema: public; Owner: kunal.sawhney
--

COPY public.course_versions (id, course_id, version, content_id, valid_from, valid_until, changelog, is_active, created_at, updated_at, deleted_at, is_deleted) FROM stdin;
416baf12-5147-41e6-ae0e-b8091df4f1b3	378eced2-9bf4-461c-b7ff-bff55c2d8aee	1.0	4138231f-75d0-42ef-8d5c-66ca524fe8dd	2025-03-18 18:53:56.988192+05:30	\N	{"initial": "Initial course version"}	t	2025-03-19 00:23:56.971428+05:30	2025-03-19 00:23:56.971428+05:30	\N	f
c29a18dc-bd4e-483f-95fb-087853966a9b	1f6168fd-ec6f-4c15-8541-7e6697a5993e	1.0	60f198c9-b6e5-4f44-b854-d067cdc3d65b	2025-03-18 18:59:38.446111+05:30	\N	{"initial": "Initial course version"}	t	2025-03-19 00:29:38.441787+05:30	2025-03-19 00:29:38.441787+05:30	\N	f
e556229f-dcf3-47ca-be29-bbefaa46a787	87840252-d3f8-444c-87f0-da4d7824e986	1.0	984c732d-32cf-487c-a7d2-b4963befe268	2025-03-19 11:02:24.838613+05:30	\N	{"initial": "Initial course version"}	t	2025-03-19 16:32:24.828452+05:30	2025-03-19 16:32:24.828452+05:30	\N	f
81e7fe56-23a9-46c3-9e7b-592665d6c3cb	4bd06078-323f-4d42-a39b-331c5641db66	1.0	f0e472e6-dafe-491f-9068-c2da7518d427	2025-03-19 11:06:46.948052+05:30	\N	{"initial": "Initial course version"}	t	2025-03-19 16:36:46.941483+05:30	2025-03-19 16:36:46.941483+05:30	\N	f
4a137031-a827-48ab-b0d6-52a58f56a183	81b876b2-8a60-4f42-a166-f86ab0a268b1	1.0	7210b4b4-bf8d-4db2-8444-25670776e770	2025-03-19 11:09:22.543222+05:30	\N	{"initial": "Initial course version"}	t	2025-03-19 16:39:22.519383+05:30	2025-03-19 16:39:22.519383+05:30	\N	f
3a6fed0b-9a1a-470d-9767-60b3458f9584	25152729-61da-4033-902e-9e2bcbfce75a	1.0	7531e9f1-ec66-4342-9cf8-32be0965d502	2025-03-19 11:10:54.882057+05:30	\N	{"initial": "Initial course version"}	t	2025-03-19 16:40:54.871554+05:30	2025-03-19 16:40:54.871554+05:30	\N	f
e310f40e-a03c-47ab-9b02-2ce706ceb387	9ec55396-d652-4adc-a8ca-e7d3465a39ce	1.0	d57bf4fa-7a3e-4146-a009-8dbf9d9128e4	2025-03-19 11:16:07.510041+05:30	\N	{"initial": "Initial course version"}	t	2025-03-19 16:46:07.504502+05:30	2025-03-19 16:46:07.504502+05:30	\N	f
7d44b7a6-17ab-435c-98ca-74b66f3dd1cc	181388c0-3603-4bc4-9e07-b40bbae6fcc4	1.0	5ce7d8fc-f08b-4a3c-b20f-9c8e336a52f5	2025-03-19 20:44:26.178657+05:30	\N	{"initial": "Initial course version"}	t	2025-03-20 02:14:26.160196+05:30	2025-03-20 02:14:26.160196+05:30	\N	f
be6f50be-6ab3-4841-9af7-a2bba8375aa5	2acad696-7c58-4ba1-8a35-095636d4baea	1.0	885db119-c1c1-4f74-a0cc-b9c84381edc4	2025-03-21 16:38:09.275606+05:30	\N	{"initial": "Initial course version"}	t	2025-03-21 22:08:09.255011+05:30	2025-03-21 22:08:09.255011+05:30	\N	f
0534f451-e67d-4046-9b89-c08762a0b221	b806f246-211e-4e2f-a64b-933824985982	1.0	e9d61095-90ad-465c-abc8-307cb3ec4e9d	2025-03-21 16:40:18.807241+05:30	\N	{"initial": "Initial course version"}	t	2025-03-21 22:10:18.801188+05:30	2025-03-21 22:10:18.801188+05:30	\N	f
bc79a8c2-582a-41c4-97b3-3fb033aa5a88	67d54d73-be9b-4211-8ead-40cee6bc621b	1.0	72e49450-763a-437b-a0fc-0979e931b7f3	2025-03-21 16:52:49.510799+05:30	\N	{"initial": "Initial course version"}	t	2025-03-21 22:22:49.508223+05:30	2025-03-21 22:22:49.508223+05:30	\N	f
7957e353-f8e4-4e90-947d-e43ef773bed1	e1337671-47f8-48f2-99de-36bebbdce1ef	1.0	fca81c84-5a0d-459a-88b5-a0ab64338ac6	2025-03-21 16:57:02.271577+05:30	\N	{"initial": "Initial course version"}	t	2025-03-21 22:27:02.266668+05:30	2025-03-21 22:27:02.266668+05:30	\N	f
deed44c2-72eb-431c-8afa-99577af02ff3	145d70c3-fd85-4e6e-a3a6-28e48bda3710	1.0	1c43c089-aeeb-413a-8407-08d21339b216	2025-03-21 16:57:59.381062+05:30	\N	{"initial": "Initial course version"}	t	2025-03-21 22:27:59.377655+05:30	2025-03-21 22:27:59.377655+05:30	\N	f
67257f5d-d5ba-4c6c-8d10-926b2747cddf	9f827a9b-124a-4f3b-8865-fa93a38ce6f2	1.0	1f072a25-4cf4-417c-949e-c2d59caca146	2025-03-21 17:01:01.735127+05:30	\N	{"initial": "Initial course version"}	t	2025-03-21 22:31:01.693719+05:30	2025-03-21 22:31:01.693719+05:30	\N	f
28838065-c5b3-49c3-860c-49e74827e388	56627c53-8133-4d79-a57e-79cf37ae84b7	1.0	c684b21d-53f4-4143-b027-bb76f2812612	2025-03-21 21:55:40.327026+05:30	\N	{"initial": "Initial course version"}	t	2025-03-22 03:25:40.310427+05:30	2025-03-22 03:25:40.310427+05:30	\N	f
\.


--
-- Data for Name: courses; Type: TABLE DATA; Schema: public; Owner: kunal.sawhney
--

COPY public.courses (title, description, code, status, cover_image_url, settings, difficulty_level, tags, estimated_duration, learning_objectives, target_audience, prerequisites, completion_criteria, grade_level, academic_year, sequence_number, base_price, currency, pricing_type, created_by_id, version, is_d2c_enabled, is_b2b_enabled, id, is_active, created_at, updated_at, deleted_at, is_deleted) FROM stdin;
Introduction to Python - 3	This course provides an introduction to programming and the Python language.  Students are introduced to core programming concepts like data structures, conditionals, loops, variables, and functions.  This course includes an overview of the various tools available for writing and running Python, and gets students coding quickly.  It also provides hands-on coding exercises using commonly used data structures, writing custom functions, and reading and writing to files. This course may be more robust than some other introductory python courses, as it delves deeper into certain essential programming topics.	course-3	draft	https://plus.unsplash.com/premium_photo-1678565999332-1cde462f7b24	null	beginner	["Python", "Programming", "Beginner", "Coding", "Data Structures", "Functions", "Files"]	300	["Learn the basics of Python programming", "Understand core programming concepts", "Write and run Python code", "Use data structures and functions", "Read and write to files"]	["Students interested in learning Python programming", "Beginners with no prior programming experience", "Developers looking to refresh their Python skills", "Data scientists and analysts interested in automation"]	["Basic computer literacy"]	{}	1	2024-2025	1	99	USD	one-time	5ad71d81-cd14-4d80-957c-5f9b16b3dcfd	1.0	f	t	87840252-d3f8-444c-87f0-da4d7824e986	t	2025-03-19 16:32:24.828452+05:30	2025-03-19 16:44:19.531126+05:30	\N	t
Introduction to Python	This course provides an introduction to programming and the Python language.  Students are introduced to core programming concepts like data structures, conditionals, loops, variables, and functions.  This course includes an overview of the various tools available for writing and running Python, and gets students coding quickly.  It also provides hands-on coding exercises using commonly used data structures, writing custom functions, and reading and writing to files. This course may be more robust than some other introductory python courses, as it delves deeper into certain essential programming topics.	course-2	draft	https://plus.unsplash.com/premium_photo-1678565999332-1cde462f7b24	null	intermediate	["Python", "Programming", "Beginner", "Coding", "Data Structures", "Functions", "Files"]	300	["Learn the basics of Python programming", "Understand core programming concepts", "Write and run Python code", "Use data structures and functions", "Read and write to files"]	["Students interested in learning Python programming", "Beginners with no prior programming experience", "Developers looking to refresh their Python skills", "Data scientists and analysts interested in automation"]	[]	{}	1	2024-2025	1	99	USD	one-time	5ad71d81-cd14-4d80-957c-5f9b16b3dcfd	1.0	f	t	1f6168fd-ec6f-4c15-8541-7e6697a5993e	t	2025-03-19 00:29:38.441787+05:30	2025-03-19 16:43:31.773978+05:30	\N	t
Introduction to Python	This course provides an introduction to programming and the Python language.  Students are introduced to core programming concepts like data structures, conditionals, loops, variables, and functions.  This course includes an overview of the various tools available for writing and running Python, and gets students coding quickly.  It also provides hands-on coding exercises using commonly used data structures, writing custom functions, and reading and writing to files. This course may be more robust than some other introductory python courses, as it delves deeper into certain essential programming topics.	course-5	draft	https://plus.unsplash.com/premium_photo-1678565999332-1cde462f7b24	null	beginner	["Python", "Programming", "Beginner", "Coding", "Data Structures", "Functions", "Files"]	300	["Learn the basics of Python programming", "Understand core programming concepts", "Write and run Python code", "Use data structures and functions", "Read and write to files"]	["Students interested in learning Python programming", "Beginners with no prior programming experience", "Developers looking to refresh their Python skills", "Data scientists and analysts interested in automation"]	["Basic computer literacy"]	{}	1	2024-2025	1	99	USD	one-time	5ad71d81-cd14-4d80-957c-5f9b16b3dcfd	1.0	f	t	81b876b2-8a60-4f42-a166-f86ab0a268b1	t	2025-03-19 16:39:22.519383+05:30	2025-03-19 16:43:50.076432+05:30	\N	t
Introduction to Python	This course provides an introduction to programming and the Python language.  Students are introduced to core programming concepts like data structures, conditionals, loops, variables, and functions.  This course includes an overview of the various tools available for writing and running Python, and gets students coding quickly.  It also provides hands-on coding exercises using commonly used data structures, writing custom functions, and reading and writing to files. This course may be more robust than some other introductory python courses, as it delves deeper into certain essential programming topics.	course-6	draft	https://plus.unsplash.com/premium_photo-1678565999332-1cde462f7b24	null	beginner	["Python", "Programming", "Beginner", "Coding", "Data Structures", "Functions", "Files"]	300	["Learn the basics of Python programming", "Understand core programming concepts", "Write and run Python code", "Use data structures and functions", "Read and write to files"]	["Students interested in learning Python programming", "Beginners with no prior programming experience", "Developers looking to refresh their Python skills", "Data scientists and analysts interested in automation"]	["Basic computer literacy"]	{}	1	2024-2025	1	99	USD	one-time	5ad71d81-cd14-4d80-957c-5f9b16b3dcfd	1.0	f	t	25152729-61da-4033-902e-9e2bcbfce75a	t	2025-03-19 16:40:54.871554+05:30	2025-03-19 16:43:58.252804+05:30	\N	t
Introduction to Python - 4	This course provides an introduction to programming and the Python language.  Students are introduced to core programming concepts like data structures, conditionals, loops, variables, and functions.  This course includes an overview of the various tools available for writing and running Python, and gets students coding quickly.  It also provides hands-on coding exercises using commonly used data structures, writing custom functions, and reading and writing to files. This course may be more robust than some other introductory python courses, as it delves deeper into certain essential programming topics.	course-4	draft	https://plus.unsplash.com/premium_photo-1678565999332-1cde462f7b24	null	beginner	["Python", "Programming", "Beginner", "Coding", "Data Structures", "Functions", "Files"]	300	["Learn the basics of Python programming", "Understand core programming concepts", "Write and run Python code", "Use data structures and functions", "Read and write to files"]	["Students interested in learning Python programming", "Beginners with no prior programming experience", "Developers looking to refresh their Python skills", "Data scientists and analysts interested in automation"]	["Basic computer literacy"]	{}	1	2024-2025	1	99	USD	one-time	5ad71d81-cd14-4d80-957c-5f9b16b3dcfd	1.0	f	t	4bd06078-323f-4d42-a39b-331c5641db66	t	2025-03-19 16:36:46.941483+05:30	2025-03-19 16:43:45.678069+05:30	\N	t
Introduction to Python	This course provides an introduction to programming and the Python language.  Students are introduced to core programming concepts like data structures, conditionals, loops, variables, and functions.  This course includes an overview of the various tools available for writing and running Python, and gets students coding quickly.  It also provides hands-on coding exercises using commonly used data structures, writing custom functions, and reading and writing to files. This course may be more robust than some other introductory python courses, as it delves deeper into certain essential programming topics.	course-10	draft	https://plus.unsplash.com/premium_photo-1678565999332-1cde462f7b24	null	beginner	["Python", "Programming", "Beginner", "Coding", "Data Structures", "Functions", "Files"]	300	["Learn the basics of Python programming", "Understand core programming concepts", "Write and run Python code", "Use data structures and functions", "Read and write to files"]	["Students interested in learning Python programming", "Beginners with no prior programming experience", "Developers looking to refresh their Python skills", "Data scientists and analysts interested in automation"]	["Basic computer literacy"]	{}	1	2024-2025	1	99	USD	one-time	5ad71d81-cd14-4d80-957c-5f9b16b3dcfd	1.0	f	t	181388c0-3603-4bc4-9e07-b40bbae6fcc4	t	2025-03-20 02:14:26.160196+05:30	2025-03-21 23:25:38.356721+05:30	\N	t
Introduction to Python	This course provides an introduction to programming and the Python language.  Students are introduced to core programming concepts like data structures, conditionals, loops, variables, and functions.  This course includes an overview of the various tools available for writing and running Python, and gets students coding quickly.  It also provides hands-on coding exercises using commonly used data structures, writing custom functions, and reading and writing to files. This course may be more robust than some other introductory python courses, as it delves deeper into certain essential programming topics.	course-1	archived	https://plus.unsplash.com/premium_photo-1678565999332-1cde462f7b24	null	beginner	["Python", "Programming", "Beginner", "Coding", "Data Structures", "Functions", "Files"]	300	["Learn the basics of Python programming", "Understand core programming concepts", "Write and run Python code", "Use data structures and functions", "Read and write to files"]	["Students interested in learning Python programming", "Beginners with no prior programming experience", "Developers looking to refresh their Python skills", "Data scientists and analysts interested in automation"]	[]	{}	1	2024-2025	1	99	USD	one-time	5ad71d81-cd14-4d80-957c-5f9b16b3dcfd	1.0	f	t	378eced2-9bf4-461c-b7ff-bff55c2d8aee	t	2025-03-19 00:23:56.971428+05:30	2025-03-21 23:25:56.357171+05:30	\N	t
Block Based Programming	Block Based Programming : A course for beginners to learn about block based programming.	BCP-101	draft	https://via.placeholder.com/150	null	beginner	null	20	null	null	null	null	elementary	2024-2025	1	99.99	USD	one-time	5ad71d81-cd14-4d80-957c-5f9b16b3dcfd	1.0.0	f	t	2acad696-7c58-4ba1-8a35-095636d4baea	t	2025-03-21 22:08:09.255011+05:30	2025-03-21 23:26:02.057676+05:30	\N	t
Block Based Programming	Block Based Programming : A course for beginners to learn about block based programming.	BCP-102	draft	https://via.placeholder.com/150	null	beginner	null	20	null	null	null	null	elementary	2024-2025	1	99.99	USD	one-time	5ad71d81-cd14-4d80-957c-5f9b16b3dcfd	1.0.0	f	t	b806f246-211e-4e2f-a64b-933824985982	t	2025-03-21 22:10:18.801188+05:30	2025-03-21 23:26:04.848725+05:30	\N	t
Block Based Programming	Block Based Programming : A course for beginners to learn about block based programming.	BCP-103	draft	https://via.placeholder.com/150	null	beginner	null	20	null	null	null	null	elementary	2024-2025	1	99.99	USD	one-time	5ad71d81-cd14-4d80-957c-5f9b16b3dcfd	1.0.0	f	t	67d54d73-be9b-4211-8ead-40cee6bc621b	t	2025-03-21 22:22:49.508223+05:30	2025-03-21 23:26:07.80055+05:30	\N	t
Block Based Programming	Block Based Programming : A course for beginners to learn about block based programming.	BCP-104	draft	https://via.placeholder.com/150	null	beginner	null	20	null	null	null	null	elementary	2024-2025	1	99.99	USD	one-time	5ad71d81-cd14-4d80-957c-5f9b16b3dcfd	1.0	f	t	e1337671-47f8-48f2-99de-36bebbdce1ef	t	2025-03-21 22:27:02.266668+05:30	2025-03-21 23:26:11.273893+05:30	\N	t
Block Based Programming	Block Based Programming : A course for beginners to learn about block based programming.	BCP-105	draft	https://via.placeholder.com/150	null	beginner	null	20	null	null	null	null	elementary	2024-2025	1	99.99	USD	one-time	5ad71d81-cd14-4d80-957c-5f9b16b3dcfd	1.0	f	t	145d70c3-fd85-4e6e-a3a6-28e48bda3710	t	2025-03-21 22:27:59.377655+05:30	2025-03-21 23:26:13.899409+05:30	\N	t
Block Based Programming	Block Based Programming : A course for beginners to learn about block based programming.	BCP-106	draft		null	beginner	null	1	null	null	null	null	middle	2025-2026	1	0.01	USD	one-time	5ad71d81-cd14-4d80-957c-5f9b16b3dcfd	1.0	f	t	9f827a9b-124a-4f3b-8865-fa93a38ce6f2	t	2025-03-21 22:31:01.693719+05:30	2025-03-22 02:12:57.255327+05:30	\N	f
Getting deep with Python	This course provides an introduction to programming and the Python language.  Students are introduced to core programming concepts like data structures, conditionals, loops, variables, and functions.  This course includes an overview of the various tools available for writing and running Python, and gets students coding quickly.  It also provides hands-on coding exercises using commonly used data structures, writing custom functions, and reading and writing to files. This course may be more robust than some other introductory python courses, as it delves deeper into certain essential programming topics.	course-7	draft	https://plus.unsplash.com/premium_photo-1678565999332-1cde462f7b24	null	advanced	["Python", "Programming", "Beginner", "Coding", "Data Structures", "Functions", "Files"]	400	["Learn the basics of Python programming", "Understand core programming concepts", "Write and run Python code", "Use data structures and functions", "Read and write to files"]	["Students interested in learning Python programming", "Beginners with no prior programming experience", "Developers looking to refresh their Python skills", "Data scientists and analysts interested in automation"]	[]	{}	1	2024-2025	1	99	USD	one-time	5ad71d81-cd14-4d80-957c-5f9b16b3dcfd	1.0	f	t	9ec55396-d652-4adc-a8ca-e7d3465a39ce	t	2025-03-19 16:46:07.504502+05:30	2025-03-21 23:25:59.347384+05:30	\N	t
Introduction to Python	Learning Python gives the programmer a wide variety of career paths to choose from. Python is an open-source (free) programming language that is used in web programming, data science, artificial intelligence, and many scientific applications. Learning Python allows the programmer to focus on solving problems, rather than focusing on syntax. Its relative size and simplified syntax give it an edge over languages like Java and C++, yet the abundance of libraries gives it the power needed to accomplish great things.\n\nIn this tutorial you will create a guessing game application that pits the computer against the user. You will create variables, decision constructs, and loops in python to create the game.	PYT-101	draft		null	beginner	null	8	null	null	null	null	middle	2023-2024	1	99.99	USD	one-time	5ad71d81-cd14-4d80-957c-5f9b16b3dcfd	1.0	f	t	56627c53-8133-4d79-a57e-79cf37ae84b7	t	2025-03-22 03:25:40.310427+05:30	2025-03-22 03:25:40.310427+05:30	\N	f
\.


--
-- Data for Name: lesson_progress; Type: TABLE DATA; Schema: public; Owner: kunal.sawhney
--

COPY public.lesson_progress (id, lesson_id, student_id, individual_user_id, status, progress, started_at, completed_at, last_interaction, time_spent_seconds, is_active, created_at, updated_at, deleted_at, is_deleted) FROM stdin;
\.


--
-- Data for Name: lesson_quizzes; Type: TABLE DATA; Schema: public; Owner: kunal.sawhney
--

COPY public.lesson_quizzes (id, lesson_id, title, description, questions, settings, is_mandatory, passing_score, max_attempts, is_active, created_at, updated_at, deleted_at, is_deleted) FROM stdin;
\.


--
-- Data for Name: lessons; Type: TABLE DATA; Schema: public; Owner: kunal.sawhney
--

COPY public.lessons (id, module_id, description, sequence_number, content_type, content, duration_minutes, is_mandatory, completion_criteria, is_active, created_at, updated_at, deleted_at, is_deleted, title) FROM stdin;
ca2aaa99-6e75-4a61-8402-c63d8e795d9d	f5781881-df35-4f90-a991-8ff784c6247b	What you should expect from this Course	1	video	{"video_url": ""}	2	t	\N	t	2025-03-22 03:28:57.879105+05:30	2025-03-22 03:28:57.879105+05:30	\N	f	What you should expect from this Course
54377a74-0310-4346-a745-5dc9df34b326	a42ff7b8-22c4-4e21-b07b-ca83df09f723	What is Programming?	1	video	{"video_url": ""}	10	t	\N	t	2025-03-22 03:31:06.778288+05:30	2025-03-22 03:31:06.778288+05:30	\N	f	What is Programming?
669d09a7-4156-4ed4-bb3e-9069b3b96a5b	a42ff7b8-22c4-4e21-b07b-ca83df09f723	What is Python?	2	video	{"video_url": ""}	8	t	\N	t	2025-03-22 03:31:23.127823+05:30	2025-03-22 03:31:23.127823+05:30	\N	f	What is Python?
63467a3f-749b-4060-9b1a-4f955fd7e5a8	a42ff7b8-22c4-4e21-b07b-ca83df09f723	Why Python?	3	video	{"video_url": ""}	1	t	\N	t	2025-03-22 03:31:37.082027+05:30	2025-03-22 03:31:37.082027+05:30	\N	f	Why Python?
\.


--
-- Data for Name: modules; Type: TABLE DATA; Schema: public; Owner: kunal.sawhney
--

COPY public.modules (id, content_id, description, sequence_number, duration_weeks, status, completion_criteria, is_mandatory, is_active, created_at, updated_at, deleted_at, is_deleted, title) FROM stdin;
f5781881-df35-4f90-a991-8ff784c6247b	c684b21d-53f4-4143-b027-bb76f2812612	This course covers the basics of Python and provides you with knowledge to solve real-world problems using Python.	1	\N	draft	\N	t	t	2025-03-22 03:27:15.55408+05:30	2025-03-22 03:27:15.55408+05:30	\N	f	Course Introduction
a42ff7b8-22c4-4e21-b07b-ca83df09f723	c684b21d-53f4-4143-b027-bb76f2812612	This first module covers an intro to programming and the Python language. We’ll start by downloading and installing the necessary tools to begin programming and writing code in Python. After learning how to print to the console, we’ll get an understanding of Python’s basic data types, and how to do simple math.	2	\N	draft	\N	t	t	2025-03-22 03:28:20.028298+05:30	2025-03-22 03:28:20.028298+05:30	\N	f	Introduction to Programming and Python Language
\.


--
-- Data for Name: school_settings; Type: TABLE DATA; Schema: public; Owner: kunal.sawhney
--

COPY public.school_settings (school_id, academic_year_start, grading_system, attendance_rules, class_schedule_settings, notification_preferences, id, is_active, created_at, updated_at, deleted_at, is_deleted) FROM stdin;
\.


--
-- Data for Name: schools; Type: TABLE DATA; Schema: public; Owner: kunal.sawhney
--

COPY public.schools (name, code, description, domain, contact_email, contact_phone, timezone, address, settings, logo_url, subscription_status, trial_ends_at, max_students, max_teachers, features_enabled, id, is_active, created_at, updated_at, deleted_at, is_deleted) FROM stdin;
Test School	test-school-1	A test school for development	test-school-1.com	admin@test-school-1.com	+1234567890	UTC	123 Test Street, Test City, 12345	{}	\N	trial	\N	100	10	\N	5f3952d3-e68a-4a48-bbf0-369efbe460d4	t	2025-03-12 16:06:19.901172+05:30	2025-03-12 16:06:19.901172+05:30	\N	f
Test School 2	test-school-2	A test school for development	test-school-2.com	admin@test-school-2.com	+1234567890	UTC	123 Test Street, Test City, 12345	{}	\N	trial	\N	1000	10	\N	54676053-ba35-4a6b-a99c-aabbf93809ad	t	2025-03-12 16:12:46.230289+05:30	2025-03-12 16:12:46.230289+05:30	\N	f
Test School	test-school-3	A test school for development	test-school-3.com	admin@test-school-3.com	+1234567890	UTC	123 Test Street, Test City, 12345	{}	\N	trial	\N	100	10	\N	e8adcc9e-578d-4f71-9c02-3cbca900b13b	t	2025-03-12 16:16:47.504757+05:30	2025-03-12 16:16:47.504757+05:30	\N	f
Test School	test-school-4	A test school for development	test-school-4.com	admin@test-school-4.com	+1234567890	UTC	123 Test Street, Test City, 12345	{}	\N	trial	\N	100	10	\N	aad8deee-35f0-499e-aa0d-a3297b352144	t	2025-03-12 16:17:41.888227+05:30	2025-03-12 16:17:41.888227+05:30	\N	f
Test School	test-school-5	A test school for development	test-school-5.com	admin@test-school-5.com	+1234567890	UTC	123 Test Street, Test City, 12345	{}	\N	trial	\N	100	10	\N	2d7e1cf3-849d-46e3-bbbf-23bb9b2824e9	t	2025-03-12 16:19:45.271647+05:30	2025-03-12 16:19:45.271647+05:30	\N	f
Test School	test-school-6	A test school for development	test-school-6.com	admin@test-school-6.com	+1234567890	UTC	123 Test Street, Test City, 12345	{}	\N	trial	\N	100	10	\N	7c2dc91f-ee3a-45d5-b401-4620032a481a	t	2025-03-12 16:21:16.37443+05:30	2025-03-12 16:21:16.37443+05:30	\N	f
Test School	test-school-7	A test school for development	test-school-7.com	admin@test-school-7.com	+1234567890	UTC	123 Test Street, Test City, 12345	{}	\N	trial	\N	100	10	\N	8ef0807b-cfcc-4dbb-b280-282b0fede223	t	2025-03-12 16:27:22.967481+05:30	2025-03-12 16:27:22.967481+05:30	\N	f
Salwan	school-1244	fewf	salwan@example.com	salwan@example.com	9810119977	UTC	fewf	{}	\N	trial	\N	100	10	\N	bb863a8f-7ade-43a2-a6b6-ffbaa1376ba2	t	2025-03-18 00:27:38.632693+05:30	2025-03-18 00:27:38.632693+05:30	\N	f
\.


--
-- Data for Name: student_profiles; Type: TABLE DATA; Schema: public; Owner: kunal.sawhney
--

COPY public.student_profiles (user_id, school_id, enrollment_number, grade_level, section, parent_details, admission_date, academic_status, id, is_active, created_at, updated_at, deleted_at, is_deleted) FROM stdin;
\.


--
-- Data for Name: subscriptions; Type: TABLE DATA; Schema: public; Owner: kunal.sawhney
--

COPY public.subscriptions (school_id, plan_type, starts_at, ends_at, status, billing_cycle, payment_method, billing_details, id, is_active, created_at, updated_at, deleted_at, is_deleted) FROM stdin;
\.


--
-- Data for Name: teacher_profiles; Type: TABLE DATA; Schema: public; Owner: kunal.sawhney
--

COPY public.teacher_profiles (user_id, school_id, employee_id, subjects, qualifications, joining_date, department, id, is_active, created_at, updated_at, deleted_at, is_deleted) FROM stdin;
\.


--
-- Data for Name: user_progress; Type: TABLE DATA; Schema: public; Owner: kunal.sawhney
--

COPY public.user_progress (id, enrollment_id, content_type, content_id, status, progress, started_at, completed_at, last_interaction, time_spent_seconds, progress_metadata, is_active, created_at, updated_at, deleted_at, is_deleted) FROM stdin;
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: kunal.sawhney
--

COPY public.users (email, password, first_name, last_name, role, school_id, id, is_active, created_at, updated_at, deleted_at, is_deleted, settings) FROM stdin;
super.admin@example.com	$2b$12$N.jtH0s5X8nlcVQwankCwOu37IRoIcrzH7SyWLGrjfdAWn3.9r/ie	John	Admin	super_admin	\N	da6bbd97-30c6-4a3c-be81-6489de5a3cac	t	2025-03-12 02:38:13.564188+05:30	2025-03-12 02:38:13.564188+05:30	\N	f	\N
test@example.com	$2b$12$wHxY7Kr54AdmqpPKG6UFR.zTW2f8COsfoCJRZ04D5oiaIIXVpBKGK	Test	User	student	\N	583617c6-5c51-40f8-8ea9-ca432aae2a93	t	2025-03-12 03:20:35.763931+05:30	2025-03-12 03:20:35.763931+05:30	\N	f	\N
set_password@gmail.com	$2b$12$rmOgdcUAPWltu1s6QKhFUOyk9pRXjcEG0GSDXNwPXElbUUaPafsAC	set_password	set_password	student	\N	c038a9b6-af65-4f63-a08a-2cc9f4523aba	t	2025-03-12 12:55:09.970279+05:30	2025-03-12 12:55:09.970279+05:30	\N	f	null
teacher1@school.com	$2b$12$La0WnNmcw.h9PF4ZQ.XAY.4hWpOo3Ty8ELIxKGVEFjrXZdQg7YqMG	Teacher	School	teacher	\N	e24f0b5e-9181-47f3-b8c2-3a5631933623	t	2025-03-12 12:55:38.638135+05:30	2025-03-12 12:55:38.638135+05:30	\N	f	null
admin@school.com	$2b$12$8rrVR2Yc.0yi2jG4hP2bk.f4lFAL7WNbkMA22U32tfZCtXW.D4IdC	Admin	School	school_admin	\N	d8fdb4bc-bab2-4ed4-8726-35f436d7effc	t	2025-03-12 12:56:06.951268+05:30	2025-03-12 12:56:06.951268+05:30	\N	f	null
kunal@example.com	$2b$12$pEcPWDYfHgpkhTDAycUQ/.dLZQoBO2V2T.V5zt25s/0Mo7eNx6ymW	Kunal	Sawhney	super_admin	\N	17cd27e6-0a56-41eb-8749-88f5e5f9c196	t	2025-03-12 13:40:08.61671+05:30	2025-03-12 13:40:08.61671+05:30	\N	f	null
k@s.com	$2b$12$5UQrG8uM0dfjol7d/JjBKe6qcoQtnsGNF7h8QXIhvWU7zHeQuvnaS	ks	s	student	\N	8e9e6287-f581-4470-9fa6-ea6a4a7efc33	t	2025-03-12 14:44:01.821421+05:30	2025-03-12 14:44:01.821421+05:30	\N	f	null
admin@test-school-6.com	$2b$12$bv/bGsYzGSP2srCn6ooty.F.fpGd32GEihJeSL9LswIiCgtrOW/Ki	Test	Admin	school_admin	7c2dc91f-ee3a-45d5-b401-4620032a481a	cdda56e4-2cce-4b6e-b647-ac15ae22d96a	t	2025-03-12 16:21:16.382667+05:30	2025-03-12 16:21:16.382667+05:30	\N	f	null
admin@test-school-7.com	$2b$12$GXa60gzA9VFxCQjqpiKPZ.qXHgbs0m6XvBvC9f0pLjVrwLKpXvJge	Test	Admin	school_admin	8ef0807b-cfcc-4dbb-b280-282b0fede223	504de05a-f856-4c88-ba02-921ddde182c0	t	2025-03-12 16:27:22.9756+05:30	2025-03-12 16:27:22.9756+05:30	\N	f	null
kunal@test5.com	$2b$12$3hEWo.6ZoBm4/dPCGUGk6OGYvWvPUCIyyy/63UmWmx/neHuvZbAyu	TJTH	noofenf	student	\N	b006d033-8045-457c-937c-66a9cff63b89	t	2025-03-18 00:26:48.178191+05:30	2025-03-18 00:26:48.178191+05:30	\N	f	null
user123@salwan.com	$2b$12$AlVMr3vpNka8aFBBY1E4L.gm5jzJ0tsKEaW5IdGefWQpj4DFuyAd.	user	salwan	school_admin	bb863a8f-7ade-43a2-a6b6-ffbaa1376ba2	8c1d54e6-64ec-4fa4-a83b-ddbe41c91b31	t	2025-03-18 00:27:38.640083+05:30	2025-03-18 00:27:38.640083+05:30	\N	f	null
admin@example.com	$2b$12$2DvL03VlwkYlzBmqRcoRDeaVSAWUf2Qwr1rJlO4QLmndgj7e1h60e	John	Doe	super_admin	\N	5ad71d81-cd14-4d80-957c-5f9b16b3dcfd	t	2025-03-12 02:33:19.503305+05:30	2025-03-24 19:46:32.1369+05:30	\N	f	\N
\.


--
-- Name: alembic_version alembic_version_pkc; Type: CONSTRAINT; Schema: public; Owner: kunal.sawhney
--

ALTER TABLE ONLY public.alembic_version
    ADD CONSTRAINT alembic_version_pkc PRIMARY KEY (version_num);


--
-- Name: course_contents course_contents_pkey; Type: CONSTRAINT; Schema: public; Owner: kunal.sawhney
--

ALTER TABLE ONLY public.course_contents
    ADD CONSTRAINT course_contents_pkey PRIMARY KEY (id);


--
-- Name: course_enrollments course_enrollments_pkey; Type: CONSTRAINT; Schema: public; Owner: kunal.sawhney
--

ALTER TABLE ONLY public.course_enrollments
    ADD CONSTRAINT course_enrollments_pkey PRIMARY KEY (id);


--
-- Name: course_licenses course_licenses_pkey; Type: CONSTRAINT; Schema: public; Owner: kunal.sawhney
--

ALTER TABLE ONLY public.course_licenses
    ADD CONSTRAINT course_licenses_pkey PRIMARY KEY (id);


--
-- Name: course_purchases course_purchases_pkey; Type: CONSTRAINT; Schema: public; Owner: kunal.sawhney
--

ALTER TABLE ONLY public.course_purchases
    ADD CONSTRAINT course_purchases_pkey PRIMARY KEY (id);


--
-- Name: course_reviews course_reviews_pkey; Type: CONSTRAINT; Schema: public; Owner: kunal.sawhney
--

ALTER TABLE ONLY public.course_reviews
    ADD CONSTRAINT course_reviews_pkey PRIMARY KEY (id);


--
-- Name: course_versions course_versions_pkey; Type: CONSTRAINT; Schema: public; Owner: kunal.sawhney
--

ALTER TABLE ONLY public.course_versions
    ADD CONSTRAINT course_versions_pkey PRIMARY KEY (id);


--
-- Name: courses courses_code_key; Type: CONSTRAINT; Schema: public; Owner: kunal.sawhney
--

ALTER TABLE ONLY public.courses
    ADD CONSTRAINT courses_code_key UNIQUE (code);


--
-- Name: courses courses_pkey; Type: CONSTRAINT; Schema: public; Owner: kunal.sawhney
--

ALTER TABLE ONLY public.courses
    ADD CONSTRAINT courses_pkey PRIMARY KEY (id);


--
-- Name: lesson_progress lesson_progress_pkey; Type: CONSTRAINT; Schema: public; Owner: kunal.sawhney
--

ALTER TABLE ONLY public.lesson_progress
    ADD CONSTRAINT lesson_progress_pkey PRIMARY KEY (id);


--
-- Name: lesson_quizzes lesson_quizzes_pkey; Type: CONSTRAINT; Schema: public; Owner: kunal.sawhney
--

ALTER TABLE ONLY public.lesson_quizzes
    ADD CONSTRAINT lesson_quizzes_pkey PRIMARY KEY (id);


--
-- Name: lessons lessons_pkey; Type: CONSTRAINT; Schema: public; Owner: kunal.sawhney
--

ALTER TABLE ONLY public.lessons
    ADD CONSTRAINT lessons_pkey PRIMARY KEY (id);


--
-- Name: modules modules_pkey; Type: CONSTRAINT; Schema: public; Owner: kunal.sawhney
--

ALTER TABLE ONLY public.modules
    ADD CONSTRAINT modules_pkey PRIMARY KEY (id);


--
-- Name: school_settings school_settings_pkey; Type: CONSTRAINT; Schema: public; Owner: kunal.sawhney
--

ALTER TABLE ONLY public.school_settings
    ADD CONSTRAINT school_settings_pkey PRIMARY KEY (id);


--
-- Name: schools schools_code_key; Type: CONSTRAINT; Schema: public; Owner: kunal.sawhney
--

ALTER TABLE ONLY public.schools
    ADD CONSTRAINT schools_code_key UNIQUE (code);


--
-- Name: schools schools_domain_key; Type: CONSTRAINT; Schema: public; Owner: kunal.sawhney
--

ALTER TABLE ONLY public.schools
    ADD CONSTRAINT schools_domain_key UNIQUE (domain);


--
-- Name: schools schools_pkey; Type: CONSTRAINT; Schema: public; Owner: kunal.sawhney
--

ALTER TABLE ONLY public.schools
    ADD CONSTRAINT schools_pkey PRIMARY KEY (id);


--
-- Name: student_profiles student_profiles_pkey; Type: CONSTRAINT; Schema: public; Owner: kunal.sawhney
--

ALTER TABLE ONLY public.student_profiles
    ADD CONSTRAINT student_profiles_pkey PRIMARY KEY (id);


--
-- Name: subscriptions subscriptions_pkey; Type: CONSTRAINT; Schema: public; Owner: kunal.sawhney
--

ALTER TABLE ONLY public.subscriptions
    ADD CONSTRAINT subscriptions_pkey PRIMARY KEY (id);


--
-- Name: teacher_profiles teacher_profiles_pkey; Type: CONSTRAINT; Schema: public; Owner: kunal.sawhney
--

ALTER TABLE ONLY public.teacher_profiles
    ADD CONSTRAINT teacher_profiles_pkey PRIMARY KEY (id);


--
-- Name: user_progress user_progress_pkey; Type: CONSTRAINT; Schema: public; Owner: kunal.sawhney
--

ALTER TABLE ONLY public.user_progress
    ADD CONSTRAINT user_progress_pkey PRIMARY KEY (id);


--
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: kunal.sawhney
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: kunal.sawhney
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: idx_user_progress_content; Type: INDEX; Schema: public; Owner: kunal.sawhney
--

CREATE INDEX idx_user_progress_content ON public.user_progress USING btree (content_type, content_id);


--
-- Name: ix_courses_status; Type: INDEX; Schema: public; Owner: kunal.sawhney
--

CREATE INDEX ix_courses_status ON public.courses USING btree (status);


--
-- Name: ix_schools_subscription_status; Type: INDEX; Schema: public; Owner: kunal.sawhney
--

CREATE INDEX ix_schools_subscription_status ON public.schools USING btree (subscription_status);


--
-- Name: ix_users_role; Type: INDEX; Schema: public; Owner: kunal.sawhney
--

CREATE INDEX ix_users_role ON public.users USING btree (role);


--
-- Name: course_contents course_contents_last_reviewed_by_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: kunal.sawhney
--

ALTER TABLE ONLY public.course_contents
    ADD CONSTRAINT course_contents_last_reviewed_by_id_fkey FOREIGN KEY (last_reviewed_by_id) REFERENCES public.users(id) ON DELETE SET NULL;


--
-- Name: course_enrollments course_enrollments_course_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: kunal.sawhney
--

ALTER TABLE ONLY public.course_enrollments
    ADD CONSTRAINT course_enrollments_course_id_fkey FOREIGN KEY (course_id) REFERENCES public.courses(id) ON DELETE CASCADE;


--
-- Name: course_enrollments course_enrollments_enrolled_by_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: kunal.sawhney
--

ALTER TABLE ONLY public.course_enrollments
    ADD CONSTRAINT course_enrollments_enrolled_by_id_fkey FOREIGN KEY (enrolled_by_id) REFERENCES public.users(id) ON DELETE RESTRICT;


--
-- Name: course_enrollments course_enrollments_individual_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: kunal.sawhney
--

ALTER TABLE ONLY public.course_enrollments
    ADD CONSTRAINT course_enrollments_individual_user_id_fkey FOREIGN KEY (individual_user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: course_enrollments course_enrollments_student_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: kunal.sawhney
--

ALTER TABLE ONLY public.course_enrollments
    ADD CONSTRAINT course_enrollments_student_id_fkey FOREIGN KEY (student_id) REFERENCES public.student_profiles(id) ON DELETE CASCADE;


--
-- Name: course_enrollments course_enrollments_version_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: kunal.sawhney
--

ALTER TABLE ONLY public.course_enrollments
    ADD CONSTRAINT course_enrollments_version_id_fkey FOREIGN KEY (version_id) REFERENCES public.course_versions(id) ON DELETE RESTRICT;


--
-- Name: course_licenses course_licenses_course_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: kunal.sawhney
--

ALTER TABLE ONLY public.course_licenses
    ADD CONSTRAINT course_licenses_course_id_fkey FOREIGN KEY (course_id) REFERENCES public.courses(id) ON DELETE CASCADE;


--
-- Name: course_licenses course_licenses_granted_by_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: kunal.sawhney
--

ALTER TABLE ONLY public.course_licenses
    ADD CONSTRAINT course_licenses_granted_by_id_fkey FOREIGN KEY (granted_by_id) REFERENCES public.users(id) ON DELETE RESTRICT;


--
-- Name: course_licenses course_licenses_school_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: kunal.sawhney
--

ALTER TABLE ONLY public.course_licenses
    ADD CONSTRAINT course_licenses_school_id_fkey FOREIGN KEY (school_id) REFERENCES public.schools(id) ON DELETE CASCADE;


--
-- Name: course_purchases course_purchases_course_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: kunal.sawhney
--

ALTER TABLE ONLY public.course_purchases
    ADD CONSTRAINT course_purchases_course_id_fkey FOREIGN KEY (course_id) REFERENCES public.courses(id) ON DELETE RESTRICT;


--
-- Name: course_purchases course_purchases_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: kunal.sawhney
--

ALTER TABLE ONLY public.course_purchases
    ADD CONSTRAINT course_purchases_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE RESTRICT;


--
-- Name: course_reviews course_reviews_enrollment_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: kunal.sawhney
--

ALTER TABLE ONLY public.course_reviews
    ADD CONSTRAINT course_reviews_enrollment_id_fkey FOREIGN KEY (enrollment_id) REFERENCES public.course_enrollments(id) ON DELETE CASCADE;


--
-- Name: course_reviews course_reviews_moderated_by_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: kunal.sawhney
--

ALTER TABLE ONLY public.course_reviews
    ADD CONSTRAINT course_reviews_moderated_by_id_fkey FOREIGN KEY (moderated_by_id) REFERENCES public.users(id) ON DELETE SET NULL;


--
-- Name: course_versions course_versions_content_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: kunal.sawhney
--

ALTER TABLE ONLY public.course_versions
    ADD CONSTRAINT course_versions_content_id_fkey FOREIGN KEY (content_id) REFERENCES public.course_contents(id) ON DELETE RESTRICT;


--
-- Name: course_versions course_versions_course_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: kunal.sawhney
--

ALTER TABLE ONLY public.course_versions
    ADD CONSTRAINT course_versions_course_id_fkey FOREIGN KEY (course_id) REFERENCES public.courses(id) ON DELETE CASCADE;


--
-- Name: courses courses_created_by_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: kunal.sawhney
--

ALTER TABLE ONLY public.courses
    ADD CONSTRAINT courses_created_by_id_fkey FOREIGN KEY (created_by_id) REFERENCES public.users(id) ON DELETE RESTRICT;


--
-- Name: lesson_progress lesson_progress_individual_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: kunal.sawhney
--

ALTER TABLE ONLY public.lesson_progress
    ADD CONSTRAINT lesson_progress_individual_user_id_fkey FOREIGN KEY (individual_user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: lesson_progress lesson_progress_lesson_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: kunal.sawhney
--

ALTER TABLE ONLY public.lesson_progress
    ADD CONSTRAINT lesson_progress_lesson_id_fkey FOREIGN KEY (lesson_id) REFERENCES public.lessons(id) ON DELETE CASCADE;


--
-- Name: lesson_progress lesson_progress_student_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: kunal.sawhney
--

ALTER TABLE ONLY public.lesson_progress
    ADD CONSTRAINT lesson_progress_student_id_fkey FOREIGN KEY (student_id) REFERENCES public.student_profiles(id) ON DELETE CASCADE;


--
-- Name: lesson_quizzes lesson_quizzes_lesson_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: kunal.sawhney
--

ALTER TABLE ONLY public.lesson_quizzes
    ADD CONSTRAINT lesson_quizzes_lesson_id_fkey FOREIGN KEY (lesson_id) REFERENCES public.lessons(id) ON DELETE CASCADE;


--
-- Name: lessons lessons_module_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: kunal.sawhney
--

ALTER TABLE ONLY public.lessons
    ADD CONSTRAINT lessons_module_id_fkey FOREIGN KEY (module_id) REFERENCES public.modules(id) ON DELETE CASCADE;


--
-- Name: modules modules_content_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: kunal.sawhney
--

ALTER TABLE ONLY public.modules
    ADD CONSTRAINT modules_content_id_fkey FOREIGN KEY (content_id) REFERENCES public.course_contents(id) ON DELETE CASCADE;


--
-- Name: school_settings school_settings_school_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: kunal.sawhney
--

ALTER TABLE ONLY public.school_settings
    ADD CONSTRAINT school_settings_school_id_fkey FOREIGN KEY (school_id) REFERENCES public.schools(id) ON DELETE CASCADE;


--
-- Name: student_profiles student_profiles_school_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: kunal.sawhney
--

ALTER TABLE ONLY public.student_profiles
    ADD CONSTRAINT student_profiles_school_id_fkey FOREIGN KEY (school_id) REFERENCES public.schools(id) ON DELETE CASCADE;


--
-- Name: student_profiles student_profiles_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: kunal.sawhney
--

ALTER TABLE ONLY public.student_profiles
    ADD CONSTRAINT student_profiles_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: subscriptions subscriptions_school_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: kunal.sawhney
--

ALTER TABLE ONLY public.subscriptions
    ADD CONSTRAINT subscriptions_school_id_fkey FOREIGN KEY (school_id) REFERENCES public.schools(id) ON DELETE CASCADE;


--
-- Name: teacher_profiles teacher_profiles_school_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: kunal.sawhney
--

ALTER TABLE ONLY public.teacher_profiles
    ADD CONSTRAINT teacher_profiles_school_id_fkey FOREIGN KEY (school_id) REFERENCES public.schools(id) ON DELETE CASCADE;


--
-- Name: teacher_profiles teacher_profiles_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: kunal.sawhney
--

ALTER TABLE ONLY public.teacher_profiles
    ADD CONSTRAINT teacher_profiles_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: user_progress user_progress_enrollment_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: kunal.sawhney
--

ALTER TABLE ONLY public.user_progress
    ADD CONSTRAINT user_progress_enrollment_id_fkey FOREIGN KEY (enrollment_id) REFERENCES public.course_enrollments(id) ON DELETE CASCADE;


--
-- Name: users users_school_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: kunal.sawhney
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_school_id_fkey FOREIGN KEY (school_id) REFERENCES public.schools(id);


--
-- PostgreSQL database dump complete
--

