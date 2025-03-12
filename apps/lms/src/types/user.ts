export interface User {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  role: 'student' | 'teacher' | 'school_admin' | 'super_admin';
  school_id?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
} 