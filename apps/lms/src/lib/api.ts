import axios, { InternalAxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
import { User } from '@/types/user';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

// Extend the InternalAxiosRequestConfig type to include _retry
interface ExtendedAxiosRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for adding auth token
api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = localStorage.getItem('token');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor for handling token refresh
api.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as ExtendedAxiosRequestConfig;

    // If the error is 401 and we haven't retried yet
    if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Try to refresh the token
        const refreshToken = localStorage.getItem('refresh_token');
        const response = await api.post<{ access_token: string; refresh_token: string; token_type: string }>(
          '/auth/refresh',
          { refresh_token: refreshToken }
        );

        const { access_token, refresh_token } = response.data;

        // Store both tokens in localStorage
        localStorage.setItem('token', access_token);
        localStorage.setItem('refresh_token', refresh_token);

        // Store both tokens in cookies for middleware
        document.cookie = `token=${access_token}; path=/`;
        document.cookie = `refresh_token=${refresh_token}; path=/`;

        // Retry the original request with the new token
        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${access_token}`;
        }
        return api(originalRequest);
      } catch (refreshError) {
        // If refresh fails, redirect to login
        localStorage.removeItem('token');
        localStorage.removeItem('refresh_token');
        // Clear cookies too
        document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT';
        document.cookie = 'refresh_token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT';
        window.location.href = '/';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

// Auth endpoints
export const auth = {
  login: async (email: string, password: string) => {
    const response = await api.post<{ access_token: string; refresh_token: string; token_type: string }>(
      '/auth/login',
      { username: email, password }
    );
    return response.data;
  },
  refreshToken: async (refreshToken: string) => {
    const response = await api.post<{ access_token: string; refresh_token: string; token_type: string }>(
      '/auth/refresh',
      { refresh_token: refreshToken }
    );
    return response.data;
  },
};

// User endpoints
export const users = {
  me: async () => {
    const response = await api.get<User>('/users/me');
    return response.data;
  },
  update: async (data: Partial<User>) => {
    const response = await api.put<User>('/users/me', data);
    return response.data;
  },
};

// Course endpoints
export interface Course {
  id: string;
  name: string;
  description: string;
  instructor: string;
  duration: string;
  level: string;
  status: string;
  image?: string;
}

export const courses = {
  list: async (params?: { skip?: number; limit?: number; status?: string; search?: string }) => {
    const response = await api.get<Course[]>('/courses', { params });
    return response.data;
  },
  get: async (id: string) => {
    const response = await api.get<Course>(`/courses/${id}`);
    return response.data;
  },
  enroll: async (courseId: string) => {
    const response = await api.post<{ id: string }>('/enrollments/individual', { course_id: courseId });
    return response.data;
  },
};

// Enrollment endpoints
export interface Enrollment {
  id: string;
  user_id: string;
  course_id: string;
  status: string;
  progress: number;
  last_accessed: string;
}

export interface Progress {
  lesson_id: string;
  completed: boolean;
  score?: number;
  time_spent: number;
}

export const enrollments = {
  list: async (params?: { course_id?: string; status?: string; skip?: number; limit?: number }) => {
    const response = await api.get<Enrollment[]>('/enrollments', { params });
    return response.data;
  },
  getProgress: async (enrollmentId: string) => {
    const response = await api.get<Progress[]>(`/enrollments/${enrollmentId}/progress`);
    return response.data;
  },
  updateProgress: async (enrollmentId: string, data: Partial<Progress>) => {
    const response = await api.post<Progress>(`/enrollments/${enrollmentId}/progress`, data);
    return response.data;
  },
};

export default api; 