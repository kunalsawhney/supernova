import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { Flame, Target, Book, ChevronRight, ChevronLeft } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { StreakCalendar } from './StreakCalendar';
import { ActionCard } from '@/components/student/ActionCard';
import { CourseCard } from '@/components/student/CourseCard';
import { useLearningActivities } from '@/hooks/useLearningActivities';
import { useStudyRecommendations } from '@/hooks/useStudyRecommendations';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import '@/components/student/student.css';

// Mock data for now until we have real API endpoints - defined outside component for SSR consistency
const mockCourses = [
  {
    id: '1',
    title: 'Web Development Fundamentals',
    instructor: 'John Smith',
    progress: 65,
    lastAccessed: '2 hours ago',
    status: 'in_progress' as const,
    thumbnail: '/course-thumbnails/web-dev.jpg',
    continuationPoint: {
      lessonId: '5',
      lessonTitle: 'CSS Layouts',
      moduleTitle: 'CSS Fundamentals'
    }
  },
  {
    id: '2',
    title: 'Advanced JavaScript',
    instructor: 'Sarah Johnson',
    progress: 45,
    lastAccessed: '1 day ago',
    status: 'in_progress' as const,
    thumbnail: '/course-thumbnails/js.jpg',
    continuationPoint: {
      lessonId: '8',
      lessonTitle: 'Async Programming',
      moduleTitle: 'Modern JavaScript'
    }
  },
  {
    id: '3',
    title: 'React & Next.js',
    instructor: 'Mike Chen',
    progress: 15,
    lastAccessed: '3 days ago',
    status: 'in_progress' as const,
    thumbnail: '/course-thumbnails/react.jpg',
    continuationPoint: {
      lessonId: '2',
      lessonTitle: 'Component Basics',
      moduleTitle: 'React Fundamentals'
    }
  },
  {
    id: '4',
    title: 'UI/UX Design Principles',
    instructor: 'Jessica Lee',
    progress: 0,
    status: 'not_started' as const,
    thumbnail: '/course-thumbnails/ui-ux.jpg'
  },
  {
    id: '5',
    title: 'Responsive Design Mastery',
    instructor: 'Alex Rodriguez',
    progress: 100,
    lastAccessed: '1 week ago',
    status: 'completed' as const,
    thumbnail: '/course-thumbnails/responsive.jpg'
  }
];

export function LearningMomentumHub() {
  const { streak, activities, isLoading: activitiesLoading } = useLearningActivities();
  const { recommendations, isLoading: recommendationsLoading } = useStudyRecommendations();
  const [courses, setCourses] = useState(mockCourses);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  
  // Reference for course carousel scrolling
  const carouselRef = useRef<HTMLDivElement>(null);
  
  // Simulate loading of courses data - only on client side
  useEffect(() => {
    // Only run this effect on the client side
    if (typeof window !== 'undefined') {
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 1000);
      
      return () => clearTimeout(timer);
    } else {
      // For server-side rendering, don't show loading state
      setIsLoading(false);
    }
  }, []);
  
  // Prevent mousewheel from scrolling horizontally in the carousel
  useEffect(() => {
    const carousel = carouselRef.current;
    if (!carousel) return;
    
    const preventWheelScroll = (e: WheelEvent) => {
      // Don't intercept the event at all for vertical scrolling
      // This allows normal page scrolling to work
      if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
        return;
      }
      
      // Only for horizontal mousewheel movements, we control the scrolling
      if (Math.abs(e.deltaX) > 0) {
        // Don't call preventDefault here, as that would stop page scrolling too
        // Instead, manually control the horizontal scroll
        carousel.scrollLeft += e.deltaX;
      }
    };
    
    // Using 'wheel' event with passive true to ensure page scrolling isn't blocked
    carousel.addEventListener('wheel', preventWheelScroll, { passive: true });
    
    return () => {
      carousel.removeEventListener('wheel', preventWheelScroll);
    };
  }, []);
  
  // Handle carousel scrolling
  const scrollCarousel = (direction: 'left' | 'right') => {
    if (!carouselRef.current) return;
    
    const container = carouselRef.current;
    const cardWidth = 300; // Width of a course card
    const gap = 16; // Gap between cards
    const scrollAmount = direction === 'left' 
      ? -(cardWidth + gap) * 2 // Scroll two cards to the left
      : (cardWidth + gap) * 2; // Scroll two cards to the right
    
    // Use scrollTo instead of scrollBy for more consistent behavior
    const newScrollPosition = container.scrollLeft + scrollAmount;
    
    container.scrollTo({
      left: newScrollPosition,
      behavior: 'smooth'
    });
  };
  
  // Generate loading skeletons
  const renderSkeletons = (count: number, className: string) => {
    return Array(count).fill(0).map((_, i) => (
      <Skeleton key={i} className={className} />
    ));
  };

  return (
    <div className="space-y-6 relative">
      {/* Learning Streak */}
      <Card className="bg-gradient-to-r from-primary/5 to-secondary/5 overflow-visible">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Flame className="h-5 w-5 text-primary" />
            Your Learning Streak
          </CardTitle>
        </CardHeader>
        <CardContent>
          {activitiesLoading ? (
            <div className="flex items-center gap-4">
              <Skeleton className="h-10 w-16" />
              <Skeleton className="h-10 w-full max-w-md" />
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <div className="text-3xl font-bold">{streak.current} days</div>
              <StreakCalendar days={activities.lastMonth} />
            </div>
          )}
          
          <div className="text-sm text-muted-foreground mt-2">
            {activitiesLoading 
              ? <Skeleton className="h-4 w-2/3" /> 
              : streak.message
            }
          </div>
        </CardContent>
      </Card>
      
      {/* Today's Focus */}
      <Card className="overflow-visible">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-primary" />
            Today's Focus
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {recommendationsLoading ? (
              renderSkeletons(3, "h-40 w-full")
            ) : (
              recommendations.slice(0, 3).map(item => {
                const IconComponent = item.iconType;
                return (
                  <ActionCard 
                    key={item.id}
                    title={item.title}
                    description={item.description}
                    icon={<IconComponent className={`h-5 w-5 ${item.iconColor}`} />}
                    action="Start"
                    href={item.href}
                    priority={item.priority}
                  />
                );
              })
            )}
          </div>
        </CardContent>
      </Card>
      
      {/* Continue Learning */}
      <Card className="overflow-visible">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Book className="h-5 w-5 text-primary" />
              Continue Learning
            </CardTitle>
            <div className="flex items-center gap-2">
              <div className="hidden md:flex gap-2">
                <Button 
                  variant="outline" 
                  size="icon" 
                  onClick={() => scrollCarousel('left')}
                  className="h-8 w-8"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button 
                  variant="outline" 
                  size="icon" 
                  onClick={() => scrollCarousel('right')}
                  className="h-8 w-8"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
              <Link href="/dashboard/student/courses">
                <Button variant="ghost" size="sm" className="gap-1">
                  View all
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div 
            className="flex gap-4 overflow-x-auto pb-4 -mx-1 px-1 pt-1 snap-x custom-scrollbar"
            ref={carouselRef}
            style={{ scrollbarWidth: 'thin', WebkitOverflowScrolling: 'touch' }}
          >
            {isLoading ? (
              renderSkeletons(4, "min-w-[300px] h-[400px]")
            ) : (
              courses.map(course => (
                <div key={course.id} className="snap-start flex-shrink-0">
                  <CourseCard 
                    course={course}
                    continuationPoint={course.continuationPoint}
                  />
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 