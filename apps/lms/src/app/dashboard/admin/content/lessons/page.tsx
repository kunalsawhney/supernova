'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { adminService } from '@/services/adminService';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Link from 'next/link';
import { 
  AlertCircle, 
  BookOpen,
  Clock, 
  Edit, 
  FileEdit,
  Filter, 
  Layers, 
  Play,
  Plus, 
  RefreshCcw,
  Search, 
  Trash2,
  FileText,
  Video,
  ScrollText,
  BarChart4
} from 'lucide-react';
import { ModuleViewModel, CourseViewModel } from '@/types';
import { LessonViewModel } from '@/types/course';
import { toast } from '@/hooks/use-toast';

// interface ModuleBasicInfo {
//   id: string;
//   title: string;
//   courseId: string;
// }

// interface CourseBasicInfo {
//   id: string;
//   title: string;
// }

function getLessonTypeIcon(type: string) {
  switch (type) {
    case 'text':
      return <ScrollText className="h-4 w-4" />;
    case 'video':
      return <Video className="h-4 w-4" />;
    case 'quiz':
      return <BarChart4 className="h-4 w-4" />;
    case 'presentation':
      return <Play className="h-4 w-4" />;
    default:
      return <FileText className="h-4 w-4" />;
  }
}

function LessonCard({ 
  lesson,
  module,
  course,
  onEdit, 
  onDelete 
}: { 
  lesson: LessonViewModel;
  module: ModuleViewModel | undefined;
  course: CourseViewModel | undefined;
  onEdit: (lessonId: string) => void;
  onDelete: (lessonId: string) => void;
}) {
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

  const getTypeBadge = (type: string) => {
    switch (type) {
      case 'text':
        return <Badge variant="outline" className="bg-blue-50 text-blue-800 border-blue-200">Text</Badge>;
      case 'video':
        return <Badge variant="outline" className="bg-purple-50 text-purple-800 border-purple-200">Video</Badge>;
      case 'quiz':
        return <Badge variant="outline" className="bg-orange-50 text-orange-800 border-orange-200">Quiz</Badge>;
      case 'presentation':
        return <Badge variant="outline" className="bg-indigo-50 text-indigo-800 border-indigo-200">Presentation</Badge>;
      default:
        return <Badge variant="outline">{type}</Badge>;
    }
  };

  return (
    <Card className="mb-4 hover:shadow-md transition-all">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <CardTitle className="flex items-center gap-2">
                {getLessonTypeIcon(lesson.contentType)}
                {lesson.title}
              </CardTitle>
              {getStatusBadge(lesson.status)}
              {/* {getTypeBadge(lesson.contentType)} */}
            </div>
            <CardDescription>{lesson.description}</CardDescription>
          </div>
          <div className="flex gap-2">
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-muted-foreground hover:text-foreground"
              onClick={() => onEdit(lesson.id)}
            >
              <Edit className="h-4 w-4 mr-1" />
              Edit
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-muted-foreground hover:text-red-500"
              onClick={() => onDelete(lesson.id)}
            >
              <Trash2 className="h-4 w-4 mr-1" />
              Delete
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
            <Layers className="h-4 w-4 text-primary" />
            <div>
              <p className="text-sm font-medium">Module</p>
              <p className="text-sm text-muted-foreground">
                {module ? module.title : 'Unknown Module'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-primary" />
            <div>
              <p className="text-sm font-medium">Duration</p>
              <p className="text-sm text-muted-foreground">{lesson.durationMinutes} minutes</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <FileText className="h-4 w-4 text-primary" />
            <div>
              <p className="text-sm font-medium">Content Type</p>
              <p className="text-sm text-muted-foreground">{lesson.contentType}</p>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="pt-2 flex justify-end">
        <Link href={`/dashboard/admin/content/lessons/${lesson.id}`} className="w-full">
          <Button variant="outline" size="sm" className="w-full">
            <FileEdit className="h-4 w-4 mr-2" />
            Edit Lesson Content
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}

export default function LessonsPage() {
  const router = useRouter();
  const initialFetchRef = React.useRef(false);
  
  const [lessons, setLessons] = useState<LessonViewModel[]>([]);
  const [modules, setModules] = useState<ModuleViewModel[]>([]);
  const [courses, setCourses] = useState<CourseViewModel[]>([]);
  const [filteredLessons, setFilteredLessons] = useState<LessonViewModel[]>([]);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [courseFilter, setCourseFilter] = useState('all');
  const [moduleFilter, setModuleFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    if (!initialFetchRef.current) {
      fetchData();
      initialFetchRef.current = true;
    }
  }, []);
  
  useEffect(() => {
    filterLessons();
  }, [lessons, searchQuery, courseFilter, moduleFilter, typeFilter, statusFilter]);
  
  // Filtered modules based on selected course
  const filteredModuleOptions = courseFilter === 'all' 
    ? modules 
    : modules.filter(module => module.contentId === courseFilter);
  
  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // In a real app, you would fetch actual data from your API
      // For now, we'll use the sample data
      const lessonsData = await adminService.getLessons();
      const modulesData = await adminService.getModules();
      const coursesData = await adminService.getCourses();
      
      setLessons(lessonsData);
      // Cast the modules data to the expected type before setting state
      setModules(modulesData as unknown as ModuleViewModel[]);
      setCourses(coursesData);
      setFilteredLessons(lessonsData);
      
    } catch (err) {
      toast({
        title: 'Error fetching data',
        description: 'Please try again later',
        variant: 'destructive',
      });
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch data';
      setError(errorMessage);
      console.error('Error fetching data:', err);
      initialFetchRef.current = false; // Reset so we can try again
    } finally {
      setLoading(false);
    }
  };
  
  const filterLessons = () => {
    let filtered = [...lessons];
    
    // Apply module filter (which implicitly applies the course filter)
    if (moduleFilter !== 'all') {
      filtered = filtered.filter(lesson => lesson.moduleId === moduleFilter);
    } else if (courseFilter !== 'all') {
      // If no module is selected but a course is, filter by course
      const moduleIds = modules
        .filter(module => module.contentId === courseFilter)
        .map(module => module.id);
      filtered = filtered.filter(lesson => moduleIds.includes(lesson.moduleId));
    }
    
    // Apply type filter
    if (typeFilter !== 'all') {
      filtered = filtered.filter(lesson => lesson.contentType === typeFilter);
    }
    
    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(lesson => lesson.status === statusFilter);
    }
    
    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(lesson => 
        lesson.title.toLowerCase().includes(query) || 
        (lesson.description && lesson.description.toLowerCase().includes(query))
      );
    }
    
    setFilteredLessons(filtered);
  };
  
  const handleEditLesson = (lessonId: string) => {
    router.push(`/dashboard/admin/content/lessons/${lessonId}`);
  };
  
  const handleDeleteLesson = async (lessonId: string) => {
    // This would open a confirmation dialog in a real app
    // For now, we'll just remove it from the list
    // setLessons(lessons.filter(lesson => lesson.id !== lessonId));
    console.log("Deleting lesson:", lessonId);
    try {
      await adminService.deleteLesson(lessonId);
      setLessons(lessons.filter(lesson => lesson.id !== lessonId));
      toast({
        title: 'Lesson deleted',
        description: 'Lesson deleted successfully',
        variant: 'default',
      });
    } catch (error) {
      console.error('Error deleting lesson:', error);
      toast({
        title: 'Error deleting lesson',
        description: 'Please try again',
        variant: 'destructive',
      });
    }
  };
  
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-80 space-y-4">
        <RefreshCcw className="h-8 w-8 animate-spin text-primary" />
        <p className="text-muted-foreground">Loading lessons...</p>
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
          <h2 className="heading-lg mb-1">Lessons</h2>
          <p className="text-muted-foreground">
            Manage learning content across all modules and courses
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
          <div className="grid grid-cols-1 gap-4">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search lessons by title or description..."
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <Select value={courseFilter} onValueChange={(value) => {
                  setCourseFilter(value);
                  // Reset module filter when course changes
                  setModuleFilter('all');
                }}>
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
                <Select 
                  value={moduleFilter} 
                  onValueChange={setModuleFilter}
                  disabled={courseFilter === 'all' && filteredModuleOptions.length > 10}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Filter by module" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="all">All Modules</SelectItem>
                      {filteredModuleOptions.map(module => (
                        <SelectItem key={module.id} value={module.id}>
                          {module.title}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Filter by type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="text">Text</SelectItem>
                      <SelectItem value="video">Video</SelectItem>
                      <SelectItem value="quiz">Quiz</SelectItem>
                      <SelectItem value="presentation">Presentation</SelectItem>
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
          </div>
        </CardContent>
        <CardFooter className="border-t bg-muted/50 flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            {filteredLessons.length} {filteredLessons.length === 1 ? 'lesson' : 'lessons'} found
          </div>
          {(searchQuery || courseFilter !== 'all' || moduleFilter !== 'all' || typeFilter !== 'all' || statusFilter !== 'all') && (
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => {
                setSearchQuery('');
                setCourseFilter('all');
                setModuleFilter('all');
                setTypeFilter('all');
                setStatusFilter('all');
              }}
              className="text-muted-foreground hover:text-foreground"
            >
              Clear Filters
            </Button>
          )}
        </CardFooter>
      </Card>
      
      {/* Lessons List */}
      {filteredLessons.length === 0 ? (
        <Card className="border">
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <div className="rounded-full bg-muted p-3 mb-3">
              <FileText className="h-6 w-6 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium mb-1">No lessons found</h3>
            <p className="text-muted-foreground text-sm mb-4 max-w-md">
              {searchQuery || courseFilter !== 'all' || moduleFilter !== 'all' || typeFilter !== 'all' || statusFilter !== 'all'
                ? "No lessons match your current filters. Try adjusting your search criteria."
                : "No lessons have been added to the system yet."}
            </p>
            {searchQuery || courseFilter !== 'all' || moduleFilter !== 'all' || typeFilter !== 'all' || statusFilter !== 'all' ? (
              <Button 
                variant="outline" 
                onClick={() => {
                  setSearchQuery('');
                  setCourseFilter('all');
                  setModuleFilter('all');
                  setTypeFilter('all');
                  setStatusFilter('all');
                }}
              >
                Clear filters
              </Button>
            ) : (
              <Link href="/dashboard/admin/content/modules">
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Create a lesson
                </Button>
              </Link>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredLessons.map((lesson) => {
            const module = modules.find(m => m.id === lesson.moduleId);
            const course = module 
              ? courses.find(c => c.contentId === module.contentId) 
              : undefined;
              
            return (
              <LessonCard 
                key={lesson.id} 
                lesson={lesson} 
                module={module}
                course={course}
                onEdit={handleEditLesson} 
                onDelete={handleDeleteLesson}
              />
            );
          })}
        </div>
      )}
    </div>
  );
} 