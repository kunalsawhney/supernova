'use client';

import { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardFooter 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Link from 'next/link';
import { 
  Users, 
  BookOpen, 
  GraduationCap, 
  PieChart, 
  BarChart2, 
  Clock, 
  Calendar, 
  CheckCircle2, 
  Bell,
  PlusCircle,
  ArrowRight,
  Settings,
  UserPlus
} from 'lucide-react';

// Sample data - in a real app, this would come from API/hooks
const schoolStats = {
  totalStudents: 1256,
  totalTeachers: 42,
  totalCourses: 68,
  activeStudents: '78%',
};

const recentActivity = [
  {
    id: 1,
    event: 'New student registered',
    user: 'Emma Wilson',
    time: '2 hours ago',
    role: 'student',
  },
  {
    id: 2,
    event: 'New course published',
    user: 'Michael Chen',
    time: '5 hours ago',
    role: 'teacher',
  },
  {
    id: 3,
    event: 'Student enrollment approved',
    user: 'Alex Johnson',
    time: '1 day ago',
    role: 'admin',
  },
  {
    id: 4,
    event: 'Quiz submissions graded',
    user: 'Sarah Parker',
    time: '2 days ago',
    role: 'teacher',
  },
];

const upcomingDeadlines = [
  {
    id: 1,
    title: 'Semester registration deadline',
    date: 'June 15, 2023',
    daysLeft: 5,
  },
  {
    id: 2,
    title: 'Teacher evaluation period ends',
    date: 'June 20, 2023',
    daysLeft: 10,
  },
  {
    id: 3,
    title: 'Summer program registration',
    date: 'June 25, 2023',
    daysLeft: 15,
  },
];

const popularCourses = [
  {
    id: 1,
    name: 'Advanced Mathematics',
    teacher: 'Dr. Robert Smith',
    students: 128,
    rating: 4.8,
  },
  {
    id: 2,
    name: 'Introduction to Physics',
    teacher: 'Prof. Amanda Johnson',
    students: 112,
    rating: 4.7,
  },
  {
    id: 3,
    name: 'English Literature',
    teacher: 'Sarah Williams',
    students: 96,
    rating: 4.6,
  },
];

export function SchoolAdminDashboard() {
  return (
    <div className="space-y-6" style={{ border: 'none', borderRight: 'none' }}>
      {/* Action buttons */}
      <div className="flex justify-end space-x-3">
        <Button variant="outline" className="gap-2">
          <Settings className="h-4 w-4" />
          School Settings
        </Button>
        <Button className="gap-2">
          <UserPlus className="h-4 w-4" />
          Add User
        </Button>
      </div>
      
      {/* School Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center text-blue-600 dark:text-blue-400">
                <Users className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Students</p>
                <h3 className="text-2xl font-bold mt-0.5">{schoolStats.totalStudents}</h3>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-purple-100 dark:bg-purple-900/20 flex items-center justify-center text-purple-600 dark:text-purple-400">
                <GraduationCap className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Teachers</p>
                <h3 className="text-2xl font-bold mt-0.5">{schoolStats.totalTeachers}</h3>
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
                <p className="text-sm font-medium text-muted-foreground">Total Courses</p>
                <h3 className="text-2xl font-bold mt-0.5">{schoolStats.totalCourses}</h3>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-amber-100 dark:bg-amber-900/20 flex items-center justify-center text-amber-600 dark:text-amber-400">
                <PieChart className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Active Students</p>
                <h3 className="text-2xl font-bold mt-0.5">{schoolStats.activeStudents}</h3>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Two-column layout for main content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column - 2/3 width */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Latest events at your school</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-start gap-3 pb-4 border-b border-border last:border-0 last:pb-0">
                    <div className={`
                      h-8 w-8 rounded-full flex items-center justify-center 
                      ${activity.role === 'student' ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400' : 
                        activity.role === 'teacher' ? 'bg-purple-100 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400' : 
                        'bg-amber-100 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400'}
                    `}>
                      {activity.role === 'student' ? (
                        <Users className="h-4 w-4" />
                      ) : activity.role === 'teacher' ? (
                        <GraduationCap className="h-4 w-4" />
                      ) : (
                        <Settings className="h-4 w-4" />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-foreground">{activity.event}</p>
                      <div className="flex items-center text-xs text-muted-foreground mt-1">
                        <span>{activity.user}</span>
                        <span className="mx-2">•</span>
                        <span>{activity.time}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter className="border-t pt-4 flex justify-center">
              <Button variant="ghost" size="sm" className="gap-1">
                View All Activity
                <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Popular Courses</CardTitle>
              <CardDescription>Highest enrollment and engagement</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {popularCourses.map((course) => (
                  <div key={course.id} className="flex items-center gap-4 pb-4 border-b border-border last:border-0 last:pb-0">
                    <div className="h-10 w-10 rounded-md bg-primary/10 flex items-center justify-center text-primary">
                      <BookOpen className="h-5 w-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-foreground truncate">{course.name}</h3>
                      <p className="text-sm text-muted-foreground">{course.teacher}</p>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-1 text-amber-500">
                        <span className="font-medium">{course.rating}</span>
                        <svg className="h-4 w-4 fill-current" viewBox="0 0 20 20">
                          <path d="M10 15.27L16.18 19l-1.64-7.03L20 7.24l-7.19-.61L10 0 7.19 6.63 0 7.24l5.46 4.73L3.82 19z" />
                        </svg>
                      </div>
                      <p className="text-xs text-muted-foreground">{course.students} students</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter className="border-t pt-4 flex justify-between">
              <Button variant="ghost" size="sm">View All Courses</Button>
              <Button variant="outline" size="sm" className="gap-1">
                <PlusCircle className="h-3.5 w-3.5" />
                Add Course
              </Button>
            </CardFooter>
          </Card>
        </div>

        {/* Right column - 1/3 width */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Deadlines</CardTitle>
              <CardDescription>Important dates to remember</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {upcomingDeadlines.map((deadline) => (
                  <div key={deadline.id} className="flex gap-4 pb-4 border-b border-border last:border-0 last:pb-0">
                    <div className="h-10 w-10 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center text-red-600 dark:text-red-400">
                      <Calendar className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-medium text-foreground text-sm">{deadline.title}</h3>
                      <p className="text-xs text-muted-foreground mt-1">{deadline.date}</p>
                      <Badge 
                        variant="outline" 
                        className={`mt-2 ${
                          deadline.daysLeft <= 5 ? 'text-red-500 border-red-200 dark:border-red-800' : 
                          deadline.daysLeft <= 10 ? 'text-amber-500 border-amber-200 dark:border-amber-800' : 
                          'text-blue-500 border-blue-200 dark:border-blue-800'
                        }`}
                      >
                        {deadline.daysLeft} days left
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter className="border-t pt-4">
              <Button variant="ghost" size="sm" className="w-full">
                View Calendar
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Common tasks</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col space-y-2">
                <Button variant="outline" className="justify-start text-left" size="sm">
                  <UserPlus className="h-4 w-4 mr-2" />
                  Enroll New Student
                </Button>
                <Button variant="outline" className="justify-start text-left" size="sm">
                  <GraduationCap className="h-4 w-4 mr-2" />
                  Add Teacher
                </Button>
                <Button variant="outline" className="justify-start text-left" size="sm">
                  <BookOpen className="h-4 w-4 mr-2" />
                  Create New Course
                </Button>
                <Button variant="outline" className="justify-start text-left" size="sm">
                  <Bell className="h-4 w-4 mr-2" />
                  Send Announcement
                </Button>
                <Button variant="outline" className="justify-start text-left" size="sm">
                  <BarChart2 className="h-4 w-4 mr-2" />
                  View Reports
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
} 