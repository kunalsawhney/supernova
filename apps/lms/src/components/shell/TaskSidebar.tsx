'use client';

import { useMemo } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useShell } from '@/contexts/ShellContext';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { 
  Sidebar, 
  SidebarContent,
  SidebarFooter, 
  SidebarHeader, 
  SidebarMenu, 
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarTrigger,
  useSidebar 
} from '@/components/ui/sidebar';
import { Separator } from '@/components/ui/separator';
import { 
  Home, 
  BookOpen, 
  GraduationCap, 
  Calendar, 
  BarChart, 
  Settings, 
  Users, 
  Building, 
  Layers, 
  MessageSquare,
  ChevronLeft,
  ChevronRight,
  Video
} from 'lucide-react';

// Interface for navigation items
interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
  mode?: 'focus' | 'explore' | 'collaborate';
}

// Role-based navigation groups
interface NavGroup {
  title: string;
  items: NavItem[];
}

export function TaskSidebar({ role }: { role: string }) {
  const pathname = usePathname();
  const { mode } = useShell();
  
  // Define navigation groups based on role
  const navGroups = useMemo(() => {
    const groups: Record<string, NavGroup[]> = {
      student: [
        {
          title: 'Learning',
          items: [
            { label: 'Overview', href: '/dashboard/student', icon: <Home size={20} />, mode: 'focus' },
            { label: 'My Courses', href: '/dashboard/student/courses', icon: <BookOpen size={20} />, mode: 'focus' },
            { label: 'Course Player', href: '/dashboard/student/course-player/1', icon: <Video size={20} />, mode: 'focus' },
            { label: 'Live Classes', href: '/dashboard/student/live-classes', icon: <Video size={20} />, mode: 'focus' },
            { label: 'Assignments', href: '/dashboard/student/assignments', icon: <GraduationCap size={20} />, mode: 'focus' },
            { label: 'Calendar', href: '/dashboard/student/calendar', icon: <Calendar size={20} />, mode: 'focus' },
          ],
        },
        {
          title: 'Discover',
          items: [
            { label: 'Overview', href: '/dashboard/student', icon: <Home size={20} />, mode: 'explore' },
            { label: 'Explore Courses', href: '/dashboard/student/explore', icon: <Layers size={20} />, mode: 'explore' },
            { label: 'Progress Reports', href: '/dashboard/student/progress', icon: <BarChart size={20} />, mode: 'explore' },
          ],
        },
        {
          title: 'Connect',
          items: [
            { label: 'Overview', href: '/dashboard/student', icon: <Home size={20} />, mode: 'collaborate' },
            { label: 'Discussion Forums', href: '/dashboard/student/forums', icon: <MessageSquare size={20} />, mode: 'collaborate' },
            { label: 'Study Groups', href: '/dashboard/student/groups', icon: <Users size={20} />, mode: 'collaborate' },
          ],
        },
      ],
      instructor: [
        {
          title: 'Teaching',
          items: [
            { label: 'Dashboard', href: '/dashboard/instructor', icon: <Home size={20} />, mode: 'focus' },
            { label: 'My Courses', href: '/dashboard/instructor/courses', icon: <BookOpen size={20} />, mode: 'focus' },
            { label: 'Assignments', href: '/dashboard/instructor/assignments', icon: <GraduationCap size={20} />, mode: 'focus' },
            { label: 'Calendar', href: '/dashboard/instructor/calendar', icon: <Calendar size={20} />, mode: 'focus' },
          ],
        },
        {
          title: 'Analyze',
          items: [
            { label: 'Student Progress', href: '/dashboard/instructor/progress', icon: <BarChart size={20} />, mode: 'explore' },
            { label: 'Course Analytics', href: '/dashboard/instructor/analytics', icon: <Layers size={20} />, mode: 'explore' },
          ],
        },
        {
          title: 'Engage',
          items: [
            { label: 'Discussion Forums', href: '/dashboard/instructor/forums', icon: <MessageSquare size={20} />, mode: 'collaborate' },
            { label: 'Office Hours', href: '/dashboard/instructor/office-hours', icon: <Users size={20} />, mode: 'collaborate' },
          ],
        },
      ],
      admin: [
        {
          title: 'Administration',
          items: [
            { label: 'Dashboard', href: '/dashboard/admin', icon: <Home size={20} />, mode: 'focus' },
            { label: 'Users', href: '/dashboard/admin/users', icon: <Users size={20} />, mode: 'focus' },
            { label: 'Courses', href: '/dashboard/admin/courses', icon: <BookOpen size={20} />, mode: 'focus' },
            { label: 'Schools', href: '/dashboard/admin/schools', icon: <Building size={20} />, mode: 'focus' },
          ],
        },
        {
          title: 'Reports',
          items: [
            { label: 'Analytics', href: '/dashboard/admin/analytics', icon: <BarChart size={20} />, mode: 'explore' },
            { label: 'System Settings', href: '/dashboard/admin/settings', icon: <Settings size={20} />, mode: 'explore' },
          ],
        },
      ],
      school_admin: [
        {
          title: 'School',
          items: [
            { label: 'Dashboard', href: '/dashboard/admin', icon: <Home size={20} />, mode: 'focus' },
            { label: 'Users', href: '/dashboard/admin/users', icon: <Users size={20} />, mode: 'focus' },
            { label: 'Courses', href: '/dashboard/admin/courses', icon: <BookOpen size={20} />, mode: 'focus' },
          ],
        },
        {
          title: 'Reports',
          items: [
            { label: 'Analytics', href: '/dashboard/admin/analytics', icon: <BarChart size={20} />, mode: 'explore' },
            { label: 'School Settings', href: '/dashboard/admin/settings', icon: <Settings size={20} />, mode: 'explore' },
          ],
        },
        {
          title: 'Communicate',
          items: [
            { label: 'Announcements', href: '/dashboard/admin/announcements', icon: <MessageSquare size={20} />, mode: 'collaborate' },
          ],
        },
      ],
      super_admin: [
        {
          title: 'Platform',
          items: [
            { label: 'Overview', href: '/dashboard/admin', icon: <Home size={20} />, mode: 'focus' },
            { label: 'Users', href: '/dashboard/admin/users', icon: <Users size={20} />, mode: 'focus' },
            { label: 'Schools', href: '/dashboard/admin/schools', icon: <Building size={20} />, mode: 'focus' },
            { label: 'Content', href: '/dashboard/admin/content', icon: <Settings size={20} />, mode: 'focus' },
          ],
        },
        {
          title: 'Analytics',
          items: [
            { label: 'Overview', href: '/dashboard/admin', icon: <Home size={20} />, mode: 'explore' },
            { label: 'Platform Stats', href: '/dashboard/admin/platform-stats', icon: <BarChart size={20} />, mode: 'explore' },
            { label: 'Resource Usage', href: '/dashboard/admin/resources', icon: <Layers size={20} />, mode: 'explore' },
          ],
        },
      ],
    };
    
    return groups[role] || groups.student;
  }, [role]);
  
  const isActive = (href: string) => {
    // For dashboard paths, we need more precise matching
    if (href.includes('/dashboard')) {
      // For the dashboard root, only highlight when exactly at /dashboard
      if (href === '/dashboard') {
        return pathname === '/dashboard';
      }
      
      // For dashboard sections like /dashboard/student
      if (href.endsWith('/student') || href.endsWith('/instructor') || href.endsWith('/admin')) {
        return pathname === href;
      }
      
      // For nested paths, check if the current path matches this route but not its parent
      // e.g., /dashboard/student/courses should only highlight 'courses', not 'dashboard'
      const pathParts = pathname.split('/');
      const hrefParts = href.split('/');
      
      // If the href has more parts than the current path, it can't be a match
      if (hrefParts.length > pathParts.length) {
        return false;
      }
      
      // Check if all parts match and the last part of href is the same as the corresponding part in pathname
      for (let i = 0; i < hrefParts.length; i++) {
        if (hrefParts[i] !== pathParts[i]) {
          return false;
        }
      }
      
      // If we matched all href parts and we're at a path with the same depth or deeper,
      // it's considered active
      return true;
    }
    
    // For other paths, use exact matching
    return pathname === href;
  };

  const SIDEBAR_CONFIG = {
    logoTextPrimary: "SuperNova",
    logoTextSecondary: "Learning Management",
    logoInitials: "SN",
    version: "v1.0",
    tooltip: "Toggle Sidebar",
  };

  const { state } = useSidebar();
  const isCollapsed = state === 'collapsed';

  return (
    <Sidebar variant="sidebar" collapsible="icon">
      <SidebarHeader className="opacity-60">
        <div className="flex items-center justify-center h-16 ">
          <div className="relative w-9 h-9">
            <div className="absolute inset-0 bg-gradient-to-tr from-primary to-secondary rounded-lg shadow-sm"></div>
            <div className="absolute inset-0.5 bg-card rounded-lg flex items-center justify-center">
              <span className="text-sm font-bold text-primary">{SIDEBAR_CONFIG.logoInitials}</span>
            </div>
          </div>
          
          <div className={`${isCollapsed ? "hidden" : "ml-3 overflow-hidden whitespace-nowrap"}`}>
            <span className="heading-md block">{SIDEBAR_CONFIG.logoTextPrimary}</span>
            <span className="text-xs text-muted-foreground">{SIDEBAR_CONFIG.logoTextSecondary}</span>
          </div>
        </div>
        
        <SidebarTrigger className="p-1.5 rounded-md hover:bg-background-secondary hidden lg:flex items-center justify-center text-foreground hover:text-primary transition-colors">
          {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </SidebarTrigger>
      </SidebarHeader>
      
      <SidebarContent className="mt-8">
        <SidebarMenu>
          {navGroups.map((group, groupIndex) => {
            // Filter items based on current mode
            const visibleItems = group.items.filter(
              item => !item.mode || item.mode === mode
            );
            
            // Skip the group if there are no visible items
            if (visibleItems.length === 0) {
              return null;
            }
            
            return (
              <div key={group.title} className="px-2">
                {!isCollapsed ? (
                  <h3 className="px-2 text-md font-medium text-muted-foreground/80 mb-4 h-6">
                    {group.title}
                  </h3>
                ) : (
                  <h3 className="px-2 text-md font-medium text-muted-foreground/80 mb-4 h-6">
                    <Separator className="opacity-50" />
                  </h3>
                )}
                
                <div className="space-y-2">
                  {visibleItems.map((item) => {
                    const active = isActive(item.href);
                    
                    return (
                      <SidebarMenuItem key={item.href}>
                        <Link href={item.href} passHref>
                          <SidebarMenuButton
                            variant="default"
                            size="default"
                            isActive={active}
                            className="text-muted-foreground text-md"
                            // title={item.label}
                          >
                            <TooltipProvider>
                              <Tooltip>
                                  <TooltipTrigger asChild>
                                    {item.icon}
                                  </TooltipTrigger>
                                {item.label}
                                <TooltipContent sideOffset={12} side="right">
                                  <p>{item.label}</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </SidebarMenuButton>
                        </Link>
                      </SidebarMenuItem>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter>
        <Separator className="opacity-50" />
        {isCollapsed ? (
          <div className="text-center">
            <div className="text-xs text-muted-foreground">
              v1.0
            </div>
          </div>
        ) : (
          <div className="text-center">
            <div className="text-xs text-muted-foreground flex flex-col items-center justify-center gap-2">
              <span>v1.0</span>
              <span>⌘+B to toggle sidebar</span>
            </div>
          </div>
        )}
      </SidebarFooter>
    </Sidebar>
  );
} 