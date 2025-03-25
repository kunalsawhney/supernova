import { api } from '@/lib/api';
import { User } from '@/types/user';
import { 
  Course, 
  CourseViewModel, 
  transformCourse,
  CreateCourseData,
  UpdateCourseData,
  LessonViewModel,
  transformLesson,
} from '@/types/course';
import { 
  PlatformStats, 
  SystemHealth, 
  CreateUserData, 
  UpdateUserData,
  ApiUser,
  UserViewModel,
  transformUser
} from '@/types/admin';
import { 
  School, 
  CreateSchoolData, 
  UpdateSchoolData,
  SchoolViewModel,
  transformSchool
} from '@/types/school';
import { PaginationParams, ApiError } from '@/types/api';
import { mockApi, mockCourses } from '@/utils/mockData';
import { handleApiError } from '@/utils/errorHandling';
import { withCache, clearCacheByPrefix } from '@/utils/caching';
import { CreateModuleData } from '@/types/module';
import { ModuleViewModel, Module, transformModule } from '@/types/course';
import { ContentStats, ContentStatsViewModel, transformContentStats } from '@/types/content';
/**
 * Service for admin-related API calls
 */
export const adminService = {
  // Platform Overview
  /**
   * Get platform statistics
   */
  async getPlatformStats(): Promise<PlatformStats> {
    try {
      return await api.get<PlatformStats>('/admin/stats');
    } catch (error) {
      console.warn('Failed to fetch platform stats from API, using mock data', error);
      return mockApi.getPlatformStats();
    }
  },

  // Schools Management
  /**
   * Get a list of schools with optional pagination
   * @returns Transformed school view models ready for UI display
   */
  async getSchools(params?: PaginationParams): Promise<SchoolViewModel[]> {
    try {
      const schools = await api.get<School[]>('/admin/schools', { params });
      return schools.map(transformSchool);
    } catch (error) {
      console.warn('Failed to fetch schools from API, using mock data', error);
      return mockApi.getSchools();
    }
  },

  /**
   * Get a specific school by ID
   * @returns Transformed school view model ready for UI display
   */
  async getSchool(id: string): Promise<SchoolViewModel> {
    try {
      const school = await api.get<School>(`/admin/schools/${id}`);
      return transformSchool(school);
    } catch (error) {
      console.warn(`Failed to fetch school ${id} from API, using mock data`, error);
      const school = await mockApi.getSchool(id);
      if (!school) {
        throw new Error(`School with ID ${id} not found`);
      }
      return school;
    }
  },

  /**
   * Create a new school
   * @returns Transformed school view model ready for UI display
   */
  async createSchool(data: CreateSchoolData): Promise<SchoolViewModel> {
    // Ensure required fields are present
    if (!data.name || !data.domain || 
        !data.admin?.email || !data.admin?.password || !data.admin?.first_name || !data.admin?.last_name) {
      throw new Error('Missing required fields for school creation');
    }

    try {
      const school = await api.post<School>('/admin/schools', data);
      return transformSchool(school);
    } catch (error) {
      throw handleApiError(error, 'Failed to create school');
    }
  },

  /**
   * Update an existing school
   * @returns Transformed school view model ready for UI display
   */
  async updateSchool(id: string, data: UpdateSchoolData): Promise<SchoolViewModel> {
    try {
      const school = await api.put<School>(`/admin/schools/${id}`, data);
      return transformSchool(school);
    } catch (error) {
      throw handleApiError(error, `Failed to update school ${id}`);
    }
  },

  /**
   * Delete a school
   */
  async deleteSchool(id: string): Promise<void> {
    try {
      return api.delete<void>(`/admin/schools/${id}`);
    } catch (error) {
      throw handleApiError(error, `Failed to delete school ${id}`);
    }
  },

  // Users Management
  /**
   * Get a list of users with optional filtering
   * @returns Transformed user view models ready for UI display
   */
  async getUsers(params?: PaginationParams & { role?: string }): Promise<UserViewModel[]> {
    try {
      const users = await api.get<ApiUser[]>('/admin/users', { params });
      return users.map(transformUser);
    } catch (error) {
      console.warn('Failed to fetch users from API, using mock data', error);
      return mockApi.getUsers();
    }
  },

  /**
   * Get a specific user by ID
   * @returns Transformed user view model ready for UI display
   */
  async getUser(id: string): Promise<UserViewModel> {
    try {
      const user = await api.get<ApiUser>(`/admin/users/${id}`);
      return transformUser(user);
    } catch (error) {
      console.warn(`Failed to fetch user ${id} from API, using mock data`, error);
      const user = await mockApi.getUser(id);
      if (!user) {
        throw new Error(`User with ID ${id} not found`);
      }
      return user;
    }
  },

  /**
   * Create a new user
   */
  async createUser(data: CreateUserData): Promise<User> {
    try {
      const transformedData = {
        ...data,
        school_id: data.school_id === '' ? null : data.school_id,
        settings: data.settings || null,
      };
      return api.post<User>('/admin/users', transformedData);
    } catch (error) {
      throw handleApiError(error, 'Failed to create user');
    }
  },

  /**
   * Update an existing user
   */
  async updateUser(id: string, data: UpdateUserData): Promise<User> {
    try {
      return api.put<User>(`/admin/users/${id}`, data);
    } catch (error) {
      throw handleApiError(error, `Failed to update user ${id}`);
    }
  },

  /**
   * Delete a user
   */
  async deleteUser(id: string): Promise<void> {
    try {
      return api.delete<void>(`/admin/users/${id}`);
    } catch (error) {
      throw handleApiError(error, `Failed to delete user ${id}`);
    }
  },

  /**
   * Suspend a user
   * @returns Transformed user view model
   */
  async suspendUser(id: string): Promise<UserViewModel> {
    try {
      const user = await api.post<ApiUser>(`/admin/users/${id}/suspend`);
      return transformUser(user);
    } catch (error) {
      throw handleApiError(error, `Failed to suspend user ${id}`);
    }
  },

  /**
   * Reinstate a suspended user
   * @returns Transformed user view model
   */
  async reinstateUser(id: string): Promise<UserViewModel> {
    try {
      const user = await api.post<ApiUser>(`/admin/users/${id}/reinstate`);
      return transformUser(user);
    } catch (error) {
      throw handleApiError(error, `Failed to reinstate user ${id}`);
    }
  },

  // System Health
  /**
   * Get system health information
   */
  async getSystemHealth(): Promise<SystemHealth> {
    try {
      return api.get<SystemHealth>('/admin/health');
    } catch (error) {
      console.warn('Failed to fetch system health from API, using mock data', error);
      return mockApi.getSystemHealth();
    }
  },

  // Courses Management
  clearCoursesCache() {
    clearCacheByPrefix('admin_courses_list');
  },

  /**
   * Get a list of courses with optional pagination and filtering
   * @returns Transformed course view models ready for UI display
   */
  getCourses: withCache(
    async (params?: PaginationParams & { status?: string, search?: string, with_content?: boolean }): Promise<CourseViewModel[]> => {
      try {
        
        // Use trailing slash to avoid redirect
        const response = await api.get<any[]>('/courses/', { params });
        
        // Normalize each course in the response
        const courses: Course[] = response.map(courseData => ({
          ...courseData,
          content_versions: courseData.content_versions || courseData.versions || []
        }));
        
        // Transform and return without additional logging
        return courses.map(transformCourse);
      } catch (error) {
        throw handleApiError(error, 'Failed to fetch courses');
      }
    },
    (params?: PaginationParams & { status?: string, search?: string }) => {
      // Create a cache key based on the parameters
      const searchParam = params?.search ? `search_${params.search}` : '';
      const statusParam = params?.status ? `status_${params.status}` : '';
      const skipParam = params?.skip ? `skip_${params.skip}` : '';
      const limitParam = params?.limit ? `limit_${params.limit}` : '';
      return `admin_courses_list_${searchParam}_${statusParam}_${skipParam}_${limitParam}`.replace(/_{2,}/g, '_');
    },
    { ttl: 5 * 60 * 1000 } // 5 minutes cache
  ),

  /**
   * Get a specific course by ID
   * @returns Transformed course view model ready for UI display
   */
  async getCourse(id: string): Promise<CourseViewModel> {
    try {
      const response = await api.get<any>(`/courses/${id}?with_content=true`);
      
      // Normalize response structure to handle both field naming conventions
      const course: Course = {
        ...response,
        // Ensure content_versions is always available, falling back to versions if needed
        content_versions: response.content_versions || response.versions || []
      };
      
      // Store content ID for easier access
      if (course.latest_version_id) {
        localStorage.setItem(`course_${course.id}_latest_version`, course.latest_version_id);
        if (course.content_versions) {
          const latest_version = course.content_versions.find(version => version.id === course.latest_version_id);
          localStorage.setItem(`course_${course.id}_latest_content`, latest_version?.content_id || '');
        }
      } else if (course.content_versions && course.content_versions.length > 0) {
        // If we have content versions but no latest_version_id, store the first one
        localStorage.setItem(`course_${course.id}_latest_version`, course.content_versions[0].id);
        if (course.content_versions) {
          const latest_version = course.content_versions.find(version => version.id === course.latest_version_id);
          localStorage.setItem(`course_${course.id}_latest_content`, latest_version?.content_id || '');
        }
      }
      
      return transformCourse(course);
    } catch (error) {
      console.error(`Failed to fetch course ${id}:`, error);
      throw handleApiError(error, `Failed to fetch course ${id}`);
    }
  },

  /**
   * Create a new course
   * @returns Transformed course view model ready for UI display
   */
  async createCourse(data: CreateCourseData): Promise<CourseViewModel> {
    try {
      // Ensure we're only sending fields the backend API expects
      const apiData = {
        title: data.title,
        description: data.description,
        code: data.code,
        status: data.status,
        cover_image_url: data.cover_image_url,
        settings: data.settings,
        difficulty_level: data.difficulty_level,
        tags: data.tags,
        estimated_duration: data.estimated_duration,
        learning_objectives: data.learning_objectives,
        target_audience: data.target_audience,
        // The backend expects prerequisites to be UUIDs, ensure they're valid
        prerequisites: data.prerequisites,
        completion_criteria: data.completion_criteria,
        grade_level: data.grade_level,
        academic_year: data.academic_year,
        sequence_number: data.sequence_number,
        base_price: data.base_price,
        currency: data.currency,
        pricing_type: data.pricing_type
      };
      
      // Remove any undefined fields to avoid sending them to the API
      const cleanApiData = Object.fromEntries(
        Object.entries(apiData).filter(([_, value]) => value !== undefined)
      );
      const response = await api.post<any>('/courses/', cleanApiData);
      
      // Normalize response structure
      const course: Course = {
        ...response,
        content_versions: response.content_versions || response.versions || []
      };
      
      // Store the latest content ID in localStorage for easier access
      if (course.latest_version_id) {
        localStorage.setItem(`course_${course.id}_latest_version`, course.latest_version_id);
        if (course.content_versions) {
          const latest_version = course.content_versions.find(version => version.id === course.latest_version_id);
          localStorage.setItem(`course_${course.id}_latest_content`, latest_version?.content_id || '');
        }
      }
      
      return transformCourse(course);
    } catch (error: any) {
      console.error('Detailed error from create course call:', error);
      
      // Try to extract validation errors if available
      if (error.response?.data) {
        console.error('Validation errors:', JSON.stringify(error.response.data, null, 2));
      }
      
      throw handleApiError(error, 'Failed to create course');
    }
  },

  /**
   * Update an existing course
   * @returns Transformed course view model ready for UI display
   */
  async updateCourse(id: string, data: Partial<UpdateCourseData>): Promise<CourseViewModel> {
    try {
      // Further restrict data to only fields that are updatable
      // Also ensure data formats match what the backend expects
      const apiData = {
        title: data.title,
        description: data.description,
        code: data.code,
        status: data.status,
        cover_image_url: data.cover_image_url,
        difficulty_level: data.difficulty_level,
        tags: data.tags,
        estimated_duration: data.estimated_duration,
        learning_objectives: data.learning_objectives,
        target_audience: data.target_audience,
        // The backend expects prerequisites to be UUIDs, ensure they're valid
        prerequisites: data.prerequisites,
        completion_criteria: data.completion_criteria,
        grade_level: data.grade_level,
        academic_year: data.academic_year,
        sequence_number: data.sequence_number,
        base_price: data.base_price,
        currency: data.currency,
        pricing_type: data.pricing_type,
        metadata: data.metadata
      };
      
      // Remove any undefined fields to avoid sending them to the API
      const cleanApiData = Object.fromEntries(
        Object.entries(apiData).filter(([_, value]) => value !== undefined)
      );
      
      const response = await api.put<any>(`/courses/${id}/`, cleanApiData);
      
      // Normalize response structure
      const course: Course = {
        ...response,
        content_versions: response.content_versions || response.versions || []
      };
      
      return transformCourse(course);
    } catch (error: any) {
      console.error('Detailed error from update course call:', error);
      
      // Try to extract validation errors if available
      if (error.response?.data) {
        console.error('Validation errors:', JSON.stringify(error.response.data, null, 2));
      }
      
      throw handleApiError(error, `Failed to update course ${id}`);
    }
  },

  /**
   * Delete a course
   */
  async deleteCourse(id: string): Promise<void> {
    try {
      await api.delete<void>(`/courses/${id}/`);
    } catch (error) {
      throw handleApiError(error, `Failed to delete course ${id}`);
    }
  },

  // Modules Management
  /**
   * Get a list of modules with optional filtering
   */
  async getModules(params?: { 
    skip?: number; 
    limit?: number; 
    status?: string; 
    course_id?: string;
    search?: string;
  }): Promise<ModuleViewModel[]> {
    try {
      
      const response = await api.get<any[]>('/modules/', { params });
      
      // Transform the modules without logging
      return response.map(module => transformModule(module));
    } catch (error) {
      throw handleApiError(error, 'Failed to fetch modules');
    }
  },

  /**
   * Get a specific module by ID
   */
  async getModule(id: string, with_lessons: boolean = false): Promise<any> {
    try {
      const response = await api.get<any>(`/modules/${id}?with_lessons=${with_lessons}`);
      const module: Module = {
        ...response,
        lessons: response.lessons || []
      };
      return transformModule(module);
    } catch (error) {
      throw handleApiError(error, `Failed to fetch module ${id}`);
    }
  },

  /**
   * Add a module to a course's content
   */
  async addModule(data: CreateModuleData): Promise<ModuleViewModel> {
    try {
      const module = await api.post<Module>(`/courses/content/${data.content_id}/modules`, data);
      return transformModule(module);
    } catch (error) {
      throw handleApiError(error, 'Failed to add module');
    }
  },

  /**
   * Delete a module
   */
  async deleteModule(moduleId: string): Promise<void> {
    try {
      await api.delete(`/courses/modules/${moduleId}/`);
      clearCacheByPrefix(`course_${moduleId}`);
    } catch (error) {
      throw handleApiError(error, `Failed to delete module ${moduleId}`);
    }
  },

  // Lessons Management
  /**
   * Get a list of lessons with optional filtering
   */
  async getLessons(params?: { 
    skip?: number; 
    limit?: number; 
    module_id?: string;
    lesson_type?: string;
    search?: string;
  }): Promise<LessonViewModel[]> {
    try {
      const response = await api.get<any[]>('/lessons', { params });
      return response.map(transformLesson);
    } catch (error) {
      throw handleApiError(error, 'Failed to fetch lessons');
    }
  },

  /**
   * Get a specific lesson by ID
   */
  async getLesson(id: string): Promise<LessonViewModel> {
    try {
      const response = await api.get<any>(`/lessons/${id}`);
      return transformLesson(response);
    } catch (error) {
      throw handleApiError(error, `Failed to fetch lesson ${id}`);
    }
  },

  /**
   * Add a lesson to a module
   */
  async addLesson(moduleId: string, data: any): Promise<any> {
    try {
      const response = await api.post(`/modules/${moduleId}/lessons`, data);
      return response;
    } catch (error) {
      throw handleApiError(error, 'Failed to add lesson');
    }
  },

  /**
   * Delete a lesson
   */
  async deleteLesson(lessonId: string): Promise<void> {
    try {
      await api.delete(`/courses/lessons/${lessonId}/`);
    } catch (error) {
      throw handleApiError(error, `Failed to delete lesson ${lessonId}`);
    }
  },

  /**
   * Get content statistics for the dashboard
   */
  async getContentStats(): Promise<ContentStatsViewModel> {
    try {
      const response = await api.get<ContentStats>('/admin/content/stats');
      // Transform the response to match the ContentStats type
      return transformContentStats(response);
    } catch (error) {
      throw handleApiError(error, 'Failed to fetch content statistics');
    }
  },

  /**
   * Get modules for a specific course
   * @returns Transformed module view models ready for UI display
   */
  async getCourseModules(courseId: string, params?: { status?: string }): Promise<ModuleViewModel[]> {
    try {
      const modules = await api.get<any[]>(`/courses/${courseId}/modules/`, { params });
      return modules.map(module => ({
        id: module.id,
        title: module.title,
        description: module.description,
        courseId: courseId,
        sequenceNumber: module.order,
        lessonCount: module.lessons?.length || 0,
        totalDuration: module.lessons?.reduce((total: number, lesson: any) => total + (lesson.duration_minutes || 0), 0) || 0,
        status: module.status,
        createdAt: module.created_at,
        updatedAt: module.updated_at
      }));
    } catch (error) {
      throw handleApiError(error, `Failed to fetch modules for course ${courseId}`);
    }
  },

  /**
   * Get a specific module by ID
   * @returns Transformed module view model ready for UI display
   */
  async getModuleById(moduleId: string): Promise<ModuleViewModel> {
    try {
      const module = await api.get<any>(`/modules/${moduleId}/`);
      return {
        id: module.id,
        title: module.title,
        description: module.description,
        courseId: '', // This needs to be determined from the content relationship
        sequenceNumber: module.order,
        lessonCount: module.lessons?.length || 0,
        totalDuration: module.lessons?.reduce((total: number, lesson: any) => total + (lesson.duration_minutes || 0), 0) || 0,
        status: module.status,
        createdAt: module.created_at,
        updatedAt: module.updated_at
      };
    } catch (error) {
      throw handleApiError(error, `Failed to fetch module ${moduleId}`);
    }
  },

  /**
   * Update an existing module
   * @returns Transformed module view model ready for UI display
   */
  async updateModule(moduleId: string, data: Partial<{
    title: string;
    description?: string;
    order?: number;
    status?: string;
  }>): Promise<ModuleViewModel> {
    try {
      const module = await api.put<any>(`/modules/${moduleId}/`, data);
      return {
        id: module.id,
        title: module.title,
        description: module.description,
        courseId: '', // This needs to be determined from the content relationship
        sequenceNumber: module.order,
        lessonCount: module.lessons?.length || 0,
        totalDuration: module.lessons?.reduce((total: number, lesson: any) => total + (lesson.duration_minutes || 0), 0) || 0,
        status: module.status,
        createdAt: module.created_at,
        updatedAt: module.updated_at
      };
    } catch (error) {
      throw handleApiError(error, `Failed to update module ${moduleId}`);
    }
  },
  
  /**
   * Save course as draft
   */
  async saveCourseAsDraft(data: {
    id: string | null;
    step: number;
    data: any;
    lastModified: string;
  }): Promise<{ id: string }> {
    try {
      if (data.id) {
        // Update existing draft
        const response = await api.put<{ id: string }>(`/admin/courses/drafts/${data.id}`, data);
        return response;
      } else {
        // Create new draft
        const response = await api.post<{ id: string }>('/admin/courses/drafts', data);
        return response;
      }
    } catch (error) {
      // For now, return a mock ID in development
      if (process.env.NODE_ENV === 'development') {
        console.warn('Using mock draft ID in development');
        return { id: data.id || 'draft-' + Date.now() };
      }
      throw handleApiError(error, 'Failed to save course draft');
    }
  },
}; 