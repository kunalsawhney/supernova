import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  LineChart, 
  Line, 
  BarChart, 
  Bar, 
  AreaChart, 
  Area,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';
import { 
  Server, 
  Clock, 
  Zap, 
  HardDrive, 
  Database, 
  RefreshCcw,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Globe,
  Activity
} from 'lucide-react';

// Mock data
interface SystemHealth {
  serverStatus: 'operational' | 'degraded' | 'offline';
  uptime: string;
  responseTime: string;
  activeConnections: number;
  cpuUsage: string;
  memoryUsage: string;
  storageUsed: string;
  lastBackup: string;
}

const mockSystemHealth: SystemHealth = {
  serverStatus: 'operational',
  uptime: '99.98%',
  responseTime: '145ms',
  activeConnections: 248,
  cpuUsage: '38%',
  memoryUsage: '42%',
  storageUsed: '67%',
  lastBackup: '2023-04-18 03:15 AM'
};

// Mock data for CPU usage over time
const mockCpuUsageHistory = [
  { time: '00:00', usage: 32 },
  { time: '01:00', usage: 25 },
  { time: '02:00', usage: 18 },
  { time: '03:00', usage: 15 },
  { time: '04:00', usage: 14 },
  { time: '05:00', usage: 17 },
  { time: '06:00', usage: 22 },
  { time: '07:00', usage: 30 },
  { time: '08:00', usage: 42 },
  { time: '09:00', usage: 55 },
  { time: '10:00', usage: 58 },
  { time: '11:00', usage: 62 },
  { time: '12:00', usage: 65 },
  { time: '13:00', usage: 61 },
  { time: '14:00', usage: 58 },
  { time: '15:00', usage: 60 },
  { time: '16:00', usage: 62 },
  { time: '17:00', usage: 58 },
  { time: '18:00', usage: 52 },
  { time: '19:00', usage: 48 },
  { time: '20:00', usage: 44 },
  { time: '21:00', usage: 40 },
  { time: '22:00', usage: 35 },
  { time: '23:00', usage: 30 },
];

// Mock data for memory usage over time
const mockMemoryUsageHistory = [
  { time: '00:00', usage: 38 },
  { time: '01:00', usage: 38 },
  { time: '02:00', usage: 37 },
  { time: '03:00', usage: 37 },
  { time: '04:00', usage: 36 },
  { time: '05:00', usage: 36 },
  { time: '06:00', usage: 37 },
  { time: '07:00', usage: 38 },
  { time: '08:00', usage: 42 },
  { time: '09:00', usage: 45 },
  { time: '10:00', usage: 48 },
  { time: '11:00', usage: 52 },
  { time: '12:00', usage: 54 },
  { time: '13:00', usage: 53 },
  { time: '14:00', usage: 52 },
  { time: '15:00', usage: 54 },
  { time: '16:00', usage: 56 },
  { time: '17:00', usage: 52 },
  { time: '18:00', usage: 48 },
  { time: '19:00', usage: 46 },
  { time: '20:00', usage: 44 },
  { time: '21:00', usage: 42 },
  { time: '22:00', usage: 40 },
  { time: '23:00', usage: 38 },
];

// Mock data for server response time over time
const mockResponseTimeHistory = [
  { time: '00:00', responseTime: 120 },
  { time: '01:00', responseTime: 115 },
  { time: '02:00', responseTime: 110 },
  { time: '03:00', responseTime: 105 },
  { time: '04:00', responseTime: 108 },
  { time: '05:00', responseTime: 112 },
  { time: '06:00', responseTime: 118 },
  { time: '07:00', responseTime: 125 },
  { time: '08:00', responseTime: 145 },
  { time: '09:00', responseTime: 165 },
  { time: '10:00', responseTime: 170 },
  { time: '11:00', responseTime: 175 },
  { time: '12:00', responseTime: 180 },
  { time: '13:00', responseTime: 170 },
  { time: '14:00', responseTime: 165 },
  { time: '15:00', responseTime: 175 },
  { time: '16:00', responseTime: 180 },
  { time: '17:00', responseTime: 165 },
  { time: '18:00', responseTime: 155 },
  { time: '19:00', responseTime: 145 },
  { time: '20:00', responseTime: 140 },
  { time: '21:00', responseTime: 135 },
  { time: '22:00', responseTime: 130 },
  { time: '23:00', responseTime: 125 },
];

