import { useState, useEffect } from 'react';
import { adminService } from '@/services';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { UserViewModel, ApiUser } from '@/types/admin';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  PlusCircle, 
  Search, 
  UserPlus, 
  UserCog, 
  Filter, 
  MoreVertical,
  Pencil,
  Ban,
  CheckCircle2,
  Trash2,
  AlertCircle,
  RefreshCcw,
  UserCheck,
  FileText,
  ChevronDown,
  Download
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function UsersTab() {
  const router = useRouter();
  const [users, setUsers] = useState<UserViewModel[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<UserViewModel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    // Apply filters whenever users, searchQuery or filters change
    filterUsers();
  }, [users, searchQuery, roleFilter, statusFilter]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const transformedUsers = await adminService.getUsers();
      setUsers(transformedUsers);
      setError(null);
    } catch (err) {
      setError('Failed to fetch users');
      console.error('Error fetching users:', err);
    } finally {
      setLoading(false);
    }
  };

  const filterUsers = () => {
    let result = [...users];
    
    // Apply search query filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(user => 
        user.firstName.toLowerCase().includes(query) || 
        user.lastName.toLowerCase().includes(query) || 
        user.email.toLowerCase().includes(query)
      );
    }
    
    // Apply role filter
    if (roleFilter !== 'all') {
      result = result.filter(user => user.role === roleFilter);
    }
    
    // Apply status filter
    if (statusFilter !== 'all') {
      const isActive = statusFilter === 'active';
      result = result.filter(user => user.isActive === isActive);
    }
    
    setFilteredUsers(result);
  };

  const handleToggleStatus = async (user: UserViewModel) => {
    try {
      if (user.isActive) {
        await adminService.suspendUser(user.id);
      } else {
        await adminService.reinstateUser(user.id);
      }
      fetchUsers();
    } catch (err) {
      setError('Failed to update user status');
      console.error('Error updating user status:', err);
    }
  };

  const handleEditUser = (user: UserViewModel) => {
    // Convert the view model back to API format for storage
    const apiUser: ApiUser = {
      id: user.id,
      email: user.email,
      first_name: user.firstName,
      last_name: user.lastName,
      role: user.role,
      school_id: user.schoolId,
      is_active: user.isActive,
      created_at: user.createdAt,
    };
    
    // Store the user data in localStorage for the edit page to use
    localStorage.setItem('editUser', JSON.stringify(apiUser));
    router.push(`/dashboard/admin/users/edit/${user.id}`);
  };

  const getRoleBadgeStyle = (role: string) => {
    switch (role) {
      case 'super_admin':
        return 'bg-violet-100 text-violet-800 dark:bg-violet-900/30 dark:text-violet-300 border-violet-200 dark:border-violet-800/30';
      case 'school_admin':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 border-blue-200 dark:border-blue-800/30';
      case 'teacher':
        return 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300 border-amber-200 dark:border-amber-800/30';
      case 'student':
        return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800/30';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800/30 dark:text-gray-300 border-gray-200 dark:border-gray-700/30';
    }
  };

  const formatRoleName = (role: string) => {
    return role.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };

  const renderUserName = (user: UserViewModel) => {
    const initials = `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`.toUpperCase();
    return (
      <div className="flex items-center gap-3">
        <div className={`flex items-center justify-center h-9 w-9 rounded-full text-xs font-medium ${
          user.isActive 
            ? 'bg-primary/10 text-primary' 
            : 'bg-muted text-muted-foreground'
        }`}>
          {initials}
        </div>
        <div>
          <div className="font-medium">{user.firstName} {user.lastName}</div>
          <div className="text-xs text-muted-foreground">{user.email}</div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-80 space-y-4">
        <RefreshCcw className="h-8 w-8 animate-spin text-primary" />
        <p className="text-muted-foreground">Loading users...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 dark:bg-red-900/20 dark:border-red-800/30 p-4 flex items-center gap-3 text-red-800 dark:text-red-300">
        <AlertCircle className="h-5 w-5" />
        <div>{error}</div>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={fetchUsers}
          className="ml-auto border-red-300 dark:border-red-800/30 text-red-800 dark:text-red-300 hover:bg-red-100 dark:hover:bg-red-900/30"
        >
          <RefreshCcw className="h-4 w-4 mr-2" />
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="heading-lg mb-1">Users Management</h2>
          <p className="text-muted-foreground">
            Manage users and their access to the platform
          </p>
        </div>
        <div className="flex items-center gap-3">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-2">
                <FileText className="h-4 w-4" />
                Export
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-popover border shadow-md">
              <DropdownMenuItem className="cursor-pointer">
                <Download className="mr-2 h-4 w-4" />
                Export as CSV
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer">
                <Download className="mr-2 h-4 w-4" />
                Export as Excel
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Link href="/dashboard/admin/users/add">
            <Button
              variant="default"
              size="default"
              className="gap-2"
            >
              <UserPlus className="h-4 w-4" />
              Add New User
            </Button>
          </Link>
        </div>
      </div>

      {/* Filters */}
      <Card className="border">
        <CardHeader className="pb-3">
          <CardTitle className="text-md font-medium flex items-center">
            <Filter className="h-4 w-4 mr-2" />
            Filters and Search
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search by name or email..."
                  className="pl-9"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            <div>
              <Select value={roleFilter} onValueChange={setRoleFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Roles</SelectItem>
                  <SelectItem value="super_admin">Super Admin</SelectItem>
                  <SelectItem value="school_admin">School Admin</SelectItem>
                  <SelectItem value="teacher">Teacher</SelectItem>
                  <SelectItem value="student">Student</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
        <CardFooter className="border-t bg-muted/50 flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            {filteredUsers.length} {filteredUsers.length === 1 ? 'user' : 'users'} found
          </div>
          {(searchQuery || roleFilter !== 'all' || statusFilter !== 'all') && (
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => {
                setSearchQuery('');
                setRoleFilter('all');
                setStatusFilter('all');
              }}
              className="text-muted-foreground hover:text-foreground"
            >
              Clear Filters
            </Button>
          )}
        </CardFooter>
      </Card>

      {/* Users Table */}
      <Card className="border overflow-hidden">
        <CardHeader className="bg-muted/30 pb-0">
          <CardTitle className="text-lg font-medium">User Accounts</CardTitle>
          <CardDescription>Manage platform users and their access levels</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="w-full overflow-auto">
            {filteredUsers.length > 0 ? (
              <Table>
                <TableHeader className="bg-muted/30">
                  <TableRow>
                    <TableHead className="font-medium">User</TableHead>
                    <TableHead className="font-medium">Role</TableHead>
                    <TableHead className="font-medium">Status</TableHead>
                    <TableHead className="font-medium text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.map((user) => (
                    <TableRow key={user.id} className="hover:bg-muted/50">
                      <TableCell>{renderUserName(user)}</TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={`px-2 py-1 font-normal border ${getRoleBadgeStyle(user.role)}`}
                        >
                          {formatRoleName(user.role)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <span
                            className={`inline-block h-2 w-2 rounded-full mr-2 ${
                              user.isActive ? 'bg-green-500' : 'bg-red-500'
                            }`}
                          />
                          <span className={user.isActive ? 'text-green-700 dark:text-green-400' : 'text-red-700 dark:text-red-400'}>
                            {user.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreVertical className="h-4 w-4" />
                              <span className="sr-only">Open menu</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="bg-popover border shadow-md">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem onClick={() => handleEditUser(user)}>
                              <Pencil className="h-4 w-4 mr-2" />
                              Edit user
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleToggleStatus(user)}>
                              {user.isActive ? (
                                <>
                                  <Ban className="h-4 w-4 mr-2 text-red-600" />
                                  <span className="text-red-600">Deactivate</span>
                                </>
                              ) : (
                                <>
                                  <UserCheck className="h-4 w-4 mr-2 text-green-600" />
                                  <span className="text-green-600">Activate</span>
                                </>
                              )}
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-red-600">
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete user
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="flex flex-col items-center justify-center p-8 text-center">
                <div className="rounded-full bg-muted p-3 mb-3">
                  <UserCog className="h-6 w-6 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-medium mb-1">No users found</h3>
                <p className="text-muted-foreground text-sm mb-4 max-w-md">
                  {searchQuery || roleFilter !== 'all' || statusFilter !== 'all'
                    ? "No users match your current filters. Try adjusting your search criteria."
                    : "No users have been added to the system yet."}
                </p>
                {searchQuery || roleFilter !== 'all' || statusFilter !== 'all' ? (
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setSearchQuery('');
                      setRoleFilter('all');
                      setStatusFilter('all');
                    }}
                  >
                    Clear filters
                  </Button>
                ) : (
                  <Link href="/dashboard/admin/users/add">
                    <Button>
                      <PlusCircle className="h-4 w-4 mr-2" />
                      Add your first user
                    </Button>
                  </Link>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 