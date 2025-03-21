'use client';

import { useState, useEffect, use } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  ArrowLeft,
  Save,
  Trash2,
  Plus,
  FileText,
  GripVertical,
  RefreshCcw,
  AlertCircle,
  CheckCircle,
  ExternalLink,
  MoveUp,
  MoveDown,
  Copy,
  Video,
  FileQuestion,
  Library,
  BookOpen
} from 'lucide-react';
import { adminService } from '@/services/adminService';
import { 
  DndContext, 
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { LessonViewModel } from '@/types/course';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface ModuleData {
  id: string;
  title: string;
  description: string;
  content_id: string;
  sequence_number: number;
  duration_weeks: number | null;
  status: 'draft' | 'published' | 'archived';
  is_mandatory: boolean;
  completion_criteria: Record<string, any> | null;
  lessons: LessonViewModel[];
}

interface SortableLessonProps {
  lesson: LessonViewModel;
  onEdit: (lesson: LessonViewModel) => void;
  onMove: (direction: 'up' | 'down', lessonId: string) => void;
  onDuplicate: (lessonId: string) => void;
  onDelete: (lessonId: string) => void;
}

function SortableLesson({ lesson, onEdit, onMove, onDuplicate, onDelete }: SortableLessonProps) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: lesson.id });
  
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };
  
  const getLessonTypeIcon = (type: string) => {
    switch (type) {
      case 'video':
        return <Video className="h-4 w-4 text-blue-500" />;
      case 'text':
        return <FileText className="h-4 w-4 text-purple-500" />;
      case 'presentation':
        return <BookOpen className="h-4 w-4 text-green-500" />;
      case 'quiz':
        return <FileQuestion className="h-4 w-4 text-red-500" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };
  
  return (
    <div 
      ref={setNodeRef} 
      style={style}
      className="border rounded-lg p-3 bg-card mb-2 cursor-grab active:cursor-grabbing"
    >
      <div className="flex items-center gap-3">
        <div className="touch-none" {...attributes} {...listeners}>
          <GripVertical className="h-5 w-5 text-muted-foreground" />
        </div>
        
        <div className="flex-1">
          <div className="flex items-center gap-2">
            {getLessonTypeIcon(lesson.type)}
            <span className="font-medium">{lesson.title}</span>
            {lesson.hasQuiz && 
              <Badge className="bg-red-100 text-red-800 hover:bg-red-100 text-xs">Quiz</Badge>
            }
          </div>
          {lesson.description && (
            <p className="text-sm text-muted-foreground mt-1 line-clamp-1">{lesson.description}</p>
          )}
        </div>
        
        <div className="flex items-center gap-1">
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => onMove('up', lesson.id)}
            title="Move up"
          >
            <MoveUp className="h-4 w-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => onMove('down', lesson.id)}
            title="Move down"
          >
            <MoveDown className="h-4 w-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => onDuplicate(lesson.id)}
            title="Duplicate"
          >
            <Copy className="h-4 w-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => onEdit(lesson)}
            className="text-primary"
            title="Edit"
          >
            Edit
          </Button>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => onDelete(lesson.id)}
            className="text-red-500"
            title="Delete"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function ModuleEditorPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const moduleId = resolvedParams.id;
  const router = useRouter();
  
  const [module, setModule] = useState<ModuleData | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [lessons, setLessons] = useState<LessonViewModel[]>([]);
  
  const [activeTab, setActiveTab] = useState('content');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSaved, setIsSaved] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [lessonToDelete, setLessonToDelete] = useState<string | null>(null);
  
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    fetchModuleData();
  }, [moduleId]);
  
  const fetchModuleData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // This would be a real API call in production
      // For now, let's mock the data
      const mockModule: ModuleData = {
        id: moduleId,
        title: 'Introduction to Mathematics',
        description: 'This module covers the fundamental concepts of mathematics including numbers, operations, and basic algebra.',
        content_id: 'course-123',
        sequence_number: 1,
        duration_weeks: 4,
        status: 'draft',
        is_mandatory: true,
        completion_criteria: null,
        lessons: [
          {
            id: 'l1',
            title: 'Numbers and Operations',
            description: 'Learn about different types of numbers and basic operations.',
            order: 1,
            type: 'video',
            content: { videoUrl: 'https://example.com/video1.mp4' },
            duration: 15,
            hasQuiz: true
          },
          {
            id: 'l2',
            title: 'Fractions and Decimals',
            description: 'Understanding fractions, decimals, and their operations.',
            order: 2,
            type: 'text',
            content: { text: 'Fractions represent parts of a whole...' },
            duration: 20,
            hasQuiz: false
          },
          {
            id: 'l3',
            title: 'Introduction to Algebra',
            description: 'Learn about variables, expressions, and equations.',
            order: 3,
            type: 'presentation',
            content: { slides: [] },
            duration: 25,
            hasQuiz: true
          }
        ]
      };
      
      setModule(mockModule);
      setTitle(mockModule.title);
      setDescription(mockModule.description);
      setLessons(mockModule.lessons);
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch module data';
      setError(errorMessage);
      console.error('Error fetching module data:', err);
    } finally {
      setLoading(false);
    }
  };
  
  const handleSave = async () => {
    try {
      setIsSaved(false);
      
      // In a real app, this would save to the API
      // adminService.updateModule(moduleId, { title, description, lessons });
      
      console.log('Saving module data:', {
        id: moduleId,
        title,
        description,
        lessons,
      });
      
      // Show success message
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 3000);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to save module';
      setError(errorMessage);
      console.error('Error saving module:', err);
    }
  };
  
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (over && active.id !== over.id) {
      setLessons((items) => {
        const oldIndex = items.findIndex(item => item.id === active.id);
        const newIndex = items.findIndex(item => item.id === over.id);
        
        const reordered = arrayMove(items, oldIndex, newIndex);
        
        // Update order property
        return reordered.map((item: LessonViewModel, index: number) => ({
          ...item,
          order: index + 1
        }));
      });
    }
  };
  
  const handleMoveLesson = (direction: 'up' | 'down', lessonId: string) => {
    setLessons((items) => {
      const index = items.findIndex(item => item.id === lessonId);
      
      if (
        (direction === 'up' && index === 0) || 
        (direction === 'down' && index === items.length - 1)
      ) {
        return items; // Can't move beyond boundaries
      }
      
      const newIndex = direction === 'up' ? index - 1 : index + 1;
      const reordered = arrayMove(items, index, newIndex);
      
      // Update order property
      return reordered.map((item: LessonViewModel, idx: number) => ({
        ...item,
        order: idx + 1
      }));
    });
  };
  
  const handleDuplicateLesson = (lessonId: string) => {
    const lessonToDuplicate = lessons.find(l => l.id === lessonId);
    
    if (lessonToDuplicate) {
      const newLesson: LessonViewModel = {
        ...lessonToDuplicate,
        id: `new-${Date.now()}`, // In production, the backend would generate a proper ID
        title: `${lessonToDuplicate.title} (Copy)`,
        order: lessons.length + 1
      };
      
      setLessons([...lessons, newLesson]);
    }
  };
  
  const confirmDeleteLesson = (lessonId: string) => {
    setLessonToDelete(lessonId);
    setShowDeleteDialog(true);
  };
  
  const handleDeleteLesson = () => {
    if (lessonToDelete) {
      setLessons(lessons.filter(l => l.id !== lessonToDelete));
      setShowDeleteDialog(false);
      setLessonToDelete(null);
    }
  };
  
  const handleAddLesson = () => {
    // In a real app, this would navigate to a lesson creation page
    // For now, let's add a placeholder lesson
    const newLesson: LessonViewModel = {
      id: `new-${Date.now()}`, // Temporary ID
      title: 'New Lesson',
      description: 'Add description here',
      order: lessons.length + 1,
      type: 'text',
      content: { text: '' },
      duration: 0,
      hasQuiz: false
    };
    
    setLessons([...lessons, newLesson]);
  };
  
  const handleEditLesson = (lesson: LessonViewModel) => {
    // In a real app, this would navigate to the lesson edit page
    router.push(`/dashboard/admin/content/lessons/${lesson.id}`);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-80 space-y-4">
        <RefreshCcw className="h-8 w-8 animate-spin text-primary" />
        <p className="text-muted-foreground">Loading module data...</p>
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
          onClick={fetchModuleData}
          className="ml-auto border-red-300 dark:border-red-800/30 text-red-800 dark:text-red-300 hover:bg-red-100 dark:hover:bg-red-900/30"
        >
          <RefreshCcw className="h-4 w-4 mr-2" />
          Retry
        </Button>
      </div>
    );
  }

  if (!module) {
    return (
      <div className="text-center py-10">
        <p>Module not found</p>
        <Link href="/dashboard/admin/content/library">
          <Button variant="link" className="mt-2">Return to Content Library</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.back()}
            className="gap-1"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
          <h2 className="heading-lg">Edit Module</h2>
        </div>
        
        <div className="flex items-center gap-2">
          {isSaved && (
            <div className="text-green-600 flex items-center gap-1 mr-2">
              <CheckCircle className="h-4 w-4" />
              <span>Saved</span>
            </div>
          )}
          
          <Link href={`/dashboard/admin/courses/edit/${module.content_id}`}>
            <Button variant="outline" size="sm" className="gap-1">
              <Library className="h-4 w-4" />
              View Course
            </Button>
          </Link>
          
          <Button 
            onClick={handleSave}
            className="gap-1"
          >
            <Save className="h-4 w-4" />
            Save Changes
          </Button>
        </div>
      </div>
      
      {/* Course breadcrumb */}
      <div className="text-sm text-muted-foreground flex items-center gap-1">
        <span>Course:</span>
        <Link href={`/dashboard/admin/courses/edit/${module.content_id}`} className="text-primary hover:underline">
          {module.content_id}
        </Link>
        <span>•</span>
        <span>Module {module.sequence_number}</span>
      </div>
      
      {/* Module Editor Tabs */}
      <Tabs defaultValue="content" value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="content">Content</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>
        
        {/* Content Tab */}
        <TabsContent value="content" className="space-y-6">
          {/* Basic Info */}
          <Card>
            <CardHeader>
              <CardTitle>Module Information</CardTitle>
              <CardDescription>Basic details about this module</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label htmlFor="title" className="text-sm font-medium mb-1 block">
                  Module Title
                </label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTitle(e.target.value)}
                  placeholder="Enter module title"
                />
              </div>
              
              <div>
                <label htmlFor="description" className="text-sm font-medium mb-1 block">
                  Description
                </label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setDescription(e.target.value)}
                  placeholder="Enter module description"
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>
          
          {/* Lessons */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Lessons</CardTitle>
                <CardDescription>Organize and manage lessons in this module</CardDescription>
              </div>
              
              <Button onClick={handleAddLesson} className="gap-1">
                <Plus className="h-4 w-4" />
                Add Lesson
              </Button>
            </CardHeader>
            
            <CardContent>
              {lessons.length === 0 ? (
                <div className="text-center py-6 border rounded-lg border-dashed">
                  <FileText className="h-8 w-8 mx-auto mb-2 text-muted-foreground opacity-50" />
                  <p className="text-muted-foreground">No lessons yet. Add your first lesson to get started.</p>
                  <Button onClick={handleAddLesson} variant="link" className="mt-2">
                    Add a Lesson
                  </Button>
                </div>
              ) : (
                <DndContext
                  sensors={sensors}
                  collisionDetection={closestCenter}
                  onDragEnd={handleDragEnd}
                >
                  <SortableContext
                    items={lessons.map(l => l.id)}
                    strategy={verticalListSortingStrategy}
                  >
                    {lessons.map((lesson) => (
                      <SortableLesson
                        key={lesson.id}
                        lesson={lesson}
                        onEdit={handleEditLesson}
                        onMove={handleMoveLesson}
                        onDuplicate={handleDuplicateLesson}
                        onDelete={confirmDeleteLesson}
                      />
                    ))}
                  </SortableContext>
                </DndContext>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Settings Tab */}
        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Module Settings</CardTitle>
              <CardDescription>Configure module behavior and accessibility</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="status" className="text-sm font-medium mb-1 block">
                    Status
                  </label>
                  <Select 
                    value={module?.status || 'draft'} 
                    onValueChange={(value) => {
                      if (module) {
                        setModule({
                          ...module,
                          status: value as 'draft' | 'published' | 'archived'
                        });
                      }
                    }}
                  >
                    <SelectTrigger id="status">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="published">Published</SelectItem>
                      <SelectItem value="archived">Archived</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label htmlFor="duration_weeks" className="text-sm font-medium mb-1 block">
                    Duration (weeks)
                  </label>
                  <Input
                    id="duration_weeks"
                    type="number"
                    min="0"
                    value={module?.duration_weeks || ''}
                    onChange={(e) => {
                      if (module) {
                        const value = e.target.value ? parseInt(e.target.value, 10) : null;
                        setModule({
                          ...module,
                          duration_weeks: value
                        });
                      }
                    }}
                    placeholder="Enter duration in weeks"
                  />
                </div>
                
                <div className="flex items-center space-x-2">
                  <input
                    id="is_mandatory"
                    type="checkbox"
                    className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                    checked={module?.is_mandatory || false}
                    onChange={(e) => {
                      if (module) {
                        setModule({
                          ...module,
                          is_mandatory: e.target.checked
                        });
                      }
                    }}
                  />
                  <label htmlFor="is_mandatory" className="text-sm font-medium">
                    Mandatory
                  </label>
                  <p className="text-xs text-muted-foreground ml-2">
                    Require students to complete this module
                  </p>
                </div>
                
                <div className="md:col-span-2">
                  <label htmlFor="sequence_number" className="text-sm font-medium mb-1 block">
                    Sequence Number
                  </label>
                  <Input
                    id="sequence_number"
                    type="number"
                    min="1"
                    value={module?.sequence_number || '1'}
                    onChange={(e) => {
                      if (module) {
                        const value = parseInt(e.target.value, 10);
                        setModule({
                          ...module,
                          sequence_number: value
                        });
                      }
                    }}
                    placeholder="Enter sequence number"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Determines the order of this module in the course
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      {/* Delete Confirmation */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Lesson</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this lesson? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteLesson} className="bg-red-600 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
} 