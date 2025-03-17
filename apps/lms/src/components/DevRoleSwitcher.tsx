'use client';

import { useRole } from '@/contexts/RoleContext';
import { useState, useRef, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { 
  FiChevronDown, 
  FiUser, 
  FiUsers, 
  FiShield, 
  FiBookOpen,
  FiLock
} from 'react-icons/fi';

// Role configuration with labels and icons
const roleConfig = {
  student: {
    label: 'Student',
    description: 'Course Learner',
    icon: FiUser,
    dashboardPath: '/dashboard/student'
  },
  instructor: {
    label: 'Instructor',
    description: 'School Teacher',
    icon: FiBookOpen,
    dashboardPath: '/dashboard/instructor'
  },
  admin: {
    label: 'Admin',
    description: 'Platform Manager',
    icon: FiShield,
    dashboardPath: '/dashboard/admin'
  },
  super_admin: {
    label: 'Super Admin',
    description: 'Global Administrator',
    icon: FiLock,
    dashboardPath: '/dashboard/admin'
  },
  school_admin: {
    label: 'School Admin',
    description: 'Institution Manager',
    icon: FiUsers,
    dashboardPath: '/dashboard/admin'
  },
};

export default function DevRoleSwitcher() {
  const { role, setRole } = useRole();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const pathname = usePathname();

  // Only show in development
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Get current role configuration
  const currentRole = roleConfig[role as keyof typeof roleConfig] || roleConfig.student;
  const RoleIcon = currentRole.icon;

  // Handle role change with proper navigation
  const handleRoleChange = (newRole: string) => {
    // Only navigate if role actually changed
    if (newRole !== role) {
      // Get the target path for the new role
      const targetPath = roleConfig[newRole as keyof typeof roleConfig]?.dashboardPath || '/dashboard';
      
      // First update the role in localStorage to ensure it persists
      localStorage.setItem('devRole', newRole as string);
      
      // Then update the role in context
      setRole(newRole as any);
      
      // Close the dropdown
      setIsOpen(false);
      
      // Force navigation to trigger a refresh
      if (pathname.startsWith('/dashboard')) {
        // If we're on the new role's dashboard but in a subsection, go to the main section
        if (pathname.startsWith(targetPath) && pathname !== targetPath) {
          router.push(targetPath);
        } 
        // If we're on a different role's dashboard, navigate to the new role's dashboard
        else if (!pathname.startsWith(targetPath)) {
          router.push(targetPath);
        }
        // If we're already on the exact dashboard path, do a hard refresh
        else if (pathname === targetPath) {
          window.location.reload();
        }
      } else {
        // If not on dashboard, simply navigate to the target path
        router.push(targetPath);
      }
    } else {
      // Just close the dropdown if role hasn't changed
      setIsOpen(false);
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-3 py-1.5 bg-amber-100 dark:bg-amber-900/30 
          rounded-lg border border-amber-200 dark:border-amber-700/50 text-amber-800 dark:text-amber-300
          hover:bg-amber-200 dark:hover:bg-amber-800/40 transition-colors shadow-sm"
      >
        <div className="flex items-center gap-2">
          <div className="bg-amber-200 dark:bg-amber-800 rounded-md p-1">
            <RoleIcon className="h-3.5 w-3.5" />
          </div>
          <span className="text-xs font-medium">DEV:</span>
          <span className="text-xs font-semibold">{currentRole.label}</span>
        </div>
        <FiChevronDown className={`w-3.5 h-3.5 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute mt-1 right-0 bg-card shadow-lg rounded-lg border border-border/30 overflow-hidden w-52 z-40">
          <div className="p-2">
            <div className="text-xs text-muted-foreground px-2 py-1.5">Development Mode</div>
            {Object.entries(roleConfig).map(([key, config]) => {
              const Icon = config.icon;
              return (
                <button
                  key={key}
                  onClick={() => handleRoleChange(key)}
                  className={`w-full flex items-center gap-3 px-2 py-2 text-sm rounded-md 
                    ${role === key ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-300' : 
                    'hover:bg-background-secondary'}
                    transition-colors text-left`}
                >
                  <div className={`p-1 rounded-md ${role === key ? 'bg-amber-200 dark:bg-amber-800' : 'bg-muted'}`}>
                    <Icon className="h-3.5 w-3.5" />
                  </div>
                  <div className="flex flex-col">
                    <span className="font-medium">{config.label}</span>
                    <span className="text-xs text-muted-foreground">{config.description}</span>
                  </div>
                </button>
              );
            })}
          </div>
          <div className="border-t border-border/30 px-3 py-2 bg-muted/50">
            <p className="text-xs text-muted-foreground">
              Quick role switching for development testing
            </p>
          </div>
        </div>
      )}
    </div>
  );
} 