'use client';

import Link from 'next/link';

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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Welcome back, John! 👋</h1>
          <p className="text-muted-foreground mt-1">Ready to continue your learning journey?</p>
        </div>
        <Link href="/dashboard/courses" className="btn-primary">
          Browse All Courses
        </Link>
      </div>

      {/* Progress Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="card">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-semibold text-foreground">Weekly Goal</h3>
            <span className="text-primary font-bold">4/5 hrs</span>
          </div>
          <div className="w-full bg-background rounded-full h-2.5">
            <div className="bg-primary h-2.5 rounded-full" style={{ width: '80%' }}></div>
          </div>
          <p className="text-muted-foreground text-sm mt-2">Keep it up! Almost there!</p>
        </div>
        
        <div className="card">
          <h3 className="text-lg font-semibold text-foreground mb-2">Assignments</h3>
          <div className="text-3xl font-bold text-primary">3</div>
          <p className="text-muted-foreground text-sm">Pending submissions</p>
        </div>

        <div className="card">
          <h3 className="text-lg font-semibold text-foreground mb-2">Next Live Session</h3>
          <div className="text-primary font-medium">2:00 PM Today</div>
          <p className="text-muted-foreground text-sm">Python Programming</p>
        </div>
      </div>

      {/* Current Courses */}
      <div>
        <h2 className="text-xl font-bold text-foreground mb-4">Current Courses</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {currentCourses.map((course) => (
            <div key={course.id} className="card">
              <div className="flex items-start space-x-4">
                <img
                  src={course.image}
                  alt={course.name}
                  className="w-12 h-12 rounded-lg bg-background"
                />
                <div className="flex-1">
                  <h3 className="font-semibold text-foreground">{course.name}</h3>
                  <p className="text-muted-foreground text-sm">{course.instructor}</p>
                </div>
              </div>
              
              <div className="mt-4">
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-muted-foreground">Progress</span>
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
                <p className="text-sm text-muted-foreground">Next: {course.nextLesson}</p>
                <Link
                  href={`/dashboard/courses/${course.id}`}
                  className="mt-2 text-sm text-primary hover:opacity-80 inline-flex items-center"
                >
                  Continue Learning
                  <svg className="w-4 h-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Upcoming Schedule */}
      <div>
        <h2 className="text-xl font-bold text-foreground mb-4">Upcoming Schedule</h2>
        <div className="card divide-y divide-border">
          {upcomingSchedule.map((item) => (
            <div key={item.id} className="py-4 first:pt-0 last:pb-0">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-foreground">{item.title}</h4>
                  <p className="text-sm text-muted-foreground">{item.time}</p>
                </div>
                <div className="text-right">
                  <span className="text-sm font-medium text-foreground">{item.date}</span>
                  <p className="text-xs text-muted-foreground">{item.type}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 