import React, { useState, useEffect } from 'react';
import { adminService } from '@/services/adminService';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { 
  AlertCircle, 
  Building, 
  ChevronDown, 
  Download, 
  FileText, 
  Filter, 
  MoreVertical, 
  Pencil,
  Plus, 
  RefreshCcw, 
  School, 
  Search, 
  Trash2
} from 'lucide-react';

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
  subscriptionStatus: 'trial' | 'active' | 'expired' | 'cancelled' | 'past_due';
  maxStudents: number;
  maxTeachers: number;
  createdAt: string;
  updatedAt: string;
}

type SubscriptionStatus = 'trial' | 'active' | 'expired' | 'cancelled' | 'past_due';

export default function SchoolsTab() {
  const router = useRouter();
  const initialFetchRef = React.useRef(false);
  
  const [schools, setSchools] = useState<School[]>([]);
  const [filteredSchools, setFilteredSchools] = useState<School[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedSchool, setSelectedSchool] = useState<School | null>(null);

  useEffect(() => {
    if (!initialFetchRef.current) {
      fetchSchools();
      initialFetchRef.current = true;
    }
  }, []);

  useEffect(() => {
    filterSchools();
  }, [schools, searchQuery, statusFilter]);

  const fetchSchools = async () => {
    try {
      setLoading(true);
      const data = await adminService.getSchools();
      setSchools(data);
      setFilteredSchools(data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch schools');
      console.error('Error fetching schools:', err);
      initialFetchRef.current = false; // Reset for retry
    } finally {
      setLoading(false);
    }
  };

  const filterSchools = () => {
    let filtered = [...schools];
    
    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(school => school.subscriptionStatus === statusFilter);
    }
    
    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(school => 
        school.name.toLowerCase().includes(query) || 
        school.domain.toLowerCase().includes(query) || 
        school.contactEmail.toLowerCase().includes(query) ||
        school.code.toLowerCase().includes(query)
      );
    }
    
    setFilteredSchools(filtered);
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

  // Format subscription status for display
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
            <div className="md:col-span-3">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search schools by name, domain, or email..."
                  className="pl-9"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            <div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="trial">Trial</SelectItem>
                    <SelectItem value="expired">Expired</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                    <SelectItem value="past_due">Past Due</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
        <CardFooter className="border-t bg-muted/50 flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            {filteredSchools.length} {filteredSchools.length === 1 ? 'school' : 'schools'} found
          </div>
          {(searchQuery || statusFilter !== 'all') && (
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => {
                setSearchQuery('');
                setStatusFilter('all');
              }}
              className="text-muted-foreground hover:text-foreground"
            >
              Clear Filters
            </Button>
          )}
        </CardFooter>
      </Card>

      {/* Schools Tabke */}
      <Card className="border overflow-hidden">
        <CardHeader className="bg-muted/30 pb-0">
          <CardTitle className="text-lg font-medium">School Accounts</CardTitle>
          <CardDescription>Manage your educational institutions and their settings</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="w-full overflow-auto">
            {filteredSchools.length > 0 ? (
              <Table>
                <TableHeader className="bg-muted/30">
                  <TableRow>
                    <TableHead className="font-medium">School</TableHead>
                    <TableHead className="font-medium">Domain</TableHead>
                    <TableHead className="font-medium">Contact</TableHead>
                    <TableHead className="font-medium">Status</TableHead>
                    <TableHead className="font-medium">Capacity</TableHead>
                    <TableHead className="text-right font-medium">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSchools.map((school) => (
                  <TableRow key={school.id} className="hover:bg-muted/50">
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center">
                          <School className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                          <div className="font-normal">{school.name}</div>
                          <div className="text-xs text-muted-foreground">{school.code}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{school.domain}</TableCell>
                    <TableCell>
                      <div>
                        <div className="text-sm">{school.contactEmail}</div>
                        <div className="text-xs text-muted-foreground">{school.contactPhone || 'No phone'}</div>
                      </div>
                    </TableCell>
                    <TableCell>{getStatusBadge(school.subscriptionStatus)}</TableCell>
                    <TableCell>
                      <div className="text-sm">Students: {school.maxStudents}</div>
                      <div className="text-xs text-muted-foreground">Teachers: {school.maxTeachers}</div>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="bg-popover border shadow-md">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => handleEditSchool(school)} className="cursor-pointer">
                            <Pencil className="mr-2 h-4 w-4" />
                            Edit school
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => router.push(`/dashboard/admin/schools/${school.id}/students`)}
                            className="cursor-pointer"
                          >
                            <School className="mr-2 h-4 w-4" /> 
                            View students
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => router.push(`/dashboard/admin/schools/${school.id}/teachers`)}
                            className="cursor-pointer"
                          >
                            <School className="mr-2 h-4 w-4" />
                            View teachers
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem 
                            className="text-red-600 focus:text-red-600 cursor-pointer" 
                            onClick={() => confirmDelete(school)}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete school
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
                  <Building className="h-6 w-6 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-medium mb-1">No schools found</h3>
                <p className="text-muted-foreground text-sm mb-4 max-w-md">
                  {searchQuery || statusFilter !== 'all'
                    ? "No schools match your current filters. Try adjusting your search criteria."
                    : "No schools have been added to the system yet."}
                </p>
                {searchQuery || statusFilter !== 'all' ? (
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setSearchQuery('');
                      setStatusFilter('all');
                    }}
                  >
                    Clear filters
                  </Button>
                ) : (
                  <Link href="/dashboard/admin/schools/add">
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Add your first school
                    </Button>
                  </Link>
                )}
              </div>
            )}
          </div>
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