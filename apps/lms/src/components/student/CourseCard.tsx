import Link from 'next/link';
import Image from 'next/image';
import { BookOpen, Clock, Play } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useState, useEffect } from 'react';

interface ContinuationPoint {
  lessonId: string;
  lessonTitle: string;
  moduleTitle: string;
  lastPosition?: number;
}

interface CourseCardProps {
  course: {
    id: string;
    title: string;
    instructor: string;
    thumbnail?: string;
    progress: number;
    lastAccessed?: string;
    status: 'not_started' | 'in_progress' | 'completed';
    estimatedTime?: string;
  };
  continuationPoint?: ContinuationPoint;
  className?: string;
}

export function CourseCard({ course, continuationPoint, className }: CourseCardProps) {
  // Client-side state for formatted time
  const [formattedTime, setFormattedTime] = useState<string>('');
  
  // Helper to get status display and color
  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'not_started':
        return { label: 'Not Started', color: 'border-amber-200 text-amber-800 bg-amber-50' };
      case 'in_progress':
        return { label: 'In Progress', color: 'border-blue-200 text-blue-800 bg-blue-50' };
      case 'completed':
        return { label: 'Completed', color: 'border-green-200 text-green-800 bg-green-50' };
      default:
        return { label: status, color: 'border-gray-200 text-gray-800 bg-gray-50' };
    }
  };

  const statusInfo = getStatusInfo(course.status);
  
  // Format the last accessed time client-side only
  useEffect(() => {
    // Only run on client
    if (typeof window !== 'undefined' && course.lastAccessed) {
      const timeString = course.lastAccessed;
      
      if (timeString.includes('ago')) {
        setFormattedTime(timeString);
      } else {
        try {
          const date = new Date(timeString);
          const now = new Date();
          const diffTime = Math.abs(now.getTime() - date.getTime());
          const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
          
          if (diffDays === 0) {
            setFormattedTime('Today');
          } else if (diffDays === 1) {
            setFormattedTime('Yesterday');
          } else if (diffDays < 7) {
            setFormattedTime(`${diffDays} days ago`);
          } else {
            setFormattedTime(date.toLocaleDateString());
          }
        } catch (e) {
          setFormattedTime(timeString);
        }
      }
    }
  }, [course.lastAccessed]);

  return (
    <div className={cn(
      "min-w-[300px] w-[300px] rounded-lg border bg-card overflow-hidden flex flex-col transition-all hover:shadow-md",
      className
    )}>
      {/* Course Thumbnail */}
      <div className="relative h-36 bg-muted">
        {course.thumbnail ? (
          <Image 
            src={course.thumbnail} 
            alt={course.title}
            fill
            className="object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <BookOpen className="h-12 w-12 text-muted-foreground/40" />
          </div>
        )}
      </div>
      
      {/* Course Content */}
      <div className="flex-1 p-4 flex flex-col">
        <div className="flex justify-between items-start">
          <h3 className="font-medium line-clamp-2">{course.title}</h3>
          <Badge 
            variant="outline"
            className={cn(
              "ml-2 whitespace-nowrap",
              statusInfo.color
            )}
          >
            {statusInfo.label}
          </Badge>
        </div>
        
        <div className="flex items-center gap-1 mt-2">
          <Avatar className="h-5 w-5">
            <AvatarFallback className="text-[10px]">
              {course.instructor.split(' ').map(n => n[0]).join('')}
            </AvatarFallback>
          </Avatar>
          <p className="text-xs text-muted-foreground">{course.instructor}</p>
        </div>
        
        {/* Course Progress */}
        <div className="mt-3">
          <div className="flex justify-between items-center text-xs mb-1">
            <span className="text-muted-foreground">Progress</span>
            <span className="font-medium">{course.progress}%</span>
          </div>
          <Progress value={course.progress} className="h-1.5" />
        </div>
        
        {/* Continuation Point */}
        {continuationPoint && (
          <div className="mt-3 text-xs">
            <p className="text-muted-foreground">Continue from:</p>
            <p className="font-medium truncate mt-0.5">{continuationPoint.lessonTitle}</p>
          </div>
        )}
        
        {/* Last Accessed - Client side rendered */}
        {formattedTime && (
          <div className="mt-2 flex items-center gap-1 text-xs text-muted-foreground">
            <Clock className="h-3 w-3" />
            <span>{formattedTime}</span>
          </div>
        )}
        
        {/* Continue Button */}
        <div className="mt-auto pt-3">
          <Link 
            href={continuationPoint 
              ? `/dashboard/student/courses/${course.id}/lesson/${continuationPoint.lessonId}`
              : `/dashboard/student/courses/${course.id}`
            }
          >
            <Button className="w-full flex items-center gap-2" size="sm">
              <Play className="h-4 w-4" />
              {course.status === 'not_started' ? 'Start Learning' : 'Continue Learning'}
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
} 