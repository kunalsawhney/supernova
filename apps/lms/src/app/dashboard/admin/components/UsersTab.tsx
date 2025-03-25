'use client';

import React, { useState, useEffect } from 'react';
import { adminService } from '@/services';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { UserViewModel, ApiUser } from '@/types/admin';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  PlusCircle, 
  UserPlus, 
  UserCog, 
  FileText,
  ChevronDown,
  Download,
  AlertCircle,
  RefreshCcw,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DataTable } from '@/components/ui/data-table';
import { columns } from './columns';

export default function UsersTab() {
  const router = useRouter();
  const initialFetchRef = React.useRef(false);
  
  const [users, setUsers] = useState<UserViewModel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!initialFetchRef.current) {
      fetchUsers();
      initialFetchRef.current = true;
    }
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const transformedUsers = await adminService.getUsers();
      console.log('transformedUsers', transformedUsers);
      setUsers(transformedUsers);
      setError(null);
    } catch (err) {
      setError('Failed to fetch users');
      console.error('Error fetching users:', err);
      initialFetchRef.current = false; // Reset for retry
    } finally {
      setLoading(false);
    }
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

  // Set up filters for the data table
  const roleOptions = [
    { label: 'Super Admin', value: 'super_admin' },
    { label: 'School Admin', value: 'school_admin' },
    { label: 'Teacher', value: 'teacher' },
    { label: 'Student', value: 'student' },
  ];

  // Setup action handlers for the data table
  const actionHandlers = {
    onEdit: handleEditUser,
    onToggleStatus: handleToggleStatus,
  };

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

      {/* Users Table Card */}
      <Card className="border">
        <CardHeader className="bg-muted/30">
          <CardTitle className="text-lg font-medium">User Accounts</CardTitle>
          <CardDescription>Manage platform users and their access levels</CardDescription>
        </CardHeader>
        <CardContent>
          {users.length > 0 ? (
            <DataTable 
              columns={columns(actionHandlers)} 
              data={users}
              searchKey="name"
              searchPlaceholder="Search by name or email..."
              filters={[
                {
                  key: "role",
                  options: roleOptions,
                  placeholder: "Filter by role"
                },
                {
                  key: "isActive",
                  options: [
                    { label: "Active", value: "true" },
                    { label: "Inactive", value: "false" },
                  ],
                  placeholder: "Filter by status"
                }
              ]}
            />
          ) : (
            <div className="flex flex-col items-center justify-center p-8 text-center">
              <div className="rounded-full bg-muted p-3 mb-3">
                <UserCog className="h-6 w-6 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-medium mb-1">No users found</h3>
              <p className="text-muted-foreground text-sm mb-4 max-w-md">
                No users have been added to the system yet.
              </p>
              <Link href="/dashboard/admin/users/add">
                <Button>
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Add your first user
                </Button>
              </Link>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
} 