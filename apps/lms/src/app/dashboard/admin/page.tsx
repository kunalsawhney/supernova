'use client';

import { useState, useEffect } from 'react';
import { adminService } from '@/services/adminService';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  ChartContainer,
} from '@/components/ui/chart';
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
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
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
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = () => {
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
    <div className="space-y-8">
      {/* Dashboard Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="heading-lg mb-1">Admin Dashboard</h1>
          <p className="text-secondary-md">Platform overview and system management</p>
        </div>
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
              <p className="display-md">{platformStats.totalUsers.toLocaleString()}</p>
              <div className="mt-3">
                <div className="flex items-center space-x-1">
                  <span className="flex items-center text-green-600 dark:text-green-500">
                    <ArrowUpIcon className="h-4 w-4" />
                    <span className="text-sm font-medium ml-1">15%</span>
                  </span>
                  <span className="text-secondary-sm">vs last month</span>
                </div>
                <div className="w-full bg-blue-200 dark:bg-blue-800/50 rounded-full h-1.5 mt-3">
                  <div className="bg-blue-600 h-1.5 rounded-full" style={{ width: '15%' }}></div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Schools Stat */}
        <Card className="overflow-hidden border-none shadow-md bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-950/40 dark:to-amber-900/20 hover:shadow-xl transition-all duration-300">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="heading-sm">Partner Schools</CardTitle>
              <div className="p-2 rounded-full bg-amber-100 dark:bg-amber-900/50 text-amber-600 dark:text-amber-400">
                <School className="h-5 w-5" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="mt-2">
              <p className="display-md">{platformStats.totalSchools}</p>
              <div className="mt-3">
                <div className="flex items-center space-x-1">
                  <span className="flex items-center text-green-600 dark:text-green-500">
                    <ArrowUpIcon className="h-4 w-4" />
                    <span className="text-sm font-medium ml-1">3</span>
                  </span>
                  <span className="text-secondary-sm">new this month</span>
                </div>
                <div className="w-full bg-amber-200 dark:bg-amber-800/50 rounded-full h-1.5 mt-3">
                  <div className="bg-amber-600 h-1.5 rounded-full" style={{ width: '10%' }}></div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Revenue Stat */}
        <Card className="overflow-hidden border-none shadow-md bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-950/40 dark:to-emerald-900/20 hover:shadow-xl transition-all duration-300">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="heading-sm">Total Revenue</CardTitle>
              <div className="p-2 rounded-full bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-400">
                <DollarSign className="h-5 w-5" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="mt-2">
              <p className="display-md">{platformStats.totalRevenue}</p>
              <div className="mt-3">
                <div className="flex items-center space-x-1">
                  <span className="flex items-center text-green-600 dark:text-green-500">
                    <ArrowUpIcon className="h-4 w-4" />
                    <span className="text-sm font-medium ml-1">8%</span>
                  </span>
                  <span className="text-secondary-sm">vs last month</span>
                </div>
                <div className="w-full bg-emerald-200 dark:bg-emerald-800/50 rounded-full h-1.5 mt-3">
                  <div className="bg-emerald-600 h-1.5 rounded-full" style={{ width: '8%' }}></div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Active Users Stat */}
        <Card className="overflow-hidden border-none shadow-md bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950/40 dark:to-purple-900/20 hover:shadow-xl transition-all duration-300">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="heading-sm">Active Users</CardTitle>
              <div className="p-2 rounded-full bg-purple-100 dark:bg-purple-900/50 text-purple-600 dark:text-purple-400">
                <Activity className="h-5 w-5" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="mt-2">
              <p className="display-md">{platformStats.activeUsers}</p>
              <div className="mt-3">
                <div className="flex items-center space-x-1">
                  <span className="flex items-center text-green-600 dark:text-green-500">
                    <ArrowUpIcon className="h-4 w-4" />
                    <span className="text-sm font-medium ml-1">5%</span>
                  </span>
                  <span className="text-secondary-sm">vs last month</span>
                </div>
                <div className="w-full bg-purple-200 dark:bg-purple-800/50 rounded-full h-1.5 mt-3">
                  <div className="bg-purple-600 h-1.5 rounded-full" style={{ width: '5%' }}></div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts & Activity Tabs */}
      <Tabs defaultValue="analytics" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="system">System Health</TabsTrigger>
          <TabsTrigger value="activity">Recent Activity</TabsTrigger>
        </TabsList>
        
        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* User Growth Chart */}
            <Card className="lg:col-span-2 border shadow-sm">
              <CardHeader>
                <CardTitle>User Growth</CardTitle>
                <CardDescription>New user registrations over time</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ChartContainer
                    config={chartConfig}
                    className="aspect-auto h-full w-full"
                  >
                    <LineChart data={userGrowthData}>
                      <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="Users"
                        name="Users"
                        stroke="var(--color-secondary)"
                        activeDot={{ r: 8 }}
                        strokeWidth={2}
                      />
                    </LineChart>
                  </ChartContainer>
                </div>
              </CardContent>
            </Card>

            {/* User Distribution */}
            <Card className="border shadow-sm">
              <CardHeader>
                <CardTitle>User Distribution</CardTitle>
                <CardDescription>By role type</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={userTypesData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        // label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {userTypesData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Revenue Chart */}
            <Card className="lg:col-span-3 border shadow-sm">
              <CardHeader>
                <CardTitle>Revenue Overview</CardTitle>
                <CardDescription>Monthly revenue in USD</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ChartContainer
                    config={chartConfig}
                    className="aspect-auto h-full w-full"
                  >
                    <BarChart data={revenueData}>
                      <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar 
                        dataKey="Revenue" 
                        name="Revenue"
                        fill="var(--color-primary)" 
                        radius={[4, 4, 0, 0]} 
                      />
                    </BarChart>
                  </ChartContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        {/* System Health Tab */}
        <TabsContent value="system" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Server Status */}
            <Card className="border shadow-sm">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Server Status</CardTitle>
                  {systemHealth.serverStatus === 'Operational' || systemHealth.serverStatus === 'healthy' ? (
                    <Badge variant="outline" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">
                      <CheckCircle2 className="h-3 w-3 mr-1" />
                      Operational
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100">
                      <AlertCircle className="h-3 w-3 mr-1" />
                      {systemHealth.serverStatus}
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span className="text-secondary-md">Uptime</span>
                  </div>
                  <span className="font-medium">{systemHealth.uptime}</span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Zap className="h-4 w-4 text-muted-foreground" />
                    <span className="text-secondary-md">Response Time</span>
                  </div>
                  <span className="font-medium">{systemHealth.responseTime}</span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span className="text-secondary-md">Active Connections</span>
                  </div>
                  <span className="font-medium">{systemHealth.activeConnections}</span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-secondary-md">Last Backup</span>
                  </div>
                  <span className="font-medium">
                    {new Date(systemHealth.lastBackup).toLocaleDateString()}
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Resource Usage */}
            <Card className="md:col-span-2 border shadow-sm">
              <CardHeader>
                <CardTitle>Resource Usage</CardTitle>
              </CardHeader>
              <CardContent className="space-y-8">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-secondary-md font-medium">CPU Usage</span>
                    <span className="font-bold">{systemHealth.cpuUsage}</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                    <div 
                      className={`h-2.5 rounded-full ${
                        getCpuUsageValue() > 80 ? 'bg-red-500' : 
                        getCpuUsageValue() > 50 ? 'bg-yellow-500' : 'bg-green-500'
                      }`}
                      style={{ width: systemHealth.cpuUsage }}
                    ></div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-secondary-md font-medium">Memory Usage</span>
                    <span className="font-bold">{systemHealth.memoryUsage}</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                    <div 
                      className={`h-2.5 rounded-full ${
                        getMemoryUsageValue() > 80 ? 'bg-red-500' : 
                        getMemoryUsageValue() > 50 ? 'bg-yellow-500' : 'bg-green-500'
                      }`}
                      style={{ width: systemHealth.memoryUsage }}
                    ></div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-secondary-md font-medium">Storage Used</span>
                    <span className="font-bold">{systemHealth.storageUsed}</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                    <div 
                      className={`h-2.5 rounded-full ${
                        getStorageUsedValue() > 80 ? 'bg-red-500' : 
                        getStorageUsedValue() > 50 ? 'bg-yellow-500' : 'bg-green-500'
                      }`}
                      style={{ width: systemHealth.storageUsed }}
                    ></div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        {/* Activity Tab */}
        <TabsContent value="activity" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Recent Activity */}
            <Card className="md:col-span-2 border shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Latest platform events</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivityData.map((activity) => (
                    <div 
                      key={activity.id} 
                      className="flex items-start py-3 px-4 hover:bg-background-secondary rounded-md transition-colors duration-200"
                    >
                      <div className="h-2 w-2 bg-primary rounded-full mt-2 mr-3"></div>
                      <div className="flex-1">
                        <div className="flex justify-between">
                          <p className="font-medium text-md">{activity.event}</p>
                          <span className="text-secondary-sm">{activity.time}</span>
                        </div>
                        <p className="text-secondary-sm">{activity.user}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter className="pt-2">
                <Button variant="ghost" size="sm" className="ml-auto flex items-center gap-1">
                  View All
                  <ArrowRight className="h-3 w-3" />
                </Button>
              </CardFooter>
            </Card>

            {/* Tasks */}
            <Card className="border shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle>Upcoming Tasks</CardTitle>
                <CardDescription>Tasks requiring attention</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-1">
                  {upcomingTasks.map((task) => (
                    <div 
                      key={task.id} 
                      className="flex items-start p-3 border-b border-border/30 last:border-0"
                    >
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <p className="font-medium text-md">{task.task}</p>
                          <Badge 
                            variant="outline" 
                            className={
                              task.priority === 'high' ? 'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300' :
                              task.priority === 'medium' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-300' :
                              'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300'
                            }
                          >
                            {task.priority}
                          </Badge>
                        </div>
                        <p className="text-secondary-sm">{task.dueDate}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter className="pt-2">
                <Button variant="ghost" size="sm" className="ml-auto flex items-center gap-1">
                  View All Tasks
                  <ArrowRight className="h-3 w-3" />
                </Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
} 