import { User } from './user';

export interface PlatformStats {
  totalUsers: number;
  totalSchools: number;
  totalRevenue: string;
  activeUsers: string;
}

export interface SystemHealth {
  serverStatus: string;
  uptime: string;
  responseTime: string;
  activeConnections: number;
  cpuUsage: string;
  memoryUsage: string;
  storageUsed: string;
  lastBackup: string;
}

export interface CreateUserData {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  role: string;
  school_id?: string;
  settings?: Record<string, any> | null;
}

export interface UpdateUserData {
  first_name?: string;
  last_name?: string;
  role?: string;
  school_id?: string;
}

export interface ApiUser {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  role: string;
  school_id: string | null;
  is_active: boolean;
  created_at: string;
}

export interface UserViewModel {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  schoolId: string | null;
  isActive: boolean;
  createdAt: string;
}

export const transformUser = (user: ApiUser): UserViewModel => ({
  id: user.id,
  email: user.email,
  firstName: user.first_name,
  lastName: user.last_name,
  role: user.role,
  schoolId: user.school_id,
  isActive: user.is_active,
  createdAt: user.created_at,
}); 