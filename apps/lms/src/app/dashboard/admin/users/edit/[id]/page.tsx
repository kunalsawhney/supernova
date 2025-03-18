'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { adminService } from '@/services';
import { ApiUser, UserViewModel } from '@/types/admin';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { 
  ArrowLeft, 
  AlertCircle, 
  UserCog, 
  School, 
  Save, 
  Trash2, 
  Loader2 
} from 'lucide-react';
import { Label } from '@/components/ui/label';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from '@/components/ui/badge';

export default function EditUserPage() {
  const router = useRouter();
  const params = useParams();
  const userId = params.id as string;
  
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    first_name: '',
    last_name: '',
    role: 'student',
    school_id: '',
    is_active: true,
  });

  useEffect(() => {
    // Load user data from localStorage
    const storedUser = localStorage.getItem('editUser');
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser) as ApiUser;
        if (user.id === userId) {
          setFormData({
            email: user.email || '',
            first_name: user.first_name || '',
            last_name: user.last_name || '',
            role: user.role || 'student',
            school_id: user.school_id || '',
            is_active: user.is_active,
          });
          setInitialLoading(false);
        } else {
          // If user ID doesn't match, fetch from API
          fetchUser();
        }
      } catch (err) {
        console.error('Error parsing stored user:', err);
        setError('Failed to load user data');
        fetchUser();
      }
    } else {
      // If no stored user, fetch from API
      fetchUser();
    }
  }, [userId]);

  const fetchUser = async () => {
    try {
      setInitialLoading(true);
      const user = await adminService.getUser(userId);
      // Convert from UserViewModel to form data format
      setFormData({
        email: user.email || '',
        first_name: user.firstName || '',
        last_name: user.lastName || '',
        role: user.role || 'student',
        school_id: user.schoolId || '',
        is_active: user.isActive,
      });
    } catch (err) {
      console.error('Error fetching user:', err);
      setError('Failed to fetch user data');
    } finally {
      setInitialLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await adminService.updateUser(userId, {
        first_name: formData.first_name,
        last_name: formData.last_name,
        role: formData.role,
        school_id: formData.school_id || undefined,
      });
      router.push('/dashboard/admin/users');
    } catch (err: any) {
      setError(err.message || 'Failed to update user');
      console.error('Error updating user:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async () => {
    try {
      setDeleteLoading(true);
      await adminService.deleteUser(userId);
      router.push('/dashboard/admin/users');
    } catch (err) {
      console.error('Error deleting user:', err);
      setError('Failed to delete user');
      setShowDeleteModal(false);
    } finally {
      setDeleteLoading(false);
    }
  };

  const formatRoleName = (role: string) => {
    return role.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
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

  if (initialLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-80 space-y-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-muted-foreground">Loading user data...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="heading-lg mb-1">Edit User</h2>
          <p className="text-muted-foreground">
            Modify user information and access rights
          </p>
        </div>
        <Button
          variant="outline"
          onClick={() => router.push('/dashboard/admin/users')}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Users
        </Button>
      </div>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 dark:bg-red-900/20 dark:border-red-800/30 p-4 flex items-center gap-3 text-red-800 dark:text-red-300">
          <AlertCircle className="h-5 w-5 flex-shrink-0" />
          <div>{error}</div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* User Profile Card */}
        <Card className="border shadow-sm lg:col-span-1">
          <CardHeader className="pb-3">
            <CardTitle className="text-md font-medium">User Profile</CardTitle>
            <CardDescription>Basic information</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center space-y-4">
            <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center text-primary text-2xl font-medium">
              {formData.first_name.charAt(0)}{formData.last_name.charAt(0)}
            </div>
            <div className="text-center">
              <h3 className="font-medium text-lg">{formData.first_name} {formData.last_name}</h3>
              <p className="text-sm text-muted-foreground">{formData.email}</p>
            </div>
            <Badge
              variant="outline"
              className={`px-2 py-1 font-normal border ${getRoleBadgeStyle(formData.role)}`}
            >
              {formatRoleName(formData.role)}
            </Badge>
            <Badge
              variant={formData.is_active ? "default" : "destructive"}
              className={`mt-1 ${formData.is_active ? "bg-green-500 hover:bg-green-600" : ""}`}
            >
              {formData.is_active ? 'Active' : 'Inactive'}
            </Badge>
          </CardContent>
          <CardFooter className="flex flex-col border-t p-4 space-y-2">
            <Button 
              variant="destructive" 
              size="sm" 
              className="w-full" 
              onClick={() => setShowDeleteModal(true)}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete User
            </Button>
          </CardFooter>
        </Card>

        {/* Edit Form Card */}
        <Card className="border shadow-sm lg:col-span-3">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-xl">
              <UserCog className="h-5 w-5" />
              Edit User Information
            </CardTitle>
            <CardDescription>
              Update user details and access rights
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form id="edit-user-form" onSubmit={handleSubmit} className="space-y-6">
              {/* Personal Information */}
              <div className="space-y-4">
                <h3 className="text-md font-medium">Personal Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="first_name" className="font-medium">
                      First Name <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="first_name"
                type="text"
                value={formData.first_name}
                onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                required
              />
            </div>
                  <div className="space-y-2">
                    <Label htmlFor="last_name" className="font-medium">
                      Last Name <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="last_name"
                type="text"
                value={formData.last_name}
                onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                required
              />
                  </div>
            </div>
          </div>

              {/* Account Information */}
              <div className="space-y-4">
                <h3 className="text-md font-medium">Account Information</h3>
                <div className="space-y-2">
                  <Label htmlFor="email" className="font-medium">
                    Email Address <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
                    disabled
                    className="opacity-70"
            />
                  <p className="text-xs text-muted-foreground">
                    Email address cannot be changed
                  </p>
                </div>
          </div>

              {/* Role & School */}
              <div className="space-y-4">
                <h3 className="text-md font-medium">Role & Access</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="role" className="font-medium">
                      User Role <span className="text-red-500">*</span>
                    </Label>
                    <Select 
              value={formData.role}
                      onValueChange={(value) => setFormData({ ...formData, role: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a role" />
                      </SelectTrigger>
                      <SelectContent className="bg-popover border shadow-md">
                        <SelectItem value="student">Student</SelectItem>
                        <SelectItem value="teacher">Teacher</SelectItem>
                        <SelectItem value="school_admin">School Admin</SelectItem>
                        <SelectItem value="super_admin">Super Admin</SelectItem>
                      </SelectContent>
                    </Select>
          </div>
                  <div className="space-y-2">
                    <Label htmlFor="school_id" className="font-medium">
                      School ID
                    </Label>
                    <div className="relative">
                      <School className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="school_id"
              type="text"
                        value={formData.school_id || ''}
              onChange={(e) => setFormData({ ...formData, school_id: e.target.value })}
                        placeholder="Optional school identifier"
                        className="pl-10"
            />
          </div>
                    <p className="text-xs text-muted-foreground">
                      Leave empty if not associated with a specific school
                    </p>
                  </div>
                </div>
              </div>
            </form>
          </CardContent>
          <CardFooter className="flex justify-end border-t p-6 bg-muted/30">
            <Button
              type="submit"
              form="edit-user-form"
              disabled={loading}
              className="flex items-center gap-2"
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              {loading ? 'Saving Changes...' : 'Save Changes'}
            </Button>
          </CardFooter>
        </Card>
      </div>

      {/* Delete Confirmation Modal */}
      <AlertDialog open={showDeleteModal} onOpenChange={setShowDeleteModal}>
        <AlertDialogContent className="bg-background border shadow-md">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete User</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this user? This action cannot be undone and will permanently remove the user account and all associated data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleteLoading}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={(e: React.MouseEvent) => {
                e.preventDefault();
                handleDeleteUser();
              }}
                disabled={deleteLoading}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleteLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Deleting...
                </>
              ) : (
                <>
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete User
                </>
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
} 