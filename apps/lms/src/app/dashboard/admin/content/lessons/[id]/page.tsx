'use client';

import { useState, useEffect, use } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  ArrowLeft,
  Save,
  ExternalLink,
  RefreshCcw,
  AlertCircle,
  CheckCircle,
  Video,
  FileText,
  FileQuestion,
  BookOpen,
  Settings,
  Library
} from 'lucide-react';
import { adminService } from '@/services/adminService';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

interface LessonData {
  id: string;
  title: string;
  description: string;
  type: 'text' | 'video' | 'presentation' | 'quiz';
  content: any;
  moduleId: string;
  moduleName: string;
  courseId: string;
  courseName: string;
  order: number;
  duration: number;
  hasQuiz: boolean;
}

export default function LessonEditorPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const lessonId = resolvedParams.id;
  const router = useRouter();
  
  const [lesson, setLesson] = useState<LessonData | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState<'text' | 'video' | 'presentation' | 'quiz'>('text');
  const [content, setContent] = useState<any>({ text: '' });
  const [duration, setDuration] = useState(0);
  const [hasQuiz, setHasQuiz] = useState(false);
  
  const [activeTab, setActiveTab] = useState('content');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSaved, setIsSaved] = useState(false);
  
  useEffect(() => {
    fetchLessonData();
  }, [lessonId]);
  
  const fetchLessonData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // This would be a real API call in production
      // For now, let's mock the data
      const mockLesson: LessonData = {
        id: lessonId,
        title: 'Introduction to Numbers',
        description: 'Learn about different types of numbers and basic operations.',
        type: 'text',
        content: { 
          text: `<h2>Introduction to Numbers</h2>
<p>In mathematics, we work with different types of numbers:</p>
<ul>
  <li><strong>Natural Numbers</strong>: 1, 2, 3, 4, ...</li>
  <li><strong>Whole Numbers</strong>: 0, 1, 2, 3, ...</li>
  <li><strong>Integers</strong>: ..., -3, -2, -1, 0, 1, 2, 3, ...</li>
  <li><strong>Rational Numbers</strong>: Numbers that can be expressed as fractions</li>
  <li><strong>Irrational Numbers</strong>: Numbers that cannot be expressed as fractions</li>
</ul>
<p>Basic operations with numbers include:</p>
<ul>
  <li>Addition (+)</li>
  <li>Subtraction (-)</li>
  <li>Multiplication (×)</li>
  <li>Division (÷)</li>
</ul>` 
        },
        moduleId: 'module-123',
        moduleName: 'Introduction to Mathematics',
        courseId: 'course-123',
        courseName: 'Mathematics 101',
        order: 1,
        duration: 15,
        hasQuiz: true
      };
      
      setLesson(mockLesson);
      setTitle(mockLesson.title);
      setDescription(mockLesson.description);
      setType(mockLesson.type);
      setContent(mockLesson.content);
      setDuration(mockLesson.duration);
      setHasQuiz(mockLesson.hasQuiz);
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch lesson data';
      setError(errorMessage);
      console.error('Error fetching lesson data:', err);
    } finally {
      setLoading(false);
    }
  };
  
  const handleSave = async () => {
    try {
      setIsSaved(false);
      
      // In a real app, this would save to the API
      // adminService.updateLesson(lessonId, { title, description, type, content, duration, hasQuiz });
      
      console.log('Saving lesson data:', {
        id: lessonId,
        title,
        description,
        type,
        content,
        duration,
        hasQuiz
      });
      
      // Show success message
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 3000);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to save lesson';
      setError(errorMessage);
      console.error('Error saving lesson:', err);
    }
  };
  
  const getLessonTypeIcon = (lessonType: string) => {
    switch (lessonType) {
      case 'video':
        return <Video className="h-5 w-5 text-blue-500" />;
      case 'text':
        return <FileText className="h-5 w-5 text-purple-500" />;
      case 'presentation':
        return <BookOpen className="h-5 w-5 text-green-500" />;
      case 'quiz':
        return <FileQuestion className="h-5 w-5 text-red-500" />;
      default:
        return <FileText className="h-5 w-5" />;
    }
  };
  
  const renderContentEditor = () => {
    switch (type) {
      case 'text':
        return (
          <div className="space-y-4">
            <div className="p-4 border rounded-md bg-muted/40">
              <p className="text-sm text-muted-foreground mb-2">
                This is a placeholder for a rich text editor (e.g., TipTap, Slate, or CKEditor).
                In a production environment, this would be a full WYSIWYG editor.
              </p>
              <Textarea
                value={content.text}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => 
                  setContent({ ...content, text: e.target.value })
                }
                rows={10}
                placeholder="Enter lesson content here..."
                className="font-mono text-sm"
              />
            </div>
          </div>
        );
      
      case 'video':
        return (
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-1 block">
                Video URL
              </label>
              <Input
                value={content.videoUrl || ''}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                  setContent({ ...content, videoUrl: e.target.value })
                }
                placeholder="Enter video URL (YouTube, Vimeo, etc.)"
              />
            </div>
            
            <div>
              <label className="text-sm font-medium mb-1 block">
                Video Description
              </label>
              <Textarea
                value={content.description || ''}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => 
                  setContent({ ...content, description: e.target.value })
                }
                rows={3}
                placeholder="Enter a brief description of the video"
              />
            </div>
            
            {content.videoUrl && (
              <div className="aspect-video bg-black/10 rounded-md flex items-center justify-center border">
                <div className="text-center p-4">
                  <Video className="h-10 w-10 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">Video Player Preview</p>
                  <p className="text-xs text-muted-foreground mt-1 break-all">{content.videoUrl}</p>
                </div>
              </div>
            )}
          </div>
        );
      
      case 'presentation':
        return (
          <div className="space-y-4">
            <div className="p-4 border rounded-md bg-muted/40">
              <p className="text-sm text-muted-foreground mb-2">
                This is a placeholder for a presentation editor.
                In a production environment, this would allow uploading and managing slide decks.
              </p>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Presentation Type</label>
                <RadioGroup defaultValue="slides" className="flex flex-col space-y-2">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="slides" id="slides" />
                    <Label htmlFor="slides">Slide Deck</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="interactive" id="interactive" />
                    <Label htmlFor="interactive">Interactive Presentation</Label>
                  </div>
                </RadioGroup>
              </div>
              
              <div className="mt-4">
                <Button variant="outline" className="mr-2">Upload Slides</Button>
                <Button variant="outline">Add Interactive Elements</Button>
              </div>
            </div>
          </div>
        );
      
      case 'quiz':
        return (
          <div className="space-y-4">
            <div className="p-4 border rounded-md bg-muted/40">
              <p className="text-sm text-muted-foreground mb-2">
                This is a placeholder for a quiz builder.
                In a production environment, this would be a full quiz creation interface.
              </p>
              
              <div className="border rounded-md p-4 mb-4 bg-card">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-medium">Question 1</h4>
                  <Badge>Multiple Choice</Badge>
                </div>
                <Input 
                  value="What is 2 + 2?" 
                  className="mb-2" 
                  placeholder="Enter question"
                />
                <div className="space-y-2 ml-4">
                  <div className="flex items-center gap-2">
                    <RadioGroupItem value="1" id="q1-1" checked />
                    <Input value="4" placeholder="Option 1" className="flex-1" />
                    <Badge className="bg-green-100 text-green-800">Correct</Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <RadioGroupItem value="2" id="q1-2" />
                    <Input value="3" placeholder="Option 2" className="flex-1" />
                  </div>
                  <div className="flex items-center gap-2">
                    <RadioGroupItem value="3" id="q1-3" />
                    <Input value="5" placeholder="Option 3" className="flex-1" />
                  </div>
                </div>
              </div>
              
              <Button variant="outline" className="w-full">
                + Add Question
              </Button>
            </div>
          </div>
        );
      
      default:
        return <p>Select a lesson type to start editing content</p>;
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-80 space-y-4">
        <RefreshCcw className="h-8 w-8 animate-spin text-primary" />
        <p className="text-muted-foreground">Loading lesson data...</p>
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
          onClick={fetchLessonData}
          className="ml-auto border-red-300 dark:border-red-800/30 text-red-800 dark:text-red-300 hover:bg-red-100 dark:hover:bg-red-900/30"
        >
          <RefreshCcw className="h-4 w-4 mr-2" />
          Retry
        </Button>
      </div>
    );
  }

  if (!lesson) {
    return (
      <div className="text-center py-10">
        <p>Lesson not found</p>
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
          <h2 className="heading-lg">Edit Lesson</h2>
        </div>
        
        <div className="flex items-center gap-2">
          {isSaved && (
            <div className="text-green-600 flex items-center gap-1 mr-2">
              <CheckCircle className="h-4 w-4" />
              <span>Saved</span>
            </div>
          )}
          
          <Button variant="outline" size="sm" className="gap-1">
            <ExternalLink className="h-4 w-4" />
            Preview
          </Button>
          
          <Button 
            onClick={handleSave}
            className="gap-1"
          >
            <Save className="h-4 w-4" />
            Save
          </Button>
        </div>
      </div>
      
      {/* Breadcrumb */}
      <div className="text-sm text-muted-foreground flex items-center gap-1">
        <span>Course:</span>
        <Link href={`/dashboard/admin/courses/edit/${lesson.courseId}`} className="text-primary hover:underline">
          {lesson.courseName}
        </Link>
        <span>•</span>
        <span>Module:</span>
        <Link href={`/dashboard/admin/content/modules/${lesson.moduleId}`} className="text-primary hover:underline">
          {lesson.moduleName}
        </Link>
        <span>•</span>
        <span>Lesson {lesson.order}</span>
      </div>
      
      {/* Lesson Type Indicator */}
      <div className="flex items-center gap-2">
        {getLessonTypeIcon(type)}
        <span className="font-medium">{type.charAt(0).toUpperCase() + type.slice(1)} Lesson</span>
        {hasQuiz && <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Has Quiz</Badge>}
      </div>
      
      {/* Lesson Editor Tabs */}
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
              <CardTitle>Lesson Information</CardTitle>
              <CardDescription>Basic details about this lesson</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label htmlFor="title" className="text-sm font-medium mb-1 block">
                  Lesson Title
                </label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTitle(e.target.value)}
                  placeholder="Enter lesson title"
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
                  placeholder="Enter lesson description"
                  rows={3}
                />
              </div>
              
              <div>
                <label htmlFor="lesson-type" className="text-sm font-medium mb-1 block">
                  Lesson Type
                </label>
                <Select 
                  value={type} 
                  onValueChange={(value: 'text' | 'video' | 'presentation' | 'quiz') => setType(value)}
                >
                  <SelectTrigger id="lesson-type">
                    <SelectValue placeholder="Select lesson type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="text">Text Content</SelectItem>
                    <SelectItem value="video">Video Lesson</SelectItem>
                    <SelectItem value="presentation">Presentation</SelectItem>
                    <SelectItem value="quiz">Quiz</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
          
          {/* Content Editor */}
          <Card>
            <CardHeader>
              <CardTitle>Lesson Content</CardTitle>
              <CardDescription>Create and edit the lesson content</CardDescription>
            </CardHeader>
            <CardContent>
              {renderContentEditor()}
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Settings Tab */}
        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Lesson Settings</CardTitle>
              <CardDescription>Configure lesson options and requirements</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">General Settings</h3>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="duration">Estimated Duration (minutes)</Label>
                    <p className="text-sm text-muted-foreground">
                      How long it takes to complete this lesson
                    </p>
                  </div>
                  <Input
                    id="duration"
                    type="number"
                    className="w-24"
                    value={duration}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDuration(parseInt(e.target.value) || 0)}
                  />
                </div>
                
                <div className="flex items-center justify-between pt-2">
                  <div className="space-y-0.5">
                    <Label htmlFor="hasQuiz">Include Quiz</Label>
                    <p className="text-sm text-muted-foreground">
                      Add a quiz at the end of this lesson
                    </p>
                  </div>
                  <Switch
                    id="hasQuiz"
                    checked={hasQuiz}
                    onCheckedChange={setHasQuiz}
                  />
                </div>
              </div>
              
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Access Settings</h3>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="requireCompletion">Required for Completion</Label>
                    <p className="text-sm text-muted-foreground">
                      Students must complete this lesson to progress
                    </p>
                  </div>
                  <Switch
                    id="requireCompletion"
                    checked={true}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="visibleToStudents">Visible to Students</Label>
                    <p className="text-sm text-muted-foreground">
                      Whether this lesson is visible to enrolled students
                    </p>
                  </div>
                  <Switch
                    id="visibleToStudents"
                    checked={true}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
} 