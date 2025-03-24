'use client';

import { useState, useEffect, useRef } from 'react';
import { adminService } from '@/services/adminService';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  RadialBarChart,
  RadialBar
} from 'recharts';
import { 
  ArrowUpIcon, 
  ArrowDownIcon, 
  RefreshCcw, 
  Users, 
  School, 
  DollarSign, 
  Activity, 
  Server, 
  Clock, 
  Zap, 
  HardDrive, 
  Database, 
  Calendar,
  AlertCircle,
  CheckCircle2,
  ArrowRight
} from 'lucide-react';

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

// Sample recent activity data
const recentActivityData = [
  { id: 1, event: 'New school registered', time: '2 hours ago', user: 'Westside Academy' },
  { id: 2, event: 'New course published', time: '5 hours ago', user: 'Advanced Chemistry' },
  { id: 3, event: 'User profile updated', time: '1 day ago', user: 'James Wilson' },
  { id: 4, event: 'School subscription renewed', time: '2 days ago', user: 'Lincoln High' },
  { id: 5, event: 'System backup completed', time: '3 days ago', user: 'Automated Task' },
];

// Sample upcoming tasks
const upcomingTasks = [
  { id: 1, task: 'Review new course submissions', dueDate: 'Today', priority: 'high' },
  { id: 2, task: 'Approve teacher accounts', dueDate: 'Tomorrow', priority: 'medium' },
  { id: 3, task: 'School license renewals', dueDate: 'In 3 days', priority: 'medium' },
  { id: 4, task: 'System maintenance', dueDate: 'Next week', priority: 'low' },
];

// User growth data formatted for Recharts
const userGrowthData = [
  { name: 'Jan', Users: 120 },
  { name: 'Feb', Users: 140 },
  { name: 'Mar', Users: 180 },
  { name: 'Apr', Users: 205 },
  { name: 'May', Users: 245 },
  { name: 'Jun', Users: 280 },
];

// Revenue data formatted for Recharts
const revenueData = [
  { name: 'Jan', Revenue: 15000 },
  { name: 'Feb', Revenue: 17500 },
  { name: 'Mar', Revenue: 19000 },
  { name: 'Apr', Revenue: 22400 },
  { name: 'May', Revenue: 24100 },
  { name: 'Jun', Revenue: 27800 },
];

// User types data formatted for Recharts
const userTypesData = [
  { name: 'Students', value: 65 },
  { name: 'Teachers', value: 20 },
  { name: 'School Admins', value: 10 },
  { name: 'Super Admins', value: 5 },
];

// Chart colors config
const chartConfig = {
  users: {
    label: "Users",
    color: "var(--color-secondary)"
  },
  revenue: {
    label: "Revenue",
    color: "var(--color-primary)"
  },
};

