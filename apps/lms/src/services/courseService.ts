import { api } from '@/lib/api';
import { 
  Course, 
  CreateCourseData, 
  CourseViewModel, 
  CourseContentViewModel, 
  CourseReviewViewModel,
  transformCourse,
  transformCourseContent,
  transformCourseReview
} from '@/types/course';
import { PaginationParams, SearchParams } from '@/types/api';
import { withCache, clearCacheByPrefix } from '@/utils/caching';

/**
 * Service for course-related API calls
 */
export const courseService = {
  /**
   * Get a list of courses with optional filtering
   * @returns Transformed course view models ready for UI display
   */
  getCourses: withCache(
    async (params?: SearchParams & { status?: string }): Promise<CourseViewModel[]> => {
      const courses = await api.get<Course[]>('/courses', { params });
      return courses.map(transformCourse);
    },
    (params?: SearchParams & { status?: string }) => {
      // Create a cache key based on the parameters
      const searchParam = params?.search ? `search_${params.search}` : '';
      const statusParam = params?.status ? `status_${params.status}` : '';
      const skipParam = params?.skip ? `skip_${params.skip}` : '';
      const limitParam = params?.limit ? `limit_${params.limit}` : '';
      return `courses_list_${searchParam}_${statusParam}_${skipParam}_${limitParam}`.replace(/_{2,}/g, '_');
    },
    { ttl: 5 * 60 * 1000 } // 5 minutes cache
  ),

  /**
   * Get a specific course by ID
   * @returns Transformed course view model ready for UI display
   */
  getCourse: withCache(
    async (id: string): Promise<CourseViewModel> => {
      const course = await api.get<Course>(`/courses/${id}`);
      return transformCourse(course);
    },
    (id: string) => `course_${id}`,
    { ttl: 10 * 60 * 1000 } // 10 minutes cache
  ),

  /**
   * Enroll the current user in a course
   */
  async enrollInCourse(courseId: string): Promise<{ id: string }> {
    const result = await api.post<{ id: string }>('/enrollments/individual', { course_id: courseId });
    // Clear course-related caches when enrolling
    clearCacheByPrefix(`course_${courseId}`);
    return result;
  },

  /**
   * Get course content (lessons, modules, etc.)
   * @returns Transformed course content view model ready for UI display
   */
  getCourseContent: withCache(
    async (courseId: string): Promise<CourseContentViewModel> => {
      const content = await api.get<any>(`/courses/${courseId}/content`);
      return transformCourseContent(content);
    },
    (courseId: string) => `course_${courseId}_content`,
    { ttl: 15 * 60 * 1000 } // 15 minutes cache
  ),

  /**
   * Get course reviews
   * @returns Transformed course review view models ready for UI display
   */
  getCourseReviews: withCache(
    async (courseId: string, params?: PaginationParams): Promise<CourseReviewViewModel[]> => {
      const reviews = await api.get<any[]>(`/courses/${courseId}/reviews`, { params });
      return reviews.map(transformCourseReview);
    },
    (courseId: string, params?: PaginationParams) => {
      const skipParam = params?.skip ? `skip_${params.skip}` : '';
      const limitParam = params?.limit ? `limit_${params.limit}` : '';
      return `course_${courseId}_reviews_${skipParam}_${limitParam}`.replace(/_{2,}/g, '_');
    },
    { ttl: 10 * 60 * 1000 } // 10 minutes cache
  ),

  /**
   * Submit a review for a course
   */
  async submitCourseReview(courseId: string, data: { rating: number; comment?: string }): Promise<CourseReviewViewModel> {
    const result = await api.post<any>(`/courses/${courseId}/reviews`, data);
    // Clear course reviews cache when submitting a new review
    clearCacheByPrefix(`course_${courseId}_reviews`);
    return transformCourseReview(result);
  },

  /**
   * Get related courses
   * @returns Transformed course view models ready for UI display
   */
  getRelatedCourses: withCache(
    async (courseId: string, limit: number = 4): Promise<CourseViewModel[]> => {
      const courses = await api.get<Course[]>(`/courses/${courseId}/related`, { params: { limit } });
      return courses.map(transformCourse);
    },
    (courseId: string, limit: number = 4) => `course_${courseId}_related_limit_${limit}`,
    { ttl: 30 * 60 * 1000 } // 30 minutes cache for related courses
  )
}; 