'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { adminService } from '@/services/adminService';
import { CourseViewModel } from '@/types/course';
import { ModuleViewModel } from '@/types/module';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { 
  ArrowLeft, 
  BookOpen, 
  Calendar, 
  Clock, 
  Cog, 
  Edit, 
  FileEdit, 
  Layers, 
  LayoutGrid, 
  Move, 
  Plus, 
  RefreshCcw, 
  Settings, 
  Trash2, 
  AlertCircle,
  GripVertical,
  Bookmark,
  Tags
} from 'lucide-react';
import Link from 'next/link';

// Sample module data for demonstration
const sampleModules: ModuleViewModel[] = [
  {
    id: "1",
    title: "Introduction to the Course",
    description: "An overview of what to expect from this course",
    sequenceNumber: 1,
    lessonCount: 3,
    totalDuration: 45,
    status: "published"
  },
  {
    id: "2",
    title: "Core Concepts",
    description: "Learn the fundamental concepts that form the basis of the course",
    sequenceNumber: 2,
    lessonCount: 5,
    totalDuration: 90,
    status: "published"
  },
  {
    id: "3",
    title: "Advanced Topics",
    description: "Deeper exploration of complex topics in the subject area",
    sequenceNumber: 3,
    lessonCount: 4,
    totalDuration: 75,
    status: "draft"
  }
];

