'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  ArrowLeft,
  BookOpen,
  Clock,
  Calendar,
  Tag,
  Users,
  BarChart,
  Award,
  CheckCircle,
  Target,
  Lightbulb,
  User,
  List,
  Loader2,
  DollarSign,
} from 'lucide-react';

import Breadcrumbs from '@/components/Breadcrumbs';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';

import { enrollmentService } from '@/services/enrollmentService';
import { courseService } from '@/services/courseService';
import { CourseViewModel } from '@/types/course';
import { EnrollmentViewModel, EnrollmentProgressViewModel } from '@/types/enrollment';

export default function CourseDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const courseId = params.courseId as string;

  const [isLoading, setIsLoading] = useState(true);
  const [course, setCourse] = useState<CourseViewModel | null>(null);
  const [enrollment, setEnrollment] = useState<EnrollmentViewModel | null>(null);
  const [progress, setProgress] = useState<EnrollmentProgressViewModel | null>(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Fetch course details
        const courseData = await courseService.getCourse(courseId);
        setCourse(courseData);

        // Fetch enrollment details
        const enrollmentsData = await enrollmentService.getEnrollments({ course_id: courseId });

        if (enrollmentsData.length > 0) {
          const userEnrollment = enrollmentsData[0]; // Assuming one enrollment per user per course
          setEnrollment(userEnrollment);

          // Fetch progress for this enrollment
          try {
            const progressData = await enrollmentService.getOverallProgress(userEnrollment.id);
            setProgress(progressData);
            console.log('Progress data:', progressData);
          } catch (progressError) {
            console.error('Error fetching progress:', progressError);
          }
        }
      } catch (error) {
        console.error('Error fetching course details:', error);
        setError('Failed to load course details. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    if (courseId) {
      fetchData();
    }
  }, [courseId]);

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
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

  if (isLoading) {
    return (
      <div className="space-y-6 pb-8 container mx-auto px-4 max-w-7xl">
        <Breadcrumbs />
        <div className="flex justify-center items-center min-h-[50vh]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-3 text-lg">Loading course details...</span>
        </div>
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="space-y-6 pb-8 container mx-auto px-4 max-w-7xl">
        <Breadcrumbs />
        <Card>
          <CardContent className="py-12 flex flex-col items-center justify-center text-center">
            <h3 className="text-xl font-semibold mb-2">Error</h3>
            <p className="text-muted-foreground max-w-md mb-6">
              {error || 'Course not found'}
            </p>
            <Button onClick={() => router.push('/dashboard/student/courses')}>
              Back to Courses
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-8 container mx-auto px-4 max-w-7xl">
      <Breadcrumbs />

      {/* Back button & header */}
      <div className="space-y-4">
        <Button
          variant="ghost"
          size="sm"
          className="gap-2"
          onClick={() => router.push('/dashboard/student/courses')}
        >
          <ArrowLeft className="h-4 w-4" /> Back to Courses
        </Button>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-3xl font-bold tracking-tight">{course.title}</h1>
              {course.status === 'published' && (
                <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">
                  Published
                </Badge>
              )}
            </div>
            <p className="text-muted-foreground mt-1">Course Code: {course.code}</p>
          </div>
          {enrollment && (
            <Button
              onClick={() => router.push(`/dashboard/student/course-player/${enrollment.id}`)}
              className="gap-2"
            >
              <BookOpen className="h-4 w-4" />
              Continue Learning
            </Button>
          )}
        </div>
      </div>

      {/* Course Image Banner */}
      <div className="w-full h-48 md:h-64 bg-muted rounded-xl overflow-hidden relative">
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
      </div>

      {/* Course metadata cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {enrollment && (
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <BarChart className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Progress</p>
                  <h3 className="text-2xl font-bold mt-1">
                    {progress?.overallProgress ? `${Math.round(progress.overallProgress)}%` : '0%'}
                  </h3>
                  <Progress value={progress?.overallProgress || 0} className="mt-2 h-2" />
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-full bg-secondary/10 flex items-center justify-center">
                <Clock className="h-6 w-6 text-secondary" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Duration</p>
                <h3 className="text-2xl font-bold mt-1">{course.estimatedDuration || '--'}</h3>
                <p className="text-sm text-secondary">hours</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-full bg-success/10 flex items-center justify-center">
                <Award className="h-6 w-6 text-success" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Difficulty</p>
                <h3 className="text-2xl font-bold mt-1">
                  {course.difficultyLevel ? course.difficultyLevel.charAt(0).toUpperCase() + course.difficultyLevel.slice(1) : 'N/A'}
                </h3>
                <p className="text-sm text-success">level</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {enrollment && (
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-accent/10 flex items-center justify-center">
                  <Calendar className="h-6 w-6 text-accent" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Enrolled</p>
                  <h3 className="text-2xl font-bold mt-1">{formatDate(enrollment.enrollmentDate).split(' ')[0]}</h3>
                  <p className="text-sm text-accent">{formatDate(enrollment.enrollmentDate).split(' ').slice(1).join(' ')}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Tabs for additional information */}
      <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-4 w-full sm:w-auto">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="content">Content</TabsTrigger>
          <TabsTrigger value="progress" disabled={!enrollment}>Progress</TabsTrigger>
          <TabsTrigger value="info">Additional Info</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-6 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Course Description</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="whitespace-pre-line">{course.description}</p>
            </CardContent>
          </Card>

          {course.learningObjectives && course.learningObjectives.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Learning Objectives</CardTitle>
                <CardDescription>What you'll learn in this course</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {course.learningObjectives.map((objective, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-success flex-shrink-0 mt-0.5" />
                      <span>{objective}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          {course.prerequisites && course.prerequisites.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Prerequisites</CardTitle>
                <CardDescription>What you should know before starting</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {course.prerequisites.map((prerequisite, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <Lightbulb className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
                      <span>{prerequisite}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          {course.targetAudience && course.targetAudience.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Target Audience</CardTitle>
                <CardDescription>Who this course is for</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {course.targetAudience.map((audience, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <Target className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                      <span>{audience}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="content" className="mt-6 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Course Structure</CardTitle>
              <CardDescription>Modules and lessons in this course</CardDescription>
            </CardHeader>
            <CardContent>
              {course.contentVersions && course.contentVersions.length > 0 ? (
                <div className="space-y-6">
                  <p className="text-sm text-muted-foreground">
                    Current Version: {course.contentVersions[0].version}
                  </p>
                  <div className="space-y-4">
                    {Array.from({ length: 3 }).map((_, moduleIndex) => (
                      <div key={moduleIndex} className="border rounded-lg p-4">
                        <div className="flex justify-between items-center mb-2">
                          <h3 className="font-medium">Module {moduleIndex + 1}: Example Module</h3>
                          <Badge variant="outline" className="bg-primary/5 border-primary/20">
                            {Math.floor(Math.random() * 5) + 1} Lessons
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-4">
                          This is a placeholder for module content description.
                        </p>
                        <div className="space-y-2">
                          {Array.from({ length: Math.floor(Math.random() * 3) + 2 }).map((_, lessonIndex) => (
                            <div key={lessonIndex} className="flex items-center gap-2 text-sm">
                              <div className="h-6 w-6 rounded-full bg-muted flex items-center justify-center text-xs">
                                {lessonIndex + 1}
                              </div>
                              <span>Example Lesson {lessonIndex + 1}</span>
                              {enrollment && (
                                <Badge variant="outline" className="ml-auto bg-green-100 text-green-800 border-green-200">
                                  {Math.random() > 0.5 ? 'Completed' : 'Not Started'}
                                </Badge>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <p className="text-muted-foreground">No content structure available for this course.</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="progress" className="mt-6 space-y-6">
          {enrollment && progress ? (
            <>
              <Card>
                <CardHeader>
                  <CardTitle>Your Progress</CardTitle>
                  <CardDescription>Track your course completion</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm font-medium">Overall Progress</span>
                        <span className="text-sm">{Math.round(progress.overallProgress || 0)}%</span>
                      </div>
                      <Progress value={progress.overallProgress || 0} className="h-3" />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
                      <Card>
                        <CardContent className="p-4">
                          <div className="text-center">
                            <h4 className="text-sm font-medium text-muted-foreground">Modules</h4>
                            <div className="flex items-center justify-center gap-1 mt-2">
                              <span className="text-2xl font-bold">{progress.completedModules}</span>
                              <span className="text-muted-foreground">/ {progress.totalModules}</span>
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">completed</p>
                          </div>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardContent className="p-4">
                          <div className="text-center">
                            <h4 className="text-sm font-medium text-muted-foreground">Lessons</h4>
                            <div className="flex items-center justify-center gap-1 mt-2">
                              <span className="text-2xl font-bold">{progress.completedLessons}</span>
                              <span className="text-muted-foreground">/ {progress.totalLessons}</span>
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">completed</p>
                          </div>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardContent className="p-4">
                          <div className="text-center">
                            <h4 className="text-sm font-medium text-muted-foreground">Average Score</h4>
                            <div className="mt-2">
                              <span className="text-2xl font-bold">
                                {progress.averageScore ? `${Math.round(progress.averageScore)}%` : 'N/A'}
                              </span>
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">on quizzes & assignments</p>
                          </div>
                        </CardContent>
                      </Card>
                    </div>

                    <div className="mt-6">
                      <h4 className="text-sm font-medium mb-3">Recent Activity</h4>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center p-3 border rounded-lg">
                          <div className="flex items-center gap-3">
                            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                              <CheckCircle className="h-4 w-4 text-primary" />
                            </div>
                            <div>
                              <p className="text-sm font-medium">Completed Lesson</p>
                              <p className="text-xs text-muted-foreground">Example Lesson</p>
                            </div>
                          </div>
                          <p className="text-xs text-muted-foreground">Today</p>
                        </div>
                        <div className="flex justify-between items-center p-3 border rounded-lg">
                          <div className="flex items-center gap-3">
                            <div className="h-8 w-8 rounded-full bg-amber-100 flex items-center justify-center">
                              <Award className="h-4 w-4 text-amber-600" />
                            </div>
                            <div>
                              <p className="text-sm font-medium">Quiz Score</p>
                              <p className="text-xs text-muted-foreground">Module Quiz: 85%</p>
                            </div>
                          </div>
                          <p className="text-xs text-muted-foreground">Yesterday</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </>
          ) : (
            <Card>
              <CardContent className="py-12 flex flex-col items-center justify-center text-center">
                <BarChart className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-xl font-semibold mb-2">No progress data available</h3>
                <p className="text-muted-foreground max-w-md mb-6">
                  Start the course to track your progress
                </p>
                <Button
                  onClick={() => enrollment && router.push(`/dashboard/student/course-player/${enrollment.id}`)}
                >
                  Start Learning
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="info" className="mt-6 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Course Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Grade Level</p>
                    <p>{course.gradeLevel || 'Not specified'}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Academic Year</p>
                    <p>{course.academicYear || 'Not specified'}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Sequence Number</p>
                    <p>{course.sequenceNumber || 'Not specified'}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Created At</p>
                    <p>{formatDate(course.createdAt)}</p>
                  </div>
                </div>

                <Separator />

                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-2">Tags</p>
                  <div className="flex flex-wrap gap-2">
                    {course.tags && course.tags.length > 0 ? (
                      course.tags.map((tag, index) => (
                        <Badge key={index} variant="outline" className="bg-secondary/10">
                          {tag}
                        </Badge>
                      ))
                    ) : (
                      <p className="text-sm text-muted-foreground">No tags specified</p>
                    )}
                  </div>
                </div>

                {course.basePrice && (
                  <>
                    <Separator />
                    <div>
                      <p className="text-sm font-medium text-muted-foreground mb-2">Pricing Information</p>
                      <div className="flex items-center gap-2">
                        <DollarSign className="h-5 w-5 text-green-600" />
                        <span className="font-semibold">
                          {course.basePrice} {course.currency || 'USD'}
                        </span>
                        {course.pricingType && (
                          <Badge variant="outline" className="bg-green-50 border-green-200 text-green-700">
                            {course.pricingType === 'one-time' ? 'One-time payment' : 'Subscription'}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Enrollment Information</CardTitle>
            </CardHeader>
            <CardContent>
              {enrollment ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Enrollment ID</p>
                      <p className="font-mono text-sm">{enrollment.id}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Status</p>
                      <Badge variant="outline" className={`
                        ${enrollment.status === 'enrolled' ? 'bg-blue-100 text-blue-800 border-blue-200' : ''}
                        ${enrollment.status === 'completed' ? 'bg-green-100 text-green-800 border-green-200' : ''}
                        ${enrollment.status === 'expired' ? 'bg-red-100 text-red-800 border-red-200' : ''}
                      `}>
                        {enrollment.status.charAt(0).toUpperCase() + enrollment.status.slice(1)}
                      </Badge>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Enrollment Date</p>
                      <p>{formatDate(enrollment.enrollmentDate)}</p>
                    </div>
                    {enrollment.completionDate && (
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Completion Date</p>
                        <p>{formatDate(enrollment.completionDate)}</p>
                      </div>
                    )}
                    {enrollment.expiryDate && (
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Expiry Date</p>
                        <p>{formatDate(enrollment.expiryDate)}</p>
                      </div>
                    )}
                    {enrollment.certificateId && (
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Certificate ID</p>
                        <p className="font-mono text-sm">{enrollment.certificateId}</p>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="py-6 flex flex-col items-center justify-center text-center">
                  <Users className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Not Currently Enrolled</h3>
                  <p className="text-muted-foreground max-w-md mb-6">
                    You are viewing this course's details but are not currently enrolled.
                  </p>
                  <Button onClick={() => courseService.enrollInCourse(courseId)}>
                    Enroll in this Course
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
} 