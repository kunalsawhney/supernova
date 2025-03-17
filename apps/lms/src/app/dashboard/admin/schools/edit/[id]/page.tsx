'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { adminService } from '@/services/adminService';
import { SchoolViewModel } from '@/types/school';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { ArrowLeft, Building, Calendar, Check, Save, School, Trash2, UserCog, Users } from 'lucide-react';

type SubscriptionStatus = 'trial' | 'active' | 'expired' | 'cancelled' | 'past_due';

interface School {
  id: string;
  name: string;
  code: string;
  domain: string;
  description?: string;
  contactEmail: string;
  contactPhone?: string;
  timezone: string;
  address?: string;
  subscriptionStatus: SubscriptionStatus;
  maxStudents: number;
  maxTeachers: number;
  createdAt: string;
  updatedAt: string;
}

export default function EditSchoolPage() {
  const router = useRouter();
  const params = useParams();
  const schoolId = params.id as string;
  
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showSuspendModal, setShowSuspendModal] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [toggleStatusLoading, setToggleStatusLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    domain: '',
    description: '',
    contactEmail: '',
    contactPhone: '',
    timezone: 'UTC',
    address: '',
    subscriptionStatus: 'trial' as SubscriptionStatus,
    maxStudents: 100,
    maxTeachers: 10,
    settings: {},
  });

  useEffect(() => {
    // Load school data from localStorage
    const storedSchool = localStorage.getItem('editSchool');
    if (storedSchool) {
      try {
        const school = JSON.parse(storedSchool) as School;
        if (school.id === schoolId) {
          setFormData({
            name: school.name || '',
            code: school.code || '',
            domain: school.domain || '',
            description: school.description || '',
            contactEmail: school.contactEmail || '',
            contactPhone: school.contactPhone || '',
            timezone: school.timezone || 'UTC',
            address: school.address || '',
            subscriptionStatus: school.subscriptionStatus || 'trial',
            maxStudents: school.maxStudents || 100,
            maxTeachers: school.maxTeachers || 10,
            settings: {},
          });
        }
      } catch (err) {
        console.error('Error parsing stored school:', err);
        setError('Failed to load school data');
      }
    } else {
      // If no stored school, fetch from API
      fetchSchool();
    }
  }, [schoolId]);

  const fetchSchool = async () => {
    try {
      setLoading(true);
      const school = await adminService.getSchool(schoolId);
      setFormData({
        name: school.name || '',
        code: school.code || '',
        domain: school.domain || '',
        description: school.description || '',
        contactEmail: school.contactEmail || '',
        contactPhone: school.contactPhone || '',
        timezone: school.timezone || 'UTC',
        address: school.address || '',
        subscriptionStatus: school.subscriptionStatus || 'trial',
        maxStudents: school.maxStudents || 100,
        maxTeachers: school.maxTeachers || 10,
        settings: school.settings || {},
      });
    } catch (err) {
      console.error('Error fetching school:', err);
      setError('Failed to fetch school data');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await adminService.updateSchool(schoolId, formData);
      router.push('/dashboard/admin/schools');
    } catch (err: any) {
      const errorMessage = err.response?.data?.detail || 'Failed to update school';
      setError(errorMessage);
      console.error('Error updating school:', err.response?.data || err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteSchool = async () => {
    try {
      setDeleteLoading(true);
      await adminService.deleteSchool(schoolId);
      router.push('/dashboard/admin/schools');
    } catch (err) {
      console.error('Error deleting school:', err);
      setError('Failed to delete school');
      setShowDeleteModal(false);
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleToggleStatus = async () => {
    try {
      setToggleStatusLoading(true);
      if (formData.subscriptionStatus === 'cancelled') {
        await adminService.updateSchool(schoolId, {
          subscription_status: 'active'
        });
        setFormData({ ...formData, subscriptionStatus: 'active' });
      } else {
        await adminService.updateSchool(schoolId, {
          subscription_status: 'cancelled'
        });
        setFormData({ ...formData, subscriptionStatus: 'cancelled' });
      }
      setShowSuspendModal(false);
    } catch (err) {
      console.error('Error toggling school status:', err);
      setError('Failed to update school status');
    } finally {
      setToggleStatusLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusBadge = (status: SubscriptionStatus) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Active</Badge>;
      case 'trial':
        return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">Trial</Badge>;
      case 'past_due':
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Past Due</Badge>;
      case 'expired':
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Expired</Badge>;
      case 'cancelled':
        return <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100">Cancelled</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  if (loading && !formData.name) {
    return (
      <Card className="mt-6">
        <CardContent className="pt-6">
          <div className="flex flex-col items-center justify-center space-y-3 py-12">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
            <p className="text-sm text-muted-foreground">Loading school data...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h2 className="text-3xl font-bold tracking-tight">Edit School</h2>
          <p className="text-muted-foreground">
            Update information for {formData.name}
          </p>
        </div>
        <Button 
          variant="outline" 
          onClick={() => router.push('/dashboard/admin/schools')}
          className="gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Schools
        </Button>
      </div>

      {error && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <div className="text-red-700">
              <p className="font-medium">Error</p>
              <p>{error}</p>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* School Profile Card */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <School className="h-5 w-5" />
              School Profile
            </CardTitle>
            <CardDescription>
              ID: {schoolId}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex justify-center">
              <div className="h-24 w-24 rounded-full bg-primary/10 flex items-center justify-center">
                <Building className="h-12 w-12 text-primary" />
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="text-center">
                <h3 className="text-xl font-semibold">{formData.name}</h3>
                <p className="text-sm text-muted-foreground">{formData.code}</p>
              </div>
              
              <div className="flex items-center justify-center">
                {getStatusBadge(formData.subscriptionStatus)}
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Domain:</span>
                  <span className="font-medium">{formData.domain}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Students:</span>
                  <span className="font-medium">{formData.maxStudents}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Teachers:</span>
                  <span className="font-medium">{formData.maxTeachers}</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <Button 
                variant="outline" 
                className="justify-start gap-2 text-muted-foreground"
                onClick={() => router.push(`/dashboard/admin/schools/${schoolId}/students`)}
              >
                <Users className="h-4 w-4" />
                View Students
              </Button>
              <Button 
                variant="outline" 
                className="justify-start gap-2 text-muted-foreground"
                onClick={() => router.push(`/dashboard/admin/schools/${schoolId}/teachers`)}
              >
                <UserCog className="h-4 w-4" />
                View Teachers
              </Button>
              {formData.subscriptionStatus !== 'cancelled' ? (
                <Button 
                  variant="outline" 
                  className="justify-start gap-2 text-yellow-600 border-yellow-200"
                  onClick={() => setShowSuspendModal(true)}
                >
                  <span className="h-4 w-4 rounded-full border border-yellow-600 flex items-center justify-center">
                    ⊘
                  </span>
                  Suspend School
                </Button>
              ) : (
                <Button 
                  variant="outline" 
                  className="justify-start gap-2 text-green-600 border-green-200"
                  onClick={() => setShowSuspendModal(true)}
                >
                  <Check className="h-4 w-4" />
                  Reactivate School
                </Button>
              )}
              <Button 
                variant="outline" 
                className="justify-start gap-2 text-red-600 border-red-200"
                onClick={() => setShowDeleteModal(true)}
              >
                <Trash2 className="h-4 w-4" />
                Delete School
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* School Details Form */}
        <div className="space-y-6 lg:col-span-2">
          <form onSubmit={handleSubmit}>
            {/* Basic Information */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
                <CardDescription>
                  Core details about this school
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="name">School Name</Label>
                    <Input
                      id="name"
                      placeholder="Enter school name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="code">School Code</Label>
                    <Input
                      id="code"
                      placeholder="Enter school code"
                      value={formData.code}
                      onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="domain">Domain</Label>
                    <Input
                      id="domain"
                      placeholder="example.edu"
                      value={formData.domain}
                      onChange={(e) => setFormData({ ...formData, domain: e.target.value })}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="timezone">Timezone</Label>
                    <Select
                      value={formData.timezone}
                      onValueChange={(value) => setFormData({ ...formData, timezone: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select timezone" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectItem value="UTC">UTC</SelectItem>
                          <SelectItem value="America/New_York">Eastern Time (ET)</SelectItem>
                          <SelectItem value="America/Chicago">Central Time (CT)</SelectItem>
                          <SelectItem value="America/Denver">Mountain Time (MT)</SelectItem>
                          <SelectItem value="America/Los_Angeles">Pacific Time (PT)</SelectItem>
                          <SelectItem value="Asia/Kolkata">Indian Standard Time (IST)</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <textarea
                    id="description"
                    placeholder="Brief description of the school"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Contact Information */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
                <CardDescription>
                  How to reach this institution
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="contactEmail">Contact Email</Label>
                    <Input
                      id="contactEmail"
                      type="email"
                      placeholder="contact@school.edu"
                      value={formData.contactEmail}
                      onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="contactPhone">Contact Phone</Label>
                    <Input
                      id="contactPhone"
                      type="tel"
                      placeholder="+1 (555) 123-4567"
                      value={formData.contactPhone}
                      onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <textarea
                    id="address"
                    placeholder="Physical address"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Subscription Details */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Subscription Details</CardTitle>
                <CardDescription>
                  Service plan and capacity limits
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                  <div className="space-y-2">
                    <Label htmlFor="subscriptionStatus">Status</Label>
                    <Select
                      value={formData.subscriptionStatus}
                      onValueChange={(value) => setFormData({ ...formData, subscriptionStatus: value as SubscriptionStatus })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectItem value="trial">Trial</SelectItem>
                          <SelectItem value="active">Active</SelectItem>
                          <SelectItem value="expired">Expired</SelectItem>
                          <SelectItem value="cancelled">Cancelled</SelectItem>
                          <SelectItem value="past_due">Past Due</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="maxStudents">Max Students</Label>
                    <Input
                      id="maxStudents"
                      type="number"
                      min="1"
                      value={formData.maxStudents}
                      onChange={(e) => setFormData({ ...formData, maxStudents: parseInt(e.target.value) || 0 })}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="maxTeachers">Max Teachers</Label>
                    <Input
                      id="maxTeachers"
                      type="number"
                      min="1"
                      value={formData.maxTeachers}
                      onChange={(e) => setFormData({ ...formData, maxTeachers: parseInt(e.target.value) || 0 })}
                      required
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-end space-x-4">
              <Button
                variant="outline"
                type="button"
                onClick={() => router.push('/dashboard/admin/schools')}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={loading}
                className="gap-2"
              >
                {loading ? (
                  <>
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent"></div>
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    Save Changes
                  </>
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>

      {/* Delete School Modal */}
      <AlertDialog open={showDeleteModal} onOpenChange={setShowDeleteModal}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete <strong>{formData.name}</strong> and all of its data.
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleteLoading}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteSchool}
              disabled={deleteLoading}
              className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
            >
              {deleteLoading ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent mr-2"></div>
                  Deleting...
                </>
              ) : (
                'Delete School'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Suspend/Reactivate School Modal */}
      <AlertDialog open={showSuspendModal} onOpenChange={setShowSuspendModal}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {formData.subscriptionStatus !== 'cancelled'
                ? 'Suspend this school?'
                : 'Reactivate this school?'}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {formData.subscriptionStatus !== 'cancelled'
                ? `This will suspend ${formData.name}'s subscription and prevent access to the platform. Users will not be able to log in.`
                : `This will reactivate ${formData.name}'s subscription and restore access to the platform.`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={toggleStatusLoading}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleToggleStatus}
              disabled={toggleStatusLoading}
              className={formData.subscriptionStatus !== 'cancelled'
                ? "bg-yellow-600 hover:bg-yellow-700 focus:ring-yellow-600"
                : "bg-green-600 hover:bg-green-700 focus:ring-green-600"
              }
            >
              {toggleStatusLoading ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent mr-2"></div>
                  Processing...
                </>
              ) : (
                formData.subscriptionStatus !== 'cancelled'
                  ? 'Suspend School'
                  : 'Reactivate School'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
} 