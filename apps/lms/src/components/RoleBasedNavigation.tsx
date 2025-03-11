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
    { label: 'Dashboard', href: '/dashboard/admin', icon: 'HomeIcon' },
    { label: 'Users', href: '/dashboard/admin/users', icon: 'UsersIcon' },
    { label: 'Courses', href: '/dashboard/admin/courses', icon: 'BookOpenIcon' },
    { label: 'Analytics', href: '/dashboard/admin/analytics', icon: 'ChartPieIcon' },
    { label: 'Settings', href: '/dashboard/admin/settings', icon: 'CogIcon' },
  ],
};

export default function RoleBasedNavigation() {
  const { role } = useRole();
  const navigation = navigationConfig[role];

  return (
    <nav className="space-y-1">
      {navigation.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className="flex items-center px-4 py-2 text-sm font-medium rounded-md hover:bg-background-secondary"
        >
          {/* Icon would be imported and rendered here */}
          <span className="ml-3">{item.label}</span>
        </Link>
      ))}
    </nav>
  );
} 