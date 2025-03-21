'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { LessonForm } from '@/components/content/LessonForm';
import { Button } from '@/components/ui/button';
import { FiArrowLeft } from 'react-icons/fi';
import { useToast } from '@/hooks/use-toast';
import { courseWizardService } from '@/services/courseWizardService';
import { LessonData } from '@/components/content/LessonCard';

export default function EditLessonPage({ params }: { params: { lessonId: string } }) {
  const router = useRouter();
  const { toast } = useToast();
  const { lessonId } = params;
  
  const [lesson, setLesson] = useState<LessonData | null>(null);
  const [moduleId, setModuleId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    async function fetchLessonData(id: string) {
      if (!id) {
        toast({
          title: 'No lesson selected',
          description: 'Please select a lesson to edit',
          variant: 'destructive',
        });
        router.push('/dashboard/admin/content-v2/modules');
        return;
      }
      
      setIsLoading(true);
      try {
        // Fetch lesson data
        const lessonData = await courseWizardService.getLesson(id);
        // Transform API data to match LessonData interface
        const transformedLesson: LessonData = {
          id: lessonData.id,
          title: lessonData.title,
          description: lessonData.description,
          sequence_number: lessonData.sequence_number,
          duration_minutes: lessonData.duration_minutes,
          content_type: lessonData.content_type,
          content: lessonData.content,
          is_mandatory: lessonData.is_mandatory || true,
          module_id: lessonData.module_id,
          completion_criteria: lessonData.completion_criteria
        };
        
        setLesson(transformedLesson);
        
        // Set module ID from the lesson data
        if (lessonData.module_id) {
          setModuleId(lessonData.module_id);
        }
      } catch (error) {
        console.error('Failed to fetch lesson:', error);
        toast({
          title: 'Error',
          description: 'Failed to fetch lesson data',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchLessonData(lessonId);
  }, [lessonId, router, toast]);

  // Handle successful lesson update
  const handleLessonUpdated = () => {
    toast({
      title: 'Success',
      description: 'Lesson has been updated successfully',
    });
    
    if (moduleId) {
      router.push(`/dashboard/admin/content-v2/lessons?moduleId=${moduleId}`);
    } else {
      router.push('/dashboard/admin/content-v2/modules');
    }
  };
  
  // Cancel and go back to lessons list
  const handleCancel = () => {
    router.push(
      moduleId 
        ? `/dashboard/admin/content-v2/lessons?moduleId=${moduleId}`
        : '/dashboard/admin/content-v2/modules'
    );
  };

  if (isLoading) {
    return (
      <div className="container py-6">
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  if (!lesson || !moduleId) {
    return (
      <div className="container py-6">
        <div className="flex flex-col items-center justify-center h-40 space-y-4">
          <p className="text-muted-foreground">
            Lesson not found or missing required information.
          </p>
          <Button variant="outline" onClick={() => router.push('/dashboard/admin/content-v2/modules')}>
            Go to Modules
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-6 space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" onClick={handleCancel}>
          <FiArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Edit Lesson
          </h1>
          <p className="text-muted-foreground">
            Update lesson information
          </p>
        </div>
      </div>

      <LessonForm
        lesson={lesson}
        moduleId={moduleId}
        onSuccess={handleLessonUpdated}
        onCancel={handleCancel}
        isEditing={true}
      />
    </div>
  );
} 