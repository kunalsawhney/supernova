import { api } from '@/lib/api';
import { User } from '@/types/user';
import { 
  Course, 
  CourseViewModel, 
  transformCourse,
  CreateCourseData
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
  /**
   * Get a list of courses with optional pagination
   * @returns Transformed course view models ready for UI display
   */
  async getCourses(params?: PaginationParams): Promise<CourseViewModel[]> {
    try {
      const courses = await api.get<Course[]>('/admin/courses', { params });
      return courses.map(transformCourse);
    } catch (error) {
      console.warn('Failed to fetch courses from API, using mock data', error);
      return mockApi.getCourses();
    }
  },

  /**
   * Get a specific course by ID
   * @returns Transformed course view model ready for UI display
   */
  async getCourse(id: string): Promise<CourseViewModel> {
    try {
      const course = await api.get<Course>(`/admin/courses/${id}`);
      return transformCourse(course);
    } catch (error) {
      console.warn(`Failed to fetch course ${id} from API, using mock data`, error);
      const course = await mockApi.getCourse(id);
      if (!course) {
        throw new Error(`Course with ID ${id} not found`);
      }
      return course;
    }
  },

  /**
   * Create a new course
   * @returns Transformed course view model ready for UI display
   */
  async createCourse(data: CreateCourseData): Promise<CourseViewModel> {
    // Ensure required fields are present
    if (!data.title || !data.code || !data.status || !data.difficulty_level || 
        !data.grade_level || !data.academic_year || typeof data.sequence_number !== 'number') {
      throw new Error('Missing required fields for course creation');
    }

    try {
      const course = await api.post<Course>('/admin/courses', data);
      return transformCourse(course);
    } catch (error) {
      throw handleApiError(error, 'Failed to create course');
    }
  },

  /**
   * Update an existing course
   * @returns Transformed course view model ready for UI display
   */
  async updateCourse(id: string, data: Partial<Course>): Promise<CourseViewModel> {
    try {
      const course = await api.put<Course>(`/admin/courses/${id}`, data);
      return transformCourse(course);
    } catch (error) {
      throw handleApiError(error, `Failed to update course ${id}`);
    }
  },

  /**
   * Delete a course
   */
  async deleteCourse(id: string): Promise<void> {
    try {
      return api.delete<void>(`/admin/courses/${id}`);
    } catch (error) {
      throw handleApiError(error, `Failed to delete course ${id}`);
    }
  },
}; 