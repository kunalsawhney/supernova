import { PaginationParams } from './api';

export interface Course {
  id: string;
  title: string;
  description: string;
  code: string;
  status: string;
  cover_image_url?: string;
  settings?: Record<string, any>;
  difficulty_level: string;
  tags?: string[];
  estimated_duration?: number;
  learning_objectives?: string[];
  target_audience?: string[];
  prerequisites?: string[];
  completion_criteria?: Record<string, any>;
  grade_level: string;
  academic_year: string;
  sequence_number: number;
  base_price?: number;
  currency?: string;
  pricing_type?: string;
  created_by_id: string;
  latest_version_id: string;
  created_at: string;
  updated_at: string;
  is_active: boolean;
  is_deleted: boolean;
  deleted_at?: string;

}

export type CourseStatus = 'draft' | 'published' | 'archived';
export type DifficultyLevel = 'beginner' | 'intermediate' | 'advanced';
export type PricingType = 'one-time' | 'subscription';

export interface CreateCourseData {
  title: string;
  description: string;
  code: string;
  status: CourseStatus;
  cover_image_url?: string;
  settings?: Record<string, any>;
  difficulty_level: DifficultyLevel;
  tags?: string[];
  estimated_duration?: number;  // in hours
  learning_objectives?: string[];
  target_audience?: string[];
  prerequisites?: string[];
  completion_criteria?: Record<string, any>;
  grade_level: string;
  academic_year: string;
  sequence_number: number;
  base_price?: number;
  currency?: string;
  pricing_type?: PricingType;
}

export interface UpdateCourseData {
  id: string;
  title?: string;
  description?: string;
  code?: string;
  status?: CourseStatus;
  cover_image_url?: string;
  difficulty_level?: DifficultyLevel;
  tags?: string[];
  estimated_duration?: number;
  learning_objectives?: string[];
  target_audience?: string[];
  prerequisites?: string[];
  completion_criteria?: Record<string, any>;
  grade_level?: string;
  academic_year?: string;
  sequence_number?: number;
  base_price?: number;
  currency?: string;
  pricing_type?: PricingType;
  metadata?: Record<string, any>;
}


// View Models for UI
export interface CourseViewModel {
  id: string;
  title: string;
  description: string;
  code: string;
  status: string;
  coverImageUrl?: string;
  settings?: Record<string, any>;
  difficultyLevel?: string;
  tags?: string[];
  estimatedDuration?: number;
  learningObjectives?: string[];
  targetAudience?: string[];
  prerequisites?: string[];
  completionCriteria?: Record<string, any>;
  gradeLevel?: string;
  academicYear?: string;
  sequenceNumber?: number;
  basePrice?: number;
  currency?: string;
  pricingType?: string;
  createdById: string;
  latestVersionId: string;
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
  isDeleted: boolean;
  deletedAt?: string;
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
  description: course.description,
  code: course.code,
  status: course.status,
  coverImageUrl: course.cover_image_url,
  settings: course.settings,
  difficultyLevel: course.difficulty_level,
  tags: course.tags,
  estimatedDuration: course.estimated_duration,
  learningObjectives: course.learning_objectives,
  targetAudience: course.target_audience,
  prerequisites: course.prerequisites,
  completionCriteria: course.completion_criteria,
  gradeLevel: course.grade_level,
  academicYear: course.academic_year,
  sequenceNumber: course.sequence_number,
  basePrice: course.base_price,
  currency: course.currency,
  pricingType: course.pricing_type,
  createdById: course.created_by_id,
  latestVersionId: course.latest_version_id,
  createdAt: course.created_at,
  updatedAt: course.updated_at,
  isActive: course.is_active,
  isDeleted: course.is_deleted,
  deletedAt: course.deleted_at,
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