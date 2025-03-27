'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  CommandDialog, 
  CommandEmpty, 
  CommandGroup, 
  CommandInput, 
  CommandItem, 
  CommandList, 
  CommandSeparator 
} from '@/components/ui/command';
import { useRole } from '@/contexts/RoleContext';
import { useShell } from '@/contexts/ShellContext';
import { Button } from '@/components/ui/button';
import { 
  Search, 
  Home, 
  BookOpen, 
  GraduationCap, 
  Calendar, 
  Settings, 
  BarChart, 
  Users, 
  Layers, 
  LifeBuoy, 
  Play, 
  FileText, 
  MessageSquare, 
  Key,
  Keyboard,
  PlusCircle,
  Edit,
  CheckSquare,
  Upload,
  Download
} from 'lucide-react';

interface QuickAction {
  name: string;
  shortcut?: string;
  icon: React.ReactNode;
  action: () => void;
}

interface NavigationItem {
  name: string;
  href: string;
  icon: React.ReactNode;
}

interface CommandPaletteProps {
  openShortcutsDialog?: () => void;
}

export function CommandPalette({ openShortcutsDialog }: CommandPaletteProps) {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const { role } = useRole();
  const { mode, setMode, availableModes } = useShell();

  // Handle keyboard shortcut
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  // Role-based navigation items
  const navigationItems: Record<string, NavigationItem[]> = {
    student: [
      { name: 'Dashboard', href: '/dashboard/student', icon: <Home className="mr-2 h-4 w-4" /> },
      { name: 'My Courses', href: '/dashboard/student/courses', icon: <BookOpen className="mr-2 h-4 w-4" /> },
      { name: 'Assignments', href: '/dashboard/student/assignments', icon: <GraduationCap className="mr-2 h-4 w-4" /> },
      { name: 'Calendar', href: '/dashboard/student/calendar', icon: <Calendar className="mr-2 h-4 w-4" /> },
      { name: 'Explore Courses', href: '/dashboard/student/explore', icon: <Layers className="mr-2 h-4 w-4" /> },
      { name: 'Progress Reports', href: '/dashboard/student/progress', icon: <BarChart className="mr-2 h-4 w-4" /> },
      { name: 'Discussion Forums', href: '/dashboard/student/forums', icon: <MessageSquare className="mr-2 h-4 w-4" /> },
      { name: 'Study Groups', href: '/dashboard/student/groups', icon: <Users className="mr-2 h-4 w-4" /> },
      { name: 'Profile', href: '/dashboard/profile', icon: <Settings className="mr-2 h-4 w-4" /> },
    ],
    instructor: [
      { name: 'Dashboard', href: '/dashboard/instructor', icon: <Home className="mr-2 h-4 w-4" /> },
      { name: 'My Courses', href: '/dashboard/instructor/courses', icon: <BookOpen className="mr-2 h-4 w-4" /> },
      { name: 'Assignments', href: '/dashboard/instructor/assignments', icon: <GraduationCap className="mr-2 h-4 w-4" /> },
      { name: 'Calendar', href: '/dashboard/instructor/calendar', icon: <Calendar className="mr-2 h-4 w-4" /> },
      { name: 'Student Progress', href: '/dashboard/instructor/progress', icon: <BarChart className="mr-2 h-4 w-4" /> },
      { name: 'Course Analytics', href: '/dashboard/instructor/analytics', icon: <Layers className="mr-2 h-4 w-4" /> },
      { name: 'Discussion Forums', href: '/dashboard/instructor/forums', icon: <MessageSquare className="mr-2 h-4 w-4" /> },
      { name: 'Office Hours', href: '/dashboard/instructor/office-hours', icon: <Users className="mr-2 h-4 w-4" /> },
      { name: 'Profile', href: '/dashboard/profile', icon: <Settings className="mr-2 h-4 w-4" /> },
    ],
    admin: [
      { name: 'Dashboard', href: '/dashboard/admin', icon: <Home className="mr-2 h-4 w-4" /> },
      { name: 'Users', href: '/dashboard/admin/users', icon: <Users className="mr-2 h-4 w-4" /> },
      { name: 'Courses', href: '/dashboard/admin/courses', icon: <BookOpen className="mr-2 h-4 w-4" /> },
      { name: 'Analytics', href: '/dashboard/admin/analytics', icon: <BarChart className="mr-2 h-4 w-4" /> },
      { name: 'Settings', href: '/dashboard/admin/settings', icon: <Settings className="mr-2 h-4 w-4" /> },
      { name: 'Profile', href: '/dashboard/profile', icon: <Settings className="mr-2 h-4 w-4" /> },
    ],
  };

  // Role-based quick actions
  const quickActionsMap: Record<string, QuickAction[]> = {
    student: [
      { 
        name: 'Resume Last Course', 
        shortcut: '⌘+R',
        icon: <Play className="mr-2 h-4 w-4" />,
        action: () => router.push('/dashboard/student/last-course')
      },
      { 
        name: 'Download Notes', 
        icon: <Download className="mr-2 h-4 w-4" />,
        action: () => router.push('/dashboard/student/notes/download')
      },
      { 
        name: 'Join Study Group', 
        icon: <Users className="mr-2 h-4 w-4" />,
        action: () => router.push('/dashboard/student/groups/join')
      },
      { 
        name: 'View Documentation', 
        icon: <FileText className="mr-2 h-4 w-4" />,
        action: () => window.open('/documentation', '_blank')
      },
      { 
        name: 'Get Help', 
        icon: <LifeBuoy className="mr-2 h-4 w-4" />,
        action: () => router.push('/help')
      },
      { 
        name: 'Keyboard Shortcuts', 
        icon: <Keyboard className="mr-2 h-4 w-4" />,
        action: () => {
          if (openShortcutsDialog) {
            openShortcutsDialog();
          } else {
            setOpen(false);
            const event = new KeyboardEvent('keydown', {
              key: '?',
              shiftKey: true,
              bubbles: true
            });
            document.dispatchEvent(event);
          }
        }
      }
    ],
    instructor: [
      { 
        name: 'Create New Course', 
        shortcut: '⌘+N',
        icon: <PlusCircle className="mr-2 h-4 w-4" />,
        action: () => router.push('/dashboard/instructor/courses/create')
      },
      { 
        name: 'Grade Assignments', 
        icon: <CheckSquare className="mr-2 h-4 w-4" />,
        action: () => router.push('/dashboard/instructor/assignments/grade')
      },
      { 
        name: 'Upload Course Materials', 
        icon: <Upload className="mr-2 h-4 w-4" />,
        action: () => router.push('/dashboard/instructor/courses/upload')
      },
      { 
        name: 'Edit Course Content', 
        icon: <Edit className="mr-2 h-4 w-4" />,
        action: () => router.push('/dashboard/instructor/courses/edit')
      },
      { 
        name: 'View Documentation', 
        icon: <FileText className="mr-2 h-4 w-4" />,
        action: () => window.open('/documentation', '_blank')
      },
      { 
        name: 'Keyboard Shortcuts', 
        icon: <Keyboard className="mr-2 h-4 w-4" />,
        action: () => {
          if (openShortcutsDialog) {
            openShortcutsDialog();
          } else {
            setOpen(false);
            const event = new KeyboardEvent('keydown', {
              key: '?',
              shiftKey: true,
              bubbles: true
            });
            document.dispatchEvent(event);
          }
        }
      }
    ],
    admin: [
      { 
        name: 'Add New User', 
        shortcut: '⌘+U',
        icon: <PlusCircle className="mr-2 h-4 w-4" />,
        action: () => router.push('/dashboard/admin/users/create')
      },
      { 
        name: 'System Settings', 
        icon: <Settings className="mr-2 h-4 w-4" />,
        action: () => router.push('/dashboard/admin/settings/system')
      },
      { 
        name: 'Manage Permissions', 
        icon: <Key className="mr-2 h-4 w-4" />,
        action: () => router.push('/dashboard/admin/users/permissions')
      },
      { 
        name: 'Export Analytics', 
        icon: <Download className="mr-2 h-4 w-4" />,
        action: () => router.push('/dashboard/admin/analytics/export')
      },
      { 
        name: 'View Documentation', 
        icon: <FileText className="mr-2 h-4 w-4" />,
        action: () => window.open('/documentation', '_blank')
      },
      { 
        name: 'Keyboard Shortcuts', 
        icon: <Keyboard className="mr-2 h-4 w-4" />,
        action: () => {
          if (openShortcutsDialog) {
            openShortcutsDialog();
          } else {
            setOpen(false);
            const event = new KeyboardEvent('keydown', {
              key: '?',
              shiftKey: true,
              bubbles: true
            });
            document.dispatchEvent(event);
          }
        }
      }
    ],
  };

  // Get quick actions based on role
  const quickActions = quickActionsMap[role] || quickActionsMap.student;

  // Mode switching actions
  const modeActions = availableModes.map((availableMode) => ({
    name: `Switch to ${availableMode.charAt(0).toUpperCase() + availableMode.slice(1)} Mode`,
    icon: availableMode === 'focus' 
      ? <Key className="mr-2 h-4 w-4" />
      : availableMode === 'explore'
        ? <Layers className="mr-2 h-4 w-4" />
        : <Users className="mr-2 h-4 w-4" />,
    action: () => {
      setMode(availableMode);
      setOpen(false);
    }
  }));

  return (
    <>
      <Button 
        variant="outline" 
        className="relative h-9 w-full justify-start text-sm text-muted-foreground sm:pr-12 md:w-64 lg:w-80"
        onClick={() => setOpen(true)}
      >
        <span className="hidden lg:inline-flex">Search or use commands...</span>
        <span className="inline-flex lg:hidden">Search...</span>
        <kbd className="pointer-events-none absolute right-1.5 top-1.5 hidden h-6 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-xs font-medium opacity-100 sm:flex">
          <span className="text-xs">⌘</span>K
        </kbd>
      </Button>

      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Type a command or search..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          
          {/* Quick Actions */}
          <CommandGroup heading="Quick Actions">
            {quickActions.map((action) => (
              <CommandItem
                key={action.name}
                onSelect={() => {
                  action.action();
                  setOpen(false);
                }}
              >
                {action.icon}
                <span>{action.name}</span>
                {action.shortcut && (
                  <kbd className="ml-auto pointer-events-none hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-xs font-medium opacity-100 sm:flex">
                    {action.shortcut}
                  </kbd>
                )}
              </CommandItem>
            ))}
          </CommandGroup>
          
          <CommandSeparator />
          
          {/* Navigation */}
          <CommandGroup heading="Navigation">
            {(navigationItems[role] || navigationItems.student).map((item) => (
              <CommandItem
                key={item.name}
                onSelect={() => {
                  router.push(item.href);
                  setOpen(false);
                }}
              >
                {item.icon}
                <span>{item.name}</span>
              </CommandItem>
            ))}
          </CommandGroup>
          
          {availableModes.length > 1 && (
            <>
              <CommandSeparator />
              
              {/* Mode Switching */}
              <CommandGroup heading="Change Mode">
                {modeActions.map((action) => (
                  <CommandItem
                    key={action.name}
                    onSelect={action.action}
                  >
                    {action.icon}
                    <span>{action.name}</span>
                  </CommandItem>
                ))}
              </CommandGroup>
            </>
          )}
        </CommandList>
      </CommandDialog>
    </>
  );
} 