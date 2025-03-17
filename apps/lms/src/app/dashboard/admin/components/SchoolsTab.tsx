import { useState, useEffect } from 'react';
import { adminService } from '@/services/adminService';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Building, ChevronDown, Download, FileText, MoreVertical, Plus, Search, School } from 'lucide-react';

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
  const [schools, setSchools] = useState<School[]>([]);
  const [filteredSchools, setFilteredSchools] = useState<School[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedSchool, setSelectedSchool] = useState<School | null>(null);

  useEffect(() => {
    fetchSchools();
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
      <Card className="mt-6">
        <CardContent className="pt-6">
          <div className="flex flex-col items-center justify-center space-y-3 py-12">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
            <p className="text-sm text-muted-foreground">Loading schools...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="mt-6 border-red-200">
        <CardContent className="pt-6">
          <div className="bg-red-50 px-4 py-3 text-red-700 rounded">
            <p className="font-medium">Error</p>
            <p>{error}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="mt-6">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl font-bold">Schools</CardTitle>
              <CardDescription className="text-muted-foreground">
                Manage your educational institutions
              </CardDescription>
            </div>
            <div className="flex space-x-2">
              <Link href="/dashboard/admin/schools/add">
                <Button className="whitespace-nowrap">
                  <Plus className="mr-2 h-4 w-4" />
                  Add School
                </Button>
              </Link>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline">
                    <FileText className="mr-2 h-4 w-4" />
                    Export
                    <ChevronDown className="ml-2 h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-popover border shadow-md">
                  <DropdownMenuItem>
                    <Download className="mr-2 h-4 w-4" />
                    Export as CSV
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Download className="mr-2 h-4 w-4" />
                    Export as Excel
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-4 flex flex-col space-y-3 sm:flex-row sm:space-y-0 sm:space-x-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-muted-foreground" />
              <Input
                placeholder="Search schools..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-[180px]">
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

          {filteredSchools.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Building className="h-12 w-12 text-muted-foreground" />
              <h3 className="mt-4 text-lg font-semibold">No schools found</h3>
              <p className="text-sm text-muted-foreground">
                {searchQuery || statusFilter !== 'all'
                  ? 'Try adjusting your search or filter criteria'
                  : 'Get started by adding your first school'}
              </p>
              {!searchQuery && statusFilter === 'all' && (
                <Link href="/dashboard/admin/schools/add" className="mt-4">
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Add School
                  </Button>
                </Link>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="font-semibold">Name</TableHead>
                    <TableHead className="font-semibold">Domain</TableHead>
                    <TableHead className="font-semibold">Contact</TableHead>
                    <TableHead className="font-semibold">Subscription</TableHead>
                    <TableHead className="font-semibold">Capacity</TableHead>
                    <TableHead className="text-right font-semibold">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredSchools.map((school) => (
                    <TableRow key={school.id} className="group">
                      <TableCell className="font-medium">
                        <div className="flex items-center space-x-2">
                          <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                            <School className="h-4 w-4 text-primary" />
                          </div>
                          <div>
                            <div>{school.name}</div>
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
                            <DropdownMenuItem onClick={() => handleEditSchool(school)}>
                              Edit school
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => router.push(`/dashboard/admin/schools/${school.id}/students`)}>
                              View students
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => router.push(`/dashboard/admin/schools/${school.id}/teachers`)}>
                              View teachers
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem 
                              className="text-red-600 focus:text-red-600" 
                              onClick={() => confirmDelete(school)}
                            >
                              Delete school
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>

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
      </Card>
    </div>
  );
} 