'use client';

import { useState } from 'react';

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

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const markAsRead = (id: number) => {
    setNotifications(notifications.map(notification =>
      notification.id === id ? { ...notification, isRead: true } : notification
    ));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(notification => ({ ...notification, isRead: true })));
  };

  const getTypeStyles = (type: Notification['type']) => {
    switch (type) {
      case 'success':
        return 'bg-green-100 text-green-800';
      case 'warning':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-blue-100 text-blue-800';
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-lg hover:bg-background-secondary transition-colors relative"
      >
        <span className="text-xl">🔔</span>
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-background-secondary border border-border rounded-lg shadow-lg z-50">
          <div className="p-4 border-b border-border">
            <div className="flex justify-between items-center">
              <h3 className="text-lg-medium">Notifications</h3>
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="text-sm text-button-primary hover:underline"
                >
                  Mark all as read
                </button>
              )}
            </div>
          </div>

          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-4 text-center text-text-secondary">
                No notifications
              </div>
            ) : (
              notifications.map(notification => (
                <div
                  key={notification.id}
                  className={`p-4 border-b border-border hover:bg-background-secondary transition-colors ${
                    !notification.isRead ? 'bg-background-secondary' : ''
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h4 className="text-md-medium text-text-primary">{notification.title}</h4>
                      <p className="text-sm text-text-secondary mt-1">{notification.message}</p>
                      <div className="flex items-center mt-2">
                        <span className={`text-xs px-2 py-1 rounded-full ${getTypeStyles(notification.type)}`}>
                          {notification.type}
                        </span>
                        <span className="text-xs text-text-secondary ml-2">{notification.time}</span>
                      </div>
                    </div>
                    {!notification.isRead && (
                      <button
                        onClick={() => markAsRead(notification.id)}
                        className="ml-2 text-sm text-button-primary hover:underline"
                      >
                        Mark as read
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="p-4 border-t border-border">
            <button className="w-full text-center text-button-primary text-sm hover:underline">
              View all notifications
            </button>
          </div>
        </div>
      )}
    </div>
  );
} 