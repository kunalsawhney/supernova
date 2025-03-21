'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { 
  MoreVertical, 
  Edit, 
  RefreshCw, 
  Trash, 
  Plus, 
  Search,
  BookOpen,
  ArrowUpDown
} from 'lucide-react';
// import { adminService } from '@/services/adminService';
import { courseService } from '@/services/courseService';
import { Spinner } from '@/components/ui/spinner';
import { useToast } from '@/hooks/use-toast';
import { Input } from '@/components/ui/input';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function CoursesPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<'title' | 'status' | 'created_at'>('created_at');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch courses from the API
      const data = await courseService.getCourses();
      setCourses(data);
    } catch (err) {
      console.error('Failed to fetch courses:', err);
      setError('Failed to load courses. Please try again.');
      toast({
        title: 'Error',
        description: 'Failed to load courses.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleQuickEdit = (courseId: string) => {
    router.push(`/dashboard/admin/content-v2/courses/edit/${courseId}`);
  };

  const handleWizardEdit = (courseId: string) => {
    router.push(`/dashboard/admin/content-v2/courses/edit/${courseId}?mode=wizard`);
  };

  const handleDeleteCourse = async (courseId: string) => {
    if (!confirm('Are you sure you want to delete this course? This action cannot be undone.')) {
      return;
    }

    try {
      await courseService.deleteCourse(courseId);
      toast({
        title: 'Success',
        description: 'Course deleted successfully',
      });
      // Refresh the course list
      fetchCourses();
    } catch (err) {
      console.error('Failed to delete course:', err);
      toast({
        title: 'Error',
        description: 'Failed to delete course.',
        variant: 'destructive',
      });
    }
  };

  const toggleSort = (field: 'title' | 'status' | 'created_at') => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Filter and sort courses
  const filteredAndSortedCourses = [...courses]
    .filter(course => 
      course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.code.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      if (sortField === 'title') {
        return sortDirection === 'asc'
          ? a.title.localeCompare(b.title)
          : b.title.localeCompare(a.title);
      } else if (sortField === 'status') {
        return sortDirection === 'asc'
          ? a.status.localeCompare(b.status)
          : b.status.localeCompare(a.status);
      } else {
        // created_at
        const dateA = new Date(a.created_at).getTime();
        const dateB = new Date(b.created_at).getTime();
        return sortDirection === 'asc' ? dateA - dateB : dateB - dateA;
      }
    });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'published':
        return <Badge className="bg-green-100 text-green-800 dark:bg-green-800/30 dark:text-green-300">Published</Badge>;
      case 'draft':
        return <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-800/30 dark:text-yellow-300">Draft</Badge>;
      case 'archived':
        return <Badge className="bg-gray-100 text-gray-800 dark:bg-gray-800/30 dark:text-gray-300">Archived</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-80 space-y-4">
        <Spinner size="lg" />
        <p className="text-muted-foreground">Loading courses...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold">Course Management</h1>
          <p className="text-muted-foreground">Create and manage your educational content</p>
        </div>
        
        <Link href="/dashboard/admin/content-v2/courses/create">
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            New Course
          </Button>
        </Link>
      </div>

      {/* Search & Filters */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input 
            placeholder="Search courses..." 
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Course List Table */}
      <div className="bg-card rounded-lg border border-border overflow-hidden">
        {/* Table Header */}
        <div className="grid grid-cols-12 p-4 bg-muted/50 border-b border-border font-medium text-sm">
          <div className="col-span-5 flex items-center gap-1 cursor-pointer" onClick={() => toggleSort('title')}>
            Title <ArrowUpDown className="h-3 w-3" />
          </div>
          <div className="col-span-2 flex items-center gap-1 cursor-pointer" onClick={() => toggleSort('status')}>
            Status <ArrowUpDown className="h-3 w-3" />
          </div>
          <div className="col-span-3">Duration</div>
          <div className="col-span-2 text-right">Actions</div>
        </div>

        {/* Table Content */}
        {filteredAndSortedCourses.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground">
            {searchTerm ? 'No courses match your search.' : 'No courses available. Create your first course!'}
          </div>
        ) : (
          filteredAndSortedCourses.map(course => (
            <div key={course.id} className="grid grid-cols-12 p-4 border-b border-border items-center hover:bg-muted/20">
              <div className="col-span-5">
                <div className="font-medium">{course.title}</div>
                <div className="text-sm text-muted-foreground">Code: {course.code}</div>
              </div>
              <div className="col-span-2">
                {getStatusBadge(course.status)}
              </div>
              <div className="col-span-3 flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-muted-foreground" />
                <span>{course.estimatedDuration || 0} minutes</span>
              </div>
              <div className="col-span-2 flex justify-end">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handleQuickEdit(course.id)}>
                      <Edit className="h-4 w-4 mr-2" /> Quick Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleWizardEdit(course.id)}>
                      <RefreshCw className="h-4 w-4 mr-2" /> Wizard Edit
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem 
                      onClick={() => handleDeleteCourse(course.id)}
                      className="text-destructive focus:text-destructive"
                    >
                      <Trash className="h-4 w-4 mr-2" /> Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
} 