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

// Define types for navigation items
interface NavItem {
  label: string;
  href: string;
  icon: string;
  items?: NavItem[];
}

interface NavSection {
  category: string;
  items: NavItem[];
}

type NavigationConfig = {
  [key in 'student' | 'instructor' | 'admin' | 'super_admin' | 'school_admin']: NavSection[];
};

// Navigation items grouped by category
const navigationConfig: NavigationConfig = {
  student: [
    {
      category: 'Main',
      items: [
        { label: 'Dashboard', href: '/dashboard', icon: 'FiHome' },
        { label: 'Analytics', href: '/dashboard/analytics', icon: 'FiPieChart' },
      ]
    },
    {
      category: 'Learning',
      items: [
        { label: 'My Courses', href: '/dashboard/courses', icon: 'FiBook' },
        { label: 'Assignments', href: '/dashboard/assignments', icon: 'FiClipboard' },
        { label: 'Live Classes', href: '/dashboard/live-classes', icon: 'FiVideo' },
        { label: 'Course Player', href: '/dashboard/course-player', icon: 'FiPlay' },
      ]
    },
    {
      category: 'Performance',
      items: [
        { label: 'Progress', href: '/dashboard/progress', icon: 'FiBarChart2' },
        { label: 'Grades', href: '/dashboard/grades', icon: 'FiAward' },
      ]
    },
    {
      category: 'Resources',
      items: [
        { label: 'Bookmarks', href: '/dashboard/bookmarks', icon: 'FiBookmark' },
        { label: 'Support', href: '/dashboard/support', icon: 'FiHelpCircle' },
      ]
    }
  ],
  instructor: [
    {
      category: 'Main',
      items: [
        { label: 'Dashboard', href: '/dashboard', icon: 'FiHome' },
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
        { label: 'Overview', href: '/dashboard', icon: 'FiHome' },
        { label: 'Analytics', href: '/dashboard/analytics', icon: 'FiPieChart' },
      ]
    },
    {
      category: 'Management',
      items: [
        { label: 'Users', href: '/dashboard/users', icon: 'FiUsers' },
        { label: 'Schools', href: '/dashboard/schools', icon: 'FiServer' },
      ]
    },
    {
      category: 'Content',
      items: [
        { label: 'Overview', href: '/dashboard/content', icon: 'FiBook' },
        { label: 'Courses', href: '/dashboard/content/courses', icon: 'FiBookmark' },
        { label: 'Modules', href: '/dashboard/content/modules', icon: 'FiServer' },
        { label: 'Lessons', href: '/dashboard/content/lessons', icon: 'FiClipboard' },
      ]
    },
    {
      category: 'System',
      items: [
        { label: 'Settings', href: '/dashboard/settings', icon: 'FiSettings' },
        { label: 'Integrations', href: '/dashboard/integrations', icon: 'FiBox' },
      ]
    }
  ],
  super_admin: [
    {
      category: 'Dashboard',
      items: [
        { label: 'Overview', href: '/dashboard', icon: 'FiHome' },
        { label: 'Analytics', href: '/dashboard/analytics', icon: 'FiPieChart' },
      ]
    },
    {
      category: 'Management',
      items: [
        { label: 'Users', href: '/dashboard/users', icon: 'FiUsers' },
        { label: 'Schools', href: '/dashboard/schools', icon: 'FiServer' },
      ]
    },
    {
      category: 'Content',
      items: [
        { label: 'Overview', href: '/dashboard/content', icon: 'FiBook' },
        { label: 'Courses', href: '/dashboard/content/courses', icon: 'FiBookmark' },
        { label: 'Modules', href: '/dashboard/content/modules', icon: 'FiServer' },
        { label: 'Lessons', href: '/dashboard/content/lessons', icon: 'FiClipboard' },
      ]
    },
    {
      category: 'System',
      items: [
        { label: 'Settings', href: '/dashboard/settings', icon: 'FiSettings' },
        { label: 'Integrations', href: '/dashboard/integrations', icon: 'FiBox' },
      ]
    }
  ],
  school_admin: [
    {
      category: 'Dashboard',
      items: [
        { label: 'Overview', href: '/dashboard', icon: 'FiHome' },
        { label: 'Analytics', href: '/dashboard/analytics', icon: 'FiPieChart' },
      ]
    },
    {
      category: 'School',
      items: [
        { label: 'Teachers', href: '/dashboard/teachers', icon: 'FiUsers' },
        { label: 'Students', href: '/dashboard/students', icon: 'FiUsers' },
        { label: 'Courses', href: '/dashboard/courses', icon: 'FiBook' },
      ]
    },
    {
      category: 'Administration',
      items: [
        { label: 'Calendar', href: '/dashboard/calendar', icon: 'FiActivity' },
        { label: 'Reports', href: '/dashboard/reports', icon: 'FiBarChart2' },
        { label: 'Settings', href: '/dashboard/settings', icon: 'FiSettings' },
      ]
    }
  ]
};

// Icon mapping to render dynamic icons
const IconMap = {
  FiHome: FiHome,
  FiUsers: FiUsers,
  FiBook: FiBook,
  FiClipboard: FiClipboard,
  FiBarChart2: FiBarChart2,
  FiPieChart: FiPieChart,
  FiAward: FiAward,
  FiSettings: FiSettings,
  FiBox: FiBox,
  FiServer: FiServer,
  FiActivity: FiActivity,
  FiBookmark: FiBookmark,
  FiHelpCircle: FiHelpCircle,
  FiMessageSquare: FiMessageSquare,
  FiVideo: FiVideo,
  FiPlay: FiPlay,
  FiPlus: FiPlus,
};

export function DashboardNavigation() {
  const { role } = useRole();
  const pathname = usePathname();
  const { state } = useSidebar();
  const isCollapsed = state === 'collapsed';
  
  // Get the navigation configuration for the current role
  const navigation = navigationConfig[role] || navigationConfig.student;
  
  // Helper function to render the appropriate icon component
  const renderIcon = (iconName: string) => {
    const IconComponent = IconMap[iconName as keyof typeof IconMap];
    return IconComponent ? <IconComponent className="h-4 w-4" /> : <FiHome className="h-4 w-4" />;
  };

  return (
    <SidebarMenu>
      {navigation.map((section, index) => (
       <SidebarGroup key={`${section.category}-${index}`} className="mb-2">
       <SidebarGroupLabel className="px-2 py-1 text-sm text-muted-foreground font-medium uppercase">
         {section.category}
       </SidebarGroupLabel>
       <SidebarGroupContent>
         <SidebarMenu>
           {section.items.map((item, itemIndex) => (
             <SidebarMenuItem key={`${item.label}-${itemIndex}`}>
               <SidebarMenuButton
                 asChild
                 isActive={pathname === item.href}
                 tooltip={isCollapsed ? item.label : undefined}
               >
                 <Link href={item.href} className="flex items-center gap-2 w-full">
                   {renderIcon(item.icon)}
                   <span className="truncate text-sm">{item.label}</span>
                 </Link>
               </SidebarMenuButton>
             </SidebarMenuItem>
           ))}
         </SidebarMenu>
       </SidebarGroupContent>
     </SidebarGroup>
      ))}
    </SidebarMenu>
  );
} 