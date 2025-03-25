import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { toast } from '@/hooks/use-toast';
import { BookOpen, CheckSquare, Clock, Calendar, AlertCircle, Target } from 'lucide-react';
import { LucideIcon } from 'lucide-react';

export interface Recommendation {
  id: string;
  title: string;
  description: string;
  href: string;
  iconType: LucideIcon;
  iconColor: string;
  priority: 'high' | 'medium' | 'low';
  type: 'continue' | 'assignment' | 'deadline' | 'review' | 'new';
  courseId?: string;
  lessonId?: string;
}

// Define the mock data outside of the component for SSR consistency
const mockRecommendations: Recommendation[] = [
  {
    id: '1',
    title: 'Continue Web Development',
    description: 'Resume from CSS Layouts module',
    href: '/dashboard/student/courses/1/lesson/5',
    iconType: BookOpen,
    iconColor: 'text-blue-500',
    priority: 'high',
    type: 'continue',
    courseId: '1',
    lessonId: '5'
  },
  {
    id: '2',
    title: 'JavaScript Assignment Due',
    description: 'Complete within 2 days',
    href: '/dashboard/student/assignments/3',
    iconType: AlertCircle,
    iconColor: 'text-red-500',
    priority: 'high',
    type: 'deadline'
  },
  {
    id: '3',
    title: 'Review React Fundamentals',
    description: 'You have a quiz scheduled tomorrow',
    href: '/dashboard/student/courses/3/review',
    iconType: CheckSquare,
    iconColor: 'text-purple-500',
    priority: 'medium',
    type: 'review',
    courseId: '3'
  },
  {
    id: '4',
    title: 'New Course Available',
    description: 'Check out Node.js Backend Development',
    href: '/dashboard/student/explore/courses/10',
    iconType: Target,
    iconColor: 'text-green-500',
    priority: 'low',
    type: 'new'
  },
  {
    id: '5',
    title: 'Live Class: Advanced CSS',
    description: 'Today at 3:00 PM',
    href: '/dashboard/student/calendar',
    iconType: Calendar,
    iconColor: 'text-indigo-500',
    priority: 'medium',
    type: 'assignment'
  }
];

// Sort by priority (do this outside component for SSR consistency)
const priorityValue = { high: 0, medium: 1, low: 2 };
const sortedRecommendations = [...mockRecommendations].sort((a, b) => 
  priorityValue[a.priority] - priorityValue[b.priority]
);

/**
 * Hook for fetching personalized study recommendations
 */
export function useStudyRecommendations() {
  const [recommendations, setRecommendations] = useState<Recommendation[]>(sortedRecommendations);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // TODO: Replace with actual API call when backend is ready
        // const response = await api.get('/user/recommendations');
        
        // Simulate loading with a timeout, but use the same data
        setTimeout(() => {
          setRecommendations(sortedRecommendations);
          setIsLoading(false);
        }, 800);
      } catch (err) {
        console.error('Error fetching recommendations:', err);
        setError('Failed to load your study recommendations');
        toast({
          title: 'Error loading recommendations',
          description: 'We couldn\'t load personalized recommendations. Please try again later.',
          variant: 'destructive'
        });
        setIsLoading(false);
      }
    };

    // Only run on client side to avoid hydration mismatch
    if (typeof window !== 'undefined') {
      fetchRecommendations();
    } else {
      // For server-side rendering, just set loading to false
      setIsLoading(false);
    }
  }, []);

  return {
    recommendations,
    isLoading,
    error
  };
} 