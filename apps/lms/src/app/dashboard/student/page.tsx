'use client';

import { useState } from 'react';
import Breadcrumbs from '@/components/Breadcrumbs';
import {
  BookOpen,
  Clock,
  Calendar,
  Trophy,
  Plus,
  ArrowRight,
  CheckCircle,
  Activity,
  Star,
  User,
  BarChart,
  ChevronRight,
  Search,
  Bookmark,
  GraduationCap
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

// Mock data
const learningStats = {
  coursesEnrolled: 3,
  completedCourses: 1,
  averageScore: '92%',
  totalHours: 45,
};

const myCourses = [
  {
    id: 1,
    name: 'Web Development Fundamentals',
    instructor: 'John Smith',
    progress: 65,
    nextMilestone: 'CSS Layouts',
    lastAccessed: '2 hours ago',
    status: 'in_progress',
    thumbnail: '/course-thumbnails/web-dev.jpg',
  },
  {
    id: 2,
    name: 'Advanced JavaScript',
    instructor: 'Sarah Johnson',
    progress: 45,
    nextMilestone: 'Async Programming',
    lastAccessed: '1 day ago',
    status: 'in_progress',
    thumbnail: '/course-thumbnails/js.jpg',
  },
  {
    id: 3,
    name: 'React & Next.js',
    instructor: 'Mike Chen',
    progress: 15,
    nextMilestone: 'Component Basics',
    lastAccessed: '3 days ago',
    status: 'just_started',
    thumbnail: '/course-thumbnails/react.jpg',
  },
];

const upcomingLiveClasses = [
  {
    id: 1,
    title: 'Building Real-World Projects',
    course: 'Web Development Fundamentals',
    instructor: 'John Smith',
    time: '10:00 AM',
    date: 'Today',
    duration: '1.5 hours',
    type: 'workshop',
  },
  {
    id: 2,
    title: 'JavaScript Interview Prep',
    course: 'Advanced JavaScript',
    instructor: 'Sarah Johnson',
    time: '2:00 PM',
    date: 'Tomorrow',
    duration: '1 hour',
    type: 'qa',
  },
];

const recommendedCourses = [
  {
    id: 1,
    name: 'TypeScript Essentials',
    instructor: 'Alex Brown',
    rating: 4.8,
    students: 1234,
    price: '$49.99',
    thumbnail: '/course-thumbnails/typescript.jpg',
    tags: ['Programming', 'Web Development'],
  },
  {
    id: 2,
    name: 'Node.js Backend Development',
    instructor: 'Emma Wilson',
    rating: 4.9,
    students: 2156,
    price: '$59.99',
    thumbnail: '/course-thumbnails/nodejs.jpg',
    tags: ['Backend', 'JavaScript'],
  },
];

const achievements = [
  { id: 1, name: "First Quiz Ace", description: "Score 100% on your first quiz", icon: <Trophy className="h-6 w-6 text-yellow-500" /> },
  { id: 2, name: "Streak Master", description: "Login for 7 consecutive days", icon: <Activity className="h-6 w-6 text-blue-500" /> },
  { id: 3, name: "Fast Learner", description: "Complete a course section in one day", icon: <GraduationCap className="h-6 w-6 text-emerald-500" /> }
];

export default function StudentDashboard() {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div className="space-y-6 pb-8 container mx-auto px-4 max-w-7xl">
      <Breadcrumbs />
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Learning Dashboard</h1>
          <p className="text-muted-foreground mt-1">Track your progress and continue your learning journey</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button variant="outline" className="gap-2">
            <Search className="h-4 w-4" />
            Browse Courses
          </Button>
          <Button className="gap-2">
            <Calendar className="h-4 w-4" />
            Book Live Class
          </Button>
        </div>
      </div>

      {/* Main Tabs Navigation */}
      <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="w-full justify-start mb-6 bg-transparent p-0 border-b border-border h-auto space-x-8">
          <TabsTrigger 
            value="overview" 
            className="px-1 py-3 rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none"
          >
            Overview
          </TabsTrigger>
          <TabsTrigger 
            value="courses" 
            className="px-1 py-3 rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none"
          >
            My Courses
          </TabsTrigger>
          <TabsTrigger 
            value="live-classes" 
            className="px-1 py-3 rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none"
          >
            Live Classes
          </TabsTrigger>
          <TabsTrigger 
            value="certificates" 
            className="px-1 py-3 rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none"
          >
            Certificates
          </TabsTrigger>
          <TabsTrigger 
            value="wishlist" 
            className="px-1 py-3 rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none"
          >
            Wishlist
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="p-0 border-none">
          {/* Learning Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center">
                    <BookOpen className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Enrolled Courses</p>
                    <h3 className="text-2xl font-bold mt-1">{learningStats.coursesEnrolled}</h3>
                    <p className="text-sm text-blue-600 dark:text-blue-400">Active courses</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-full bg-green-100 dark:bg-green-900/20 flex items-center justify-center">
                    <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Completed</p>
                    <h3 className="text-2xl font-bold mt-1">{learningStats.completedCourses}</h3>
                    <p className="text-sm text-green-600 dark:text-green-400">Finished courses</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-full bg-yellow-100 dark:bg-yellow-900/20 flex items-center justify-center">
                    <BarChart className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Average Score</p>
                    <h3 className="text-2xl font-bold mt-1">{learningStats.averageScore}</h3>
                    <p className="text-sm text-yellow-600 dark:text-yellow-400">Keep it up!</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-full bg-purple-100 dark:bg-purple-900/20 flex items-center justify-center">
                    <Clock className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Learning Hours</p>
                    <h3 className="text-2xl font-bold mt-1">{learningStats.totalHours}h</h3>
                    <p className="text-sm text-purple-600 dark:text-purple-400">Total time spent</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* My Courses */}
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Continue Learning</CardTitle>
                      <CardDescription>Pick up where you left off</CardDescription>
                    </div>
                    <Button variant="ghost" className="gap-1 text-sm">
                      View all courses
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {myCourses.map((course) => (
                    <Card key={course.id} className="overflow-hidden">
                      <div className="p-4">
                        <div className="flex gap-4">
                          <div className="w-16 h-16 bg-muted rounded-md flex-shrink-0 flex items-center justify-center">
                            <BookOpen className="h-8 w-8 text-muted-foreground" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-start gap-2">
                              <div>
                                <h3 className="font-medium truncate">{course.name}</h3>
                                <div className="flex items-center gap-1 mt-1">
                                  <Avatar className="h-5 w-5">
                                    <AvatarFallback className="text-[10px]">
                                      {course.instructor.split(' ').map(n => n[0]).join('')}
                                    </AvatarFallback>
                                  </Avatar>
                                  <p className="text-xs text-muted-foreground">{course.instructor}</p>
                                </div>
                              </div>
                              <Badge 
                                variant="outline" 
                                className={`
                                  ${course.status === 'completed' ? 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800/30' : 
                                    course.status === 'in_progress' ? 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800/30' : 
                                    'bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800/30'}
                                `}
                              >
                                {course.status === 'in_progress' ? 'In Progress' : 
                                 course.status === 'just_started' ? 'Just Started' : 
                                 'Completed'}
                              </Badge>
                            </div>
                            
                            <div className="mt-3">
                              <div className="flex justify-between text-xs mb-1.5">
                                <span className="text-muted-foreground">Progress</span>
                                <span className="font-medium">{course.progress}%</span>
                              </div>
                              <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                                <div
                                  className={`h-2 rounded-full ${
                                    course.progress < 20 ? 'bg-amber-500' :
                                    course.progress < 70 ? 'bg-blue-500' : 'bg-emerald-500'
                                  }`}
                                  style={{ width: `${course.progress}%` }}
                                ></div>
                              </div>
                            </div>

                            <div className="mt-3 flex items-center justify-between text-xs">
                              <div className="flex items-center gap-1.5 text-muted-foreground">
                                <Clock className="h-3.5 w-3.5" />
                                <span>Last accessed {course.lastAccessed}</span>
                              </div>
                              <Button size="sm" className="h-8">
                                Continue
                                <ArrowRight className="ml-1 h-3.5 w-3.5" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </CardContent>
              </Card>

              {/* Achievements */}
              <Card>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>My Achievements</CardTitle>
                      <CardDescription>Track your progress and rewards</CardDescription>
                    </div>
                    <Button variant="ghost" className="gap-1 text-sm">
                      View all
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-4 overflow-x-auto py-1 pb-3 scrollbar-thin">
                    {achievements.map((achievement) => (
                      <Card key={achievement.id} className="min-w-[200px] flex-shrink-0">
                        <CardContent className="p-4 text-center">
                          <div className="mx-auto h-14 w-14 rounded-full bg-muted flex items-center justify-center mb-3">
                            {achievement.icon}
                          </div>
                          <h4 className="font-medium text-sm mb-1">{achievement.name}</h4>
                          <p className="text-xs text-muted-foreground">{achievement.description}</p>
                        </CardContent>
                      </Card>
                    ))}
                    
                    <Card className="min-w-[200px] flex-shrink-0 border-dashed">
                      <CardContent className="p-4 text-center h-full flex flex-col items-center justify-center">
                        <div className="mx-auto h-14 w-14 rounded-full bg-muted/60 flex items-center justify-center mb-3">
                          <Plus className="h-6 w-6 text-muted-foreground/60" />
                        </div>
                        <h4 className="font-medium text-sm mb-1">Unlock More</h4>
                        <p className="text-xs text-muted-foreground">Complete courses to earn achievements</p>
                      </CardContent>
                    </Card>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {/* Upcoming Live Classes */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle>Upcoming Live Classes</CardTitle>
                  <CardDescription>Join interactive sessions with instructors</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {upcomingLiveClasses.map((liveClass) => (
                    <div key={liveClass.id} className="flex gap-3 p-3 bg-muted/40 rounded-lg">
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                        {liveClass.type === 'workshop' ? (
                          <User className="h-5 w-5 text-primary" />
                        ) : (
                          <Star className="h-5 w-5 text-primary" />
                        )}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-sm">{liveClass.title}</h4>
                        <p className="text-xs text-muted-foreground mt-0.5">{liveClass.course}</p>
                        <div className="flex items-center gap-3 mt-2">
                          <div className="flex items-center text-xs">
                            <Calendar className="h-3.5 w-3.5 mr-1 text-muted-foreground" />
                            <span>{liveClass.date}</span>
                          </div>
                          <div className="flex items-center text-xs">
                            <Clock className="h-3.5 w-3.5 mr-1 text-muted-foreground" />
                            <span>{liveClass.time}</span>
                          </div>
                        </div>
                      </div>
                      <Button size="sm" variant="outline" className="self-center h-8">
                        Join
                      </Button>
                    </div>
                  ))}
                </CardContent>
                <CardFooter className="pt-0">
                  <Button variant="outline" className="w-full gap-1">
                    <Plus className="h-4 w-4" />
                    Book a new class
                  </Button>
                </CardFooter>
              </Card>

              {/* Recommended Courses */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle>Recommended for You</CardTitle>
                  <CardDescription>Based on your interests</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {recommendedCourses.map((course) => (
                    <div key={course.id} className="group relative rounded-lg border p-3 hover:shadow-md transition-shadow">
                      <div className="flex gap-3">
                        <div className="w-12 h-12 bg-muted rounded-md flex-shrink-0 flex items-center justify-center">
                          <BookOpen className="h-6 w-6 text-muted-foreground" />
                        </div>
                        <div>
                          <h3 className="font-medium text-sm">{course.name}</h3>
                          <p className="text-xs text-muted-foreground mt-0.5">{course.instructor}</p>
                          <div className="flex items-center mt-1.5">
                            <div className="flex">
                              {[...Array(5)].map((_, i) => (
                                <Star 
                                  key={i} 
                                  className={`h-3.5 w-3.5 ${i < Math.floor(course.rating) ? 'text-amber-500 fill-amber-500' : 'text-muted stroke-muted'}`}
                                />
                              ))}
                            </div>
                            <span className="text-xs font-medium ml-1.5">{course.rating}</span>
                            <span className="text-xs text-muted-foreground ml-2">({course.students.toLocaleString()} students)</span>
                          </div>
                        </div>
                      </div>
                      <div className="mt-2 flex flex-wrap gap-1">
                        {course.tags.map((tag, i) => (
                          <Badge variant="secondary" key={i} className="text-xs px-1.5 py-0 h-5">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                      <div className="absolute bottom-3 right-3">
                        <Button size="sm" variant="ghost" className="h-8 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Bookmark className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </CardContent>
                <CardFooter className="pt-0">
                  <Button variant="outline" className="w-full">
                    View all recommendations
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="courses" className="p-0 border-none">
          <div className="border rounded-lg p-8 text-center">
            <h3 className="text-lg font-medium">My Courses Content</h3>
            <p className="text-muted-foreground mt-2">This tab would display a complete list of all your courses</p>
          </div>
        </TabsContent>

        <TabsContent value="live-classes" className="p-0 border-none">
          <div className="border rounded-lg p-8 text-center">
            <h3 className="text-lg font-medium">Live Classes Content</h3>
            <p className="text-muted-foreground mt-2">This tab would display all scheduled and available live classes</p>
          </div>
        </TabsContent>

        <TabsContent value="certificates" className="p-0 border-none">
          <div className="border rounded-lg p-8 text-center">
            <h3 className="text-lg font-medium">Certificates Content</h3>
            <p className="text-muted-foreground mt-2">This tab would display your earned certificates and achievements</p>
          </div>
        </TabsContent>

        <TabsContent value="wishlist" className="p-0 border-none">
          <div className="border rounded-lg p-8 text-center">
            <h3 className="text-lg font-medium">Wishlist Content</h3>
            <p className="text-muted-foreground mt-2">This tab would display courses you've saved to your wishlist</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
} 