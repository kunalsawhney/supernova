'use client';

import { useState, useRef, useEffect } from 'react';
import { 
  Bell, 
  CheckCircle2, 
  Info, 
  AlertTriangle, 
  Check,
  Eye,
  ChevronDown,
  X,
  Clock,
  BadgeCheck,
  Calendar
} from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { formatDistanceToNow } from 'date-fns';

// Import UI components
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

type NotificationType = 'info' | 'success' | 'warning';

interface Notification {
  id: number;
  title: string;
  message: string;
  type: NotificationType;
  createdAt: Date;
  isRead: boolean;
  link?: string;
  actionText?: string;
}

// Mock notifications data with actual dates
const mockNotifications: Notification[] = [
  {
    id: 1,
    title: 'New Quiz Available',
    message: 'Python Basics Quiz is now available in your Python Programming course.',
    type: 'info',
    createdAt: new Date(Date.now() - 5 * 60 * 1000), // 5 minutes ago
    isRead: false,
    link: '/dashboard/student/courses/python/quizzes',
    actionText: 'Take Quiz',
  },
  {
    id: 2,
    title: 'Achievement Unlocked',
    message: "Congratulations! You've earned the \"Quick Learner\" badge.",
    type: 'success',
    createdAt: new Date(Date.now() - 60 * 60 * 1000), // 1 hour ago
    isRead: false,
    link: '/dashboard/student/achievements',
    actionText: 'View Badge',
  },
  {
    id: 3,
    title: 'Upcoming Live Class',
    message: 'Your "Web Development" live class starts in 30 minutes.',
    type: 'warning',
    createdAt: new Date(Date.now() - 25 * 60 * 1000), // 25 minutes ago
    isRead: false,
    link: '/dashboard/student/classes/web-dev',
    actionText: 'Join Class',
  },
  {
    id: 4,
    title: 'Assignment Graded',
    message: 'Your JavaScript Fundamentals assignment has been graded.',
    type: 'success',
    createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000), // 3 hours ago
    isRead: true,
    link: '/dashboard/student/assignments/js-fundamentals',
    actionText: 'See Feedback',
  },
  {
    id: 5,
    title: 'Course Recommendation',
    message: 'Based on your interests, we recommend "Advanced React Patterns".',
    type: 'info',
    createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000), // 12 hours ago
    isRead: true,
    link: '/dashboard/student/courses/recommendations',
    actionText: 'View Course',
  },
];

