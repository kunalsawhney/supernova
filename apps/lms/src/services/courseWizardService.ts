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
   * Get course structure with all modules and lessons
   */
  async getCourseStructure(courseId: string): Promise<any> {
    try {
      const response = await api.get<any>(`/api/v1/courses/${courseId}/structure`);
      return response;
    } catch (error) {
      throw handleApiError(error, `Failed to get course structure for ${courseId}`);
    }
  },

  /**
   * Get all modules for a course
   */
  async getModules(courseId: string): Promise<any[]> {
    try {
      const response = await api.get<any[]>(`/api/v1/courses/${courseId}/modules`);
      return response;
    } catch (error) {
      throw handleApiError(error, `Failed to get modules for course ${courseId}`);
    }
  },

  async getAllModules(): Promise<any[]> {
    try {
      console.log('Getting all modules');
      const response = await api.get<any[]>(`/modules/`);
      console.log('Modules fetched', response);
      return response;
    } catch (error) {
      throw handleApiError(error, `Failed to get all modules`);
    }
  },

  /**
   * Get specific module details
   */
  async getModule(moduleId: string): Promise<any> {
    try {
      const response = await api.get<any>(`/api/v1/modules/${moduleId}`);
      return response;
    } catch (error) {
      throw handleApiError(error, `Failed to get module ${moduleId}`);
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
   * Reorder modules within a course
   */
  async reorderModules(moduleIds: { id: string; sequence_number: number }[]): Promise<void> {
    try {
      await api.put(`/api/v1/modules/reorder`, { modules: moduleIds });
    } catch (error) {
      throw handleApiError(error, 'Failed to reorder modules');
    }
  },

  /**
   * Delete a module
   */
  async deleteModule(moduleId: string): Promise<void> {
    try {
      await api.delete(`/api/v1/modules/${moduleId}`);
    } catch (error) {
      throw handleApiError(error, `Failed to delete module ${moduleId}`);
    }
  },

  /**
   * Get all lessons for a module
   */
  async getLessons(moduleId: string): Promise<any[]> {
    try {
      const response = await api.get<any[]>(`/api/v1/lessons?module_id=${moduleId}`);
      return response;
    } catch (error) {
      throw handleApiError(error, `Failed to get lessons for module ${moduleId}`);
    }
  },

  /**
   * Get specific lesson details
   */
  async getLesson(lessonId: string): Promise<any> {
    try {
      const response = await api.get<any>(`/api/v1/lessons/${lessonId}`);
      return response;
    } catch (error) {
      throw handleApiError(error, `Failed to get lesson ${lessonId}`);
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
   * Reorder lessons within a module
   */
  async reorderLessons(moduleId: string, lessonIds: { id: string; sequence_number: number }[]): Promise<void> {
    try {
      await api.put(`/api/v1/lessons/reorder`, { 
        module_id: moduleId,
        lessons: lessonIds 
      });
    } catch (error) {
      throw handleApiError(error, 'Failed to reorder lessons');
    }
  },

  /**
   * Delete a lesson
   */
  async deleteLesson(lessonId: string): Promise<void> {
    try {
      await api.delete(`/api/v1/lessons/${lessonId}`);
    } catch (error) {
      throw handleApiError(error, `Failed to delete lesson ${lessonId}`);
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
  },
  
  /**
   * Create a new course version
   */
  async createCourseVersion(courseId: string, versionData: any): Promise<{
    version_id: string;
  }> {
    try {
      const response = await api.post<{
        version_id: string;
      }>(`/api/v1/courses/${courseId}/versions`, versionData);
      
      return response;
    } catch (error) {
      throw handleApiError(error, `Failed to create version for course ${courseId}`);
    }
  },
  
  /**
   * Get available versions for a course
   */
  async getCourseVersions(courseId: string): Promise<any[]> {
    try {
      const response = await api.get<any[]>(`/api/v1/courses/${courseId}/versions`);
      return response;
    } catch (error) {
      throw handleApiError(error, `Failed to get versions for course ${courseId}`);
    }
  }
}; 