'use client';

import { useRole } from '@/contexts/RoleContext';
import { useSidebar } from '@/contexts/SidebarContext';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { 
  FiHome, FiUsers, FiBook, FiClipboard, FiBarChart2, 
  FiPieChart, FiAward, FiSettings, FiBox, FiServer,
  FiActivity, FiBookmark, FiHelpCircle, FiMessageSquare,
  FiChevronDown, FiChevronRight
} from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';

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

export function DashboardNavigation() {
  const pathname = usePathname();
  const { role } = useRole();
  const { collapsed, closeSidebar } = useSidebar();
  
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

  // Handle link click - close sidebar on mobile
  const handleLinkClick = () => {
    // Close sidebar on mobile view when clicking a link
    if (typeof window !== 'undefined' && window.innerWidth < 1024) {
      closeSidebar();
    }
  };

  return (
    <div className="flex flex-col h-full overflow-y-auto px-2">
      {navigationGroups.map((group, groupIndex) => (
        <div key={`${group.category}-${groupIndex}`} className="mb-4">
          {/* Category Header - show only if not collapsed */}
          <AnimatePresence initial={false}>
            {!collapsed && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
                onClick={() => toggleCategory(group.category)}
                className="flex items-center justify-between px-3 py-2 mb-1 cursor-pointer group text-muted-foreground hover:text-foreground transition-colors rounded-md hover:bg-background-secondary/50 overflow-hidden"
              >
                <h3 className="text-xs font-medium uppercase tracking-wider">
                  {group.category}
                </h3>
                <motion.div 
                  animate={{ 
                    rotate: expandedCategories[group.category] ? 0 : -90 
                  }}
                  transition={{ duration: 0.2 }}
                  className="text-muted-foreground opacity-70 group-hover:opacity-100 transition-opacity"
                >
                  <FiChevronDown className="h-3 w-3" />
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
          
          {/* Navigation Items */}
          <div className="space-y-1">
            {group.items.map((item) => {
              const active = isActive(item.href);
              
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={handleLinkClick}
                  className={`
                    flex items-center ${collapsed ? 'justify-center px-2' : 'px-3'} 
                    py-2.5 rounded-md transition-all duration-200 relative
                    ${active 
                      ? 'bg-orange-100 text-primary font-medium shadow-sm dark:bg-primary/20' 
                      : 'text-muted-foreground hover:text-foreground hover:bg-background-secondary'
                    }
                    ${!collapsed && !expandedCategories[group.category] ? 'hidden' : ''}
                  `}
                  title={collapsed ? item.label : ''}
                >
                  {/* Active indicator bar */}
                  {active && (
                    <motion.span 
                      layoutId="activeIndicator"
                      transition={{ type: "spring", stiffness: 500, damping: 35 }}
                      className="absolute left-0 top-1/2 transform -translate-y-1/2 w-1 h-2/3 bg-primary rounded-r-md"
                    ></motion.span>
                  )}
                  
                  {/* Icon with active styling */}
                  <span className={`flex-shrink-0 ${active ? 'text-primary' : ''}`}>
                    {icons[item.icon as keyof typeof icons]}
                  </span>
                  
                  {/* Label - shown only when not collapsed */}
                  <AnimatePresence initial={false}>
                    {!collapsed && (
                      <motion.span 
                        key="label"
                        initial={{ opacity: 0, width: 0, marginLeft: 0 }}
                        animate={{ opacity: 1, width: 'auto', marginLeft: 12 }}
                        exit={{ opacity: 0, width: 0, marginLeft: 0 }}
                        transition={{ duration: 0.2 }}
                        className="text-sm overflow-hidden whitespace-nowrap"
                      >
                        {item.label}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </Link>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
} 