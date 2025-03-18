import { api } from '@/lib/api';
import { 
  User, 
  UserViewModel, 
  NotificationViewModel,
  transformUser,
  transformNotification
} from '@/types/user';
import { withCache, clearCacheByPrefix } from '@/utils/caching';

/**
 * Service for user-related API calls
 */
export const userService = {
  /**
   * Get current user's profile
   * @returns Transformed user view model ready for UI display
   */
  getProfile: withCache(
    async (): Promise<UserViewModel> => {
      const user = await api.get<User>('/users/me');
      return transformUser(user);
    },
    () => 'current_user_profile',
    { ttl: 5 * 60 * 1000 } // 5 minutes cache
  ),

  /**
   * Update the current user's profile
   * @returns Transformed user view model ready for UI display
   */
  async updateProfile(data: Partial<User>): Promise<UserViewModel> {
    const result = await api.put<User>('/users/me', data);
    // Clear user-related cache entries when profile is updated
    clearCacheByPrefix('user_');
    return transformUser(result);
  },

  /**
   * Change the current user's password
   */
  async changePassword(currentPassword: string, newPassword: string): Promise<{ message: string }> {
    return api.post<{ message: string }>('/users/me/change-password', {
      current_password: currentPassword,
      new_password: newPassword,
    });
  },

  /**
   * Update user preferences
   * @returns Transformed user view model ready for UI display
   */
  async updatePreferences(preferences: Record<string, any>): Promise<UserViewModel> {
    const result = await api.put<User>('/users/me/preferences', { preferences });
    // Clear user profile cache when preferences are updated
    clearCacheByPrefix('user_profile');
    return transformUser(result);
  },

  /**
   * Get user notifications
   * @returns Transformed notification view models ready for UI display
   */
  getNotifications: withCache(
    async (params?: { read?: boolean; limit?: number }): Promise<NotificationViewModel[]> => {
      const notifications = await api.get<any[]>('/users/me/notifications', { params });
      return notifications.map(transformNotification);
    },
    (params?: { read?: boolean; limit?: number }) => {
      // Create a cache key based on the parameters
      const readParam = params?.read !== undefined ? `read_${params.read}` : 'read_all';
      const limitParam = params?.limit ? `limit_${params.limit}` : 'limit_default';
      return `user_notifications_${readParam}_${limitParam}`;
    },
    { ttl: 2 * 60 * 1000 } // 2 minutes cache for notifications
  ),

  /**
   * Mark notifications as read
   */
  async markNotificationsAsRead(notificationIds: string[]): Promise<{ message: string }> {
    const result = await api.post<{ message: string }>('/users/me/notifications/mark-read', {
      notification_ids: notificationIds,
    });
    // Clear notifications cache when marking as read
    clearCacheByPrefix('user_notifications_');
    return result;
  }
}; 