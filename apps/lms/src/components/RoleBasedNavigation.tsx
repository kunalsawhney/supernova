import { useRole } from '@/contexts/RoleContext';
import Link from 'next/link';
import { useState } from 'react';

const navigationConfig = {
  student: [
    { label: 'Dashboard', href: '/dashboard/student', icon: 'HomeIcon' },
    { label: 'My Courses', href: '/dashboard/student/courses', icon: 'BookOpenIcon' },
    { label: 'Assignments', href: '/dashboard/student/assignments', icon: 'ClipboardIcon' },
    { label: 'Progress', href: '/dashboard/student/progress', icon: 'ChartBarIcon' },
    { label: 'Grades', href: '/dashboard/student/grades', icon: 'AcademicCapIcon' },
  ],
  instructor: [
    { label: 'Dashboard', href: '/dashboard/instructor', icon: 'HomeIcon' },
    { label: 'My Courses', href: '/dashboard/instructor/courses', icon: 'BookOpenIcon' },
    { label: 'Students', href: '/dashboard/instructor/students', icon: 'UsersIcon' },
    { label: 'Assignments', href: '/dashboard/instructor/assignments', icon: 'ClipboardIcon' },
    { label: 'Analytics', href: '/dashboard/instructor/analytics', icon: 'ChartPieIcon' },
  ],
  admin: [
    { label: 'Overview', href: '/dashboard/admin', icon: 'HomeIcon' },
    { label: 'Users', href: '/dashboard/admin/users', icon: 'UsersIcon' },
    { label: 'Schools', href: '/dashboard/admin/schools', icon: 'BuildingOfficeIcon' },
    { label: 'Courses', href: '/dashboard/admin/courses', icon: 'BookOpenIcon' },
    { label: 'Analytics', href: '/dashboard/admin/analytics', icon: 'ChartPieIcon' },
    { label: 'Settings', href: '/dashboard/admin/settings', icon: 'CogIcon' },
  ],
  super_admin: [
    { label: 'Overview', href: '/dashboard/admin', icon: 'HomeIcon' },
    { label: 'Users', href: '/dashboard/admin/users', icon: 'UsersIcon' },
    { label: 'Schools', href: '/dashboard/admin/schools', icon: 'BuildingOfficeIcon' },
    { label: 'Courses', href: '/dashboard/admin/courses', icon: 'BookOpenIcon' },
    { label: 'Analytics', href: '/dashboard/admin/analytics', icon: 'ChartPieIcon' },
    { label: 'Settings', href: '/dashboard/admin/settings', icon: 'CogIcon' },
  ],
  school_admin: [
    { label: 'Overview', href: '/dashboard/admin', icon: 'HomeIcon' },
    { label: 'Users', href: '/dashboard/admin/users', icon: 'UsersIcon' },
    { label: 'Schools', href: '/dashboard/admin/schools', icon: 'BuildingOfficeIcon' },
    { label: 'Courses', href: '/dashboard/admin/courses', icon: 'BookOpenIcon' },
    { label: 'Analytics', href: '/dashboard/admin/analytics', icon: 'ChartPieIcon' },
    { label: 'Settings', href: '/dashboard/admin/settings', icon: 'CogIcon' },
  ],
} as const;

// Simple icon components for navigation
const icons = {
  HomeIcon: () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
    </svg>
  ),
  UsersIcon: () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
    </svg>
  ),
  BookOpenIcon: () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
    </svg>
  ),
  ClipboardIcon: () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
    </svg>
  ),
  ChartBarIcon: () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
    </svg>
  ),
  ChartPieIcon: () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
    </svg>
  ),
  AcademicCapIcon: () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path d="M12 14l9-5-9-5-9 5 9 5z" />
      <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" />
    </svg>
  ),
  BuildingOfficeIcon: () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
    </svg>
  ),
  CogIcon: () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  ),
};

interface RoleBasedNavigationProps {
  collapsed?: boolean;
}

export default function RoleBasedNavigation({ collapsed = false }: RoleBasedNavigationProps) {
  const [activeNav, setActiveNav] = useState<string | null>(null);

  const { role } = useRole();
  // Map super_admin and school_admin to admin navigation
  const effectiveRole = (role === 'super_admin' || role === 'school_admin') ? 'admin' : role;
  const navigation = navigationConfig[effectiveRole];

  // Get icon component based on icon name
  const getIcon = (iconName: string) => {
    const IconComponent = icons[iconName as keyof typeof icons];
    return IconComponent ? <IconComponent /> : null;
  };

  return (
    <nav className={`${collapsed ? 'px-2' : 'px-4'} space-y-1`}>
      {navigation.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={`flex items-center ${collapsed ? 'justify-center' : 'px-4'} py-3 text-md font-medium rounded-md hover:bg-background-secondary transition-all duration-200 ${
            activeNav === item.label ? 'bg-background-secondary text-button-primary' : 'text-text-secondary hover:text-text-primary'
          }`}
          onClick={() => setActiveNav(item.label)}
          title={collapsed ? item.label : ''}
        >
          <span className={`${activeNav === item.label ? 'text-button-primary' : 'text-text-secondary group-hover:text-text-primary'}`}>
            {getIcon(item.icon)}
          </span>
          {!collapsed && <span className="ml-3 truncate">{item.label}</span>}
        </Link>
      ))}
    </nav>
  );
} 