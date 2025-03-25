import { useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  UserPlus, 
  Users, 
  Search, 
  Filter, 
  MoreHorizontal, 
  ChevronRight,
  CheckCircle,
  XCircle,
  AlertTriangle
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

// Mock data
interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  status: 'active' | 'pending' | 'inactive';
  school?: string;
  createdAt: string;
  avatar?: string;
}

const mockRecentUsers: User[] = [
  {
    id: '1',
    name: 'Sarah Johnson',
    email: 'sarah.j@example.com',
    role: 'teacher',
    status: 'active',
    school: 'Westside Academy',
    createdAt: '2023-04-15',
    avatar: 'https://i.pravatar.cc/150?img=32'
  },
  {
    id: '2',
    name: 'Michael Chang',
    email: 'mchang@example.com',
    role: 'student',
    status: 'active',
    school: 'Eastside High',
    createdAt: '2023-04-14',
    avatar: 'https://i.pravatar.cc/150?img=69'
  },
  {
    id: '3',
    name: 'James Wilson',
    email: 'jwilson@example.com',
    role: 'school_admin',
    status: 'active',
    school: 'Lincoln High',
    createdAt: '2023-04-12',
    avatar: 'https://i.pravatar.cc/150?img=51'
  },
  {
    id: '4',
    name: 'Emma Davis',
    email: 'edavis@example.com',
    role: 'teacher',
    status: 'pending',
    school: 'Northern Middle School',
    createdAt: '2023-04-10'
  },
  {
    id: '5',
    name: 'Robert Lee',
    email: 'rlee@example.com',
    role: 'student',
    status: 'inactive',
    school: 'Westside Academy',
    createdAt: '2023-04-05'
  }
];

const mockUserStats = {
  total: 2450,
  active: 1890,
  pending: 124,
  inactive: 436,
  roleBreakdown: {
    students: 1840,
    teachers: 320,
    schoolAdmins: 280,
    superAdmins: 10
  }
};

