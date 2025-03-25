'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { ArrowRight, BookOpen } from 'lucide-react';

const currentCourses = [
  {
    id: 1,
    name: 'Introduction to Python Programming',
    progress: 65,
    nextLesson: 'Functions and Methods',
    instructor: 'Dr. Sarah Chen',
    image: 'https://api.dicebear.com/7.x/shapes/svg?seed=python',
  },
  {
    id: 2,
    name: 'Web Development Fundamentals',
    progress: 42,
    nextLesson: 'CSS Layouts and Flexbox',
    instructor: 'Alex Thompson',
    image: 'https://api.dicebear.com/7.x/shapes/svg?seed=web',
  },
  {
    id: 3,
    name: 'Data Structures & Algorithms',
    progress: 28,
    nextLesson: 'Binary Search Trees',
    instructor: 'Prof. James Wilson',
    image: 'https://api.dicebear.com/7.x/shapes/svg?seed=dsa',
  },
];

const upcomingSchedule = [
  {
    id: 1,
    title: 'Python Programming Live Session',
    time: '2:00 PM - 3:30 PM',
    date: 'Today',
    type: 'Live Class',
  },
  {
    id: 2,
    title: 'Web Development Project Due',
    time: '11:59 PM',
    date: 'Tomorrow',
    type: 'Assignment',
  },
  {
    id: 3,
    title: 'DSA Practice Session',
    time: '10:00 AM - 11:30 AM',
    date: 'Mar 15',
    type: 'Practice',
  },
];

export default function Dashboard() {
  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Welcome back, John! 👋</h1>
          <p className="text-muted-foreground mt-1">Ready to continue your learning journey?</p>
        </div>
        <Button asChild>
          <Link href="/dashboard/courses">
            Browse All Courses
          </Link>
        </Button>
      </div>

      {/* Progress Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-semibold">Weekly Goal</h3>
              <span className="text-primary font-bold">4/5 hrs</span>
            </div>
            <div className="w-full bg-background rounded-full h-2.5">
              <div className="bg-primary h-2.5 rounded-full" style={{ width: '80%' }}></div>
            </div>
            <p className="text-muted-foreground text-sm mt-2">Keep it up! Almost there!</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-2">Assignments</h3>
            <div className="text-3xl font-bold text-primary">3</div>
            <p className="text-muted-foreground text-sm">Pending submissions</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-2">Next Live Session</h3>
            <div className="text-primary font-medium">2:00 PM Today</div>
            <p className="text-muted-foreground text-sm">Python Programming</p>
          </CardContent>
        </Card>
      </div>

      {/* Current Courses */}
      <div>
        <h2 className="text-xl font-bold mb-4">Current Courses</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {currentCourses.map((course) => (
            <Card key={course.id}>
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  <Avatar className="h-12 w-12 rounded-lg">
                    <AvatarImage src={course.image} alt={course.name} />
                    <AvatarFallback className="rounded-lg bg-primary/10">
                      <BookOpen className="h-6 w-6 text-primary" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h3 className="font-semibold">{course.name}</h3>
                    <p className="text-muted-foreground text-sm">{course.instructor}</p>
                  </div>
                </div>
                
                <div className="mt-4">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-muted-foreground">Progress</span>
                    <span className="font-medium">{course.progress}%</span>
                  </div>
                  <div className="w-full bg-background rounded-full h-2">
                    <div
                      className="bg-primary h-2 rounded-full"
                      style={{ width: `${course.progress}%` }}
                    ></div>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-border">
                  <p className="text-sm text-muted-foreground">Next: {course.nextLesson}</p>
                  <Button variant="link" className="p-0 h-auto mt-2" asChild>
                    <Link href={`/dashboard/courses/${course.id}`}>
                      Continue Learning
                      <ArrowRight className="h-4 w-4 ml-1" />
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Upcoming Schedule */}
      <div>
        <h2 className="text-xl font-bold mb-4">Upcoming Schedule</h2>
        <Card>
          <CardContent className="p-6 divide-y divide-border">
            {upcomingSchedule.map((item, index) => (
              <div key={item.id} className={`py-4 ${index === 0 ? 'pt-0' : ''} ${index === upcomingSchedule.length - 1 ? 'pb-0' : ''}`}>
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">{item.title}</h4>
                    <p className="text-sm text-muted-foreground">{item.time}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-medium">{item.date}</span>
                    <p className="text-xs text-muted-foreground">{item.type}</p>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 