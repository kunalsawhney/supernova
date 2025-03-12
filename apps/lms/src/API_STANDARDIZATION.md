# API Standardization Documentation

This document outlines the standardization of the API layer in our LMS application, including the organization of types, services, and utilities.

## Overview

We've implemented a comprehensive API standardization to improve type safety, maintainability, and performance across the application. The standardization includes:

1. **Organized Type Definitions**: Clear separation of domain-specific types
2. **Service-Based Architecture**: Domain-specific services with consistent patterns
3. **Caching Layer**: Performance optimization for frequently accessed data
4. **Error Handling**: Standardized error handling across the application
5. **Testing Utilities**: Tools to facilitate unit testing of services
6. **Data Transformation Layer**: Centralized transformation of API data to view models
7. **Robust Authentication**: Advanced token refresh mechanism with request queuing

## Directory Structure

```
src/
├── lib/
│   └── api.ts                 # Core API client with authentication and error handling
├── services/
│   ├── index.ts               # Re-exports all services
│   ├── authService.ts         # Authentication-related API calls
│   ├── userService.ts         # User-related API calls
│   ├── courseService.ts       # Course-related API calls
│   ├── enrollmentService.ts   # Enrollment-related API calls
│   └── adminService.ts        # Admin-related API calls
├── types/
│   ├── index.ts               # Re-exports all types
│   ├── api.ts                 # API-related types (responses, errors, etc.)
│   ├── user.ts                # User-related types
│   ├── course.ts              # Course-related types
│   ├── school.ts              # School-related types
│   ├── admin.ts               # Admin-related types and transformations
│   └── enrollment.ts          # Enrollment-related types
├── contexts/
│   ├── AuthContext.tsx        # Authentication context with session management
│   └── ...                    # Other context providers
└── utils/
    ├── caching.ts             # Caching utilities for API responses
    ├── errorHandling.ts       # Error handling utilities
    └── testUtils.ts           # Testing utilities for services
```

## Key Components

### API Client (`lib/api.ts`)

The core API client provides:
- Consistent request methods (get, post, put, patch, delete)
- Authentication token management
- Advanced token refresh with request queuing
- Error handling and transformation
- Request/response interceptors
- Prevention of token refresh loops

#### Token Refresh Mechanism

Our token refresh implementation includes:
- Request queuing during token refresh
- Handling of concurrent requests during refresh
- Prevention of refresh loops
- Direct axios calls for token refresh to bypass interceptors
- Proper error handling and recovery
- Automatic redirection on authentication failures

```typescript
// Flag to track if a token refresh is in progress
let isRefreshing = false;
// Queue of requests to retry after token refresh
let refreshSubscribers: Array<(token: string) => void> = [];

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
        // Try to refresh the token using a direct axios call
        const refreshToken = localStorage.getItem('refresh_token');
        // ... token refresh logic ...
        
        // Notify all subscribers that token has been refreshed
        onTokenRefreshed(access_token);
        isRefreshing = false;
        
        // Retry the original request
        return this.instance(originalRequest);
      } catch (refreshError) {
        // Handle refresh failure
        onRefreshError(refreshError);
        isRefreshing = false;
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);
```

### Authentication Context (`contexts/AuthContext.tsx`)

The authentication context provides:
- User authentication state management
- Session persistence
- Token refresh functionality
- Sign-in and sign-out methods
- Automatic session recovery

```typescript
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserViewModel | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Function to refresh the user session
  const refreshSession = async (): Promise<boolean> => {
    try {
      const refreshToken = localStorage.getItem('refresh_token');
      if (!refreshToken) {
        return false;
      }

      const { access_token, refresh_token } = await authService.refreshToken(refreshToken);
      
      // Store tokens and get user profile
      // ...
      
      return true;
    } catch (error) {
      console.error('Session refresh failed:', error);
      return false;
    }
  };

  useEffect(() => {
    // Check for existing session
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          try {
            const userData = await userService.getProfile();
            setUser(userData);
          } catch (error) {
            // If profile fetch fails, try to refresh the token
            const refreshSuccess = await refreshSession();
            if (!refreshSuccess) {
              // Clear tokens on failure
              // ...
            }
          }
        }
      } catch (error) {
        console.error('Auth check failed:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Sign in, sign out methods
  // ...

  return (
    <AuthContext.Provider value={{ user, isLoading, signIn, signOut, refreshSession }}>
      {children}
    </AuthContext.Provider>
  );
}
```

### Authentication Service (`services/authService.ts`)

The authentication service provides:
- Login and registration methods
- Token refresh functionality
- Password reset functionality
- Logout functionality
- Token management utilities

```typescript
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
   * Clear all authentication tokens
   */
  clearTokens(): void {
    // Clear tokens from localStorage and cookies
    // ...
  },

  // Other authentication methods
  // ...
};
```

### Services

