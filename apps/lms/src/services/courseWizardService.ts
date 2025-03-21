import { api } from '@/lib/api';
import { 
  Course, 
  CourseViewModel, 
  transformCourse,
  CreateCourseData,
} from '@/types/course';
import { ModuleViewModel, CreateModuleData, transformModule } from '@/types/module';
import { handleApiError } from '@/utils/errorHandling';

/**
 * Service for course wizard related API calls
 */
export const courseWizardService = {
  /**
   * Create a new course with the details from the first step
   * @returns Course with ID and version information
   */
  async createCourse(data: CreateCourseData): Promise<{
    id: string;
    content_id: string;
    version_id: string;
  }> {
    try {
      console.log('Creating new course', data);
      const response = await api.post<{
        id: string;
        content_id: string;
        version_id: string;
      }>('/courses', data);
      console.log('Course created', response);
      return response;
    } catch (error) {
      throw handleApiError(error, 'Failed to create course');
    }
  },

  /**
   * Add a module to a course
   * @returns Module with ID information
   */
  async addModule(contentId: string, moduleData: CreateModuleData): Promise<{
    id: string;
  }> {
    try {
      console.log('Adding module', moduleData);
      const response = await api.post<{
        id: string;
      }>(`/courses/content/${contentId}/modules`, moduleData);
      console.log('Module added', response);
      return response;
    } catch (error) {
      throw handleApiError(error, 'Failed to add module');
    }
  },

  /**
   * Add a lesson to a module
   * @returns Lesson with ID information
   */
  async addLesson(moduleId: string, lessonData: any): Promise<{
    id: string;
  }> {
    try {
      console.log('Adding lesson', lessonData);
      const response = await api.post<{
        id: string;
      }>(`/courses/modules/${moduleId}/lessons`, lessonData);
      console.log('Lesson added', response);
      return response;
    } catch (error) {
      throw handleApiError(error, 'Failed to add lesson');
    }
  },

  /**
   * Update an existing course
   * @returns Updated course information
   */
  async updateCourse(courseId: string, data: Partial<CreateCourseData>): Promise<{
    id: string;
  }> {
    try {
      const response = await api.put<{
        id: string;
      }>(`/api/v1/courses/${courseId}`, data);
      
      return response;
    } catch (error) {
      throw handleApiError(error, `Failed to update course ${courseId}`);
    }
  },

  /**
   * Update an existing module
   * @returns Updated module information
   */
  async updateModule(moduleId: string, data: Partial<CreateModuleData>): Promise<{
    id: string;
  }> {
    try {
      const response = await api.put<{
        id: string;
      }>(`/api/v1/modules/${moduleId}`, data);
      
      return response;
    } catch (error) {
      throw handleApiError(error, `Failed to update module ${moduleId}`);
    }
  },

  /**
   * Update an existing lesson
   * @returns Updated lesson information
   */
  async updateLesson(lessonId: string, data: any): Promise<{
    id: string;
  }> {
    try {
      const response = await api.put<{
        id: string;
      }>(`/api/v1/lessons/${lessonId}`, data);
      
      return response;
    } catch (error) {
      throw handleApiError(error, `Failed to update lesson ${lessonId}`);
    }
  }
}; 