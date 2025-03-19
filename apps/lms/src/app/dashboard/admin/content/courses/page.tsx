'use client';

import { useState, useEffect } from 'react';
import { adminService } from '@/services/adminService';
import { CourseViewModel } from '@/types/course';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { 
  AlertCircle, 
  Book, 
  Bookmark,
  Clock, 
  FileEdit, 
  Filter, 
  Pencil, 
  Plus, 
  RefreshCcw,
  Search, 
  Trash2, 
  BookOpen
} from 'lucide-react';

const CourseCard = ({ course, onEdit, onDelete }: { 
  course: CourseViewModel; 
  onEdit: (courseId: string) => void;
  onDelete: (courseId: string) => void;
}) => {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'published':
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Published</Badge>;
      case 'draft':
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Draft</Badge>;
      case 'archived':
        return <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100">Archived</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <Card className="mb-4 hover:shadow-md transition-all">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-4 w-4" />
                {course.title}
              </CardTitle>
              {getStatusBadge(course.status)}
            </div>
            <CardDescription>{course.description || 'No description provided'}</CardDescription>
          </div>
          <div className="flex gap-2">
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-muted-foreground hover:text-foreground"
              onClick={() => onEdit(course.id)}
            >
              <Pencil className="h-4 w-4 mr-1" />
              Edit
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-muted-foreground hover:text-red-500"
              onClick={() => onDelete(course.id)}
            >
              <Trash2 className="h-4 w-4 mr-1" />
              Delete
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center gap-2">
            <Book className="h-4 w-4 text-primary" />
            <div>
              <p className="text-sm font-medium">Code</p>
              <p className="text-sm text-muted-foreground">
                {course.code || 'No code assigned'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-primary" />
            <div>
              <p className="text-sm font-medium">Duration</p>
              <p className="text-sm text-muted-foreground">
                {course.estimatedDuration ? `${course.estimatedDuration} minutes` : 'Not specified'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Bookmark className="h-4 w-4 text-primary" />
            <div>
              <p className="text-sm font-medium">Difficulty</p>
              <p className="text-sm text-muted-foreground">{course.difficultyLevel || 'Not specified'}</p>
            </div>
          </div>
        </div>
        {course.tags && course.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-3">
            {course.tags.map((tag, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        )}
      </CardContent>
      <CardFooter className="pt-2 flex justify-end">
        <Link href={`/dashboard/admin/content/courses/${course.id}`} className="w-full">
          <Button variant="outline" size="sm" className="w-full">
            <FileEdit className="h-4 w-4 mr-2" />
            View Course Details
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
};

export default function CoursesPage() {
  const router = useRouter();

  const [courses, setCourses] = useState<CourseViewModel[]>([]);
  const [filteredCourses, setFilteredCourses] = useState<CourseViewModel[]>([]);
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [difficultyFilter, setDifficultyFilter] = useState<string>('all');
  
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<CourseViewModel | null>(null);

  useEffect(() => {
    fetchCourses();
  }, []);

  useEffect(() => {
    filterCourses();
  }, [courses, searchQuery, statusFilter, difficultyFilter]);

  const handleRefresh: React.MouseEventHandler<HTMLButtonElement> = (e) => {
    e.preventDefault();
    void fetchCourses(true);
  };

  const handleRetry: React.MouseEventHandler<HTMLButtonElement> = (e) => {
    e.preventDefault();
    void fetchCourses(false);
  };

  const fetchCourses = async (forceFresh: boolean = false) => {
    try {
      setLoading(true);
      setError(null);
      
      if (forceFresh) {
        adminService.clearCoursesCache();
      }
      
      const data = await adminService.getCourses({
        ...(statusFilter !== 'all' ? { status: statusFilter } : {}),
        ...(searchQuery ? { search: searchQuery } : {})
      });
      setCourses(data);
      setFilteredCourses(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch courses';
      setError(errorMessage);
      console.error('Error fetching courses:', err);
    } finally {
      setLoading(false);
    }
  };

  const filterCourses = () => {
    let filtered = [...courses];
    
    // Status filtering is now handled by the API, but we'll keep this for client-side filtering too
    if (statusFilter !== 'all') {
      filtered = filtered.filter(course => course.status === statusFilter);
    }
    
    // Apply difficulty filter
    if (difficultyFilter !== 'all') {
      filtered = filtered.filter(course => course.difficultyLevel === difficultyFilter);
    }
    
    // Search filtering is now handled by the API, but we'll keep this for client-side filtering too
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(course => 
        course.title.toLowerCase().includes(query) || 
        (course.description && course.description.toLowerCase().includes(query)) ||
        (course.code && course.code.toLowerCase().includes(query)) ||
        (course.tags && course.tags.some(tag => tag.toLowerCase().includes(query)))
      );
    }
    
    setFilteredCourses(filtered);
  };

  const handleEditCourse = (courseId: string) => {
    router.push(`/dashboard/admin/content/courses/edit/${courseId}`);
  };

  const confirmDelete = (courseId: string) => {
    const course = courses.find(c => c.id === courseId);
    if (course) {
      setSelectedCourse(course);
      setShowDeleteDialog(true);
    }
  };

  const handleDeleteCourse = async () => {
    if (!selectedCourse) return;
    
    try {
      await adminService.deleteCourse(selectedCourse.id);
      setShowDeleteDialog(false);
      fetchCourses(); // Refresh the list
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete course';
      setError(errorMessage);
      console.error('Error deleting course:', err);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-80 space-y-4">
        <RefreshCcw className="h-8 w-8 animate-spin text-primary" />
        <p className="text-muted-foreground">Loading courses...</p>
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
          onClick={handleRetry}
          className="ml-auto border-red-300 dark:border-red-800/30 text-red-800 dark:text-red-300 hover:bg-red-100 dark:hover:bg-red-900/30"
        >
          <RefreshCcw className="h-4 w-4 mr-2" />
          Retry
        </Button>
      </div>
    );
  }

  // Get all unique difficulty levels for the filter
  const difficultyLevels = Array.from(new Set(courses
    .map(course => course.difficultyLevel)
    .filter(Boolean) as string[]));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="heading-lg mb-1">Courses Management</h2>
          <p className="text-muted-foreground">
            Manage your course catalog and learning resources
          </p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="default" 
            onClick={handleRefresh}
            className="gap-2"
          >
            <RefreshCcw className="h-4 w-4" />
            Refresh
          </Button>
          <Link href="/dashboard/admin/content/courses/add">
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Add Course
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
          <div className="grid grid-cols-1 gap-4">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search courses by title, description, code or tags..."
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="all">All Statuses</SelectItem>
                      <SelectItem value="published">Published</SelectItem>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="archived">Archived</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Select value={difficultyFilter} onValueChange={setDifficultyFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Filter by difficulty" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="all">All Difficulty Levels</SelectItem>
                      {difficultyLevels.map(level => (
                        <SelectItem key={level} value={level}>{level}</SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="border-t bg-muted/50 flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            {filteredCourses.length} {filteredCourses.length === 1 ? 'course' : 'courses'} found
          </div>
          {(searchQuery || statusFilter !== 'all' || difficultyFilter !== 'all') && (
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => {
                setSearchQuery('');
                setStatusFilter('all');
                setDifficultyFilter('all');
              }}
              className="text-muted-foreground hover:text-foreground"
            >
              Clear Filters
            </Button>
          )}
        </CardFooter>
      </Card>

      {/* Course List */}
      {filteredCourses.length === 0 ? (
        <Card className="border">
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <div className="rounded-full bg-muted p-3 mb-3">
              <BookOpen className="h-6 w-6 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium mb-1">No courses found</h3>
            <p className="text-muted-foreground text-sm mb-4 max-w-md">
              {searchQuery || statusFilter !== 'all' || difficultyFilter !== 'all'
                ? "No courses match your current filters. Try adjusting your search criteria."
                : "No courses have been added to the system yet."}
            </p>
            {searchQuery || statusFilter !== 'all' || difficultyFilter !== 'all' ? (
              <Button 
                variant="outline" 
                onClick={() => {
                  setSearchQuery('');
                  setStatusFilter('all');
                  setDifficultyFilter('all');
                }}
              >
                Clear filters
              </Button>
            ) : (
              <Link href="/dashboard/admin/content/courses/add">
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Create a course
                </Button>
              </Link>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredCourses.map((course) => (
            <CourseCard 
              key={course.id} 
              course={course}
              onEdit={handleEditCourse}
              onDelete={confirmDelete}
            />
          ))}
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the course &quot;{selectedCourse?.title}&quot; and cannot be undone.
              All associated modules and lessons will be orphaned.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteCourse} className="bg-red-500 hover:bg-red-600">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
} 