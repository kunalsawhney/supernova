import { PaginationParams } from './api';

export interface Course {
  id: string;
  title: string;
  code: string;
  description: string;
  status: string;
  difficulty_level: string;
  grade_level: string;
  academic_year: string;
  sequence_number: number;
  created_at: string;
  updated_at: string;
  school_id?: string;
  instructor_id?: string;
  thumbnail_url?: string;
  duration_minutes?: number;
  prerequisites?: string[];
  tags?: string[];
  metadata?: Record<string, any>;
}

export interface CreateCourseData {
  title: string;
  code: string;
  description: string;
  status: string;
  difficulty_level: string;
  grade_level: string;
  academic_year: string;
  sequence_number: number;
  school_id?: string;
  instructor_id?: string;
  thumbnail_url?: string;
  duration_minutes?: number;
  prerequisites?: string[];
  tags?: string[];
  metadata?: Record<string, any>;
}

// View Models for UI
export interface CourseViewModel {
  id: string;
  title: string;
  code: string;
  description: string;
  status: string;
  difficultyLevel: string;
  gradeLevel: string;
  academicYear: string;
  sequenceNumber: number;
  createdAt: string;
  updatedAt: string;
  schoolId?: string;
  instructorId?: string;
  thumbnailUrl?: string;
  durationMinutes?: number;
  prerequisites?: string[];
  tags?: string[];
  metadata?: Record<string, any>;
}

export interface CourseContentViewModel {
  id: string;
  title: string;
  description?: string;
  modules: ModuleViewModel[];
  resources?: ResourceViewModel[];
}

export interface ModuleViewModel {
  id: string;
  title: string;
  description?: string;
  order: number;
  lessons: LessonViewModel[];
}

export interface LessonViewModel {
  id: string;
  title: string;
  description?: string;
  order: number;
  type: string;
  content: any;
  duration?: number;
  hasQuiz: boolean;
}

export interface ResourceViewModel {
  id: string;
  title: string;
  type: string;
  url: string;
  description?: string;
}

export interface CourseReviewViewModel {
  id: string;
  userId: string;
  userName: string;
  rating: number;
  comment?: string;
  createdAt: string;
}

// Transformation functions
export const transformCourse = (course: Course): CourseViewModel => ({
  id: course.id,
  title: course.title,
  code: course.code,
  description: course.description,
  status: course.status,
  difficultyLevel: course.difficulty_level,
  gradeLevel: course.grade_level,
  academicYear: course.academic_year,
  sequenceNumber: course.sequence_number,
  createdAt: course.created_at,
  updatedAt: course.updated_at,
  schoolId: course.school_id,
  instructorId: course.instructor_id,
  thumbnailUrl: course.thumbnail_url,
  durationMinutes: course.duration_minutes,
  prerequisites: course.prerequisites,
  tags: course.tags,
  metadata: course.metadata,
});

export const transformCourseContent = (content: any): CourseContentViewModel => ({
  id: content.id,
  title: content.title,
  description: content.description,
  modules: Array.isArray(content.modules) 
    ? content.modules.map((module: any) => ({
        id: module.id,
        title: module.title,
        description: module.description,
        order: module.order || 0,
        lessons: Array.isArray(module.lessons) 
          ? module.lessons.map((lesson: any) => ({
              id: lesson.id,
              title: lesson.title,
              description: lesson.description,
              order: lesson.order || 0,
              type: lesson.type,
              content: lesson.content,
              duration: lesson.duration,
              hasQuiz: !!lesson.has_quiz,
            }))
          : [],
      }))
    : [],
  resources: Array.isArray(content.resources)
    ? content.resources.map((resource: any) => ({
        id: resource.id,
        title: resource.title,
        type: resource.type,
        url: resource.url,
        description: resource.description,
      }))
    : [],
});

export const transformCourseReview = (review: any): CourseReviewViewModel => ({
  id: review.id,
  userId: review.user_id,
  userName: review.user_name || 'Anonymous',
  rating: review.rating,
  comment: review.comment,
  createdAt: review.created_at,
}); 