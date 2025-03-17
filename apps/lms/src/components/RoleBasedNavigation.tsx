import { useRole } from '@/contexts/RoleContext';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { 
  FiHome, FiUsers, FiBook, FiClipboard, FiBarChart2, 
  FiPieChart, FiAward, FiSettings, FiBox, FiServer,
  FiActivity, FiBookmark, FiHelpCircle, FiMessageSquare
} from 'react-icons/fi';

// Navigation items grouped by category
const navigationConfig = {
  student: [
    {
      category: 'Main',
      items: [
        { label: 'Dashboard', href: '/dashboard/student', icon: 'FiHome' },
        { label: 'My Courses', href: '/dashboard/student/courses', icon: 'FiBook' },
        { label: 'Assignments', href: '/dashboard/student/assignments', icon: 'FiClipboard' },
      ]
    },
    {
      category: 'Performance',
      items: [
        { label: 'Progress', href: '/dashboard/student/progress', icon: 'FiBarChart2' },
        { label: 'Grades', href: '/dashboard/student/grades', icon: 'FiAward' },
      ]
    },
    {
      category: 'Resources',
      items: [
        { label: 'Bookmarks', href: '/dashboard/student/bookmarks', icon: 'FiBookmark' },
        { label: 'Support', href: '/dashboard/student/support', icon: 'FiHelpCircle' },
      ]
    }
  ],
  instructor: [
    {
      category: 'Main',
      items: [
        { label: 'Dashboard', href: '/dashboard/instructor', icon: 'FiHome' },
        { label: 'My Courses', href: '/dashboard/instructor/courses', icon: 'FiBook' },
        { label: 'Students', href: '/dashboard/instructor/students', icon: 'FiUsers' },
      ]
    },
    {
      category: 'Teaching',
      items: [
        { label: 'Assignments', href: '/dashboard/instructor/assignments', icon: 'FiClipboard' },
        { label: 'Messages', href: '/dashboard/instructor/messages', icon: 'FiMessageSquare' },
      ]
    },
    {
      category: 'Insights',
      items: [
        { label: 'Analytics', href: '/dashboard/instructor/analytics', icon: 'FiPieChart' },
        { label: 'Reports', href: '/dashboard/instructor/reports', icon: 'FiActivity' },
      ]
    }
  ],
  admin: [
    {
      category: 'Dashboard',
      items: [
        { label: 'Overview', href: '/dashboard/admin', icon: 'FiHome' },
        { label: 'Analytics', href: '/dashboard/admin/analytics', icon: 'FiPieChart' },
      ]
    },
    {
      category: 'Management',
      items: [
        { label: 'Users', href: '/dashboard/admin/users', icon: 'FiUsers' },
        { label: 'Schools', href: '/dashboard/admin/schools', icon: 'FiServer' },
        { label: 'Courses', href: '/dashboard/admin/courses', icon: 'FiBook' },
      ]
    },
    {
      category: 'System',
      items: [
        { label: 'Settings', href: '/dashboard/admin/settings', icon: 'FiSettings' },
        { label: 'Integrations', href: '/dashboard/admin/integrations', icon: 'FiBox' },
      ]
    }
  ],
  super_admin: [
    {
      category: 'Dashboard',
      items: [
        { label: 'Overview', href: '/dashboard/admin', icon: 'FiHome' },
        { label: 'Analytics', href: '/dashboard/admin/analytics', icon: 'FiPieChart' },
      ]
    },
    {
      category: 'Management',
      items: [
        { label: 'Users', href: '/dashboard/admin/users', icon: 'FiUsers' },
        { label: 'Schools', href: '/dashboard/admin/schools', icon: 'FiServer' },
        { label: 'Courses', href: '/dashboard/admin/courses', icon: 'FiBook' },
      ]
    },
    {
      category: 'System',
      items: [
        { label: 'Settings', href: '/dashboard/admin/settings', icon: 'FiSettings' },
        { label: 'Integrations', href: '/dashboard/admin/integrations', icon: 'FiBox' },
      ]
    }
  ],
  school_admin: [
    {
      category: 'Dashboard',
      items: [
        { label: 'Overview', href: '/dashboard/admin', icon: 'FiHome' },
        { label: 'Analytics', href: '/dashboard/admin/analytics', icon: 'FiPieChart' },
      ]
    },
    {
      category: 'Management',
      items: [
        { label: 'Users', href: '/dashboard/admin/users', icon: 'FiUsers' },
        { label: 'Schools', href: '/dashboard/admin/schools', icon: 'FiServer' },
        { label: 'Courses', href: '/dashboard/admin/courses', icon: 'FiBook' },
      ]
    },
    {
      category: 'System',
      items: [
        { label: 'Settings', href: '/dashboard/admin/settings', icon: 'FiSettings' },
        { label: 'Integrations', href: '/dashboard/admin/integrations', icon: 'FiBox' },
      ]
    }
  ],
} as const;

