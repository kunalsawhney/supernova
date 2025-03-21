'use client';

import { useRole } from '@/contexts/RoleContext';
import { useSidebar } from '@/components/ui/sidebar';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { 
  FiHome, FiUsers, FiBook, FiClipboard, FiBarChart2, 
  FiPieChart, FiAward, FiSettings, FiBox, FiServer,
  FiActivity, FiBookmark, FiHelpCircle, FiMessageSquare,
  FiChevronDown, FiVideo, FiPlay, FiPlus
} from 'react-icons/fi';

import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent
} from '@/components/ui/sidebar';

// Navigation items grouped by category
const navigationConfig = {
  student: [
    {
      category: 'Main',
      items: [
        { label: 'Dashboard', href: '/dashboard/student', icon: 'FiHome' },
        { label: 'Analytics', href: '/dashboard/student/analytics', icon: 'FiPieChart' },
      ]
    },
    {
      category: 'Learning',
      items: [
        { label: 'My Courses', href: '/dashboard/student/courses', icon: 'FiBook' },
        { label: 'Assignments', href: '/dashboard/student/assignments', icon: 'FiClipboard' },
        { label: 'Live Classes', href: '/dashboard/student/live-classes', icon: 'FiVideo' },
        { label: 'Course Player', href: '/dashboard/student/course-player', icon: 'FiPlay' },
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
      ]
    },
    {
      category: 'Content',
      items: [
        { label: 'Overview', href: '/dashboard/admin/content', icon: 'FiBook' },
        { label: 'Courses', href: '/dashboard/admin/content/courses', icon: 'FiBookmark' },
        { label: 'Modules', href: '/dashboard/admin/content/modules', icon: 'FiServer' },
        { label: 'Lessons', href: '/dashboard/admin/content/lessons', icon: 'FiClipboard' },
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
      ]
    },
    {
      category: 'Content',
      items: [
        { label: 'Overview', href: '/dashboard/admin/content', icon: 'FiBook' },
        { label: 'Courses', href: '/dashboard/admin/content/courses', icon: 'FiBookmark' },
        { label: 'Modules', href: '/dashboard/admin/content/modules', icon: 'FiServer' },
        { label: 'Lessons', href: '/dashboard/admin/content/lessons', icon: 'FiClipboard' },
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
      ]
    },
    {
      category: 'Content',
      items: [
        { label: 'Dashboard', href: '/dashboard/admin/content', icon: 'FiBook' },
        { label: 'Courses', href: '/dashboard/admin/content/courses', icon: 'FiBookmark' },
        { label: 'Modules', href: '/dashboard/admin/content/modules', icon: 'FiServer' },
        { label: 'Lessons', href: '/dashboard/admin/content/lessons', icon: 'FiClipboard' },
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
  FiMessageSquare: <FiMessageSquare />,
  FiVideo: <FiVideo />,
  FiPlay: <FiPlay />,
  FiPlus: <FiPlus />
};

export function DashboardNavigation() {
  const pathname = usePathname();
  const { role } = useRole();
  const { state, isMobile, setOpenMobile } = useSidebar();
  const collapsed = state === "collapsed";
  
  // Map super_admin and school_admin to admin navigation
  const effectiveRole = (role === 'super_admin' || role === 'school_admin') ? 'admin' : role;
  const navigationGroups = navigationConfig[effectiveRole];

  // Track expanded categories
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
    // Exact match for dashboard routes
    if (href === '/dashboard/student' || href === '/dashboard/instructor' || href === '/dashboard/admin') {
      return pathname === href;
    }
    
    // Special handling for content section to avoid multiple highlights
    if (href === '/dashboard/admin/content') {
      // Only highlight dashboard when on the exact content path
      return pathname === href;
    }
    
    if (href === '/dashboard/admin/content/courses') {
      // Highlight courses for the courses path and its sub-paths
      return pathname.startsWith(href) && !pathname.includes('/modules') && !pathname.includes('/lessons');
    }
    
    if (href === '/dashboard/admin/content/modules') {
      // Highlight modules for the modules path and its sub-paths
      return pathname.startsWith(href) && !pathname.includes('/courses') && !pathname.includes('/lessons');
    }
    
    if (href === '/dashboard/admin/content/lessons') {
      // Highlight lessons for the lessons path and its sub-paths
      return pathname.startsWith(href) && !pathname.includes('/courses') && !pathname.includes('/modules');
    }

    // Special handling for content-v2 section
    if (href === '/dashboard/admin/content-v2') {
      return pathname === href;
    }

    if (href === '/dashboard/admin/content-v2/courses') {
      // Highlight courses for the courses path but not create
      return pathname === href;
    }

    if (href === '/dashboard/admin/content-v2/courses/create') {
      // Highlight create course only when on create path
      return pathname === href;
    }
    
    // Default behavior for other routes
    return pathname.startsWith(href);
  };

  // Close mobile sidebar after navigation
  const handleLinkClick = () => {
    // Close sidebar on mobile view when clicking a link
    if (isMobile) {
      setOpenMobile(false);
    }
  };

  return (
    <div className="px-2 py-1">
      {navigationGroups.map((group, groupIndex) => (
        <SidebarGroup key={`${group.category}-${groupIndex}`} className="mb-2">
          <SidebarGroupLabel className="px-2 py-1 text-sm text-muted-foreground font-medium uppercase">
            {group.category}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {group.items.map((item, itemIndex) => (
                <SidebarMenuItem key={`${item.label}-${itemIndex}`}>
                  <SidebarMenuButton
                    asChild
                    isActive={isActive(item.href)}
                    tooltip={collapsed ? item.label : undefined}
                  >
                    <Link href={item.href} onClick={handleLinkClick} className="flex items-center gap-2 w-full">
                      {icons[item.icon as keyof typeof icons]}
                      <span className="truncate text-sm">{item.label}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      ))}
    </div>
  );
} 