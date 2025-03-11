'use client';

import { useState } from 'react';
import Breadcrumbs from '@/components/Breadcrumbs';

// Mock data
const platformStats = {
  totalUsers: 12580,
  totalSchools: 45,
  totalRevenue: '$125,450',
  activeUsers: '78%',
};

const recentSchools = [
  {
    id: 1,
    name: 'Riverside High School',
    location: 'New York, USA',
    students: 450,
    activeCourses: 8,
    joinDate: '2024-03-15',
    status: 'active',
  },
  {
    id: 2,
    name: 'Tech Academy',
    location: 'San Francisco, USA',
    students: 320,
    activeCourses: 6,
    joinDate: '2024-03-14',
    status: 'active',
  },
  {
    id: 3,
    name: 'Global Learning Institute',
    location: 'London, UK',
    students: 280,
    activeCourses: 5,
    joinDate: '2024-03-13',
    status: 'pending',
  },
];

const recentTransactions = [
  {
    id: 1,
    type: 'school_subscription',
    school: 'Riverside High School',
    amount: '$2,499',
    date: '2024-03-15',
    status: 'completed',
  },
  {
    id: 2,
    type: 'course_purchase',
    user: 'Emma Thompson',
    course: 'Web Development Bundle',
    amount: '$199',
    date: '2024-03-15',
    status: 'completed',
  },
  {
    id: 3,
    type: 'school_subscription',
    school: 'Tech Academy',
    amount: '$1,999',
    date: '2024-03-14',
    status: 'pending',
  },
];

const systemHealth = {
  serverStatus: 'Operational',
  uptime: '99.9%',
  responseTime: '120ms',
  activeConnections: 1250,
  cpuUsage: '45%',
  memoryUsage: '60%',
  storageUsed: '45%',
  lastBackup: '2024-03-15 03:00 AM',
};

