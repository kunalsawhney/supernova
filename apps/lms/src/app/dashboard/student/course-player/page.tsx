'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  BookOpen,
  ChevronRight,
  Loader2,
  Play,
  ArrowLeft,
} from 'lucide-react';

import Breadcrumbs from '@/components/Breadcrumbs';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

import { enrollmentService } from '@/services/enrollmentService';
import { courseService } from '@/services/courseService';
import { EnrollmentViewModel } from '@/types/enrollment';
import { CourseViewModel } from '@/types/course';

export default function CoursePlayerChooseCourse() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [enrollments, setEnrollments] = useState<EnrollmentViewModel[]>([]);
  const [courses, setCourses] = useState<Record<string, CourseViewModel>>({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        // Get all enrollments for the current user
        // const enrollmentsData = await enrollmentService.getEnrollments();
        const enrollmentsData = [
          {
            id: '1',
            courseId: '56627c53-8133-4d79-a57e-79cf37ae84b7',
            status: 'enrolled',
            userId: '1',
            enrollmentDate: '2021-01-01',
            createdAt: '2021-01-01',
            updatedAt: '2021-01-01',
          },
        ];
        setEnrollments(enrollmentsData);

        // Get course details for each enrollment
        const courseData: Record<string, CourseViewModel> = {};
        for (const enrollment of enrollmentsData) {
          try {
            const course = await courseService.getCourse(enrollment.courseId);
            courseData[enrollment.courseId] = course;
          } catch (error) {
            console.error(`Error fetching course ${enrollment.courseId}:`, error);
          }
        }
        setCourses(courseData);
      } catch (error) {
        console.error('Error fetching enrollments:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleCourseSelect = (enrollmentId: string, courseId: string) => {
    router.push(`/dashboard/student/course-player/${enrollmentId}`);
  };

  // Status badge color mapping
  const statusColorMap: Record<string, string> = {
    enrolled: 'bg-blue-100 text-blue-800 border-blue-200',
    in_progress: 'bg-amber-100 text-amber-800 border-amber-200',
    completed: 'bg-green-100 text-green-800 border-green-200',
    expired: 'bg-red-100 text-red-800 border-red-200',
  };

  // Status display names
  const statusDisplayNames: Record<string, string> = {
    enrolled: 'Enrolled',
    in_progress: 'In Progress',
    completed: 'Completed',
    expired: 'Expired',
  };

  return (
    <div className="space-y-6 pb-8 container mx-auto px-4 max-w-7xl">
      <Breadcrumbs />
      
      {/* Header */}
      <div className="space-y-4">
        <Button
          variant="ghost"
          size="sm"
          className="gap-2"
          onClick={() => router.push('/dashboard/student')}
        >
          <ArrowLeft className="h-4 w-4" /> Back to Dashboard
        </Button>
        
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Course Player</h1>
          <p className="text-muted-foreground mt-1">Select a course to start learning</p>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-3 text-lg">Loading your courses...</span>
        </div>
      ) : enrollments.length === 0 ? (
        <Card>
          <CardContent className="py-12 flex flex-col items-center justify-center text-center">
            <BookOpen className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold mb-2">No courses found</h3>
            <p className="text-muted-foreground max-w-md mb-6">
              You haven't enrolled in any courses yet. Browse our catalog to find courses that interest you.
            </p>
            <Button onClick={() => router.push('/dashboard/student/courses')}>
              Browse Courses
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {enrollments.map((enrollment) => {
            const course = courses[enrollment.courseId];
            if (!course) return null;

            return (
              <Card 
                key={enrollment.id} 
                className="overflow-hidden transition-all duration-200 hover:shadow-md cursor-pointer"
                onClick={() => handleCourseSelect(enrollment.id, enrollment.courseId)}
              >
                {/* Cover Image */}
                <div className="h-48 bg-muted relative overflow-hidden">
                  {course.coverImageUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img 
                      src={course.coverImageUrl} 
                      alt={course.title} 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <BookOpen className="h-16 w-16 text-muted-foreground/60" />
                    </div>
                  )}
                  
                  {/* Status Badge */}
                  <Badge 
                    variant="outline" 
                    className={`absolute top-3 right-3 ${statusColorMap[enrollment.status] || ''}`}
                  >
                    {statusDisplayNames[enrollment.status] || enrollment.status}
                  </Badge>
                </div>
                
                <CardHeader className="pb-2">
                  <CardTitle className="line-clamp-2">{course.title}</CardTitle>
                  <CardDescription className="line-clamp-2">{course.description}</CardDescription>
                </CardHeader>
                
                <CardContent className="pb-2">
                  {/* Progress Bar */}
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="font-medium">Progress</span>
                      <span>{enrollment.progress ? `${Math.round(enrollment.progress)}%` : '0%'}</span>
                    </div>
                    <Progress value={enrollment.progress || 0} />
                  </div>
                </CardContent>
                
                <CardFooter>
                  <Button className="w-full gap-2" onClick={(e) => {
                    e.stopPropagation();
                    router.push(`/dashboard/student/course-player/${enrollment.id}`);
                  }}>
                    <Play className="h-4 w-4" />
                    Start Learning
                    <ChevronRight className="h-4 w-4 ml-auto" />
                  </Button>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      )}
      
      {/* Links to other pages */}
      {!isLoading && enrollments.length > 0 && (
        <div className="mt-8 text-center">
          <p className="text-muted-foreground mb-4">Want to explore more courses?</p>
          <Button variant="outline" onClick={() => router.push('/dashboard/student/courses')}>
            Browse All Courses
          </Button>
        </div>
      )}
    </div>
  );
}