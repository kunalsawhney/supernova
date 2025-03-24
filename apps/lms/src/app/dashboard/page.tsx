'use client';

import { useRole } from '@/contexts/RoleContext';
import { useAuth } from '@/contexts/AuthContext';

import { AdminDashboard } from '@/components/dashboard/views/AdminDashboard';
import { StudentDashboard } from '@/components/dashboard/views/StudentDashboard';
import { InstructorDashboard } from '@/components/dashboard/views/InstructorDashboard';
import { SchoolAdminDashboard } from '@/components/dashboard/views/SchoolAdminDashboard';

export default function Dashboard() {
  const { role } = useRole();
  const { user } = useAuth();
  
  return (
    <div className="space-y-6 w-full" style={{ border: 'none', overflow: 'hidden' }}>
      {/* Common Header Section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Welcome back, {user?.firstName || 'User'}! 👋</h1>
          <p className="text-muted-foreground mt-1">Here's what's happening in your learning environment</p>
        </div>
      </div>
      
      {/* Role-specific dashboard content */}
      <div className="w-full" style={{ border: 'none' }}>
        {role === 'admin' && <AdminDashboard />}
        {role === 'super_admin' && <AdminDashboard />}
        {role === 'school_admin' && <SchoolAdminDashboard />}
        {role === 'student' && <StudentDashboard />}
        {role === 'instructor' && <InstructorDashboard />}
      </div>
    </div>
  );
} 