export default function AdminDashboard() {
  const [selectedTab, setSelectedTab] = useState('overview');

  return (
    <div className="space-y-6 pb-8">
      <Breadcrumbs />
      
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Platform Overview</h1>
          <p className="text-text-secondary mt-1">Monitor and manage your learning platform</p>
        </div>
        <div className="flex space-x-3">
          <button className="px-4 py-2 bg-button-primary text-white rounded-lg hover:bg-button-primary/90 flex items-center space-x-2">
            <span>🏫</span>
            <span>Add School</span>
          </button>
          <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center space-x-2">
            <span>📊</span>
            <span>Analytics</span>
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="border-b border-border">
        <nav className="flex space-x-8">
          {['Overview', 'Schools', 'Users', 'Courses', 'Analytics', 'Settings'].map((tab) => (
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
            <span className="text-3xl">👥</span>
            <div>
              <h3 className="text-sm font-medium text-text-secondary">Total Users</h3>
              <p className="text-2xl font-bold text-text-primary mt-1">{platformStats.totalUsers}</p>
              <span className="text-green-600 text-sm">↑ 15% this month</span>
            </div>
          </div>
        </div>
        <div className="card p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center space-x-3">
            <span className="text-3xl">🏫</span>
            <div>
              <h3 className="text-sm font-medium text-text-secondary">Partner Schools</h3>
              <p className="text-2xl font-bold text-text-primary mt-1">{platformStats.totalSchools}</p>
              <span className="text-green-600 text-sm">↑ 3 new this month</span>
            </div>
          </div>
        </div>
        <div className="card p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center space-x-3">
            <span className="text-3xl">💰</span>
            <div>
              <h3 className="text-sm font-medium text-text-secondary">Total Revenue</h3>
              <p className="text-2xl font-bold text-text-primary mt-1">{platformStats.totalRevenue}</p>
              <span className="text-green-600 text-sm">This month</span>
            </div>
          </div>
        </div>
        <div className="card p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center space-x-3">
            <span className="text-3xl">📊</span>
            <div>
              <h3 className="text-sm font-medium text-text-secondary">Active Users</h3>
              <p className="text-2xl font-bold text-text-primary mt-1">{platformStats.activeUsers}</p>
              <span className="text-blue-600 text-sm">Current engagement</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Schools and Transactions */}
        <div className="lg:col-span-2 space-y-6">
          {/* Recent Schools */}
          <div className="card">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-lg font-semibold text-text-primary">Partner Schools</h2>
                <p className="text-sm text-text-secondary mt-1">Recently joined institutions</p>
              </div>
              <button className="text-button-primary hover:underline">View All Schools</button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-4 text-text-secondary font-medium">School</th>
                    <th className="text-left py-3 px-4 text-text-secondary font-medium">Location</th>
                    <th className="text-left py-3 px-4 text-text-secondary font-medium">Students</th>
                    <th className="text-left py-3 px-4 text-text-secondary font-medium">Courses</th>
                    <th className="text-left py-3 px-4 text-text-secondary font-medium">Status</th>
                    <th className="text-left py-3 px-4 text-text-secondary font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {recentSchools.map((school) => (
                    <tr key={school.id} className="border-b border-border">
                      <td className="py-3 px-4">
                        <div>
                          <div className="font-medium text-text-primary">{school.name}</div>
                          <div className="text-sm text-text-secondary">Joined {school.joinDate}</div>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-text-secondary">{school.location}</td>
                      <td className="py-3 px-4 text-text-secondary">{school.students}</td>
                      <td className="py-3 px-4 text-text-secondary">{school.activeCourses}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          school.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {school.status}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <button className="text-button-primary hover:underline mr-3">View</button>
                        <button className="text-button-primary hover:underline">Manage</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Recent Transactions */}
          <div className="card">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-lg font-semibold text-text-primary">Recent Transactions</h2>
                <p className="text-sm text-text-secondary mt-1">Latest financial activities</p>
              </div>
              <button className="text-button-primary hover:underline">View All Transactions</button>
            </div>
            <div className="space-y-4">
              {recentTransactions.map((transaction) => (
                <div key={transaction.id} className="p-4 rounded-lg bg-background hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="text-xl">
                          {transaction.type === 'school_subscription' ? '🏫' : '📚'}
                        </span>
                        <h3 className="font-medium text-text-primary">
                          {transaction.type === 'school_subscription' ? transaction.school : transaction.user}
                        </h3>
                      </div>
                      <p className="text-sm text-text-secondary mt-1">
                        {transaction.type === 'school_subscription' 
                          ? 'School Subscription' 
                          : `Course: ${transaction.course}`}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="font-bold text-text-primary">{transaction.amount}</span>
                      <p className="text-sm text-text-secondary">{transaction.date}</p>
                    </div>
                  </div>
                  <div className="mt-3 flex justify-between items-center">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      transaction.status === 'completed' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {transaction.status}
                    </span>
                    <button className="text-button-primary hover:underline">View Details</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* System Health */}
          <div className="card">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-lg font-semibold text-text-primary">System Health</h2>
                <p className="text-sm text-text-secondary mt-1">Platform performance metrics</p>
              </div>
            </div>
            <div className="space-y-4">
              <div className="p-4 rounded-lg bg-background">
                <div className="flex justify-between items-center">
                  <span className="text-text-secondary">Server Status</span>
                  <span className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
                    {systemHealth.serverStatus}
                  </span>
                </div>
              </div>
              <div className="p-4 rounded-lg bg-background">
                <div className="flex justify-between items-center">
                  <span className="text-text-secondary">Uptime</span>
                  <span className="text-text-primary font-medium">{systemHealth.uptime}</span>
                </div>
              </div>
              <div className="p-4 rounded-lg bg-background">
                <div className="flex justify-between items-center">
                  <span className="text-text-secondary">Response Time</span>
                  <span className="text-text-primary font-medium">{systemHealth.responseTime}</span>
                </div>
              </div>
              <div className="p-4 rounded-lg bg-background">
                <div className="flex justify-between items-center">
                  <span className="text-text-secondary">Active Connections</span>
                  <span className="text-text-primary font-medium">{systemHealth.activeConnections}</span>
                </div>
              </div>
              <div className="p-4 rounded-lg bg-background">
                <div className="flex justify-between items-center">
                  <span className="text-text-secondary">CPU Usage</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-24 bg-background-secondary rounded-full h-2">
                      <div
                        className="bg-button-primary h-2 rounded-full"
                        style={{ width: systemHealth.cpuUsage }}
                      ></div>
                    </div>
                    <span className="text-text-primary font-medium">{systemHealth.cpuUsage}</span>
                  </div>
                </div>
              </div>
              <div className="p-4 rounded-lg bg-background">
                <div className="flex justify-between items-center">
                  <span className="text-text-secondary">Memory Usage</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-24 bg-background-secondary rounded-full h-2">
                      <div
                        className="bg-button-primary h-2 rounded-full"
                        style={{ width: systemHealth.memoryUsage }}
                      ></div>
                    </div>
                    <span className="text-text-primary font-medium">{systemHealth.memoryUsage}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="card">
            <h2 className="text-lg font-semibold text-text-primary mb-4">Quick Actions</h2>
            <div className="space-y-3">
              <button className="w-full text-left p-3 rounded-lg bg-background hover:bg-background-secondary transition-colors flex items-center space-x-3">
                <span className="text-2xl">🏫</span>
                <span className="text-text-primary">Manage Schools</span>
              </button>
              <button className="w-full text-left p-3 rounded-lg bg-background hover:bg-background-secondary transition-colors flex items-center space-x-3">
                <span className="text-2xl">📊</span>
                <span className="text-text-primary">View Reports</span>
              </button>
              <button className="w-full text-left p-3 rounded-lg bg-background hover:bg-background-secondary transition-colors flex items-center space-x-3">
                <span className="text-2xl">⚙️</span>
                <span className="text-text-primary">Platform Settings</span>
              </button>
              <button className="w-full text-left p-3 rounded-lg bg-background hover:bg-background-secondary transition-colors flex items-center space-x-3">
                <span className="text-2xl">💬</span>
                <span className="text-text-primary">Support Tickets</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 