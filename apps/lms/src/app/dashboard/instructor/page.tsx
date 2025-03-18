'use client';

import { useState } from 'react';
import Breadcrumbs from '@/components/Breadcrumbs';

// Mock data
const teachingStats = {
  totalStudents: 245,
  activeClasses: 4,
  completionRate: '85%',
  upcomingSessions: 3,
};

const myClasses = [
  {
    id: 1,
    name: 'Class 10-A',
    subject: 'Web Development',
    students: 35,
    progress: 65,
    nextSession: '2024-03-16 10:00 AM',
    status: 'active',
  },
  {
    id: 2,
    name: 'Class 11-B',
    subject: 'JavaScript Fundamentals',
    students: 32,
    progress: 45,
    nextSession: '2024-03-17 2:00 PM',
    status: 'active',
  },
  {
    id: 3,
    name: 'Class 12-A',
    subject: 'React Basics',
    students: 28,
    progress: 30,
    nextSession: '2024-03-18 11:00 AM',
    status: 'upcoming',
  },
];

const upcomingSchedule = [
  {
    id: 1,
    title: 'Live Class',
    class: 'Class 10-A',
    subject: 'Web Development',
    topic: 'CSS Layouts',
    time: '10:00 AM',
    date: 'Today',
    attendees: 35,
  },
  {
    id: 2,
    title: 'Doubt Session',
    class: 'Class 11-B',
    subject: 'JavaScript Fundamentals',
    topic: 'Functions & Scope',
    time: '2:00 PM',
    date: 'Tomorrow',
    attendees: 32,
  },
];

const studentProgress = [
  {
    id: 1,
    name: 'Emma Thompson',
    class: 'Class 10-A',
    attendance: '95%',
    progress: 78,
    lastActive: '2 hours ago',
    status: 'on_track',
  },
  {
    id: 2,
    name: 'James Wilson',
    class: 'Class 11-B',
    attendance: '85%',
    progress: 45,
    lastActive: '1 day ago',
    status: 'needs_attention',
  },
  {
    id: 3,
    name: 'Sophie Chen',
    class: 'Class 10-A',
    attendance: '98%',
    progress: 92,
    lastActive: '5 hours ago',
    status: 'excellent',
  },
];

