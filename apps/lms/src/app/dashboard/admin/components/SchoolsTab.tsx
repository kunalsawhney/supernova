'use client';

import React, { useState, useEffect } from 'react';
import { adminService } from '@/services/adminService';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { 
  AlertCircle, 
  Building, 
  ChevronDown, 
  Download, 
  FileText, 
  Plus, 
  RefreshCcw,
} from 'lucide-react';
import { DataTable } from '@/components/ui/data-table';
import { columns, School, SchoolActionHandlers } from './school-columns';

export default function SchoolsTab() {
  const router = useRouter();
  const initialFetchRef = React.useRef(false);
  
  const [schools, setSchools] = useState<School[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedSchool, setSelectedSchool] = useState<School | null>(null);

  useEffect(() => {
    if (!initialFetchRef.current) {
      fetchSchools();
      initialFetchRef.current = true;
    }
  }, []);

  const fetchSchools = async () => {
    try {
      setLoading(true);
      const data = await adminService.getSchools();
      setSchools(data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch schools');
      console.error('Error fetching schools:', err);
      initialFetchRef.current = false; // Reset for retry
    } finally {
      setLoading(false);
    }
  };

  const handleEditSchool = (school: School) => {
    // Store the school data in localStorage for the edit page to use
    localStorage.setItem('editSchool', JSON.stringify(school));
    router.push(`/dashboard/admin/schools/edit/${school.id}`);
  };

  const handleDeleteSchool = async () => {
    if (!selectedSchool) return;
    
    try {
      await adminService.deleteSchool(selectedSchool.id);
      setShowDeleteDialog(false);
      fetchSchools(); // Refresh the list
    } catch (err) {
      setError('Failed to delete school');
      console.error('Error deleting school:', err);
    }
  };

  const confirmDelete = (school: School) => {
    setSelectedSchool(school);
    setShowDeleteDialog(true);
  };

  const handleViewStudents = (school: School) => {
    router.push(`/dashboard/admin/schools/${school.id}/students`);
  };

  const handleViewTeachers = (school: School) => {
    router.push(`/dashboard/admin/schools/${school.id}/teachers`);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-80 space-y-4">
        <RefreshCcw className="h-8 w-8 animate-spin text-primary" />
        <p className="text-muted-foreground">Loading schools...</p>
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
          onClick={fetchSchools}
          className="ml-auto border-red-300 dark:border-red-800/30 text-red-800 dark:text-red-300 hover:bg-red-100 dark:hover:bg-red-900/30"
        >
          <RefreshCcw className="h-4 w-4 mr-2" />
          Retry
        </Button>
      </div>
    );
  }

  // Setup action handlers for the data table
  const actionHandlers: SchoolActionHandlers = {
    onEdit: handleEditSchool,
    onDelete: confirmDelete,
    onViewStudents: handleViewStudents,
    onViewTeachers: handleViewTeachers,
  };

  // Setup status filter options
  const statusOptions = [
    { label: 'Active', value: 'active' },
    { label: 'Trial', value: 'trial' },
    { label: 'Past Due', value: 'past_due' },
    { label: 'Expired', value: 'expired' },
    { label: 'Cancelled', value: 'cancelled' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="heading-lg mb-1">Schools Management</h2>
          <p className="text-muted-foreground">
            Manage your educational institutions and their settings
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

          <Link href="/dashboard/admin/schools/add">
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Add School
            </Button>
          </Link>
        </div>
      </div>

      {/* Schools Table Card */}
      <Card className="border">
        <CardHeader className="bg-muted/30">
          <CardTitle className="text-lg font-medium">School Accounts</CardTitle>
          <CardDescription>Manage your educational institutions and their settings</CardDescription>
        </CardHeader>
        <CardContent>
          {schools.length > 0 ? (
            <DataTable 
              columns={columns(actionHandlers)} 
              data={schools}
              searchKey="name"
              searchPlaceholder="Search schools by name, domain, or email..."
              filters={[
                {
                  key: "subscriptionStatus",
                  options: statusOptions,
                  placeholder: "Filter by status"
                }
              ]}
            />
          ) : (
            <div className="flex flex-col items-center justify-center p-8 text-center">
              <div className="rounded-full bg-muted p-3 mb-3">
                <Building className="h-6 w-6 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-medium mb-1">No schools found</h3>
              <p className="text-muted-foreground text-sm mb-4 max-w-md">
                No schools have been added to the system yet.
              </p>
              <Link href="/dashboard/admin/schools/add">
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add your first school
                </Button>
              </Link>
            </div>
          )}
        </CardContent>
      </Card>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete {selectedSchool?.name}. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteSchool} className="bg-red-600 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
} 