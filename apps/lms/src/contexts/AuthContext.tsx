'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { authService } from '@/services';
import { userService } from '@/services';
import { UserViewModel } from '@/types';

type AuthContextType = {
  user: UserViewModel | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  refreshSession: () => Promise<boolean>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserViewModel | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Function to refresh the user session
  const refreshSession = async (): Promise<boolean> => {
    try {
      const refreshToken = localStorage.getItem('refresh_token');
      if (!refreshToken) {
        return false;
      }

      const { access_token, refresh_token } = await authService.refreshToken(refreshToken);
      
      // Store in localStorage for API requests
      localStorage.setItem('token', access_token);
      localStorage.setItem('refresh_token', refresh_token);
      
      // Store in cookies for middleware
      document.cookie = `token=${access_token}; path=/`;
      document.cookie = `refresh_token=${refresh_token}; path=/`;
      
      // Get user profile with new token
      const userData = await userService.getProfile();
      setUser(userData);
      
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
        if (!token) {
          setIsLoading(false);
          return;
        }

        try {
          // Try to get user profile with existing token
          const userData = await userService.getProfile();
          setUser(userData);
        } catch (error) {
          // If profile fetch fails, try to refresh the token
          const refreshSuccess = await refreshSession();
          if (!refreshSuccess) {
            // If refresh fails, clear tokens
            authService.clearTokens();
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

  const signIn = async (email: string, password: string) => {
    try {
      const { access_token, refresh_token } = await authService.login(email, password);
      
      // Store in localStorage for API requests
      localStorage.setItem('token', access_token);
      localStorage.setItem('refresh_token', refresh_token);
      
      // Store in cookies for middleware
      document.cookie = `token=${access_token}; path=/`;
      document.cookie = `refresh_token=${refresh_token}; path=/`;
      
      const userData = await userService.getProfile();
      setUser(userData);
      router.push('/dashboard');
    } catch (error) {
      console.error('Sign in failed:', error);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      authService.clearTokens();
      setUser(null);
      router.push('/');
    } catch (error) {
      console.error('Sign out failed:', error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, signIn, signOut, refreshSession }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 