export function UserManagementHub() {
  const [users, setUsers] = useState<User[]>(mockRecentUsers);
  const [stats, setStats] = useState(mockUserStats);
  const [isLoading, setIsLoading] = useState(false);
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return (
          <Badge variant="outline" className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 border-green-200 dark:border-green-800/30 flex items-center gap-1">
            <CheckCircle className="h-3 w-3" />
            Active
          </Badge>
        );
      case 'pending':
        return (
          <Badge variant="outline" className="bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300 border-amber-200 dark:border-amber-800/30 flex items-center gap-1">
            <AlertTriangle className="h-3 w-3" />
            Pending
          </Badge>
        );
      case 'inactive':
        return (
          <Badge variant="outline" className="bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300 border-red-200 dark:border-red-800/30 flex items-center gap-1">
            <XCircle className="h-3 w-3" />
            Inactive
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };
  
  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'super_admin':
        return <Badge className="bg-violet-100 text-violet-800 dark:bg-violet-900/30 dark:text-violet-300 border-violet-200 dark:border-violet-800/30">Super Admin</Badge>;
      case 'school_admin':
        return <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 border-blue-200 dark:border-blue-800/30">School Admin</Badge>;
      case 'teacher':
        return <Badge className="bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300 border-amber-200 dark:border-amber-800/30">Teacher</Badge>;
      case 'student':
        return <Badge className="bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800/30">Student</Badge>;
      default:
        return <Badge>{role}</Badge>;
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold">User Management</h2>
          <p className="text-muted-foreground">Manage and monitor user accounts</p>
        </div>
        
        <div className="flex items-center gap-2">
          <Button size="sm" variant="outline" className="flex items-center gap-2">
            <Search className="h-4 w-4" />
            Search
          </Button>
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4" />
          </Button>
          <Button className="flex items-center gap-2">
            <UserPlus className="h-4 w-4" />
            Add User
          </Button>
        </div>
      </div>
      
      {/* User Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="py-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Users</CardTitle>
          </CardHeader>
          <CardContent className="py-0">
            <div className="text-3xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="py-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Active Users</CardTitle>
          </CardHeader>
          <CardContent className="py-0">
            <div className="text-3xl font-bold text-green-600 dark:text-green-400">{stats.active}</div>
            <div className="text-xs text-muted-foreground mt-1">
              {Math.round((stats.active / stats.total) * 100)}% of total users
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="py-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Pending Approval</CardTitle>
          </CardHeader>
          <CardContent className="py-0">
            <div className="text-3xl font-bold text-amber-600 dark:text-amber-400">{stats.pending}</div>
            <div className="text-xs text-muted-foreground mt-1">
              {Math.round((stats.pending / stats.total) * 100)}% of total users
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="py-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Inactive Users</CardTitle>
          </CardHeader>
          <CardContent className="py-0">
            <div className="text-3xl font-bold text-red-600 dark:text-red-400">{stats.inactive}</div>
            <div className="text-xs text-muted-foreground mt-1">
              {Math.round((stats.inactive / stats.total) * 100)}% of total users
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Recent Users */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-lg font-semibold">Recent Users</CardTitle>
              <CardDescription>Latest user activity and registrations</CardDescription>
            </div>
            <Link href="/dashboard/admin/users">
              <Button variant="ghost" size="sm" className="gap-1">
                View All
                <ChevronRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-3 text-sm font-medium text-muted-foreground">User</th>
                  <th className="text-left p-3 text-sm font-medium text-muted-foreground">Role</th>
                  <th className="text-left p-3 text-sm font-medium text-muted-foreground">School</th>
                  <th className="text-left p-3 text-sm font-medium text-muted-foreground">Status</th>
                  <th className="text-left p-3 text-sm font-medium text-muted-foreground">Created</th>
                  <th className="text-right p-3 text-sm font-medium text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id} className="border-b hover:bg-muted/50 transition-colors">
                    <td className="p-3">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={user.avatar} alt={user.name} />
                          <AvatarFallback>{user.name.charAt(0)}{user.name.split(' ')[1]?.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{user.name}</div>
                          <div className="text-sm text-muted-foreground">{user.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="p-3">{getRoleBadge(user.role)}</td>
                    <td className="p-3 text-sm">{user.school || '-'}</td>
                    <td className="p-3">{getStatusBadge(user.status)}</td>
                    <td className="p-3 text-sm">{user.createdAt}</td>
                    <td className="p-3 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem>View Profile</DropdownMenuItem>
                          <DropdownMenuItem>Edit User</DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-red-600 dark:text-red-400">
                            Deactivate
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
      
      {/* Role Distribution */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">User Role Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="flex flex-col items-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{stats.roleBreakdown.students}</div>
              <div className="font-medium mt-1">Students</div>
              <div className="text-xs text-muted-foreground mt-1">
                {Math.round((stats.roleBreakdown.students / stats.total) * 100)}% of total
              </div>
            </div>
            
            <div className="flex flex-col items-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-amber-600 dark:text-amber-400">{stats.roleBreakdown.teachers}</div>
              <div className="font-medium mt-1">Teachers</div>
              <div className="text-xs text-muted-foreground mt-1">
                {Math.round((stats.roleBreakdown.teachers / stats.total) * 100)}% of total
              </div>
            </div>
            
            <div className="flex flex-col items-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{stats.roleBreakdown.schoolAdmins}</div>
              <div className="font-medium mt-1">School Admins</div>
              <div className="text-xs text-muted-foreground mt-1">
                {Math.round((stats.roleBreakdown.schoolAdmins / stats.total) * 100)}% of total
              </div>
            </div>
            
            <div className="flex flex-col items-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-violet-600 dark:text-violet-400">{stats.roleBreakdown.superAdmins}</div>
              <div className="font-medium mt-1">Super Admins</div>
              <div className="text-xs text-muted-foreground mt-1">
                {Math.round((stats.roleBreakdown.superAdmins / stats.total) * 100)}% of total
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 