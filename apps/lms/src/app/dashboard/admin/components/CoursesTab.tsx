import { useState, useEffect } from 'react';
import { adminService } from '@/services/adminService';
import Image from 'next/image';
import { CourseViewModel } from '@/types/course';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { 
  AlertCircle, 
  Book, 
  Bookmark,
  Clock, 
  FileEdit, 
  Filter, 
  MoreVertical, 
  Pencil, 
  Plus, 
  RefreshCcw,
  Search, 
  Trash2, 
  BookOpen
} from 'lucide-react';

const CourseCard = ({ course, onEdit }: { course: CourseViewModel; onEdit: (course: CourseViewModel) => void }) => {
  const formatDuration = (minutes: number | undefined) => {
    if (!minutes) return 'Duration N/A';
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours === 0) return `${mins} min`;
    if (mins === 0) return `${hours} hr`;
    return `${hours} hr ${mins} min`;
  };

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
    <Card className="overflow-hidden group hover:shadow-md transition-all duration-200">
      <div className="relative w-full h-36">
        <Image 
          src={course.thumbnailUrl || '/placeholder-course.jpg'} 
          alt={course.title} 
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          priority={false}
          className="object-cover"
        />
        <div className="absolute top-2 right-2">
          {getStatusBadge(course.status)}
        </div>
      </div>
      <CardContent className="p-4">
        <h3 className="font-medium text-lg mb-2 line-clamp-1">{course.title}</h3>
        <p className="text-muted-foreground text-sm mb-3 line-clamp-2">{course.description || 'No description provided'}</p>
        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            <span>{formatDuration(course.durationMinutes)}</span>
          </div>
          <div className="flex items-center gap-1">
            <Bookmark className="h-4 w-4" />
            <span>{course.difficultyLevel}</span>
          </div>
        </div>
        {course.tags && course.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {course.tags.slice(0, 3).map((tag, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
            {course.tags.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{course.tags.length - 3}
              </Badge>
            )}
          </div>
        )}
      </CardContent>
      <CardFooter className="p-4 pt-0 flex justify-end">
        <Button 
          variant="ghost" 
          size="sm" 
          className="gap-1"
          onClick={() => onEdit(course)}
        >
          <Pencil className="h-4 w-4" />
          Edit
        </Button>
      </CardFooter>
    </Card>
  );
};

export default function CoursesTab() {
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

  const fetchCourses = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const data = await adminService.getCourses();
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
    
    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(course => course.status === statusFilter);
    }
    
    // Apply difficulty filter
    if (difficultyFilter !== 'all') {
      filtered = filtered.filter(course => course.difficultyLevel === difficultyFilter);
    }
    
    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(course => 
        course.title.toLowerCase().includes(query) || 
        (course.description && course.description.toLowerCase().includes(query)) ||
        (course.code && course.code.toLowerCase().includes(query))
      );
    }
    
    setFilteredCourses(filtered);
  };

  const handleEditCourse = (course: CourseViewModel) => {
    // Store the course data in localStorage for the edit page to use
    localStorage.setItem('editCourse', JSON.stringify(course));
    router.push(`/dashboard/admin/courses/edit/${course.id}`);
  };

  const confirmDelete = (course: CourseViewModel) => {
    setSelectedCourse(course);
    setShowDeleteDialog(true);
  };

  const handleDeleteCourse = async () => {
    if (!selectedCourse) return;
    
    try {
      await adminService.deleteCourse(selectedCourse.id);
      setShowDeleteDialog(false);
      fetchCourses(); // Refresh the list
    } catch (err) {
      setError('Failed to delete course');
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
          onClick={fetchCourses}
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
          <h2 className="heading-lg mb-1">Courses Management</h2>
          <p className="text-muted-foreground">
            Manage your course catalog and learning resources
          </p>
        </div>
        <Link href="/dashboard/admin/courses/add">
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Add Course
          </Button>
        </Link>
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
          <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
            <div className="md:col-span-4">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search courses by title, description, or code..."
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
                    <SelectItem value="all">All Levels</SelectItem>
                    <SelectItem value="beginner">Beginner</SelectItem>
                    <SelectItem value="intermediate">Intermediate</SelectItem>
                    <SelectItem value="advanced">Advanced</SelectItem>
                    <SelectItem value="expert">Expert</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
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

      {/* Courses Grid */}
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
              <Link href="/dashboard/admin/courses/add">
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add your first course
                </Button>
              </Link>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course) => (
            <CourseCard 
              key={course.id} 
              course={course} 
              onEdit={handleEditCourse}
            />
          ))}
        </div>
      )}

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the course "{selectedCourse?.title}". This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteCourse} className="bg-red-600 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
} 