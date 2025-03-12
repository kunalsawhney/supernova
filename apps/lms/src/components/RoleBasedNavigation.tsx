import { useRole } from '@/contexts/RoleContext';
import Link from 'next/link';

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

export default function RoleBasedNavigation() {
  const { role } = useRole();
  // Map super_admin and school_admin to admin navigation
  const effectiveRole = (role === 'super_admin' || role === 'school_admin') ? 'admin' : role;
  const navigation = navigationConfig[effectiveRole];

  return (
    <nav className="space-y-1">
      {navigation.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className="flex items-center px-4 py-2 section-text text-text-secondary rounded-md hover:bg-background-secondary"
        >
          {/* Icon would be imported and rendered here */}
          <span className="ml-3">{item.label}</span>
        </Link>
      ))}
    </nav>
  );
} 