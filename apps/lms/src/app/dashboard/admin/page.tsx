'use client';

import { useState, useEffect } from 'react';
import { adminService } from '@/services/adminService';

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
              <span className="text-green-600 text-sm">↑ 8% this month</span>
            </div>
          </div>
        </div>
        <div className="card p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center space-x-3">
            <span className="text-3xl">📈</span>
            <div>
              <h3 className="text-sm font-medium text-text-secondary">Active Users</h3>
              <p className="text-2xl font-bold text-text-primary mt-1">{platformStats.activeUsers}</p>
              <span className="text-green-600 text-sm">↑ 5% this month</span>
            </div>
          </div>
        </div>
      </div>

      {/* System Health */}
      <div className="card p-6 mt-6">
        <h2 className="text-lg font-semibold mb-4">System Health</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div>
            <h3 className="text-sm font-medium text-text-secondary">Server Status</h3>
            <p className="text-lg font-semibold mt-1">
              <span className={`inline-block w-2 h-2 rounded-full mr-2 ${
                systemHealth.serverStatus === 'Operational' ? 'bg-green-500' : 'bg-red-500'
              }`}></span>
              {systemHealth.serverStatus}
            </p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-text-secondary">Uptime</h3>
            <p className="text-lg font-semibold mt-1">{systemHealth.uptime}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-text-secondary">Response Time</h3>
            <p className="text-lg font-semibold mt-1">{systemHealth.responseTime}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-text-secondary">Active Connections</h3>
            <p className="text-lg font-semibold mt-1">{systemHealth.activeConnections}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-text-secondary">CPU Usage</h3>
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
            <h3 className="text-sm font-medium text-text-secondary">Memory Usage</h3>
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
            <h3 className="text-sm font-medium text-text-secondary">Storage Used</h3>
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
            <h3 className="text-sm font-medium text-text-secondary">Last Backup</h3>
            <p className="text-lg font-semibold mt-1">{systemHealth.lastBackup}</p>
          </div>
        </div>
      </div>
    </>
  );
} 