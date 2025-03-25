import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { toast } from '@/hooks/use-toast';

export interface StreakData {
  current: number;
  longest: number;
  message: string;
}

export interface ActivityData {
  date: string;
  minutes: number;
  status: 'active' | 'inactive';
}

export interface LearningActivities {
  streak: StreakData;
  activities: {
    lastWeek: ActivityData[];
    lastMonth: ActivityData[];
    today: {
      minutes: number;
      completed: number;
    };
  };
}

// Generate deterministic activity data for SSR/client consistency
const generateMockActivityData = () => {
  const mockStreak = {
    current: 5,
    longest: 12,
    message: 'You\'re on a 5-day streak! Keep learning daily to maintain it.'
  };
  
  // Use a fixed date reference for server/client consistency
  const fixedToday = new Date('2024-03-25T12:00:00Z');
  const lastMonthActivities: ActivityData[] = [];
  
  // Create deterministic activity pattern (no random values)
  for (let i = 29; i >= 0; i--) {
    const date = new Date(fixedToday);
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];
    
    // Use deterministic pattern instead of Math.random
    // Active on: weekdays, every third weekend day, and last 5 days
    const dayOfWeek = date.getDay(); // 0 = Sunday, 6 = Saturday
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
    const dayOfMonth = date.getDate();
    const isActive = i < 5 || (!isWeekend) || (dayOfMonth % 3 === 0);
    
    // Use deterministic minutes based on day of week
    const minutes = isActive ? 15 + (dayOfWeek * 10) : 0;
    
    lastMonthActivities.push({
      date: dateStr,
      minutes: minutes,
      status: isActive ? 'active' : 'inactive'
    });
  }
  
  // Last week is just the last 7 days of the month data
  const lastWeekActivities = lastMonthActivities.slice(-7);
  
  // Today's activity - use fixed values
  const todayActivity = {
    minutes: 45,
    completed: 2
  };
  
  return {
    streak: mockStreak,
    activities: {
      lastWeek: lastWeekActivities,
      lastMonth: lastMonthActivities,
      today: todayActivity
    }
  };
};

// Pre-compute the mock data outside the component for SSR consistency
const mockLearningActivities = generateMockActivityData();

/**
 * Hook for fetching and tracking user learning activities and streaks
 */
export function useLearningActivities() {
  const [data, setData] = useState<LearningActivities>(mockLearningActivities);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Simulate API call with consistent data (no randomness)
    const fetchActivities = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // TODO: Replace with actual API call when backend is ready
        // const response = await api.get('/user/learning-activities');
        
        // Use a delay to simulate loading, but with the same data
        setTimeout(() => {
          setData(mockLearningActivities);
          setIsLoading(false);
        }, 800);
      } catch (err) {
        console.error('Error fetching learning activities:', err);
        setError('Failed to load your learning activities. Please try again.');
        toast({
          title: 'Error loading activities',
          description: 'We couldn\'t load your learning data. Please refresh or try again later.',
          variant: 'destructive'
        });
        setIsLoading(false);
      }
    };

    // Only run on client side to avoid hydration mismatch
    if (typeof window !== 'undefined') {
      fetchActivities();
    } else {
      // On server, just use the pre-computed data with no loading state
      setIsLoading(false);
    }
  }, []);

  return {
    ...data,
    isLoading,
    error
  };
} 