'use client';

import { useState, useRef, useEffect } from 'react';
import { useTheme } from 'next-themes';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Bell,
  Sun,
  Moon,
  User,
  Settings,
  LogOut,
  Target,
  Eye,
  Check,
  Info,
  AlertTriangle
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { useShell } from '@/contexts/ShellContext';

// Mock notifications
const mockNotifications = [
  {
    id: 1,
    title: 'New Quiz Available',
    message: 'Python Basics Quiz is now available.',
    type: 'info',
    time: '5m ago',
    read: false,
  },
  {
    id: 2,
    title: 'Achievement Unlocked',
    message: 'You\'ve earned the "Quick Learner" badge.',
    type: 'success',
    time: '1h ago',
    read: false,
  },
  {
    id: 3,
    title: 'Upcoming Live Class',
    message: 'Web Development class starts in 30 minutes.',
    type: 'warning',
    time: '25m ago',
    read: false,
  }
];

export function HeaderActions() {
  const { theme, setTheme } = useTheme();
  const { user, signOut } = useAuth();
  const { setCompactView } = useShell();
  const [focusMode, setFocusMode] = useState(false);
  const [notifications, setNotifications] = useState(mockNotifications);
  const [mounted, setMounted] = useState(false);

  // After hydration, we can show the theme-dependent UI
  useEffect(() => {
    setMounted(true);
  }, []);

  // Toggle focus mode
  const toggleFocusMode = () => {
    setFocusMode(!focusMode);
    setCompactView(!focusMode);
  };

  // Mark notification as read
  const markAsRead = (id: number) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
  };

  // Mark all notifications as read
  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, read: true }))
    );
  };

  // Get unread notification count
  const unreadCount = notifications.filter(notification => !notification.read).length;

  // Get notification icon based on type
  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <Check className="h-4 w-4 text-green-500" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-amber-500" />;
      default:
        return <Info className="h-4 w-4 text-blue-500" />;
    }
  };

  // Generate initials for avatar fallback
  const getInitials = () => {
    if (user?.firstName && user?.lastName) {
      return `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`;
    }
    return user?.email?.charAt(0).toUpperCase() || '?';
  };

  return (
    <div className="flex items-center space-x-2">
      {/* Notifications Dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="relative h-9 w-9">
            <Bell className="h-5 w-5" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
                {unreadCount}
              </span>
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-80">
          <div className="flex items-center justify-between p-2">
            <DropdownMenuLabel>Notifications</DropdownMenuLabel>
            {unreadCount > 0 && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={markAllAsRead}
                className="h-8 px-2 text-xs"
              >
                <Check className="mr-1 h-3.5 w-3.5" />
                Mark all read
              </Button>
            )}
          </div>
          <DropdownMenuSeparator />
          {notifications.length === 0 ? (
            <div className="py-4 text-center text-sm text-muted-foreground">
              No notifications
            </div>
          ) : (
            <div className="max-h-[300px] overflow-auto">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`relative p-3 cursor-pointer hover:bg-muted ${!notification.read ? 'bg-muted/50' : ''}`}
                  onClick={() => markAsRead(notification.id)}
                >
                  <div className="flex gap-3">
                    <div className="mt-0.5">
                      {getNotificationIcon(notification.type)}
                    </div>
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {notification.title}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {notification.message}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {notification.time}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Theme Toggle - Only render after hydration to avoid mismatches */}
      <Button
        variant="ghost"
        size="icon"
        className="h-9 w-9"
        onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      >
        {mounted ? (
          theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />
        ) : (
          <div className="h-5 w-5" /> /* Placeholder while rendering */
        )}
      </Button>

      {/* Focus Mode Toggle */}
      <Button
        variant="ghost"
        size="icon"
        className="h-9 w-9"
        onClick={toggleFocusMode}
      >
        {focusMode ? 
          <Target className="h-5 w-5 text-primary" /> : 
          <Eye className="h-5 w-5" />
        }
      </Button>

      {/* User Profile Dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full overflow-hidden">
            <Avatar>
              <AvatarImage src={user?.profileImageUrl} alt={user?.firstName || 'User'} />
              <AvatarFallback>
                {getInitials()}
              </AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <div className="flex items-center p-2 gap-2">
            <Avatar className="h-10 w-10">
              <AvatarImage src={user?.profileImageUrl} alt={user?.firstName || 'User'} />
              <AvatarFallback>
                {getInitials()}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">
                {user?.firstName} {user?.lastName}
              </p>
              <p className="text-xs text-muted-foreground truncate">
                {user?.email}
              </p>
            </div>
          </div>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Link href="/dashboard/profile" className="flex w-full cursor-pointer text-muted-foreground">
              <User className="mr-2 h-4 w-4" />
              My Profile
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/dashboard/settings" className="flex w-full cursor-pointer text-muted-foreground">
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="text-red-600" onClick={signOut}>
            <LogOut className="mr-2 h-4 w-4" />
            Sign Out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
} 