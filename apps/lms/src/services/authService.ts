import { api } from '@/lib/api';
import axios from 'axios';
import { AuthTokens, LoginCredentials, RefreshTokenRequest } from '@/types/api';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

/**
 * Service for authentication-related API calls
 */
export const authService = {
  /**
   * Login with email and password
   */
  async login(email: string, password: string): Promise<AuthTokens> {
    return api.post<AuthTokens>('/auth/login', { 
      username: email, 
      password 
    } as LoginCredentials);
  },

  /**
   * Refresh the access token using a refresh token
   * Uses a direct axios call to avoid interceptors
   */
  async refreshToken(refreshToken: string): Promise<AuthTokens> {
    try {
      // Use a direct axios call to avoid interceptors
      const response = await axios.post<AuthTokens>(
        `${API_URL}/auth/refresh`, 
        { refresh_token: refreshToken } as RefreshTokenRequest,
        { headers: { 'Content-Type': 'application/json' } }
      );
      return response.data;
    } catch (error) {
      console.error('Token refresh failed:', error);
      // Clear tokens on refresh failure
      this.clearTokens();
      throw error;
    }
  },

  /**
   * Register a new user
   */
  async register(data: {
    email: string;
    password: string;
    first_name: string;
    last_name: string;
  }): Promise<AuthTokens> {
    return api.post<AuthTokens>('/auth/register', data);
  },

  /**
   * Request a password reset
   */
  async requestPasswordReset(email: string): Promise<{ message: string }> {
    return api.post<{ message: string }>('/auth/password-reset-request', { email });
  },

  /**
   * Reset password with token
   */
  async resetPassword(token: string, newPassword: string): Promise<{ message: string }> {
    return api.post<{ message: string }>('/auth/password-reset', {
      token,
      new_password: newPassword,
    });
  },

  /**
   * Clear all authentication tokens
   */
  clearTokens(): void {
    // Clear tokens from localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('refresh_token');
    
    // Clear cookies
    document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT';
    document.cookie = 'refresh_token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT';
  },

  /**
   * Logout the current user
   */
  async logout(): Promise<void> {
    // Clear tokens
    this.clearTokens();
    
    // Call logout endpoint if needed
    try {
      await api.post<void>('/auth/logout');
    } catch (error) {
      // Ignore errors on logout
      console.error('Error during logout:', error);
    }
  }
}; 