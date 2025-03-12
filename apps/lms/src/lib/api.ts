import axios, { AxiosInstance, AxiosResponse, AxiosError } from 'axios';
import { 
  ExtendedAxiosRequestConfig, 
  AuthTokens, 
  RefreshTokenRequest 
} from '@/types/api';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

// Flag to track if a token refresh is in progress
let isRefreshing = false;
// Queue of requests to retry after token refresh
let refreshSubscribers: Array<(token: string) => void> = [];

/**
 * Subscribe to token refresh
 * @param callback Function to call when token is refreshed
 */
function subscribeTokenRefresh(callback: (token: string) => void) {
  refreshSubscribers.push(callback);
}

/**
 * Notify all subscribers that token has been refreshed
 * @param token New access token
 */
function onTokenRefreshed(token: string) {
  refreshSubscribers.forEach(callback => callback(token));
  refreshSubscribers = [];
}

/**
 * Reject all subscribers when token refresh fails
 * @param error Error that occurred during refresh
 */
function onRefreshError(error: any) {
  refreshSubscribers.forEach(callback => callback(''));
  refreshSubscribers = [];
}

/**
 * Base API client with authentication and error handling
 */
export class ApiClient {
  private instance: AxiosInstance;

  constructor(baseURL: string = API_URL) {
    this.instance = axios.create({
      baseURL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    // Request interceptor for adding auth token
    this.instance.interceptors.request.use((config) => {
      const token = localStorage.getItem('token');
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });

    // Response interceptor for handling token refresh
    this.instance.interceptors.response.use(
      (response) => response,
      async (error: AxiosError) => {
        const originalRequest = error.config as ExtendedAxiosRequestConfig;

        // If the error is 401 and we haven't retried yet
        if (
          error.response?.status === 401 && 
          originalRequest && 
          !originalRequest._retry && 
          originalRequest.url !== '/auth/refresh' // Prevent refresh loops
        ) {
          // If we're already refreshing, add this request to the queue
          if (isRefreshing) {
            return new Promise<AxiosResponse>((resolve, reject) => {
              subscribeTokenRefresh((token: string) => {
                if (token) {
                  // Replace the expired token and retry
                  if (originalRequest.headers) {
                    originalRequest.headers.Authorization = `Bearer ${token}`;
                  }
                  resolve(this.instance(originalRequest));
                } else {
                  // If refresh failed, reject this request too
                  reject(error);
                }
              });
            });
          }

          // Mark that we're refreshing and this request is being retried
          originalRequest._retry = true;
          isRefreshing = true;

          try {
            // Try to refresh the token
            const refreshToken = localStorage.getItem('refresh_token');
            
            if (!refreshToken) {
              throw new Error('No refresh token available');
            }
            
            // Use a new axios instance to avoid interceptors
            const response = await axios.post<AuthTokens>(
              `${API_URL}/auth/refresh`,
              { refresh_token: refreshToken } as RefreshTokenRequest,
              { headers: { 'Content-Type': 'application/json' } }
            );

            const { access_token, refresh_token } = response.data;

            // Store both tokens in localStorage
            localStorage.setItem('token', access_token);
            localStorage.setItem('refresh_token', refresh_token);

            // Store both tokens in cookies for middleware
            document.cookie = `token=${access_token}; path=/`;
            document.cookie = `refresh_token=${refresh_token}; path=/`;

            // Notify all subscribers that token has been refreshed
            onTokenRefreshed(access_token);
            isRefreshing = false;

            // Retry the original request with the new token
            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${access_token}`;
            }
            return this.instance(originalRequest);
          } catch (refreshError) {
            // If refresh fails, redirect to login
            localStorage.removeItem('token');
            localStorage.removeItem('refresh_token');
            // Clear cookies too
            document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT';
            document.cookie = 'refresh_token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT';
            
            // Notify subscribers about the error
            onRefreshError(refreshError);
            isRefreshing = false;
            
            // Redirect to login page
            if (typeof window !== 'undefined') {
              window.location.href = '/';
            }
            return Promise.reject(refreshError);
          }
        }

        return Promise.reject(error);
      }
    );
  }

  // Generic request methods
  public async get<T>(url: string, config = {}): Promise<T> {
    const response = await this.instance.get<T>(url, config);
    return response.data;
  }

  public async post<T>(url: string, data = {}, config = {}): Promise<T> {
    const response = await this.instance.post<T>(url, data, config);
    return response.data;
  }

  public async put<T>(url: string, data = {}, config = {}): Promise<T> {
    const response = await this.instance.put<T>(url, data, config);
    return response.data;
  }

  public async delete<T>(url: string, config = {}): Promise<T> {
    const response = await this.instance.delete<T>(url, config);
    return response.data;
  }

  public async patch<T>(url: string, data = {}, config = {}): Promise<T> {
    const response = await this.instance.patch<T>(url, data, config);
    return response.data;
  }

  // Get the underlying axios instance if needed
  public getAxiosInstance(): AxiosInstance {
    return this.instance;
  }
}

// Create and export a default instance
export const api = new ApiClient();

// Export the default instance for backward compatibility
export default api; 