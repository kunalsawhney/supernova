'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  BookOpen,
  Calendar,
  Clock,
  ChevronRight,
  Filter,
  GraduationCap,
  Loader2,
  Search,
  Tag,
  User,
} from 'lucide-react';

import Breadcrumbs from '@/components/Breadcrumbs';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { toast } from '@/hooks/use-toast';
import { enrollmentService } from '@/services/enrollmentService';
import { courseService } from '@/services/courseService';
import { EnrollmentViewModel } from '@/types/enrollment';
import { CourseViewModel } from '@/types/course';

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

export default function StudentCoursesPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [enrollments, setEnrollments] = useState<EnrollmentViewModel[]>([]);
  const [courses, setCourses] = useState<Record<string, CourseViewModel>>({});
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        // Get all enrollments for the current user
        const enrollmentsData = await enrollmentService.getEnrollments();
        setEnrollments(enrollmentsData);

        // Get course details for each enrollment
        const courseData: Record<string, CourseViewModel> = {};
        for (const enrollment of enrollmentsData) {
          try {
            const course = await courseService.getCourse(enrollment.courseId);
            courseData[enrollment.courseId] = course;
          } catch (error) {
            toast({
              title: 'Error fetching course',
              description: 'Please try again later',
              variant: 'destructive',
            });
            console.error(`Error fetching course ${enrollment.courseId}:`, error);
          }
        }
        setCourses(courseData);
      } catch (error) {
        console.error('Error fetching enrollments:', error);
        toast({
          title: 'Error fetching enrollments',
          description: 'Please try again later',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filter enrollments by search query and status
  const filteredEnrollments = enrollments.filter((enrollment) => {
    const course = courses[enrollment.courseId];
    const matchesSearch = !searchQuery || 
      (course && course.title.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesStatus = statusFilter === 'all' || enrollment.status === statusFilter;
    const matchesTab = activeTab === 'all' || 
      (activeTab === 'in_progress' && enrollment.progress && enrollment.progress > 0 && enrollment.progress < 100) ||
      (activeTab === 'completed' && enrollment.status === 'completed') ||
      (activeTab === 'not_started' && (!enrollment.progress || enrollment.progress === 0));
      
    return matchesSearch && matchesStatus && matchesTab;
  });

  const handleCourseSelect = (enrollmentId: string) => {
    router.push(`/dashboard/student/course-player/${enrollmentId}`);
  };

  const getDifficultyBadge = (level?: string) => {
    if (!level) return null;
    
    const colors: Record<string, string> = {
      beginner: 'bg-green-100 text-green-800 border-green-200',
      intermediate: 'bg-amber-100 text-amber-800 border-amber-200',
      advanced: 'bg-red-100 text-red-800 border-red-200',
    };
    
    return (
      <Badge variant="outline" className={colors[level] || ''}>
        {level.charAt(0).toUpperCase() + level.slice(1)}
      </Badge>
    );
  };

  return (
    <div className="space-y-6 pb-8 container mx-auto px-4 max-w-7xl">
      <Breadcrumbs />

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Courses</h1>
          <p className="text-muted-foreground mt-1">Manage and track your enrolled courses</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button variant="outline" className="gap-2">
            <Search className="h-4 w-4" />
            Browse More Courses
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search courses..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex gap-3">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px] gap-2">
              <Filter className="h-4 w-4" />
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="enrolled">Enrolled</SelectItem>
              <SelectItem value="in_progress">In Progress</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="expired">Expired</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-3 text-lg">Loading your courses...</span>
        </div>
      ) : filteredEnrollments.length === 0 ? (
        <Card>
          <CardContent className="py-12 flex flex-col items-center justify-center text-center">
            <BookOpen className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold mb-2">No courses found</h3>
            <p className="text-muted-foreground max-w-md mb-6">
              {searchQuery || statusFilter !== 'all'
                ? "No courses match your current filters. Try adjusting your search or filters."
                : "You haven't enrolled in any courses yet. Browse our catalog to find courses that interest you."}
            </p>
            <Button onClick={() => router.push('/dashboard')}>
              Browse Courses
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEnrollments.map((enrollment) => {
            const course = courses[enrollment.courseId];
            if (!course) return null;

            return (
              <Card 
                key={enrollment.id} 
                className="overflow-hidden transition-all duration-200 hover:shadow-md cursor-pointer"
                onClick={() => handleCourseSelect(enrollment.id)}
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
                  <div className="flex gap-2 flex-wrap">
                    {getDifficultyBadge(course.difficultyLevel)}
                    {course.tags && course.tags.length > 0 && (
                      <Badge variant="outline" className="bg-primary/5 border-primary/20">
                        <Tag className="h-3 w-3 mr-1" />
                        {course.tags[0]}
                      </Badge>
                    )}
                  </div>
                  <CardTitle className="mt-2 line-clamp-2">{course.title}</CardTitle>
                  <div className="flex items-center gap-2 mt-1">
                    <Avatar className="h-5 w-5 bg-primary/10">
                      <AvatarFallback className="text-[10px]">IN</AvatarFallback>
                    </Avatar>
                    <CardDescription className="truncate">
                      <span className="text-xs">Instructor</span>
                    </CardDescription>
                  </div>
                </CardHeader>
                
                <CardContent className="pb-3 space-y-3">
                  {/* Progress Bar */}
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="font-medium">Progress</span>
                      <span>{enrollment.progress ? `${Math.round(enrollment.progress)}%` : '0%'}</span>
                    </div>
                    <Progress value={enrollment.progress || 0} />
                  </div>
                  
                  {/* Course Meta */}
                  <div className="grid grid-cols-2 gap-3 mt-4">
                    <div className="flex items-center gap-2">
                      <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                        <Clock className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Duration</p>
                        <p className="text-sm font-medium">{course.estimatedDuration || '--'} hrs</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                        <GraduationCap className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Enrolled</p>
                        <p className="text-sm font-medium">
                          {new Date(enrollment.enrollmentDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
                
                <CardFooter className="pt-0">
                  <div className="flex w-full gap-2">
                    <Button variant="outline" size="sm" className="flex-1" onClick={(e) => {
                      e.stopPropagation();
                      router.push(`/dashboard/student/courses/${enrollment.courseId}/details`);
                    }}>
                      Course Details
                    </Button>
                    <Button variant="default" size="sm" className="flex-1 justify-between" onClick={(e) => {
                      e.stopPropagation();
                      router.push(`/dashboard/student/course-player/${enrollment.courseId}`);
                    }}>
                      Continue Learning
                      <ChevronRight className="h-4 w-4 opacity-70" />
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
} 