// Mock data for API endpoints
const mockApiEndpoints = [
  { name: '/api/courses', responseTime: 125, successRate: 99.8, requests: 5284 },
  { name: '/api/users', responseTime: 145, successRate: 99.9, requests: 4217 },
  { name: '/api/enrollments', responseTime: 165, successRate: 99.7, requests: 3528 },
  { name: '/api/auth', responseTime: 95, successRate: 99.9, requests: 8756 },
  { name: '/api/schools', responseTime: 138, successRate: 99.8, requests: 2164 },
  { name: '/api/content', responseTime: 180, successRate: 99.5, requests: 4873 },
  { name: '/api/analytics', responseTime: 210, successRate: 99.6, requests: 1843 },
];

export function SystemHealthMonitor() {
  const [systemHealth, setSystemHealth] = useState<SystemHealth>(mockSystemHealth);
  const [isLoading, setIsLoading] = useState(false);
  
  const handleRefresh = () => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  };
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'operational':
        return (
          <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 border-green-200 dark:border-green-800/30 flex items-center gap-1">
            <CheckCircle2 className="h-3 w-3" />
            Operational
          </Badge>
        );
      case 'degraded':
        return (
          <Badge className="bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300 border-amber-200 dark:border-amber-800/30 flex items-center gap-1">
            <AlertTriangle className="h-3 w-3" />
            Degraded
          </Badge>
        );
      case 'offline':
        return (
          <Badge className="bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300 border-red-200 dark:border-red-800/30 flex items-center gap-1">
            <XCircle className="h-3 w-3" />
            Offline
          </Badge>
        );
      default:
        return <Badge>{status}</Badge>;
    }
  };
  
  const getProgressColor = (percentage: number) => {
    if (percentage < 50) return 'bg-green-600';
    if (percentage < 75) return 'bg-amber-500';
    return 'bg-red-600';
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">System Health</h2>
          <p className="text-muted-foreground">
            Monitor server performance and resource utilization
          </p>
        </div>
        <Button 
          onClick={handleRefresh} 
          variant="outline" 
          size="sm"
          className="flex items-center gap-2"
          disabled={isLoading}
        >
          <RefreshCcw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          {isLoading ? 'Refreshing...' : 'Refresh'}
        </Button>
      </div>
      
      {/* System Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="py-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium">Server Status</CardTitle>
              <Server className="h-5 w-5 text-primary" />
            </div>
          </CardHeader>
          <CardContent className="py-1">
            <div className="flex justify-between items-center">
              {getStatusBadge(systemHealth.serverStatus)}
              <span className="text-sm text-muted-foreground">
                Uptime: {systemHealth.uptime}
              </span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="py-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium">Response Time</CardTitle>
              <Clock className="h-5 w-5 text-primary" />
            </div>
          </CardHeader>
          <CardContent className="py-1">
            <div className="flex justify-between items-center">
              <span className="text-2xl font-bold">{systemHealth.responseTime}</span>
              <span className="text-sm text-muted-foreground">
                Avg. response time
              </span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="py-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium">Active Connections</CardTitle>
              <Globe className="h-5 w-5 text-primary" />
            </div>
          </CardHeader>
          <CardContent className="py-1">
            <div className="flex justify-between items-center">
              <span className="text-2xl font-bold">{systemHealth.activeConnections}</span>
              <span className="text-sm text-muted-foreground">
                Current users
              </span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="py-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium">Last Backup</CardTitle>
              <Database className="h-5 w-5 text-primary" />
            </div>
          </CardHeader>
          <CardContent className="py-1">
            <div className="text-sm text-muted-foreground">
              {systemHealth.lastBackup}
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Resource Utilization */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Resource Utilization</CardTitle>
          <CardDescription>Current server resource consumption</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Zap className="h-4 w-4 text-amber-500" />
                <span className="font-medium">CPU Usage</span>
              </div>
              <span>{systemHealth.cpuUsage}</span>
            </div>
            <Progress 
              value={parseInt(systemHealth.cpuUsage)} 
              className={getProgressColor(parseInt(systemHealth.cpuUsage))}
            />
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Activity className="h-4 w-4 text-blue-500" />
                <span className="font-medium">Memory Usage</span>
              </div>
              <span>{systemHealth.memoryUsage}</span>
            </div>
            <Progress 
              value={parseInt(systemHealth.memoryUsage)} 
              className={getProgressColor(parseInt(systemHealth.memoryUsage))}
            />
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <HardDrive className="h-4 w-4 text-purple-500" />
                <span className="font-medium">Storage Used</span>
              </div>
              <span>{systemHealth.storageUsed}</span>
            </div>
            <Progress 
              value={parseInt(systemHealth.storageUsed)} 
              className={getProgressColor(parseInt(systemHealth.storageUsed))}
            />
          </div>
        </CardContent>
      </Card>
      
      <Tabs defaultValue="usage">
        <TabsList className="mb-4">
          <TabsTrigger value="usage">Usage Trends</TabsTrigger>
          <TabsTrigger value="api">API Performance</TabsTrigger>
        </TabsList>
        
        {/* Usage Trends Tab */}
        <TabsContent value="usage" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-semibold">CPU Usage (24 Hours)</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={mockCpuUsageHistory}>
                      <defs>
                        <linearGradient id="colorCpu" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.8}/>
                          <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.1}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                      <XAxis dataKey="time" />
                      <YAxis domain={[0, 100]} />
                      <Tooltip formatter={(value) => `${value}%`} />
                      <Area 
                        type="monotone" 
                        dataKey="usage" 
                        name="CPU Usage"
                        stroke="#f59e0b" 
                        fillOpacity={1} 
                        fill="url(#colorCpu)" 
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-semibold">Memory Usage (24 Hours)</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={mockMemoryUsageHistory}>
                      <defs>
                        <linearGradient id="colorMemory" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                          <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                      <XAxis dataKey="time" />
                      <YAxis domain={[0, 100]} />
                      <Tooltip formatter={(value) => `${value}%`} />
                      <Area 
                        type="monotone" 
                        dataKey="usage" 
                        name="Memory Usage"
                        stroke="#3b82f6" 
                        fillOpacity={1} 
                        fill="url(#colorMemory)" 
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Response Time (24 Hours)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={mockResponseTimeHistory}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                    <XAxis dataKey="time" />
                    <YAxis />
                    <Tooltip formatter={(value) => `${value}ms`} />
                    <Line
                      type="monotone"
                      dataKey="responseTime"
                      name="Response Time"
                      stroke="#10b981"
                      strokeWidth={2}
                      dot={{ r: 3 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* API Performance Tab */}
        <TabsContent value="api" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold">API Endpoint Performance</CardTitle>
              <CardDescription>Response times and success rates by endpoint</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-3 text-sm font-medium text-muted-foreground">Endpoint</th>
                      <th className="text-left p-3 text-sm font-medium text-muted-foreground">Response Time</th>
                      <th className="text-left p-3 text-sm font-medium text-muted-foreground">Success Rate</th>
                      <th className="text-left p-3 text-sm font-medium text-muted-foreground">Requests (24h)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mockApiEndpoints.map((endpoint, index) => (
                      <tr key={index} className="border-b hover:bg-muted/50 transition-colors">
                        <td className="p-3">
                          <div className="font-medium">{endpoint.name}</div>
                        </td>
                        <td className="p-3">
                          <div className={`font-medium ${
                            endpoint.responseTime < 130 
                              ? 'text-green-600 dark:text-green-400' 
                              : endpoint.responseTime < 180 
                                ? 'text-amber-600 dark:text-amber-400' 
                                : 'text-red-600 dark:text-red-400'
                          }`}>
                            {endpoint.responseTime}ms
                          </div>
                        </td>
                        <td className="p-3">
                          <div className={`font-medium ${
                            endpoint.successRate > 99.8 
                              ? 'text-green-600 dark:text-green-400' 
                              : endpoint.successRate > 99.5 
                                ? 'text-amber-600 dark:text-amber-400' 
                                : 'text-red-600 dark:text-red-400'
                          }`}>
                            {endpoint.successRate}%
                          </div>
                        </td>
                        <td className="p-3">
                          <div className="font-medium">{endpoint.requests.toLocaleString()}</div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold">API Response Times</CardTitle>
              <CardDescription>Average response time by endpoint (ms)</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={mockApiEndpoints} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                    <XAxis type="number" />
                    <YAxis type="category" dataKey="name" width={150} />
                    <Tooltip formatter={(value) => `${value}ms`} />
                    <Bar 
                      dataKey="responseTime" 
                      name="Response Time" 
                      fill="#3b82f6" 
                      radius={[0, 4, 4, 0]} 
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
} 