function ModuleCard({ module, onEdit, onDelete }: { 
  module: ModuleViewModel; 
  onEdit: (moduleId: string) => void;
  onDelete: (moduleId: string) => void;
}) {
  return (
    <Card className="mb-4 border hover:border-primary/50 transition-all">
      <CardHeader className="pb-2 flex flex-row items-start justify-between">
        <div>
          <div className="flex items-center gap-2">
            <div className="rounded-full bg-primary/10 p-1">
              <span className="text-primary font-medium text-sm">{module.sequenceNumber}</span>
            </div>
            <CardTitle className="text-xl">{module.title}</CardTitle>
            <Badge className={module.status === "published" ? "bg-green-100 text-green-800 hover:bg-green-100" : undefined}>
              {module.status === "published" ? "Published" : "Draft"}
            </Badge>
          </div>
          <CardDescription className="mt-1">{module.description}</CardDescription>
        </div>
        <div className="flex items-center gap-2">
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
          <Button 
            variant="ghost" 
            size="sm"
            className="cursor-move text-muted-foreground"
            title="Reorder module"
          >
            <GripVertical className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Layers className="h-4 w-4" />
            <span>{module.lessonCount} lessons</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            <span>{module.totalDuration} mins</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="pt-2">
        <Link href={`/dashboard/admin/content/modules/${module.id}`} className="w-full">
          <Button variant="outline" size="sm" className="w-full">
            <FileEdit className="h-4 w-4 mr-2" />
            Manage Lessons
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}

export default function CourseDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const courseId = resolvedParams.id;
  const router = useRouter();
  
  const [course, setCourse] = useState<CourseViewModel | null>(null);
  const [modules, setModules] = useState<ModuleViewModel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [moduleToDelete, setModuleToDelete] = useState<string | null>(null);
  
  useEffect(() => {
    fetchCourseData();
  }, [courseId]);
  
  const fetchCourseData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch course data
      const courseData = await adminService.getCourse(courseId);
      setCourse(courseData);
      
      // Fetch real modules for this course
      const moduleData = await adminService.getCourseModules(courseId);
      setModules(moduleData);
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch course data';
      setError(errorMessage);
      console.error('Error fetching course data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteModule = (moduleId: string) => {
    setModuleToDelete(moduleId);
    setShowDeleteDialog(true);
  };

  const confirmDeleteModule = async () => {
    if (!moduleToDelete) return;
    
    try {
      // Call the API to delete the module
      await adminService.deleteModule(moduleToDelete);
      
      // Update the local state
      setModules(modules.filter(module => module.id !== moduleToDelete));
      setShowDeleteDialog(false);
      setModuleToDelete(null);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete module';
      setError(errorMessage);
      console.error('Error deleting module:', err);
    }
  };

  const handleEditModule = (moduleId: string) => {
    router.push(`/dashboard/admin/content/modules/${moduleId}`);
  };

  const handleBack = () => {
    router.push('/dashboard/admin/content/courses');
  };

  const formatDuration = (minutes: number | undefined) => {
    if (!minutes) return 'Duration N/A';
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours === 0) return `${mins} min`;
    if (mins === 0) return `${hours} hr`;
    return `${hours} hr ${mins} min`;
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-80 space-y-4">
        <RefreshCcw className="h-8 w-8 animate-spin text-primary" />
        <p className="text-muted-foreground">Loading course...</p>
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
          onClick={fetchCourseData}
          className="ml-auto border-red-300 dark:border-red-800/30 text-red-800 dark:text-red-300 hover:bg-red-100 dark:hover:bg-red-900/30"
        >
          <RefreshCcw className="h-4 w-4 mr-2" />
          Retry
        </Button>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="flex flex-col items-center justify-center h-80 space-y-4">
        <AlertCircle className="h-8 w-8 text-yellow-500" />
        <p className="text-muted-foreground">Course not found</p>
        <Button onClick={handleBack}>
          Go Back
        </Button>
      </div>
    );
  }

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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <button onClick={handleBack} className="text-muted-foreground hover:text-foreground">
              <ArrowLeft className="h-4 w-4" />
            </button>
            <h2 className="heading-lg">{course.title}</h2>
            {getStatusBadge(course.status)}
          </div>
          <p className="text-muted-foreground">
            {course.description || 'No description provided'}
          </p>
        </div>
        <div className="flex gap-2">
          <Link href={`/dashboard/admin/content/courses/edit/${course.id}`}>
            <Button variant="outline" className="gap-2">
              <Edit className="h-4 w-4" />
              Edit Course
            </Button>
          </Link>
        </div>
      </div>

      {/* Course Tabs */}
      <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <BookOpen className="h-4 w-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="modules" className="flex items-center gap-2">
            <Layers className="h-4 w-4" />
            Modules
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Settings
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6 pt-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-primary" />
                Course Overview
              </CardTitle>
              <CardDescription>Basic information about this course</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="font-medium text-sm text-muted-foreground mb-1">Course Code</h3>
                  <p className="text-foreground">{course.code}</p>
                </div>
                <div>
                  <h3 className="font-medium text-sm text-muted-foreground mb-1">Difficulty Level</h3>
                  <p className="text-foreground flex items-center gap-2">
                    <Bookmark className="h-4 w-4 text-primary" />
                    {course.difficultyLevel || 'Not specified'}
                  </p>
                </div>
                <div>
                  <h3 className="font-medium text-sm text-muted-foreground mb-1">Duration</h3>
                  <p className="text-foreground flex items-center gap-2">
                    <Clock className="h-4 w-4 text-primary" />
                    {course.estimatedDuration ? `${course.estimatedDuration} minutes` : 'Not specified'}
                  </p>
                </div>
                <div>
                  <h3 className="font-medium text-sm text-muted-foreground mb-1">Academic Year</h3>
                  <p className="text-foreground flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-primary" />
                    {course.academicYear || 'Not specified'}
                  </p>
                </div>
              </div>
              
              <Separator />
              
              <div>
                <h3 className="font-medium text-sm text-muted-foreground mb-2">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {course.tags && course.tags.length > 0 ? (
                    course.tags.map((tag, index) => (
                      <Badge key={index} variant="secondary" className="flex items-center gap-1">
                        <Tags className="h-3 w-3" />
                        {tag}
                      </Badge>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground">No tags</p>
                  )}
                </div>
              </div>
              
              <Separator />
              
              <div>
                <h3 className="font-medium text-sm text-muted-foreground mb-2">Prerequisites</h3>
                {course.prerequisites && course.prerequisites.length > 0 ? (
                  <ul className="list-disc list-inside space-y-1">
                    {course.prerequisites.map((prerequisite, index) => (
                      <li key={index} className="text-foreground">{prerequisite}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-muted-foreground">No prerequisites</p>
                )}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <LayoutGrid className="h-5 w-5 text-primary" />
                Course Structure
              </CardTitle>
              <CardDescription>Summary of modules and lessons in this course</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="rounded-full bg-primary/10 p-2">
                      <Layers className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">{modules.length} Modules</p>
                      <p className="text-sm text-muted-foreground">
                        {modules.filter(m => m.status === 'published').length} published
                      </p>
                    </div>
                  </div>
                  <Button 
                    onClick={() => setActiveTab('modules')}
                    variant="ghost"
                  >
                    Manage Modules
                  </Button>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="rounded-full bg-primary/10 p-2">
                      <FileEdit className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">
                        {modules.reduce((total, module) => total + module.lessonCount, 0)} Lessons
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Across all modules
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="rounded-full bg-primary/10 p-2">
                      <Clock className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">
                        {modules.reduce((total, module) => total + module.totalDuration, 0)} Minutes
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Total course duration
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Modules Tab */}
        <TabsContent value="modules" className="space-y-6 pt-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Course Modules</h3>
            <Link href={`/dashboard/admin/content/courses/${courseId}/add-module`}>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Add Module
              </Button>
            </Link>
          </div>
          
          {modules.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                <div className="rounded-full bg-muted p-3 mb-3">
                  <Layers className="h-6 w-6 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-medium mb-1">No modules found</h3>
                <p className="text-muted-foreground text-sm mb-4 max-w-md">
                  This course doesn't have any modules yet. Add your first module to get started.
                </p>
                <Link href={`/dashboard/admin/content/courses/${courseId}/add-module`}>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Add your first module
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-2">
              {modules.map((module) => (
                <ModuleCard 
                  key={module.id} 
                  module={module} 
                  onEdit={handleEditModule} 
                  onDelete={handleDeleteModule}
                />
              ))}
            </div>
          )}
        </TabsContent>

        {/* Settings Tab */}
        <TabsContent value="settings" className="space-y-6 pt-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Cog className="h-5 w-5 text-primary" />
                Course Settings
              </CardTitle>
              <CardDescription>Advanced settings for this course</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="font-medium text-sm text-muted-foreground mb-1">Created At</h3>
                  <p className="text-foreground">
                    {new Date(course.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
                <div>
                  <h3 className="font-medium text-sm text-muted-foreground mb-1">Last Updated</h3>
                  <p className="text-foreground">
                    {new Date(course.updatedAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
                {/* Add more settings as needed */}
              </div>
            </CardContent>
            <CardFooter className="border-t pt-6 flex justify-between">
              <Button 
                variant="outline" 
                className="text-red-500 border-red-200 hover:bg-red-50 hover:text-red-600 gap-2"
                onClick={() => {
                  // Open a delete confirmation dialog
                }}
              >
                <Trash2 className="h-4 w-4" />
                Delete Course
              </Button>
              <Link href={`/dashboard/admin/content/courses/edit/${course.id}`}>
                <Button variant="default" className="gap-2">
                  <Edit className="h-4 w-4" />
                  Edit Course
                </Button>
              </Link>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Delete Module Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Module</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this module? This will remove all lessons within this module and cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeleteModule} className="bg-red-600 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
} 