export function AdminDashboard() {
  const initialFetchRef = useRef(false);
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
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!initialFetchRef.current) {
      fetchDashboardData();
      initialFetchRef.current = true;
    }
  }, []);

  const fetchDashboardData = async () => {
    setIsLoading(true);
    try {
      const stats = await adminService.getPlatformStats();
      setPlatformStats(stats);

      const health = await adminService.getSystemHealth();
      setSystemHealth(health);
    } catch (error) {
      console.error('Error fetching admin dashboard data:', error);
      initialFetchRef.current = false; // Reset for retry
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = () => {
    initialFetchRef.current = false;
    fetchDashboardData();
  };

  // Convert string percentages to numbers for progress bars
  const getCpuUsageValue = () => {
    return parseInt(systemHealth.cpuUsage) || 0;
  };
  
  const getMemoryUsageValue = () => {
    return parseInt(systemHealth.memoryUsage) || 0;
  };
  
  const getStorageUsedValue = () => {
    return parseInt(systemHealth.storageUsed) || 0;
  };

  // Custom pie colors
  const COLORS = ['#219ebc', '#fb8500', '#ffb703', '#17C964'];

  return (
    <div className="space-y-8 w-full overflow-x-hidden" style={{ border: 'none', borderRight: 'none' }}>
      {/* Admin Control Row */}
      <div className="flex justify-end">
        <Button 
          onClick={handleRefresh} 
          variant="outline" 
          size="sm"
          className="flex items-center gap-2"
        >
          <RefreshCcw className="h-4 w-4" />
          Refresh Data
        </Button>
      </div>

      {/* Platform Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* User Stat */}
        <Card className="overflow-hidden border-none shadow-md bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/40 dark:to-blue-900/20 hover:shadow-xl transition-all duration-300">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="heading-sm">Total Users</CardTitle>
              <div className="p-2 rounded-full bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400">
                <Users className="h-5 w-5" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="mt-2">
              <p className="text-3xl font-bold">{platformStats.totalUsers.toLocaleString()}</p>
              <div className="mt-3">
                <div className="flex items-center gap-1">
                  <Badge variant="default" className="bg-green-500 hover:bg-green-600 gap-1">
                    <ArrowUpIcon className="h-3 w-3" />
                    <span>24%</span>
                  </Badge>
                  <span className="text-sm text-muted-foreground">vs. last month</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Schools Stat */}
        <Card className="overflow-hidden border-none shadow-md bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950/40 dark:to-purple-900/20 hover:shadow-xl transition-all duration-300">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="heading-sm">Total Schools</CardTitle>
              <div className="p-2 rounded-full bg-purple-100 dark:bg-purple-900/50 text-purple-600 dark:text-purple-400">
                <School className="h-5 w-5" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="mt-2">
              <p className="text-3xl font-bold">{platformStats.totalSchools.toLocaleString()}</p>
              <div className="mt-3">
                <div className="flex items-center gap-1">
                  <Badge variant="default" className="bg-green-500 hover:bg-green-600 gap-1">
                    <ArrowUpIcon className="h-3 w-3" />
                    <span>12%</span>
                  </Badge>
                  <span className="text-sm text-muted-foreground">vs. last month</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Revenue Stat */}
        <Card className="overflow-hidden border-none shadow-md bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950/40 dark:to-green-900/20 hover:shadow-xl transition-all duration-300">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="heading-sm">Total Revenue</CardTitle>
              <div className="p-2 rounded-full bg-green-100 dark:bg-green-900/50 text-green-600 dark:text-green-400">
                <DollarSign className="h-5 w-5" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="mt-2">
              <p className="text-3xl font-bold">{platformStats.totalRevenue}</p>
              <div className="mt-3">
                <div className="flex items-center gap-1">
                  <Badge variant="default" className="bg-green-500 hover:bg-green-600 gap-1">
                    <ArrowUpIcon className="h-3 w-3" />
                    <span>18%</span>
                  </Badge>
                  <span className="text-sm text-muted-foreground">vs. last month</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Active Users Stat */}
        <Card className="overflow-hidden border-none shadow-md bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-950/40 dark:to-amber-900/20 hover:shadow-xl transition-all duration-300">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="heading-sm">Active Users</CardTitle>
              <div className="p-2 rounded-full bg-amber-100 dark:bg-amber-900/50 text-amber-600 dark:text-amber-400">
                <Activity className="h-5 w-5" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="mt-2">
              <p className="text-3xl font-bold">{platformStats.activeUsers}</p>
              <div className="mt-3">
                <div className="flex items-center gap-1">
                  <Badge variant="default" className="bg-green-500 hover:bg-green-600 gap-1">
                    <ArrowUpIcon className="h-3 w-3" />
                    <span>5%</span>
                  </Badge>
                  <span className="text-sm text-muted-foreground">vs. last month</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>User Growth</CardTitle>
            <CardDescription>Monthly new user registrations</CardDescription>
          </CardHeader>
          <CardContent>
            <div style={{ height: '250px', width: '100%' }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={userGrowthData}>
                  <defs>
                    <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={chartConfig.users.color} stopOpacity={0.8}/>
                      <stop offset="95%" stopColor={chartConfig.users.color} stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Area 
                    type="monotone" 
                    dataKey="Users" 
                    stroke={chartConfig.users.color} 
                    fillOpacity={1} 
                    fill="url(#colorUsers)" 
                    name={chartConfig.users.label}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Revenue</CardTitle>
            <CardDescription>Monthly revenue in USD</CardDescription>
          </CardHeader>
          <CardContent>
            <div style={{ height: '250px', width: '100%' }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`$${value}`, 'Revenue']} />
                  <Bar 
                    dataKey="Revenue" 
                    fill={chartConfig.revenue.color} 
                    name={chartConfig.revenue.label}
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Activity and Tasks */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest events on the platform</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivityData.map((activity) => (
                <div key={activity.id} className="flex items-start gap-2 pb-3 border-b border-border last:border-0 last:pb-0">
                  <div className="h-9 w-9 flex items-center justify-center rounded-full bg-primary/10 text-primary">
                    <Activity className="h-5 w-5" />
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
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Upcoming Tasks</CardTitle>
            <CardDescription>Items that need your attention</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingTasks.map((task) => (
                <div key={task.id} className="flex items-start gap-2 pb-3 border-b border-border last:border-0 last:pb-0">
                  <div className={`
                    h-9 w-9 flex items-center justify-center rounded-full 
                    ${task.priority === 'high' ? 'bg-red-100 text-red-600 dark:bg-red-900/20 dark:text-red-400' : 
                      task.priority === 'medium' ? 'bg-amber-100 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400' : 
                      'bg-blue-100 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400'}
                  `}>
                    {task.priority === 'high' ? 
                      <AlertCircle className="h-5 w-5" /> : 
                      <Clock className="h-5 w-5" />
                    }
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground">{task.task}</p>
                    <div className="flex items-center text-xs text-muted-foreground mt-1">
                      <span>Due: {task.dueDate}</span>
                      <span className="mx-2">•</span>
                      <span className="capitalize">{task.priority} priority</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 