export default function NotificationsDropdown() {
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'unread'>('all');
  const dropdownRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter(n => !n.isRead).length;
  
  const filteredNotifications = selectedFilter === 'all' 
    ? notifications 
    : notifications.filter(n => !n.isRead);

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

  const markAsRead = (id: number) => {
    setNotifications(notifications.map(notification =>
      notification.id === id ? { ...notification, isRead: true } : notification
    ));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(notification => ({ ...notification, isRead: true })));
  };

  const getTypeIcon = (type: NotificationType) => {
    switch (type) {
      case 'success':
        return <BadgeCheck className="h-4 w-4 text-emerald-500" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-amber-500" />;
      default:
        return <Info className="h-4 w-4 text-blue-500" />;
    }
  };

  const getTypeBadge = (type: NotificationType) => {
    switch (type) {
      case 'success':
        return (
          <Badge variant="outline" className="text-xs bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800/30">
            Success
          </Badge>
        );
      case 'warning':
        return (
          <Badge variant="outline" className="text-xs bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800/30">
            Important
          </Badge>
        );
      default:
        return (
          <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800/30">
            Info
          </Badge>
        );
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <Button
        onClick={() => setIsOpen(!isOpen)}
        variant="ghost"
        size="icon"
        className="relative h-9 w-9 rounded-full"
        aria-label="Notifications"
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </Button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="absolute right-0 mt-2 w-80 sm:w-96 z-50"
          >
            <Card className="border shadow-lg overflow-hidden">
              <CardHeader className="p-4 pb-2 space-y-1.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold">Notifications</h3>
                    {unreadCount > 0 && (
                      <Badge variant="secondary" className="rounded-full px-2 py-0">
                        {unreadCount} new
                      </Badge>
                    )}
                  </div>
                  {unreadCount > 0 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 px-2 text-xs"
                      onClick={markAllAsRead}
                    >
                      <Check className="mr-1 h-3.5 w-3.5" />
                      Mark all read
                    </Button>
                  )}
                </div>
                
                <div className="flex gap-2 pt-1">
                  <Button
                    size="sm"
                    variant={selectedFilter === 'all' ? 'default' : 'outline'}
                    className="h-7 px-2 text-xs rounded-full"
                    onClick={() => setSelectedFilter('all')}
                  >
                    All
                  </Button>
                  <Button
                    size="sm"
                    variant={selectedFilter === 'unread' ? 'default' : 'outline'}
                    className="h-7 px-2 text-xs rounded-full"
                    onClick={() => setSelectedFilter('unread')}
                  >
                    Unread
                  </Button>
                </div>
              </CardHeader>

              <CardContent className="p-0">
                <div className="max-h-[400px] overflow-y-auto">
                  {filteredNotifications.length === 0 ? (
                    <div className="py-12 text-center">
                      <div className="mx-auto h-12 w-12 rounded-full bg-muted flex items-center justify-center mb-3">
                        <Bell className="h-6 w-6 text-muted-foreground opacity-50" />
                      </div>
                      <p className="text-sm text-muted-foreground">No notifications</p>
                      {selectedFilter === 'unread' && notifications.length > 0 && (
                        <Button
                          variant="link"
                          size="sm"
                          className="mt-1 h-auto p-0 text-xs"
                          onClick={() => setSelectedFilter('all')}
                        >
                          View all notifications
                        </Button>
                      )}
                    </div>
                  ) : (
                    <div>
                      {filteredNotifications.map((notification, index) => (
                        <div
                          key={notification.id}
                          className={`relative ${
                            index !== filteredNotifications.length - 1 ? 'border-b border-border/50' : ''
                          }`}
                        >
                          {!notification.isRead && (
                            <div className="absolute left-0 top-3 bottom-3 w-1 bg-primary rounded-r-full" />
                          )}
                          <div className={`px-4 py-3 ${!notification.isRead ? 'bg-muted/50' : ''}`}>
                            <div className="flex gap-3">
                              <div className={`flex-shrink-0 rounded-full h-9 w-9 flex items-center justify-center 
                                ${notification.type === 'success' ? 'bg-emerald-100 dark:bg-emerald-900/30' : 
                                  notification.type === 'warning' ? 'bg-amber-100 dark:bg-amber-900/30' : 
                                  'bg-blue-100 dark:bg-blue-900/30'}`}
                              >
                                {notification.type === 'success' && <BadgeCheck className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />}
                                {notification.type === 'warning' && <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-400" />}
                                {notification.type === 'info' && <Info className="h-5 w-5 text-blue-600 dark:text-blue-400" />}
                              </div>
                              
                              <div className="flex-1 min-w-0">
                                <div className="flex justify-between items-start gap-2">
                                  <p className={`text-sm font-medium ${!notification.isRead ? 'text-foreground' : 'text-muted-foreground'}`}>
                                    {notification.title}
                                  </p>
                                  <div className="flex items-center text-xs text-muted-foreground whitespace-nowrap">
                                    <Clock className="h-3 w-3 mr-1" />
                                    {formatDistanceToNow(notification.createdAt, { addSuffix: true })}
                                  </div>
                                </div>
                                
                                <p className="text-sm text-muted-foreground mt-0.5 line-clamp-2">
                                  {notification.message}
                                </p>
                                
                                <div className="flex justify-between items-center mt-2">
                                  {notification.link && (
                                    <Button
                                      variant="link"
                                      size="sm"
                                      className="h-6 p-0 text-xs"
                                      onClick={() => {
                                        markAsRead(notification.id);
                                        window.location.href = notification.link!;
                                      }}
                                    >
                                      {notification.actionText || 'View'}
                                    </Button>
                                  )}
                                  
                                  {!notification.isRead && (
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="h-6 px-2 text-xs"
                                      onClick={() => markAsRead(notification.id)}
                                    >
                                      Mark as read
                                    </Button>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>

              <CardFooter className="p-3 border-t bg-muted/50">
                <Button
                  variant="outline" 
                  size="sm" 
                  className="w-full"
                  onClick={() => {
                    setIsOpen(false);
                    // Navigate to notifications page
                    // router.push('/dashboard/notifications');
                  }}
                >
                  <Eye className="mr-2 h-4 w-4" />
                  View all notifications
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
} 