export default function InstructorDashboard() {
  const [selectedTab, setSelectedTab] = useState('overview');

  return (
    <div className="space-y-6">
      <Breadcrumbs />
      
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Teacher Dashboard</h1>
          <p className="text-muted-foreground mt-1">Manage your classes and track student progress</p>
        </div>
        <div className="flex space-x-3">
          <button className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 flex items-center space-x-2">
            <span>📅</span>
            <span>Schedule Class</span>
          </button>
          <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center space-x-2">
            <span>📊</span>
            <span>Generate Report</span>
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="border-b border-border">
        <nav className="flex space-x-8">
          {['Overview', 'Classes', 'Students', 'Schedule', 'Resources'].map((tab) => (
            <button
              key={tab}
              onClick={() => setSelectedTab(tab.toLowerCase())}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                selectedTab === tab.toLowerCase()
                  ? 'border-primary text-primary'
                  : 'border-transparent text-muted-foreground hover:text-foreground hover:border-border'
              }`}
            >
              {tab}
            </button>
          ))}
        </nav>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card p-6">
          <div className="flex items-center space-x-3">
            <span className="text-3xl">👥</span>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Total Students</h3>
              <p className="text-2xl font-bold text-foreground mt-1">{teachingStats.totalStudents}</p>
              <span className="text-muted-foreground text-sm">Across all classes</span>
            </div>
          </div>
        </div>
        <div className="card p-6">
          <div className="flex items-center space-x-3">
            <span className="text-3xl">📚</span>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Active Classes</h3>
              <p className="text-2xl font-bold text-foreground mt-1">{teachingStats.activeClasses}</p>
              <span className="text-muted-foreground text-sm">Current semester</span>
            </div>
          </div>
        </div>
        <div className="card p-6">
          <div className="flex items-center space-x-3">
            <span className="text-3xl">📈</span>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Completion Rate</h3>
              <p className="text-2xl font-bold text-foreground mt-1">{teachingStats.completionRate}</p>
              <span className="text-green-600 text-sm">Average across classes</span>
            </div>
          </div>
        </div>
        <div className="card p-6">
          <div className="flex items-center space-x-3">
            <span className="text-3xl">📅</span>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Upcoming Sessions</h3>
              <p className="text-2xl font-bold text-foreground mt-1">{teachingStats.upcomingSessions}</p>
              <span className="text-blue-600 text-sm">Next 7 days</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Classes and Progress */}
        <div className="lg:col-span-2 space-y-6">
          {/* My Classes */}
          <div className="card">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h2 className="text-lg font-semibold text-foreground">My Classes</h2>
                <p className="text-sm text-muted-foreground mt-1">Current teaching assignments</p>
              </div>
              <button className="text-primary hover:underline">View All Classes</button>
            </div>
            <div className="space-y-4">
              {myClasses.map((class_) => (
                <div key={class_.id} className="p-4 rounded-lg bg-background">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium text-foreground">{class_.name}</h3>
                      <p className="text-sm text-muted-foreground mt-1">{class_.subject} • {class_.students} students</p>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      class_.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                    }`}>
                      {class_.status}
                    </span>
                  </div>
                  <div className="mt-4">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-muted-foreground">Syllabus Progress</span>
                      <span className="text-foreground font-medium">{class_.progress}%</span>
                    </div>
                    <div className="w-full bg-background-secondary rounded-full h-2">
                      <div
                        className="bg-primary h-2 rounded-full"
                        style={{ width: `${class_.progress}%` }}
                      ></div>
                    </div>
                  </div>
                  <div className="mt-4 flex justify-between items-center text-sm">
                    <span className="text-muted-foreground">Next Session: {class_.nextSession}</span>
                    <div className="space-x-2">
                      <button className="text-primary hover:underline">View Class</button>
                      <button className="text-primary hover:underline">Take Attendance</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Student Progress */}
          <div className="card">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h2 className="text-lg font-semibold text-foreground">Student Progress</h2>
                <p className="text-sm text-muted-foreground mt-1">Recent student activities and performance</p>
              </div>
              <button className="text-primary hover:underline">View All Students</button>
            </div>
            <div className="space-y-4">
              {studentProgress.map((student) => (
                <div key={student.id} className="p-4 rounded-lg bg-background">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium text-foreground">{student.name}</h3>
                      <p className="text-sm text-muted-foreground mt-1">{student.class}</p>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      student.status === 'excellent'
                        ? 'bg-green-100 text-green-800'
                        : student.status === 'needs_attention'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      {student.status.replace('_', ' ')}
                    </span>
                  </div>
                  <div className="mt-4">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-muted-foreground">Course Progress</span>
                      <span className="text-foreground font-medium">{student.progress}%</span>
                    </div>
                    <div className="w-full bg-background-secondary rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${
                          student.status === 'excellent'
                            ? 'bg-green-500'
                            : student.status === 'needs_attention'
                            ? 'bg-red-500'
                            : 'bg-primary'
                        }`}
                        style={{ width: `${student.progress}%` }}
                      ></div>
                    </div>
                  </div>
                  <div className="mt-4 flex justify-between items-center text-sm">
                    <div className="space-x-4">
                      <span className="text-muted-foreground">Attendance: {student.attendance}</span>
                      <span className="text-muted-foreground">Last active: {student.lastActive}</span>
                    </div>
                    <button className="text-primary hover:underline">View Details</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Upcoming Schedule */}
          <div className="card">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-lg font-semibold text-foreground">Today's Schedule</h2>
                <p className="text-sm text-muted-foreground mt-1">Upcoming classes and sessions</p>
              </div>
            </div>
            <div className="space-y-4">
              {upcomingSchedule.map((session) => (
                <div key={session.id} className="p-4 rounded-lg bg-background">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium text-foreground">{session.title}</h3>
                    <span className="text-muted-foreground">{session.time}</span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">{session.class}</p>
                  <p className="text-sm text-muted-foreground">{session.subject}</p>
                  <p className="text-sm font-medium text-foreground mt-2">Topic: {session.topic}</p>
                  <div className="mt-3 flex justify-between items-center text-sm">
                    <span className="text-muted-foreground">{session.attendees} students</span>
                  </div>
                  <div className="mt-3 flex space-x-2">
                    <button className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90">
                      Start Class
                    </button>
                    <button className="px-4 py-2 border border-primary text-primary rounded-lg hover:bg-primary/10">
                      View Plan
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="card">
            <h2 className="text-lg font-semibold text-foreground mb-4">Quick Actions</h2>
            <div className="space-y-3">
              <button className="w-full text-left p-3 rounded-lg bg-background hover:bg-background-secondary transition-colors flex items-center space-x-3">
                <span className="text-2xl">📝</span>
                <span className="text-foreground">Take Attendance</span>
              </button>
              <button className="w-full text-left p-3 rounded-lg bg-background hover:bg-background-secondary transition-colors flex items-center space-x-3">
                <span className="text-2xl">📊</span>
                <span className="text-foreground">Grade Assignments</span>
              </button>
              <button className="w-full text-left p-3 rounded-lg bg-background hover:bg-background-secondary transition-colors flex items-center space-x-3">
                <span className="text-2xl">📚</span>
                <span className="text-foreground">Learning Resources</span>
              </button>
              <button className="w-full text-left p-3 rounded-lg bg-background hover:bg-background-secondary transition-colors flex items-center space-x-3">
                <span className="text-2xl">💬</span>
                <span className="text-foreground">Contact School Admin</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 