export interface User {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  role: string;
  created_at: string;
  updated_at: string;
  status?: string;
  preferences?: Record<string, any>;
  profile_image_url?: string;
}

// View Models for UI
export interface UserViewModel {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  fullName: string;
  role: string;
  createdAt: string;
  updatedAt: string;
  status?: string;
  preferences?: Record<string, any>;
  profileImageUrl?: string;
}

export interface NotificationViewModel {
  id: string;
  message: string;
  type: string;
  isRead: boolean;
  createdAt: string;
  link?: string;
  data?: Record<string, any>;
}

// Transformation functions
export const transformUser = (user: User): UserViewModel => ({
  id: user.id,
  email: user.email,
  firstName: user.first_name,
  lastName: user.last_name,
  fullName: `${user.first_name} ${user.last_name}`,
  role: user.role,
  createdAt: user.created_at,
  updatedAt: user.updated_at,
  status: user.status,
  preferences: user.preferences,
  profileImageUrl: user.profile_image_url,
});

export const transformNotification = (notification: any): NotificationViewModel => ({
  id: notification.id,
  message: notification.message,
  type: notification.type,
  isRead: notification.is_read || false,
  createdAt: notification.created_at,
  link: notification.link,
  data: notification.data,
}); 