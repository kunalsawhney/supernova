'use client';

import { useState, useEffect } from 'react';
import { adminService } from '@/services/adminService';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface PlatformStats {
  totalUsers: number;
  totalSchools: number;
  totalRevenue: string;
  activeUsers: string;
}

interface SystemHealth {
  serverStatus: string;
  uptime: string;
  responseTime: string;
  activeConnections: number;
  cpuUsage: string;
  memoryUsage: string;
  storageUsed: string;
  lastBackup: string;
}

export default function AdminOverview() {
  const [platformStats, setPlatformStats] = useState<PlatformStats>({
    totalUsers: 0,
    totalSchools: 0,
    totalRevenue: '$0',
    activeUsers: '0%',
  });
  const [systemHealth, setSystemHealth] = useState<SystemHealth>({
    serverStatus: 'Loading...',
    uptime: '0%',
    responseTime: '0ms',
    activeConnections: 0,
    cpuUsage: '0%',
    memoryUsage: '0%',
    storageUsed: '0%',
    lastBackup: 'N/A',
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const stats = await adminService.getPlatformStats();
      setPlatformStats(stats);

      const health = await adminService.getSystemHealth();
      setSystemHealth(health);
    } catch (error) {
      console.error('Error fetching admin dashboard data:', error);
    }
  };

  return (
    <>
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="overflow-hidden border-none bg-blue-50 dark:bg-blue-950/40 hover:shadow-xl transition-all duration-300">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="heading-sm">Total Users</CardTitle>
              <div className="p-2 rounded-full bg-blue-100 dark:bg-blue-900/50">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="mt-2">
              <p className="display-md">{platformStats.totalUsers}</p>
              <div className="mt-3">
                <div className="flex items-center space-x-1">
                  <span className="flex items-center text-green-600 dark:text-green-500">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                    <span className="text-sm font-medium ml-1">15%</span>
                  </span>
                  <span className="text-secondary-sm">vs last month</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5 mt-3">
                  <div className="bg-blue-600 h-1.5 rounded-full" style={{ width: '15%' }}></div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="overflow-hidden border-none bg-amber-50 dark:bg-amber-950/40 hover:shadow-xl transition-all duration-300">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="heading-sm">Partner Schools</CardTitle>
              <div className="p-2 rounded-full bg-amber-100 dark:bg-amber-900/50">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-amber-600 dark:text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="mt-2">
              <p className="display-md">{platformStats.totalSchools}</p>
              <div className="mt-3">
                <div className="flex items-center space-x-1">
                  <span className="flex items-center text-green-600 dark:text-green-500">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                    <span className="text-sm font-medium ml-1">3</span>
                  </span>
                  <span className="text-secondary-sm">new this month</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5 mt-3">
                  <div className="bg-amber-600 h-1.5 rounded-full" style={{ width: '10%' }}></div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="overflow-hidden border-none bg-emerald-50 dark:bg-emerald-950/40 hover:shadow-xl transition-all duration-300">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="heading-sm">Total Revenue</CardTitle>
              <div className="p-2 rounded-full bg-emerald-100 dark:bg-emerald-900/50">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-emerald-600 dark:text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="mt-2">
              <p className="display-md">{platformStats.totalRevenue}</p>
              <div className="mt-3">
                <div className="flex items-center space-x-1">
                  <span className="flex items-center text-green-600 dark:text-green-500">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                    <span className="text-sm font-medium ml-1">8%</span>
                  </span>
                  <span className="text-secondary-sm">vs last month</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5 mt-3">
                  <div className="bg-emerald-600 h-1.5 rounded-full" style={{ width: '8%' }}></div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="overflow-hidden border-none bg-purple-50 dark:bg-purple-950/40 hover:shadow-xl transition-all duration-300">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="heading-sm">Active Users</CardTitle>
              <div className="p-2 rounded-full bg-purple-100 dark:bg-purple-900/50">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-purple-600 dark:text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="mt-2">
              <p className="display-md">{platformStats.activeUsers}</p>
              <div className="mt-3">
                <div className="flex items-center space-x-1">
                  <span className="flex items-center text-green-600 dark:text-green-500">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                    <span className="text-sm font-medium ml-1">5%</span>
                  </span>
                  <span className="text-secondary-sm">vs last month</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5 mt-3">
                  <div className="bg-purple-600 h-1.5 rounded-full" style={{ width: '5%' }}></div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* System Health */}
      <Card className="overflow-hidden border-none bg-background-secondary">
        <CardHeader className="pb-2">
          <CardTitle className="heading-md text-text-secondary mb-4">System Health</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div>
              <h3 className="text-secondary-md font-medium">Server Status</h3>
              <p className="text-md mt-1">
                <span className={`inline-block w-2 h-2 rounded-full mr-2 ${
                  systemHealth.serverStatus === 'Operational' ? 'bg-green-500' : 'bg-red-500'
                }`}></span>
                {systemHealth.serverStatus}
              </p>
            </div>
            <div>
              <h3 className="text-secondary-md font-medium">Uptime</h3>
              <p className="text-md mt-1">{systemHealth.uptime}</p>
            </div>
            <div>
              <h3 className="text-secondary-md font-medium">Response Time</h3>
              <p className="text-md mt-1">{systemHealth.responseTime}</p>
            </div>
            <div>
              <h3 className="text-secondary-md font-medium">Active Connections</h3>
              <p className="text-md mt-1">{systemHealth.activeConnections}</p>
            </div>
            <div>
              <h3 className="text-secondary-md font-medium">CPU Usage</h3>
              <div className="mt-1">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full" 
                    style={{ width: systemHealth.cpuUsage }}
                  ></div>
                </div>
                <p className="text-sm mt-1">{systemHealth.cpuUsage}</p>
              </div>
            </div>
            <div>
              <h3 className="text-secondary-md font-medium">Memory Usage</h3>
              <div className="mt-1">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-purple-600 h-2 rounded-full" 
                    style={{ width: systemHealth.memoryUsage }}
                  ></div>
                </div>
                <p className="text-sm mt-1">{systemHealth.memoryUsage}</p>
              </div>
            </div>
            <div>
              <h3 className="text-secondary-md font-medium">Storage Used</h3>
              <div className="mt-1">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-yellow-600 h-2 rounded-full" 
                    style={{ width: systemHealth.storageUsed }}
                  ></div>
                </div>
                <p className="text-sm mt-1">{systemHealth.storageUsed}</p>
              </div>
            </div>
            <div>
              <h3 className="text-secondary-md font-medium">Last Backup</h3>
              <p className="text-md mt-1">{systemHealth.lastBackup}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
} 