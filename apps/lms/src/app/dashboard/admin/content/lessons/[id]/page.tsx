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
import { LessonViewModel } from '@/types/course';


export default function LessonEditorPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const lessonId = resolvedParams.id;
  const router = useRouter();
  
  const [lesson, setLesson] = useState<LessonViewModel | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [contentType, setContentType] = useState<'text' | 'pdf' | 'presentation' | 'video' | 'audio'>('text');
  const [content, setContent] = useState<Record<string, any>>({});
  const [durationMinutes, setDurationMinutes] = useState<number | null>(null);
  const [isMandatory, setIsMandatory] = useState(true);
  const [status, setStatus] = useState<string>('draft');
  const [moduleId, setModuleId] = useState('');
  const [sequenceNumber, setSequenceNumber] = useState(1);
  
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
      
      const lessonData = await adminService.getLesson(lessonId);
      
      setLesson(lessonData);
      setTitle(lessonData.title);
      setDescription(lessonData.description || '');
      setContentType(lessonData.contentType as 'text' | 'pdf' | 'presentation' | 'video' | 'audio');
      setContent(lessonData.content);
      setDurationMinutes(lessonData.durationMinutes);
      setIsMandatory(lessonData.isMandatory);
      setStatus(lessonData.status);
      setModuleId(lessonData.moduleId);
      setSequenceNumber(lessonData.sequenceNumber);
      
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
      
      const updatedLesson: LessonViewModel = {
        id: lessonId,
        title,
        description,
        moduleId: moduleId,
        sequenceNumber: sequenceNumber,
        contentType: contentType,
        content,
        durationMinutes: durationMinutes || 0,
        isMandatory: isMandatory,
        completionCriteria: lesson?.completionCriteria || null,
        status
      };
      
      // In a real app, this would save to the API
      // adminService.updateLesson(lessonId, updatedLesson);
      
      console.log('Saving lesson data:', updatedLesson);
      
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
      case 'pdf':
        return <FileText className="h-5 w-5 text-orange-500" />;
      case 'audio':
        return <FileText className="h-5 w-5 text-green-500" />;
      default:
        return <FileText className="h-5 w-5" />;
    }
  };
  
  const renderContentEditor = (contentType: string, content: Record<string, any>) => {
    switch (contentType) {
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
                value={content.video_url || ''}
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
                value={content.transcript || ''}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => 
                  setContent({ ...content, transcript: e.target.value })
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
      
      case 'audio':
        return (
          <div className="space-y-4">
            <div className="p-4 border rounded-md bg-muted/40">
              <p className="text-sm text-muted-foreground mb-2">
                This is a placeholder for an audio editor.
                In a production environment, this would allow uploading and managing audio files.
              </p>
              
              <div>
                <label className="text-sm font-medium mb-1 block">
                  Audio URL
                </label>
                <Input
                  value={content.audioUrl || ''}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                    setContent({ ...content, audioUrl: e.target.value })
                  }
                  placeholder="Enter audio URL or upload a file"
                />
              </div>
              
              <div className="mt-4">
                <Button variant="outline">Upload Audio File</Button>
              </div>
            </div>
          </div>
        );
      
      case 'pdf':
        return (
          <div className="space-y-4">
            <div className="p-4 border rounded-md bg-muted/40">
              <p className="text-sm text-muted-foreground mb-2">
                This is a placeholder for a PDF manager.
                In a production environment, this would allow uploading and managing PDF files.
              </p>
              
              <div>
                <label className="text-sm font-medium mb-1 block">
                  PDF URL
                </label>
                <Input
                  value={content.pdfUrl || ''}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                    setContent({ ...content, pdfUrl: e.target.value })
                  }
                  placeholder="Enter PDF URL or upload a file"
                />
              </div>
              
              <div className="mt-4">
                <Button variant="outline">Upload PDF File</Button>
              </div>
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
            size="md"
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
            size="md"
            // variant="outline"
          >
            <Save className="h-4 w-4" />
            Save
          </Button>
        </div>
      </div>
      
      {/* Breadcrumb */}
      <div className="text-sm text-muted-foreground flex items-center gap-1">
        <span>Course:</span>
        <Link href={`/dashboard/admin/courses/edit/${lesson.id}`} className="text-primary hover:underline">
          {lesson.title}
        </Link>
        <span>•</span>
        <span>Module:</span>
        <Link href={`/dashboard/admin/content/modules/${lesson.moduleId}`} className="text-primary hover:underline">
          {lesson.title}
        </Link>
        <span>•</span>
        <span>Lesson {lesson.sequenceNumber}</span>
      </div>
      
      {/* Lesson Type Indicator */}
      <div className="flex items-center gap-2">
        {getLessonTypeIcon(contentType)}
        <span className="font-medium">{contentType.charAt(0).toUpperCase() + contentType.slice(1)} Lesson</span>
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
                  value={contentType} 
                  onValueChange={(value: 'text' | 'pdf' | 'presentation' | 'video' | 'audio') => setContentType(value)}
                >
                  <SelectTrigger id="lesson-type">
                    <SelectValue placeholder="Select lesson type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="text">Text Content</SelectItem>
                    <SelectItem value="video">Video Lesson</SelectItem>
                    <SelectItem value="presentation">Presentation</SelectItem>
                    <SelectItem value="audio">Audio</SelectItem>
                    <SelectItem value="pdf">PDF</SelectItem>
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
              {renderContentEditor(lesson.contentType, lesson.content)}
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
                    value={durationMinutes || ''}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDurationMinutes(parseInt(e.target.value) || null)}
                  />
                </div>
                
                <div className="flex items-center justify-between pt-2">
                  <div className="space-y-0.5">
                    <Label htmlFor="isMandatory">Required for Completion</Label>
                    <p className="text-sm text-muted-foreground">
                      Students must complete this lesson to progress
                    </p>
                  </div>
                  <Switch
                    id="isMandatory"
                    checked={isMandatory}
                    onCheckedChange={setIsMandatory}
                  />
                </div>
              </div>
              
              <div className="tab-content space-y-4">
                <h3 className="text-lg font-medium">Access Settings</h3>
                <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="status">Status</Label>
                      <p className="text-sm text-muted-foreground">
                        Whether this lesson is published or archived
                      </p>
                    </div>
                    <Select
                      value={status}
                      onValueChange={(value: 'draft' | 'published' | 'archived') => setStatus(value)}
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
                
                <div className="flex flex-col space-y-2">
                  <Label htmlFor="sequence_number">Sequence Number</Label>
                  <p className="text-sm text-muted-foreground">
                    The order in which this lesson appears in the module
                  </p>
                  <Input
                    id="sequence_number"
                    type="number"
                    min="1"
                    value={sequenceNumber}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                      setSequenceNumber(parseInt(e.target.value, 10) || 1)
                    }
                    placeholder="Enter sequence number"
                  />
                </div>
                
                <div className="flex flex-col space-y-2">
                  <Label htmlFor="module_id">Module ID</Label>
                  <p className="text-sm text-muted-foreground">
                    The module this lesson belongs to
                  </p>
                  <Input
                    id="module_id"
                    value={moduleId}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                      setModuleId(e.target.value)
                    }
                    placeholder="Enter module ID"
                    disabled // Usually this would be a dropdown of available modules
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