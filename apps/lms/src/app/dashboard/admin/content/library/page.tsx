'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import Link from 'next/link';
import { 
  BookText,
  FileText,
  File,
  Library,
  Search,
  Filter,
  Plus,
  Layers,
  BookOpen,
  AlertCircle,
  RefreshCcw
} from 'lucide-react';
import { adminService } from '@/services/adminService';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { CourseViewModel } from '@/types/course';

interface ModuleItem {
  id: string;
  title: string;
  courseId: string;
  courseName: string;
  lessonCount: number;
  updatedAt: string;
}

interface LessonItem {
  id: string;
  title: string;
  moduleId: string;
  moduleName: string;
  courseId: string;
  courseName: string;
  type: string;
  updatedAt: string;
}

export default function ContentLibraryPage() {
  const [activeTab, setActiveTab] = useState('courses');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  
  // Data states
  const [courses, setCourses] = useState<CourseViewModel[]>([]);
  const [modules, setModules] = useState<ModuleItem[]>([]);
  const [lessons, setLessons] = useState<LessonItem[]>([]);
  
  // UI states
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch courses - this is real
      const coursesData = await adminService.getCourses();
      setCourses(coursesData);
      
      // Mock modules data - this would be a real API call in production
      setModules([
        {
          id: 'm1',
          title: 'Introduction to Mathematics',
          courseId: coursesData[0]?.id || 'c1',
          courseName: coursesData[0]?.title || 'Mathematics 101',
          lessonCount: 5,
          updatedAt: '2024-03-12T10:30:00Z',
        },
        {
          id: 'm2',
          title: 'Algebra Fundamentals',
          courseId: coursesData[0]?.id || 'c1',
          courseName: coursesData[0]?.title || 'Mathematics 101',
          lessonCount: 4,
          updatedAt: '2024-03-10T14:20:00Z',
        },
        {
          id: 'm3',
          title: 'Cellular Biology Basics',
          courseId: coursesData[1]?.id || 'c2',
          courseName: coursesData[1]?.title || 'Biology 101',
          lessonCount: 6,
          updatedAt: '2024-03-08T09:15:00Z',
        },
      ]);
      
      // Mock lessons data
      setLessons([
        {
          id: 'l1',
          title: 'Numbers and Operations',
          moduleId: 'm1',
          moduleName: 'Introduction to Mathematics',
          courseId: coursesData[0]?.id || 'c1',
          courseName: coursesData[0]?.title || 'Mathematics 101',
          type: 'video',
          updatedAt: '2024-03-12T10:30:00Z',
        },
        {
          id: 'l2',
          title: 'Fractions and Decimals',
          moduleId: 'm1',
          moduleName: 'Introduction to Mathematics',
          courseId: coursesData[0]?.id || 'c1',
          courseName: coursesData[0]?.title || 'Mathematics 101',
          type: 'text',
          updatedAt: '2024-03-11T11:30:00Z',
        },
        {
          id: 'l3',
          title: 'Variables and Constants',
          moduleId: 'm2',
          moduleName: 'Algebra Fundamentals',
          courseId: coursesData[0]?.id || 'c1',
          courseName: coursesData[0]?.title || 'Mathematics 101',
          type: 'presentation',
          updatedAt: '2024-03-10T14:20:00Z',
        },
        {
          id: 'l4',
          title: 'Cell Structure',
          moduleId: 'm3',
          moduleName: 'Cellular Biology Basics',
          courseId: coursesData[1]?.id || 'c2',
          courseName: coursesData[1]?.title || 'Biology 101',
          type: 'video',
          updatedAt: '2024-03-08T09:15:00Z',
        },
      ]);
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch content';
      setError(errorMessage);
      console.error('Error fetching content:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredCourses = courses.filter(course => {
    if (searchQuery && !course.title.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    if (statusFilter !== 'all' && course.status !== statusFilter) {
      return false;
    }
    return true;
  });

  const filteredModules = modules.filter(module => {
    if (searchQuery && !module.title.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    return true;
  });

  const filteredLessons = lessons.filter(lesson => {
    if (searchQuery && !lesson.title.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    if (typeFilter !== 'all' && lesson.type !== typeFilter) {
      return false;
    }
    return true;
  });

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

  const getContentTypeBadge = (type: string) => {
    switch (type) {
      case 'video':
        return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">Video</Badge>;
      case 'text':
        return <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-100">Text</Badge>;
      case 'presentation':
        return <Badge className="bg-indigo-100 text-indigo-800 hover:bg-indigo-100">Presentation</Badge>;
      case 'quiz':
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Quiz</Badge>;
      default:
        return <Badge variant="outline">{type}</Badge>;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }).format(date);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-80 space-y-4">
        <RefreshCcw className="h-8 w-8 animate-spin text-primary" />
        <p className="text-muted-foreground">Loading content library...</p>
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
          onClick={fetchContent}
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
          <h2 className="heading-lg mb-1">Content Library</h2>
          <p className="text-muted-foreground">
            Browse and manage all educational content
          </p>
        </div>
        <div className="flex gap-2">
          <Link href="/dashboard/admin/courses/add">
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Add Content
            </Button>
          </Link>
        </div>
      </div>
      
      {/* Filters */}
      <Card className="border">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground/70" />
              <Input 
                type="search" 
                placeholder="Search content..." 
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <div className="flex gap-2">
              {activeTab === 'courses' && (
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[140px]">
                    <div className="flex items-center gap-2">
                      <Filter className="h-4 w-4" />
                      <span>Status</span>
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="published">Published</SelectItem>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="archived">Archived</SelectItem>
                  </SelectContent>
                </Select>
              )}
              
              {activeTab === 'lessons' && (
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger className="w-[140px]">
                    <div className="flex items-center gap-2">
                      <Layers className="h-4 w-4" />
                      <span>Type</span>
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="video">Video</SelectItem>
                    <SelectItem value="text">Text</SelectItem>
                    <SelectItem value="presentation">Presentation</SelectItem>
                    <SelectItem value="quiz">Quiz</SelectItem>
                  </SelectContent>
                </Select>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Content Browser */}
      <Tabs defaultValue="courses" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="courses" className="flex items-center gap-2">
            <BookText className="h-4 w-4" />
            <span>Courses</span>
          </TabsTrigger>
          <TabsTrigger value="modules" className="flex items-center gap-2">
            <Library className="h-4 w-4" />
            <span>Modules</span>
          </TabsTrigger>
          <TabsTrigger value="lessons" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            <span>Lessons</span>
          </TabsTrigger>
        </TabsList>
        
        {/* Courses Tab */}
        <TabsContent value="courses" className="mt-4">
          <div className="grid gap-4 grid-cols-1">
            {filteredCourses.length === 0 && (
              <div className="text-center py-10 text-muted-foreground">
                <BookOpen className="mx-auto h-8 w-8 mb-2 opacity-50" />
                <p>No courses found. Try adjusting your filters.</p>
              </div>
            )}
            
            {filteredCourses.map(course => (
              <div key={course.id} className="border rounded-lg p-4 bg-card">
                <div className="flex flex-col md:flex-row justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <BookText className="h-5 w-5 text-primary" />
                      <Link href={`/dashboard/admin/courses/edit/${course.id}`}>
                        <h3 className="font-medium text-lg hover:text-primary">{course.title}</h3>
                      </Link>
                      {getStatusBadge(course.status)}
                    </div>
                    <p className="text-muted-foreground mb-2">{course.description || 'No description provided'}</p>
                    <div className="flex flex-wrap gap-2 items-center text-sm text-muted-foreground">
                      <span>Code: {course.code}</span>
                      <Separator orientation="vertical" className="h-4" />
                      <span>Grade: {course.gradeLevel}</span>
                      <Separator orientation="vertical" className="h-4" />
                      <span>Updated: {formatDate(course.updatedAt)}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Link href={`/dashboard/admin/courses/edit/${course.id}`}>
                      <Button variant="outline" size="sm">Edit</Button>
                    </Link>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">...</Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>Preview</DropdownMenuItem>
                        <DropdownMenuItem>Duplicate</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-red-600">Delete</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>
        
        {/* Modules Tab */}
        <TabsContent value="modules" className="mt-4">
          <div className="grid gap-4 grid-cols-1">
            {filteredModules.length === 0 && (
              <div className="text-center py-10 text-muted-foreground">
                <Library className="mx-auto h-8 w-8 mb-2 opacity-50" />
                <p>No modules found. Try adjusting your filters.</p>
              </div>
            )}
            
            {filteredModules.map(module => (
              <div key={module.id} className="border rounded-lg p-4 bg-card">
                <div className="flex flex-col md:flex-row justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Library className="h-5 w-5 text-primary" />
                      <Link href={`/dashboard/admin/content/modules/${module.id}`}>
                        <h3 className="font-medium text-lg hover:text-primary">{module.title}</h3>
                      </Link>
                    </div>
                    <div className="flex flex-wrap gap-2 items-center text-sm text-muted-foreground">
                      <span>Course: <Link href={`/dashboard/admin/courses/edit/${module.courseId}`} className="text-primary">{module.courseName}</Link></span>
                      <Separator orientation="vertical" className="h-4" />
                      <span>Lessons: {module.lessonCount}</span>
                      <Separator orientation="vertical" className="h-4" />
                      <span>Updated: {formatDate(module.updatedAt)}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Link href={`/dashboard/admin/content/modules/${module.id}`}>
                      <Button variant="outline" size="sm">Edit</Button>
                    </Link>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">...</Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>Preview</DropdownMenuItem>
                        <DropdownMenuItem>Duplicate</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-red-600">Delete</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>
        
        {/* Lessons Tab */}
        <TabsContent value="lessons" className="mt-4">
          <div className="grid gap-4 grid-cols-1">
            {filteredLessons.length === 0 && (
              <div className="text-center py-10 text-muted-foreground">
                <FileText className="mx-auto h-8 w-8 mb-2 opacity-50" />
                <p>No lessons found. Try adjusting your filters.</p>
              </div>
            )}
            
            {filteredLessons.map(lesson => (
              <div key={lesson.id} className="border rounded-lg p-4 bg-card">
                <div className="flex flex-col md:flex-row justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <FileText className="h-5 w-5 text-primary" />
                      <Link href={`/dashboard/admin/content/lessons/${lesson.id}`}>
                        <h3 className="font-medium text-lg hover:text-primary">{lesson.title}</h3>
                      </Link>
                      {getContentTypeBadge(lesson.type)}
                    </div>
                    <div className="flex flex-wrap gap-2 items-center text-sm text-muted-foreground">
                      <span>Module: <Link href={`/dashboard/admin/content/modules/${lesson.moduleId}`} className="text-primary">{lesson.moduleName}</Link></span>
                      <Separator orientation="vertical" className="h-4" />
                      <span>Course: <Link href={`/dashboard/admin/courses/edit/${lesson.courseId}`} className="text-primary">{lesson.courseName}</Link></span>
                      <Separator orientation="vertical" className="h-4" />
                      <span>Updated: {formatDate(lesson.updatedAt)}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Link href={`/dashboard/admin/content/lessons/${lesson.id}`}>
                      <Button variant="outline" size="sm">Edit</Button>
                    </Link>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">...</Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>Preview</DropdownMenuItem>
                        <DropdownMenuItem>Duplicate</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-red-600">Delete</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
} 