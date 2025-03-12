'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

type Role = 'student' | 'instructor' | 'admin' | 'super_admin' | 'school_admin';

interface RoleContextType {
  role: Role;
  setRole: (role: Role) => void;
  permissions: string[];
  canAccess: (feature: string) => boolean;
}

// Define role-specific permissions
const rolePermissions: Record<Role, string[]> = {
  student: [
    'view_purchased_courses',
    'view_course_content',
    'submit_assignments',
    'view_progress',
    'view_certificates',
    'access_support',
  ],
  instructor: [
    'view_school_dashboard',
    'view_student_progress',
    'view_class_analytics',
    'manage_student_access',
    'generate_reports',
    'contact_support',
  ],
  admin: [
    'manage_courses',
    'view_all_analytics',
    'manage_schools',
    'manage_users',
    'view_financial_reports',
    'manage_platform_settings',
    'manage_integrations',
  ],
  super_admin: [
    'manage_courses',
    'view_all_analytics',
    'manage_schools',
    'manage_users',
    'view_financial_reports',
    'manage_platform_settings',
    'manage_integrations',
    'manage_super_admin',
  ],
  school_admin: [
    'manage_school_courses',
    'view_school_analytics',
    'manage_school_users',
    'view_school_reports',
    'manage_school_settings',
  ],
};

const roleDashboardPaths: Record<Role, string> = {
  student: '/dashboard/student',
  instructor: '/dashboard/instructor',
  admin: '/dashboard/admin',
  super_admin: '/dashboard/admin',
  school_admin: '/dashboard/admin',
};

const RoleContext = createContext<RoleContextType | undefined>(undefined);

export function RoleProvider({ children }: { children: React.ReactNode }) {
  const [role, setRoleState] = useState<Role>('student');
  const router = useRouter();

  const permissions = rolePermissions[role];
  
  const canAccess = (feature: string) => {
    return permissions.includes(feature);
  };

  const setRole = (newRole: Role) => {
    setRoleState(newRole);
    if (process.env.NODE_ENV === 'development') {
      localStorage.setItem('devRole', newRole);
      // Only redirect if we're at the root dashboard
      if (window.location.pathname === '/dashboard') {
        router.push(roleDashboardPaths[newRole]);
      }
    }
  };

  // Load role from localStorage in development
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      const savedRole = localStorage.getItem('devRole') as Role;
      if (savedRole && savedRole !== role) {
        setRoleState(savedRole);
        // Only redirect if we're at the root dashboard
        if (window.location.pathname === '/dashboard') {
          router.push(roleDashboardPaths[savedRole]);
        }
      }
    }
  }, []);

  return (
    <RoleContext.Provider value={{ role, setRole, permissions, canAccess }}>
      {children}
    </RoleContext.Provider>
  );
}

export function useRole() {
  const context = useContext(RoleContext);
  if (context === undefined) {
    throw new Error('useRole must be used within a RoleProvider');
  }
  return context;
} 