// Map icon strings to React Icon components
const icons = {
  FiHome: <FiHome />,
  FiUsers: <FiUsers />,
  FiBook: <FiBook />,
  FiClipboard: <FiClipboard />,
  FiBarChart2: <FiBarChart2 />,
  FiPieChart: <FiPieChart />,
  FiAward: <FiAward />,
  FiSettings: <FiSettings />,
  FiBox: <FiBox />,
  FiServer: <FiServer />,
  FiActivity: <FiActivity />,
  FiBookmark: <FiBookmark />,
  FiHelpCircle: <FiHelpCircle />,
  FiMessageSquare: <FiMessageSquare />
};

interface RoleBasedNavigationProps {
  collapsed?: boolean;
}

export default function RoleBasedNavigation({ collapsed = false }: RoleBasedNavigationProps) {
  const pathname = usePathname();
  const { role } = useRole();
  
  // Map super_admin and school_admin to admin navigation
  const effectiveRole = (role === 'super_admin' || role === 'school_admin') ? 'admin' : role;
  const navigationGroups = navigationConfig[effectiveRole];

  // Track expanded categories (only relevant when sidebar is not collapsed)
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({});

  // Initialize expanded categories - all expanded by default
  useEffect(() => {
    const initialExpanded: Record<string, boolean> = {};
    navigationGroups.forEach(group => {
      initialExpanded[group.category] = true;
    });
    setExpandedCategories(initialExpanded);
  }, [navigationGroups]);

  // Toggle category expansion
  const toggleCategory = (category: string) => {
    if (collapsed) return;
    setExpandedCategories(prev => ({
      ...prev,
      [category]: !prev[category]
    }));
  };

  // Check if a nav item is active (or if we're on a child route)
  const isActive = (href: string) => {
    if (href === '/dashboard/student' || href === '/dashboard/instructor' || href === '/dashboard/admin') {
      return pathname === href;
    }
    return pathname.startsWith(href);
  };

  return (
    <div className="flex flex-col h-full overflow-y-auto scrollbar-thin scrollbar-thumb-border">
      {navigationGroups.map((group, groupIndex) => (
        <div key={`${group.category}-${groupIndex}`} className="mb-6">
          {/* Category Header - show only if not collapsed */}
          {!collapsed && (
            <div 
              onClick={() => toggleCategory(group.category)}
              className="flex items-center justify-between px-4 mb-2 cursor-pointer group"
            >
              <h3 className="text-lg font-semibold uppercase tracking-wider text-text-secondary group-hover:text-text-primary transition-colors">
                {group.category}
              </h3>
              <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                {expandedCategories[group.category] ? 
                  <span className="text-xs">▼</span> : 
                  <span className="text-xs">▶</span>
                }
              </div>
            </div>
          )}
          
          {/* Navigation Items */}
          <div className={`space-y-1 ${!collapsed && !expandedCategories[group.category] ? 'hidden' : ''}`}>
            {group.items.map((item) => {
              const active = isActive(item.href);
              
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`
                    flex items-center ${collapsed ? 'justify-center mx-2' : 'px-4 mx-2'} 
                    py-2.5 rounded-lg transition-all duration-200
                    ${active 
                      ? 'bg-button-primary/10 text-button-primary font-medium' 
                      : 'text-text-secondary hover:text-text-primary hover:bg-background-secondary'
                    }
                  `}
                  title={collapsed ? item.label : ''}
                >
                  {/* Icon with active styling */}
                  <span className={`flex-shrink-0 ${active ? 'text-button-primary' : 'text-text-secondary'}`}>
                    {icons[item.icon as keyof typeof icons]}
                  </span>
                  
                  {/* Label - shown only when not collapsed */}
                  {!collapsed && (
                    <span className="ml-3 text-md truncate">
                      {item.label}
                    </span>
                  )}
                  
                  {/* Active indicator - small dot for collapsed state */}
                  {collapsed && active && (
                    <span className="absolute w-1.5 h-1.5 rounded-full bg-button-primary right-1"></span>
                  )}
                </Link>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
} 