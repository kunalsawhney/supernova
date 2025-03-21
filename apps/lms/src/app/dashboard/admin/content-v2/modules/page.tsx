'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { adminService } from '@/services/adminService';
import { ModuleViewModel } from '@/types/module';
import { CourseViewModel } from '@/types/course';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Link from 'next/link';
import { 
  AlertCircle, 
  Bookmark,
  Clock, 
  Edit, 
  FileEdit, 
  Filter, 
  Layers, 
  Plus, 
  RefreshCcw,
  Search, 
  Trash2,
  BookOpen,
  FileText
} from 'lucide-react';

function ModuleCard({ module, course, onEdit, onDelete }: { 
  module: ModuleViewModel; 
  course: CourseViewModel | undefined;
  onEdit: (moduleId: string) => void;
  onDelete: (moduleId: string) => void;
}) {
  console.log('ModuleCard', module, course);
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
              <CardTitle>{module.title}</CardTitle>
              {getStatusBadge(module.status)}
            </div>
            <CardDescription>{module.description}</CardDescription>
          </div>
          <div className="flex gap-2">
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-muted-foreground hover:text-foreground"
              onClick={() => onEdit(module.id)}
            >
              <Edit className="h-4 w-4 mr-1" />
              Edit
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-muted-foreground hover:text-red-500"
              onClick={() => onDelete(module.id)}
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
            <BookOpen className="h-4 w-4 text-primary" />
            <div>
              <p className="text-sm font-medium">Course</p>
              <p className="text-sm text-muted-foreground">
                {course ? course.title : 'Unknown Course'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <FileText className="h-4 w-4 text-primary" />
            <div>
              <p className="text-sm font-medium">Lessons</p>
              <p className="text-sm text-muted-foreground">{module.lessonCount} lessons</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-primary" />
            <div>
              <p className="text-sm font-medium">Duration</p>
              <p className="text-sm text-muted-foreground">{module.totalDuration} minutes</p>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="pt-2 flex justify-end">
        <Link href={`/dashboard/admin/content/modules/${module.id}`} className="w-full">
          <Button variant="outline" size="sm" className="w-full">
            <Layers className="h-4 w-4 mr-2" />
            Manage Lessons
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}

export default function ModulesPage() {
  const router = useRouter();
  
  const [modules, setModules] = useState<ModuleViewModel[]>([]);
  const [courses, setCourses] = useState<CourseViewModel[]>([]);
  const [filteredModules, setFilteredModules] = useState<ModuleViewModel[]>([]);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [courseFilter, setCourseFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    fetchData();
  }, []);
  
  useEffect(() => {
    filterModules();
  }, [modules, searchQuery, courseFilter, statusFilter]);
  
  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // In a real app, you would fetch actual data from your API
      // For now, we'll use the sample data
      const modulesData = await adminService.getModules();
      const coursesData = await adminService.getCourses();
      
      setModules(modulesData);
      setCourses(coursesData);
      setFilteredModules(modulesData);
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch data';
      setError(errorMessage);
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };
  
  const filterModules = () => {
    let filtered = [...modules];
    
    // Apply course filter
    if (courseFilter !== 'all') {
      filtered = filtered.filter(module => module.courseId === courseFilter);
    }
    
    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(module => module.status === statusFilter);
    }
    
    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(module => 
        module.title.toLowerCase().includes(query) || 
        (module.description && module.description.toLowerCase().includes(query))
      );
    }
    
    setFilteredModules(filtered);
  };
  
  const handleEditModule = (moduleId: string) => {
    router.push(`/dashboard/admin/content/modules/${moduleId}`);
  };
  
  const handleDeleteModule = (moduleId: string) => {
    // This would open a confirmation dialog in a real app
    // For now, we'll just remove it from the list
    setModules(modules.filter(module => module.id !== moduleId));
  };
  
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-80 space-y-4">
        <RefreshCcw className="h-8 w-8 animate-spin text-primary" />
        <p className="text-muted-foreground">Loading modules...</p>
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
          onClick={fetchData}
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
          <h2 className="heading-lg mb-1">Modules</h2>
          <p className="text-muted-foreground">
            Manage learning modules across all courses
          </p>
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
          <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
            <div className="md:col-span-4">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search modules by title or description..."
                  className="pl-9"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            <div>
              <Select value={courseFilter} onValueChange={setCourseFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by course" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="all">All Courses</SelectItem>
                    {courses.map(course => (
                      <SelectItem key={course.id} value={course.id}>
                        {course.title}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
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
          </div>
        </CardContent>
        <CardFooter className="border-t bg-muted/50 flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            {filteredModules.length} {filteredModules.length === 1 ? 'module' : 'modules'} found
          </div>
          {(searchQuery || courseFilter !== 'all' || statusFilter !== 'all') && (
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => {
                setSearchQuery('');
                setCourseFilter('all');
                setStatusFilter('all');
              }}
              className="text-muted-foreground hover:text-foreground"
            >
              Clear Filters
            </Button>
          )}
        </CardFooter>
      </Card>
      
      {/* Modules List */}
      {filteredModules.length === 0 ? (
        <Card className="border">
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <div className="rounded-full bg-muted p-3 mb-3">
              <Layers className="h-6 w-6 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium mb-1">No modules found</h3>
            <p className="text-muted-foreground text-sm mb-4 max-w-md">
              {searchQuery || courseFilter !== 'all' || statusFilter !== 'all'
                ? "No modules match your current filters. Try adjusting your search criteria."
                : "No modules have been added to the system yet."}
            </p>
            {searchQuery || courseFilter !== 'all' || statusFilter !== 'all' ? (
              <Button 
                variant="outline" 
                onClick={() => {
                  setSearchQuery('');
                  setCourseFilter('all');
                  setStatusFilter('all');
                }}
              >
                Clear filters
              </Button>
            ) : (
              <Link href="/dashboard/admin/content/courses">
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Create a module
                </Button>
              </Link>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredModules.map((module) => (
            <ModuleCard 
              key={module.id} 
              module={module} 
              course={courses.find(c => c.id === module.courseId)}
              onEdit={handleEditModule} 
              onDelete={handleDeleteModule}
            />
          ))}
        </div>
      )}
    </div>
  );
} 