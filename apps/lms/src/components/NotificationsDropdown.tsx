'use client';

import { useState, useRef, useEffect } from 'react';
import { FiBell, FiCheck, FiCheckCircle, FiInfo, FiAlertTriangle, FiX, FiEye } from 'react-icons/fi';

type Notification = {
  id: number;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning';
  time: string;
  isRead: boolean;
};

// Mock notifications data
const mockNotifications: Notification[] = [
  {
    id: 1,
    title: 'New Quiz Available',
    message: 'Python Basics Quiz is now available in your Python Programming course.',
    type: 'info',
    time: '5 min ago',
    isRead: false,
  },
  {
    id: 2,
    title: 'Achievement Unlocked',
    message: "Congratulations! You've earned the \"Quick Learner\" badge.",
    type: 'success',
    time: '1 hour ago',
    isRead: false,
  },
  {
    id: 3,
    title: 'Upcoming Live Class',
    message: 'Your "Web Development" live class starts in 30 minutes.',
    type: 'warning',
    time: '25 min ago',
    isRead: false,
  },
];

export default function NotificationsDropdown() {
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter(n => !n.isRead).length;

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

  const getTypeIcon = (type: Notification['type']) => {
    switch (type) {
      case 'success':
        return <FiCheckCircle className="text-green-500" />;
      case 'warning':
        return <FiAlertTriangle className="text-yellow-500" />;
      default:
        return <FiInfo className="text-blue-500" />;
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2.5 rounded-full hover:bg-background-secondary transition-colors relative flex items-center justify-center"
        aria-label="Notifications"
      >
        <FiBell className="w-5 h-5 text-text-primary" />
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-button-primary rounded-full">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div
          className="absolute right-0 mt-2 w-96 bg-background border border-border rounded-xl shadow-xl z-50 overflow-hidden transition-all duration-200"
        >
          <div className="px-5 py-4 border-b border-border flex justify-between items-center">
            <h3 className="heading-md flex items-center">
              Notifications
              {unreadCount > 0 && (
                <span className="ml-2 text-sm bg-button-primary/10 text-button-primary px-2 py-0.5 rounded-full">
                  {unreadCount} new
                </span>
              )}
            </h3>
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="text-sm text-button-primary hover:text-button-primary/80 flex items-center font-medium"
              >
                <FiCheck className="mr-1" />
                Mark all read
              </button>
            )}
          </div>

          <div className="max-h-[400px] overflow-y-auto scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent">
            {notifications.length === 0 ? (
              <div className="py-12 text-center">
                <div className="mx-auto w-16 h-16 mb-4 flex items-center justify-center rounded-full bg-background-secondary">
                  <FiBell className="w-8 h-8 text-text-secondary opacity-50" />
                </div>
                <p className="text-text-secondary">No notifications yet</p>
              </div>
            ) : (
              notifications.map((notification, index) => (
                <div
                  key={notification.id}
                  className={`relative ${
                    !notification.isRead ? 'bg-background-secondary' : 'bg-background'
                  } ${index !== notifications.length - 1 ? 'border-b border-border' : ''}`}
                >
                  {!notification.isRead && (
                    <span className="absolute left-0 top-0 bottom-0 w-1 bg-button-primary"></span>
                  )}
                  <div className="p-5">
                    <div className="flex items-start">
                      <div className="flex-shrink-0 mt-0.5">
                        <div className="flex items-center justify-center w-9 h-9 rounded-full bg-background">
                          {getTypeIcon(notification.type)}
                        </div>
                      </div>
                      <div className="ml-3 flex-1">
                        <div className="flex justify-between">
                          <h4 className="text-md font-semibold">{notification.title}</h4>
                          <span className="text-xs text-text-secondary">{notification.time}</span>
                        </div>
                        <p className="text-sm text-text-secondary mt-1">{notification.message}</p>
                        
                        {!notification.isRead && (
                          <div className="flex mt-2 space-x-2">
                            <button
                              onClick={() => markAsRead(notification.id)}
                              className="text-xs px-3 py-1 rounded-full border border-button-primary/30 text-button-primary bg-button-primary/5 hover:bg-button-primary/10 transition-colors flex items-center"
                            >
                              <FiCheck className="mr-1 w-3 h-3" />
                              Mark as read
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="p-3 border-t border-border bg-background-secondary">
            <button className="w-full py-2 px-4 flex items-center justify-center text-text-primary font-medium text-sm rounded-lg hover:bg-background transition-colors">
              <FiEye className="mr-2" />
              View all notifications
            </button>
          </div>
        </div>
      )}
    </div>
  );
} 