Each service follows a consistent pattern:
- Domain-specific API calls
- Strong typing for parameters and responses
- JSDoc comments for documentation
- Caching for frequently accessed data
- Cache invalidation when data is modified
- Data transformation from API models to view models

Example:
```typescript
export const adminService = {
  /**
   * Get a list of users with optional filtering
   * @returns Transformed user view models ready for UI display
   */
  async getUsers(params?: PaginationParams & { role?: string }): Promise<UserViewModel[]> {
    const users = await api.get<ApiUser[]>('/admin/users', { params });
    return users.map(transformUser);
  }
};
```

### Data Transformation

The data transformation layer provides:
- Conversion between API data models and frontend view models
- Centralized transformation logic in the service layer
- Consistent naming conventions (e.g., `snake_case` to `camelCase`)
- Type safety through explicit typing

Example transformation:
```typescript
// In types/admin.ts - Definition of transformation function
export const transformUser = (user: ApiUser): UserViewModel => ({
  id: user.id,
  email: user.email,
  firstName: user.first_name,
  lastName: user.last_name,
  role: user.role,
  schoolId: user.school_id,
  isActive: user.is_active,
  createdAt: user.created_at,
});

// In services/adminService.ts - Application of transformation
async getUser(id: string): Promise<UserViewModel> {
  const user = await api.get<ApiUser>(`/admin/users/${id}`);
  return transformUser(user);
}
```

### Caching

The caching system provides:
- In-memory cache for API responses
- Configurable TTL (Time To Live)
- Automatic cache invalidation
- Cache key generation based on parameters
- Utility functions for cache management

Example usage:
```typescript
// Wrap a function with caching
const cachedFunction = withCache(
  async (id: string) => api.get(`/resource/${id}`),
  (id: string) => `resource_${id}`,
  { ttl: 5 * 60 * 1000 } // 5 minutes
);

// Clear cache by prefix
clearCacheByPrefix('resource_');
```

### Error Handling

Standardized error handling includes:
- Consistent error format
- Type guards for error checking
- Utility functions for error formatting
- Centralized error logging

### Testing Utilities

Testing utilities include:
- API mocking functions
- Cache management for tests
- Mock response generators
- localStorage mocking
- Fetch API mocking

## Benefits

1. **Type Safety**: Strong typing throughout the API layer
2. **Consistency**: Uniform patterns across all services
3. **Maintainability**: Clear separation of concerns
4. **Performance**: Caching for frequently accessed data
5. **Testability**: Easy-to-use testing utilities
6. **Documentation**: JSDoc comments for all public methods
7. **Developer Experience**: Simplified imports and usage
8. **Separation of Concerns**: API data models separate from UI view models
9. **Robust Authentication**: Advanced token refresh with request queuing
10. **Error Recovery**: Graceful handling of authentication failures

## Usage Examples

### Importing Services

```typescript
// Import all services
import { authService, userService, courseService } from '@/services';

// Or import specific service
import { userService } from '@/services/userService';
```

### Using Services in Components

```typescript
import { userService } from '@/services';
import { useEffect, useState } from 'react';
import { UserViewModel } from '@/types';

function UserProfile() {
  const [user, setUser] = useState<UserViewModel | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await userService.getProfile();
        setUser(userData);
      } catch (err) {
        setError('Failed to load user profile');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  // Component rendering...
}
```

### Using the Authentication Context

```typescript
import { useAuth } from '@/contexts/AuthContext';
import { useState } from 'react';

function LoginForm() {
  const { signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      await signIn(email, password);
      // Redirect happens automatically in the AuthContext
    } catch (err) {
      setError('Invalid email or password');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Form rendering...
}
```

### Manual Token Refresh

```typescript
import { useAuth } from '@/contexts/AuthContext';

function SessionRecovery() {
  const { refreshSession } = useAuth();
  
  const handleSessionExpired = async () => {
    const success = await refreshSession();
    if (success) {
      // Session recovered, continue
      console.log('Session recovered successfully');
    } else {
      // Session recovery failed, redirect to login
      window.location.href = '/login';
    }
  };

  // Component rendering...
}
```

## Future Improvements

1. **Persistent Caching**: Add localStorage/IndexedDB for persistent caching
2. **Request Deduplication**: Prevent duplicate requests for the same resource
3. **Offline Support**: Add offline capabilities with service workers
4. **Rate Limiting**: Implement client-side rate limiting
5. **Analytics**: Add request/response tracking for analytics
6. **Pagination Helpers**: Utilities for handling paginated responses
7. **GraphQL Support**: Add GraphQL client alongside REST
8. **Dedicated Transformers Directory**: Move complex transformations to a dedicated directory
9. **Token Expiration Prediction**: Proactively refresh tokens before they expire
10. **Session Timeout UI**: Add user interface for session timeout warnings
11. **Multi-Tab Synchronization**: Synchronize authentication state across browser tabs 