'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { courseWizardService } from '@/services/courseWizardService';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { LessonData } from './LessonCard';

interface LessonFormProps {
  lesson?: LessonData;
  moduleId: string;
  onSuccess?: (lessonId: string) => void;
  onCancel?: () => void;
  isEditing?: boolean;
}

export function LessonForm({
  lesson,
  moduleId,
  onSuccess,
  onCancel,
  isEditing = false,
}: LessonFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Form state
  const [title, setTitle] = useState(lesson?.title || '');
  const [description, setDescription] = useState(lesson?.description || '');
  const [duration, setDuration] = useState(lesson?.duration_minutes?.toString() || '10');
  const [contentType, setContentType] = useState<'video' | 'text' | 'quiz' | 'assignment'>(
    lesson?.content_type || 'video'
  );
  const [isMandatory, setIsMandatory] = useState(lesson?.is_mandatory ?? true);
  const [sequenceNumber, setSequenceNumber] = useState(lesson?.sequence_number?.toString() || '1');
  
  // Content-specific state
  const [videoUrl, setVideoUrl] = useState(lesson?.content?.video_url || '');
  const [textContent, setTextContent] = useState(lesson?.content?.text_content || '');
  
  // Form validation
  const validateForm = () => {
    if (!title.trim()) {
      toast({
        title: 'Error',
        description: 'Title is required',
        variant: 'destructive',
      });
      return false;
    }

    if (contentType === 'video' && !videoUrl.trim()) {
      toast({
        title: 'Error',
        description: 'Video URL is required for video lessons',
        variant: 'destructive',
      });
      return false;
    }

    if (contentType === 'text' && !textContent.trim()) {
      toast({
        title: 'Error',
        description: 'Text content is required for text lessons',
        variant: 'destructive',
      });
      return false;
    }

    return true;
  };

  // Prepare lesson data based on form fields
  const prepareLessonData = () => {
    const content: Record<string, any> = {};
    
    // Set content based on content type
    switch (contentType) {
      case 'video':
        content.video_url = videoUrl;
        break;
      case 'text':
        content.text_content = textContent;
        break;
      case 'quiz':
        content.quiz_items = [];
        break;
      case 'assignment':
        content.instructions = '';
        break;
    }

    return {
      title,
      description,
      content_type: contentType,
      content,
      duration_minutes: parseInt(duration, 10) || 0,
      is_mandatory: isMandatory,
      sequence_number: parseInt(sequenceNumber, 10) || 1,
      module_id: moduleId
    };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    const lessonData = prepareLessonData();
    
    try {
      if (isEditing && lesson?.id) {
        // Update existing lesson
        await courseWizardService.updateLesson(lesson.id, lessonData);
        toast({
          title: 'Success',
          description: 'Lesson updated successfully',
        });
      } else {
        // Create new lesson
        const response = await courseWizardService.addLesson(moduleId, lessonData);
        toast({
          title: 'Success',
          description: 'Lesson created successfully',
        });
        
        // Call onSuccess with the new lesson ID
        if (onSuccess && response.id) {
          onSuccess(response.id);
        }
      }
      
      // Navigate back to lessons page
      if (!onSuccess) {
        router.push(`/dashboard/admin/content-v2/lessons?moduleId=${moduleId}`);
      }
    } catch (error) {
      console.error('Failed to save lesson:', error);
      toast({
        title: 'Error',
        description: isEditing 
          ? 'Failed to update lesson' 
          : 'Failed to create lesson',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Render content type specific fields
  const renderContentTypeFields = () => {
    switch (contentType) {
      case 'video':
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="video_url">Video URL</Label>
              <Input
                id="video_url"
                placeholder="Enter video URL"
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
              />
              <p className="text-sm text-muted-foreground">
                Enter the URL for the video content (YouTube, Vimeo, etc.)
              </p>
            </div>
          </div>
        );
      
      case 'text':
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="text_content">Text Content</Label>
              <Textarea
                id="text_content"
                placeholder="Enter text content"
                className="min-h-[200px]"
                value={textContent}
                onChange={(e) => setTextContent(e.target.value)}
              />
              <p className="text-sm text-muted-foreground">
                Enter the text content for this lesson
              </p>
            </div>
          </div>
        );
        
      case 'quiz':
        return (
          <div className="p-4 bg-muted/50 rounded-lg text-center">
            <p className="text-muted-foreground">
              Quiz creation will be available after saving the lesson.
            </p>
          </div>
        );
        
      case 'assignment':
        return (
          <div className="p-4 bg-muted/50 rounded-lg text-center">
            <p className="text-muted-foreground">
              Assignment details will be available after saving the lesson.
            </p>
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle>{isEditing ? 'Edit Lesson' : 'Create New Lesson'}</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-6">
          {/* Basic Info */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                placeholder="Enter lesson title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
              <p className="text-sm text-muted-foreground">
                The title will be displayed in the course structure.
              </p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Enter lesson description"
                className="min-h-[100px]"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
              <p className="text-sm text-muted-foreground">
                Provide a brief description of what this lesson covers.
              </p>
            </div>
          </div>

          {/* Lesson Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="content_type">Content Type</Label>
              <Select
                value={contentType}
                onValueChange={(value: 'video' | 'text' | 'quiz' | 'assignment') => setContentType(value)}
              >
                <SelectTrigger id="content_type">
                  <SelectValue placeholder="Select content type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="video">Video</SelectItem>
                  <SelectItem value="text">Text</SelectItem>
                  <SelectItem value="quiz">Quiz</SelectItem>
                  <SelectItem value="assignment">Assignment</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-sm text-muted-foreground">
                The type of content this lesson contains.
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="duration">Duration (minutes)</Label>
              <Input
                id="duration"
                type="number"
                min="1"
                placeholder="Enter duration in minutes"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
              />
              <p className="text-sm text-muted-foreground">
                Estimated time to complete this lesson.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="sequence_number">Sequence Number</Label>
              <Input
                id="sequence_number"
                type="number"
                min="1"
                placeholder="Enter sequence number"
                value={sequenceNumber}
                onChange={(e) => setSequenceNumber(e.target.value)}
              />
              <p className="text-sm text-muted-foreground">
                Order in which this lesson appears.
              </p>
            </div>

            <div className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <Label className="text-base">
                  Mandatory
                </Label>
                <p className="text-sm text-muted-foreground">
                  Require students to complete this lesson.
                </p>
              </div>
              <Switch
                checked={isMandatory}
                onCheckedChange={setIsMandatory}
              />
            </div>
          </div>

          {/* Content Type Specific Fields */}
          <div className="border-t pt-6">
            <h3 className="text-lg font-medium mb-4">Content</h3>
            {renderContentTypeFields()}
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel || (() => router.back())}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <span className="mr-2">
                  <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                    />
                  </svg>
                </span>
                {isEditing ? 'Updating...' : 'Creating...'}
              </>
            ) : (
              isEditing ? 'Update Lesson' : 'Create Lesson'
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
} 