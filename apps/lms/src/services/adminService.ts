import { api } from '@/lib/api';
import { User } from '@/types/user';

interface PlatformStats {
  totalUsers: number;
  totalSchools: number;
  totalRevenue: string;
  activeUsers: string;
}

interface School {
  id: string;
  name: string;
  code: string;
  domain: string;
  description?: string;
  contact_email: string;
  contact_phone?: string;
  timezone: string;
  address?: string;
  settings?: Record<string, any>;
  logo_url?: string;
  subscription_status: 'trial' | 'active' | 'expired' | 'cancelled' | 'past_due';
  trial_ends_at?: string;
  max_students: number;
  max_teachers: number;
  features_enabled?: Record<string, any>;
  created_at: string;
  updated_at: string;
}

interface CreateSchoolData {
  name: string;
  code: string;
  domain: string;
  description?: string;
  contact_email: string;
  contact_phone?: string;
  timezone: string;
  address?: string;
  settings?: Record<string, any>;
  logo_url?: string;
  subscription_status: 'trial' | 'active' | 'expired' | 'cancelled' | 'past_due';
  max_students: number;
  max_teachers: number;
  features_enabled?: Record<string, any>;
  admin: {
    email: string;
    password: string;
    first_name: string;
    last_name: string;
  };
}

interface SystemHealth {
  serverStatus: string;
  uptime: string;
  responseTime: string;
  activeConnections: number;
  cpuUsage: string;
  memoryUsage: string;
  storageUsed: string;
  lastBackup: string;
}

interface CreateUserData {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  role: string;
  school_id?: string;
  settings?: Record<string, any> | null;
}

interface UpdateUserData {
  first_name?: string;
  last_name?: string;
  role?: string;
  school_id?: string;
}

export const adminService = {
  // Platform Overview
  async getPlatformStats(): Promise<PlatformStats> {
    const response = await api.get('/admin/stats');
    return response.data;
  },

  // Schools Management
  async getSchools(params?: { skip?: number; limit?: number }): Promise<School[]> {
    const response = await api.get('/admin/schools', { params });
    return response.data;
  },

  async getSchool(id: string): Promise<School> {
    const response = await api.get(`/admin/schools/${id}`);
    return response.data;
  },

  async createSchool(data: CreateSchoolData): Promise<School> {
    // Ensure required fields are present
    if (!data.name || !data.domain || 
        !data.admin?.email || !data.admin?.password || !data.admin?.first_name || !data.admin?.last_name) {
      throw new Error('Missing required fields for school creation');
    }

    const response = await api.post('/admin/schools', data);
    return response.data;
  },

  async updateSchool(id: string, data: Partial<School>): Promise<School> {
    const response = await api.put(`/admin/schools/${id}`, data);
    return response.data;
  },

  async deleteSchool(id: string): Promise<void> {
    await api.delete(`/admin/schools/${id}`);
  },

  // Users Management
  async getUsers(params?: {
    skip?: number;
    limit?: number;
    role?: string;
  }): Promise<User[]> {
    const response = await api.get('/admin/users', { params });
    return response.data;
  },

  async getUser(id: string): Promise<User> {
    const response = await api.get(`/admin/users/${id}`);
    return response.data;
  },

  async createUser(data: CreateUserData): Promise<User> {
    const transformedData = {
      ...data,
      school_id: data.school_id === '' ? null : data.school_id,
      settings: data.settings || null,
    };
    const response = await api.post('/admin/users', transformedData);
    return response.data;
  },

  async updateUser(id: string, data: UpdateUserData): Promise<User> {
    const response = await api.put(`/admin/users/${id}`, data);
    return response.data;
  },

  async deleteUser(id: string): Promise<void> {
    await api.delete(`/admin/users/${id}`);
  },

  async suspendUser(id: string): Promise<User> {
    const response = await api.post(`/admin/users/${id}/suspend`);
    return response.data;
  },

  async reinstateUser(id: string): Promise<User> {
    const response = await api.post(`/admin/users/${id}/reinstate`);
    return response.data;
  },

  // System Health
  async getSystemHealth(): Promise<SystemHealth> {
    const response = await api.get('/admin/health');
    return response.data;
  },
}; 