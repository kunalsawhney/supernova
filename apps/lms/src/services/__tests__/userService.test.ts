import { describe, it, expect, beforeEach, vi } from 'vitest';
import { userService } from '../userService';
import { User } from '@/types/user';
import { mockApi, resetApiMocks, clearApiCache, createMockApiResponse } from '@/utils/testUtils';

// Mock the API module
vi.mock('@/lib/api', () => ({
  api: {
    get: vi.fn(),
    put: vi.fn(),
    post: vi.fn(),
  },
}));

describe('userService', () => {
  const mockUser: User = {
    id: '1',
    email: 'test@example.com',
    first_name: 'Test',
    last_name: 'User',
    role: 'student',
    status: 'active',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  beforeEach(() => {
    resetApiMocks();
    clearApiCache();
  });

  describe('getProfile', () => {
    it('should fetch the user profile', async () => {
      // Arrange
      const apiMocks = mockApi();
      apiMocks.get.mockResolvedValue(createMockApiResponse(mockUser));

      // Act
      const result = await userService.getProfile();

      // Assert
      expect(apiMocks.get).toHaveBeenCalledWith('/users/me');
      expect(result).toEqual(mockUser);
    });

    it('should return cached data on subsequent calls', async () => {
      // Arrange
      const apiMocks = mockApi();
      apiMocks.get.mockResolvedValue(createMockApiResponse(mockUser));

      // Act - First call should hit the API
      await userService.getProfile();
      
      // Act - Second call should use cache
      await userService.getProfile();

      // Assert - API should only be called once
      expect(apiMocks.get).toHaveBeenCalledTimes(1);
    });
  });

  describe('updateProfile', () => {
    it('should update the user profile', async () => {
      // Arrange
      const apiMocks = mockApi();
      const updateData = { first_name: 'Updated', last_name: 'Name' };
      const updatedUser = { ...mockUser, ...updateData };
      apiMocks.put.mockResolvedValue(createMockApiResponse(updatedUser));

      // Act
      const result = await userService.updateProfile(updateData);

      // Assert
      expect(apiMocks.put).toHaveBeenCalledWith('/users/me', updateData);
      expect(result).toEqual(updatedUser);
    });

    it('should clear the user profile cache after update', async () => {
      // Arrange
      const apiMocks = mockApi();
      apiMocks.get.mockResolvedValue(createMockApiResponse(mockUser));
      apiMocks.put.mockResolvedValue(createMockApiResponse(mockUser));

      // Act - First get the profile (cache it)
      await userService.getProfile();
      
      // Act - Update the profile (should clear cache)
      await userService.updateProfile({ first_name: 'Updated' });
      
      // Act - Get the profile again (should hit API again)
      await userService.getProfile();

      // Assert - API get should be called twice
      expect(apiMocks.get).toHaveBeenCalledTimes(2);
    });
  });

  describe('changePassword', () => {
    it('should change the user password', async () => {
      // Arrange
      const apiMocks = mockApi();
      const response = { message: 'Password changed successfully' };
      apiMocks.post.mockResolvedValue(createMockApiResponse(response));

      // Act
      const result = await userService.changePassword('oldPassword', 'newPassword');

      // Assert
      expect(apiMocks.post).toHaveBeenCalledWith('/users/me/change-password', {
        current_password: 'oldPassword',
        new_password: 'newPassword',
      });
      expect(result).toEqual(response);
    });
  });

  describe('getNotifications', () => {
    it('should fetch user notifications', async () => {
      // Arrange
      const apiMocks = mockApi();
      const mockNotifications = [{ id: '1', message: 'Test notification' }];
      apiMocks.get.mockResolvedValue(createMockApiResponse(mockNotifications));

      // Act
      const result = await userService.getNotifications();

      // Assert
      expect(apiMocks.get).toHaveBeenCalledWith('/users/me/notifications', { params: undefined });
      expect(result).toEqual(mockNotifications);
    });

    it('should pass parameters to the API call', async () => {
      // Arrange
      const apiMocks = mockApi();
      const params = { read: true, limit: 10 };
      apiMocks.get.mockResolvedValue(createMockApiResponse([]));

      // Act
      await userService.getNotifications(params);

      // Assert
      expect(apiMocks.get).toHaveBeenCalledWith('/users/me/notifications', { params });
    });
  });
}); 