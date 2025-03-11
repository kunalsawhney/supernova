'use client';

import { useState } from 'react';
import { useTheme } from '@/context/ThemeContext';
import Breadcrumbs from '@/components/Breadcrumbs';

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

export default function StudentDashboard() {
  const [selectedTab, setSelectedTab] = useState('overview');
  const [showBookingModal, setShowBookingModal] = useState(false);

  return (
    <div className="space-y-6 pb-8">
      <Breadcrumbs />
      
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">My Learning Dashboard</h1>
          <p className="text-text-secondary mt-1">Track your progress and continue learning</p>
        </div>
        <div className="flex space-x-3">
          <button 
            onClick={() => setShowBookingModal(true)}
            className="px-4 py-2 bg-button-primary text-white rounded-lg hover:bg-button-primary/90 flex items-center space-x-2"
          >
            <span>📅</span>
            <span>Book Live Class</span>
          </button>
          <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center space-x-2">
            <span>🔍</span>
            <span>Browse Courses</span>
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="border-b border-border">
        <nav className="flex space-x-8">
          {['Overview', 'My Courses', 'Live Classes', 'Certificates', 'Wishlist'].map((tab) => (
            <button
              key={tab}
              onClick={() => setSelectedTab(tab.toLowerCase())}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                selectedTab === tab.toLowerCase()
                  ? 'border-button-primary text-button-primary'
                  : 'border-transparent text-text-secondary hover:text-text-primary hover:border-border'
              }`}
            >
              {tab}
            </button>
          ))}
        </nav>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center space-x-3">
            <span className="text-3xl">📚</span>
            <div>
              <h3 className="text-sm font-medium text-text-secondary">Enrolled Courses</h3>
              <p className="text-2xl font-bold text-text-primary mt-1">{learningStats.coursesEnrolled}</p>
              <span className="text-green-600 text-sm">Active courses</span>
            </div>
          </div>
        </div>
        <div className="card p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center space-x-3">
            <span className="text-3xl">🎯</span>
            <div>
              <h3 className="text-sm font-medium text-text-secondary">Completed</h3>
              <p className="text-2xl font-bold text-text-primary mt-1">{learningStats.completedCourses}</p>
              <span className="text-text-secondary text-sm">Finished courses</span>
            </div>
          </div>
        </div>
        <div className="card p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center space-x-3">
            <span className="text-3xl">📈</span>
            <div>
              <h3 className="text-sm font-medium text-text-secondary">Average Score</h3>
              <p className="text-2xl font-bold text-text-primary mt-1">{learningStats.averageScore}</p>
              <span className="text-blue-600 text-sm">Keep it up!</span>
            </div>
          </div>
        </div>
        <div className="card p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center space-x-3">
            <span className="text-3xl">⏱️</span>
            <div>
              <h3 className="text-sm font-medium text-text-secondary">Learning Hours</h3>
              <p className="text-2xl font-bold text-text-primary mt-1">{learningStats.totalHours}h</p>
              <span className="text-green-600 text-sm">Total time spent</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* My Courses */}
        <div className="lg:col-span-2 space-y-6">
          <div className="card">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-lg font-semibold text-text-primary">My Courses</h2>
                <p className="text-sm text-text-secondary mt-1">Continue where you left off</p>
              </div>
              <button className="text-button-primary hover:underline">View All Courses</button>
            </div>
            <div className="space-y-4">
              {myCourses.map((course) => (
                <div key={course.id} className="p-4 rounded-lg bg-background hover:shadow-md transition-shadow">
                  <div className="flex gap-4">
                    <div className="w-24 h-24 rounded-lg bg-background-secondary flex-shrink-0">
                      {/* Course thumbnail would go here */}
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium text-text-primary">{course.name}</h3>
                          <p className="text-sm text-text-secondary mt-1">Instructor: {course.instructor}</p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs ${
                          course.status === 'completed'
                            ? 'bg-green-100 text-green-800'
                            : course.status === 'in_progress'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {course.status.replace('_', ' ')}
                        </span>
                      </div>
                      <div className="mt-4">
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-text-secondary">Progress</span>
                          <span className="text-text-primary font-medium">{course.progress}%</span>
                        </div>
                        <div className="w-full bg-background-secondary rounded-full h-2">
                          <div
                            className="bg-button-primary h-2 rounded-full"
                            style={{ width: `${course.progress}%` }}
                          ></div>
                        </div>
                      </div>
                      <div className="mt-4 flex justify-between items-center text-sm">
                        <span className="text-text-secondary">Next: {course.nextMilestone}</span>
                        <button className="px-4 py-1 bg-button-primary text-white rounded-lg hover:bg-button-primary/90">
                          Continue
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recommended Courses */}
          <div className="card">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-lg font-semibold text-text-primary">Recommended for You</h2>
                <p className="text-sm text-text-secondary mt-1">Based on your interests and progress</p>
              </div>
              <button className="text-button-primary hover:underline">View All</button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {recommendedCourses.map((course) => (
                <div key={course.id} className="p-4 rounded-lg bg-background hover:shadow-md transition-shadow">
                  <div className="h-32 rounded-lg bg-background-secondary mb-4">
                    {/* Course thumbnail would go here */}
                  </div>
                  <h3 className="font-medium text-text-primary">{course.name}</h3>
                  <p className="text-sm text-text-secondary mt-1">{course.instructor}</p>
                  <div className="flex items-center space-x-2 mt-2">
                    <span className="text-yellow-500">⭐</span>
                    <span className="text-sm font-medium">{course.rating}</span>
                    <span className="text-sm text-text-secondary">({course.students} students)</span>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-3">
                    {course.tags.map((tag) => (
                      <span key={tag} className="px-2 py-1 bg-background-secondary rounded-full text-xs text-text-secondary">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <div className="mt-4 flex items-center justify-between">
                    <span className="font-bold text-text-primary">{course.price}</span>
                    <button className="px-4 py-2 border border-button-primary text-button-primary rounded-lg hover:bg-button-primary hover:text-white transition-colors">
                      Add to Cart
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Upcoming Live Classes */}
          <div className="card">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-lg font-semibold text-text-primary">Live Classes</h2>
                <p className="text-sm text-text-secondary mt-1">Interactive learning sessions</p>
              </div>
            </div>
            <div className="space-y-4">
              {upcomingLiveClasses.map((session) => (
                <div key={session.id} className="p-4 rounded-lg bg-background hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium text-text-primary">{session.title}</h3>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      session.type === 'workshop' ? 'bg-purple-100 text-purple-800' : 'bg-orange-100 text-orange-800'
                    }`}>
                      {session.type === 'workshop' ? 'Workshop' : 'Q&A'}
                    </span>
                  </div>
                  <p className="text-sm text-text-secondary mt-2">{session.course}</p>
                  <p className="text-sm text-text-secondary">with {session.instructor}</p>
                  <div className="mt-3 flex justify-between items-center text-sm">
                    <div className="text-text-secondary">
                      {session.date} at {session.time}
                    </div>
                    <span className="text-text-secondary">{session.duration}</span>
                  </div>
                  <button className="w-full mt-3 px-4 py-2 bg-button-primary text-white rounded-lg hover:bg-button-primary/90">
                    Join Session
                  </button>
                </div>
              ))}
            </div>
            <button 
              onClick={() => setShowBookingModal(true)}
              className="w-full mt-4 px-4 py-2 border border-dashed border-border rounded-lg text-text-secondary hover:border-button-primary hover:text-button-primary transition-colors"
            >
              + Book New Live Class
            </button>
          </div>

          {/* Quick Actions */}
          <div className="card">
            <h2 className="text-lg font-semibold text-text-primary mb-4">Quick Actions</h2>
            <div className="space-y-3">
              <button className="w-full text-left p-3 rounded-lg bg-background hover:bg-background-secondary transition-colors flex items-center space-x-3">
                <span className="text-2xl">📝</span>
                <span className="text-text-primary">View Assignments</span>
              </button>
              <button className="w-full text-left p-3 rounded-lg bg-background hover:bg-background-secondary transition-colors flex items-center space-x-3">
                <span className="text-2xl">🏆</span>
                <span className="text-text-primary">My Certificates</span>
              </button>
              <button className="w-full text-left p-3 rounded-lg bg-background hover:bg-background-secondary transition-colors flex items-center space-x-3">
                <span className="text-2xl">💬</span>
                <span className="text-text-primary">Support Chat</span>
              </button>
              <button className="w-full text-left p-3 rounded-lg bg-background hover:bg-background-secondary transition-colors flex items-center space-x-3">
                <span className="text-2xl">⭐</span>
                <span className="text-text-primary">My Wishlist</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 