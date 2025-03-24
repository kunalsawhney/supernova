'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Link from 'next/link';
import { 
  BookOpen, 
  Users, 
  Calendar, 
  FileText, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  ArrowRight, 
  BarChart,
  PlusCircle
} from 'lucide-react';

// Sample data - in a real app, this would come from API/hooks
const courseStats = {
  totalCourses: 4,
  activeCourses: 3,
  totalStudents: 128,
  averageRating: 4.7,
};

const upcomingClasses = [
  {
    id: 1,
    title: 'Introduction to JavaScript',
    time: '10:00 AM - 11:30 AM',
    date: 'Today',
    students: 24,
    courseName: 'Web Development Fundamentals',
  },
  {
    id: 2,
    title: 'CSS Layout Techniques',
    time: '2:00 PM - 3:30 PM',
    date: 'Tomorrow',
    students: 18,
    courseName: 'Web Development Fundamentals',
  },
  {
    id: 3,
    title: 'React Component Architecture',
    time: '11:00 AM - 12:30 PM',
    date: 'Thursday',
    students: 15,
    courseName: 'Advanced React',
  },
];

const assignmentSubmissions = [
  {
    id: 1,
    title: 'JavaScript Fundamentals Quiz',
    submittedBy: 12,
    totalStudents: 24,
    dueDate: 'Yesterday',
    status: 'needs_review',
  },
  {
    id: 2,
    title: 'CSS Grid Layout Project',
    submittedBy: 10,
    totalStudents: 18,
    dueDate: '2 days ago',
    status: 'needs_review',
  },
  {
    id: 3,
    title: 'React Component Challenge',
    submittedBy: 5,
    totalStudents: 15,
    dueDate: 'Tomorrow',
    status: 'upcoming',
  },
];

const activeCourses = [
  {
    id: 1,
    name: 'Web Development Fundamentals',
    students: 24,
    progress: 65,
    sections: 8,
    image: 'https://api.dicebear.com/7.x/shapes/svg?seed=web',
  },
  {
    id: 2,
    name: 'Advanced React',
    students: 15,
    progress: 42,
    sections: 12,
    image: 'https://api.dicebear.com/7.x/shapes/svg?seed=react',
  },
  {
    id: 3,
    name: 'Node.js Backend Development',
    students: 19,
    progress: 28,
    sections: 10,
    image: 'https://api.dicebear.com/7.x/shapes/svg?seed=node',
  },
];

export function InstructorDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  
  return (
    <div className="space-y-6" style={{ border: 'none', borderRight: 'none' }}>
      {/* Action row */}
      <div className="flex justify-end space-x-3">
        <Button variant="outline" className="gap-2">
          <Calendar className="h-4 w-4" />
          Schedule Class
        </Button>
        <Button className="gap-2">
          <PlusCircle className="h-4 w-4" />
          Create Course
        </Button>
      </div>
      
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center text-blue-600 dark:text-blue-400">
                <BookOpen className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Courses</p>
                <h3 className="text-2xl font-bold mt-0.5">{courseStats.totalCourses}</h3>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-green-100 dark:bg-green-900/20 flex items-center justify-center text-green-600 dark:text-green-400">
                <BookOpen className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Active Courses</p>
                <h3 className="text-2xl font-bold mt-0.5">{courseStats.activeCourses}</h3>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-purple-100 dark:bg-purple-900/20 flex items-center justify-center text-purple-600 dark:text-purple-400">
                <Users className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Students</p>
                <h3 className="text-2xl font-bold mt-0.5">{courseStats.totalStudents}</h3>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-amber-100 dark:bg-amber-900/20 flex items-center justify-center text-amber-600 dark:text-amber-400">
                <BarChart className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Average Rating</p>
                <h3 className="text-2xl font-bold mt-0.5">{courseStats.averageRating}</h3>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Content Tabs */}
      <Tabs defaultValue="upcoming" className="space-y-4">
        <TabsList>
          <TabsTrigger value="upcoming">Upcoming Classes</TabsTrigger>
          <TabsTrigger value="submissions">Assignment Submissions</TabsTrigger>
          <TabsTrigger value="courses">My Courses</TabsTrigger>
        </TabsList>
        
        {/* Upcoming Classes Tab */}
        <TabsContent value="upcoming" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold text-foreground">Upcoming Classes</h2>
            <Link href="/dashboard/instructor/schedule" className="text-sm text-primary hover:underline">
              View Full Schedule
            </Link>
          </div>
          
          <div className="space-y-3">
            {upcomingClasses.map((cls) => (
              <Card key={cls.id}>
                <CardContent className="p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium text-foreground">{cls.title}</h3>
                      <p className="text-sm text-muted-foreground">{cls.courseName}</p>
                      <div className="flex gap-2 mt-2">
                        <Badge variant="outline" className="text-xs gap-1">
                          <Clock className="h-3 w-3" />
                          {cls.time}
                        </Badge>
                        <Badge variant="outline" className="text-xs gap-1">
                          <Calendar className="h-3 w-3" />
                          {cls.date}
                        </Badge>
                        <Badge variant="outline" className="text-xs gap-1">
                          <Users className="h-3 w-3" />
                          {cls.students} students
                        </Badge>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">Start Class</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        {/* Assignment Submissions Tab */}
        <TabsContent value="submissions" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold text-foreground">Assignment Submissions</h2>
            <Link href="/dashboard/instructor/assignments" className="text-sm text-primary hover:underline">
              Manage All Assignments
            </Link>
          </div>
          
          <div className="space-y-3">
            {assignmentSubmissions.map((assignment) => (
              <Card key={assignment.id}>
                <CardContent className="p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium text-foreground">{assignment.title}</h3>
                      <div className="flex gap-2 mt-2">
                        <Badge variant="outline" className="text-xs">
                          Due: {assignment.dueDate}
                        </Badge>
                        <Badge 
                          variant={assignment.status === 'needs_review' ? 'default' : 'outline'} 
                          className="text-xs"
                        >
                          {assignment.status === 'needs_review' ? 'Needs Review' : 'Upcoming'}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mt-2">
                        {assignment.submittedBy} of {assignment.totalStudents} submitted
                      </p>
                    </div>
                    <Button 
                      variant={assignment.status === 'needs_review' ? 'default' : 'outline'} 
                      size="sm"
                      disabled={assignment.status !== 'needs_review'}
                    >
                      Review
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        {/* My Courses Tab */}
        <TabsContent value="courses" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold text-foreground">My Active Courses</h2>
            <Link href="/dashboard/instructor/courses" className="text-sm text-primary hover:underline">
              View All Courses
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {activeCourses.map((course) => (
              <Card key={course.id}>
                <CardContent className="pt-6">
                  <div className="flex items-start space-x-4">
                    <img
                      src={course.image}
                      alt={course.name}
                      className="w-12 h-12 rounded-lg bg-background"
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold text-foreground">{course.name}</h3>
                      <p className="text-sm text-muted-foreground">{course.students} students enrolled</p>
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-muted-foreground">Course progress</span>
                      <span className="text-foreground font-medium">{course.progress}%</span>
                    </div>
                    <div className="w-full bg-background rounded-full h-2">
                      <div
                        className="bg-primary h-2 rounded-full"
                        style={{ width: `${course.progress}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-border">
                    <p className="text-sm text-muted-foreground">{course.sections} sections</p>
                    <Link
                      href={`/dashboard/instructor/courses/${course.id}`}
                      className="mt-2 text-sm text-primary hover:opacity-80 inline-flex items-center"
                    >
                      Manage Course
                      <ArrowRight className="w-4 h-4 ml-1" />
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
} 