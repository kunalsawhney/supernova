import { api } from '@/lib/api';
import { 
  Enrollment, 
  Progress, 
  EnrollmentProgress, 
  UpdateProgressData,
  EnrollmentViewModel,
  ProgressViewModel,
  EnrollmentProgressViewModel,
  transformEnrollment,
  transformProgress,
  transformEnrollmentProgress
} from '@/types/enrollment';
import { PaginationParams } from '@/types/api';

/**
 * Service for enrollment-related API calls
 */
export const enrollmentService = {
  /**
   * Get a list of enrollments with optional filtering
   * @returns Transformed enrollment view models ready for UI display
   */
  async getEnrollments(params?: PaginationParams & { 
    course_id?: string; 
    status?: string; 
  }): Promise<EnrollmentViewModel[]> {
    const enrollments = await api.get<Enrollment[]>('/enrollments/', { params });
    return enrollments.map(transformEnrollment);
  },

  /**
   * Get a specific enrollment by ID
   * @returns Transformed enrollment view model ready for UI display
   */
  async getEnrollment(id: string): Promise<EnrollmentViewModel> {
    const enrollment = await api.get<Enrollment>(`/enrollments/${id}`);
    return transformEnrollment(enrollment);
  },

  /**
   * Get progress for a specific enrollment
   * @returns Transformed progress view models ready for UI display
   */
  async getProgress(enrollmentId: string): Promise<ProgressViewModel[]> {
    const progressItems = await api.get<Progress[]>(`/enrollments/${enrollmentId}/progress`);
    return progressItems.map(transformProgress);
  },

  /**
   * Update progress for a specific enrollment
   * @returns Transformed progress view model ready for UI display
   */
  async updateProgress(enrollmentId: string, data: UpdateProgressData): Promise<ProgressViewModel> {
    const progress = await api.post<Progress>(`/enrollments/${enrollmentId}/progress`, data);
    return transformProgress(progress);
  },

  /**
   * Get overall progress for a specific enrollment
   * @returns Transformed enrollment progress view model ready for UI display
   */
  async getOverallProgress(enrollmentId: string): Promise<EnrollmentProgressViewModel> {
    const progress = await api.get<EnrollmentProgress>(`/enrollments/${enrollmentId}/progress`);
    return transformEnrollmentProgress(progress);
  },

  /**
   * Complete a course
   * @returns Transformed enrollment view model ready for UI display
   */
  async completeCourse(enrollmentId: string): Promise<EnrollmentViewModel> {
    const enrollment = await api.post<Enrollment>(`/enrollments/${enrollmentId}/complete`);
    return transformEnrollment(enrollment);
  },

  /**
   * Unenroll from a course
   */
  async unenroll(enrollmentId: string): Promise<void> {
    return api.delete<void>(`/enrollments/${enrollmentId}`);
  }
}; 