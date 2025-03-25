import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { 
  LineChart, 
  Line, 
  BarChart, 
  Bar, 
  AreaChart, 
  Area,
  PieChart, 
  Pie, 
  Cell,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';
import { Download, FileText, BarChart2, PieChart as PieChartIcon, TrendingUp } from 'lucide-react';

// Mock data
const mockUserGrowth = [
  { name: 'Jan', Users: 120 },
  { name: 'Feb', Users: 140 },
  { name: 'Mar', Users: 180 },
  { name: 'Apr', Users: 205 },
  { name: 'May', Users: 245 },
  { name: 'Jun', Users: 280 },
  { name: 'Jul', Users: 320 },
  { name: 'Aug', Users: 350 },
  { name: 'Sep', Users: 370 },
  { name: 'Oct', Users: 390 },
  { name: 'Nov', Users: 400 },
  { name: 'Dec', Users: 420 },
];

const mockRevenueData = [
  { name: 'Jan', Revenue: 15000 },
  { name: 'Feb', Revenue: 17500 },
  { name: 'Mar', Revenue: 19000 },
  { name: 'Apr', Revenue: 22400 },
  { name: 'May', Revenue: 24100 },
  { name: 'Jun', Revenue: 27800 },
  { name: 'Jul', Revenue: 29300 },
  { name: 'Aug', Revenue: 31500 },
  { name: 'Sep', Revenue: 33400 },
  { name: 'Oct', Revenue: 35200 },
  { name: 'Nov', Revenue: 36900 },
  { name: 'Dec', Revenue: 39500 },
];

const mockUserTypes = [
  { name: 'Students', value: 65 },
  { name: 'Teachers', value: 20 },
  { name: 'School Admins', value: 10 },
  { name: 'Super Admins', value: 5 },
];

const mockEngagementData = [
  { name: 'Mon', Logins: 450, Sessions: 380, PageViews: 2400 },
  { name: 'Tue', Logins: 520, Sessions: 430, PageViews: 2800 },
  { name: 'Wed', Logins: 540, Sessions: 450, PageViews: 3100 },
  { name: 'Thu', Logins: 480, Sessions: 410, PageViews: 2700 },
  { name: 'Fri', Logins: 460, Sessions: 390, PageViews: 2500 },
  { name: 'Sat', Logins: 350, Sessions: 300, PageViews: 1800 },
  { name: 'Sun', Logins: 320, Sessions: 280, PageViews: 1600 },
];

const mockCoursePerformance = [
  { name: 'Advanced Math', Enrollments: 142, Completions: 89, AvgRating: 4.7 },
  { name: 'Physics 101', Enrollments: 118, Completions: 76, AvgRating: 4.5 },
  { name: 'Computer Science', Enrollments: 156, Completions: 102, AvgRating: 4.8 },
  { name: 'Biology', Enrollments: 98, Completions: 67, AvgRating: 4.3 },
  { name: 'Chemistry', Enrollments: 104, Completions: 72, AvgRating: 4.4 },
  { name: 'Literature', Enrollments: 87, Completions: 54, AvgRating: 4.2 },
  { name: 'History', Enrollments: 92, Completions: 63, AvgRating: 4.6 },
];

// Colors for charts
const COLORS = ['#4f46e5', '#06b6d4', '#16a34a', '#eab308', '#ef4444'];

export function AnalyticsCommand() {
  const [timeRange, setTimeRange] = useState('30days');
  const [activeTab, setActiveTab] = useState('overview');
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold">Platform Analytics</h2>
          <p className="text-muted-foreground">
            Insights and trends across the learning platform
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Time Period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7days">Last 7 days</SelectItem>
              <SelectItem value="30days">Last 30 days</SelectItem>
              <SelectItem value="90days">Last quarter</SelectItem>
              <SelectItem value="365days">Last year</SelectItem>
              <SelectItem value="all">All time</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="icon" className="h-9 w-9">
            <Download className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="growth">Growth</TabsTrigger>
          <TabsTrigger value="engagement">Engagement</TabsTrigger>
          <TabsTrigger value="courses">Course Performance</TabsTrigger>
        </TabsList>
        
        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          {/* Key Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* User Growth Chart */}
            <Card className="lg:col-span-2">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg font-semibold">User Growth</CardTitle>
                    <CardDescription>New user registrations over time</CardDescription>
                  </div>
                  <TrendingUp className="h-5 w-5 text-green-500" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={mockUserGrowth}>
                      <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="Users"
                        name="Users"
                        stroke={COLORS[0]}
                        activeDot={{ r: 8 }}
                        strokeWidth={2}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* User Distribution */}
            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg font-semibold">User Distribution</CardTitle>
                    <CardDescription>By role</CardDescription>
                  </div>
                  <PieChartIcon className="h-5 w-5 text-indigo-500" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="h-72 flex items-center justify-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={mockUserTypes}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        label={(entry) => entry.name}
                      >
                        {mockUserTypes.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => [`${value}%`, 'Percentage']} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Revenue analytics */}
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg font-semibold">Revenue Analytics</CardTitle>
                  <CardDescription>Platform revenue by period</CardDescription>
                </div>
                <BarChart2 className="h-5 w-5 text-green-500" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={mockRevenueData}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`$${value}`, 'Revenue']} />
                    <Legend />
                    <Bar 
                      dataKey="Revenue" 
                      name="Revenue" 
                      fill={COLORS[1]} 
                      radius={[4, 4, 0, 0]} 
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Growth Tab */}
        <TabsContent value="growth" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold">User Acquisition Trends</CardTitle>
              <CardDescription>Monthly user growth and retention rates</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-96">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={mockUserGrowth}>
                    <defs>
                      <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={COLORS[0]} stopOpacity={0.8}/>
                        <stop offset="95%" stopColor={COLORS[0]} stopOpacity={0.1}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Area 
                      type="monotone" 
                      dataKey="Users" 
                      stroke={COLORS[0]} 
                      fillOpacity={1} 
                      fill="url(#colorUsers)" 
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Engagement Tab */}
        <TabsContent value="engagement" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Platform Engagement</CardTitle>
              <CardDescription>User activity and interaction metrics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-96">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={mockEngagementData}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                    <XAxis dataKey="name" />
                    <YAxis yAxisId="left" />
                    <YAxis yAxisId="right" orientation="right" />
                    <Tooltip />
                    <Legend />
                    <Line 
                      yAxisId="left"
                      type="monotone" 
                      dataKey="Logins" 
                      stroke={COLORS[0]} 
                      strokeWidth={2} 
                      dot={{ r: 4 }}
                    />
                    <Line 
                      yAxisId="left"
                      type="monotone" 
                      dataKey="Sessions" 
                      stroke={COLORS[1]}
                      strokeWidth={2} 
                      dot={{ r: 4 }}
                    />
                    <Line 
                      yAxisId="right"
                      type="monotone" 
                      dataKey="PageViews" 
                      stroke={COLORS[2]}
                      strokeWidth={2} 
                      dot={{ r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Course Performance Tab */}
        <TabsContent value="courses" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Course Performance</CardTitle>
              <CardDescription>Enrollments and completion rates by course</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-96">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={mockCoursePerformance}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                    <XAxis dataKey="name" />
                    <YAxis yAxisId="left" />
                    <YAxis yAxisId="right" orientation="right" domain={[0, 5]} />
                    <Tooltip />
                    <Legend />
                    <Bar 
                      yAxisId="left"
                      dataKey="Enrollments" 
                      fill={COLORS[0]} 
                      radius={[4, 4, 0, 0]} 
                    />
                    <Bar 
                      yAxisId="left"
                      dataKey="Completions" 
                      fill={COLORS[1]} 
                      radius={[4, 4, 0, 0]} 
                    />
                    <Line
                      yAxisId="right"
                      type="monotone"
                      dataKey="AvgRating"
                      stroke={COLORS[4]}
                      strokeWidth={2}
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