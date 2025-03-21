'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { LessonForm } from '@/components/content/LessonForm';
import { Button } from '@/components/ui/button';
import { FiArrowLeft } from 'react-icons/fi';
import { useToast } from '@/hooks/use-toast';
import { courseWizardService } from '@/services/courseWizardService';

export default function CreateLessonPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  
  const [moduleId, setModuleId] = useState<string | null>(null);
  const [courseId, setCourseId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Get module ID from URL query params
  useEffect(() => {
    const moduleIdParam = searchParams.get('moduleId');
    if (!moduleIdParam) {
      // No module ID provided, show error
      toast({
        title: 'No module selected',
        description: 'Please select a module first',
        variant: 'destructive',
      });
      router.push('/dashboard/admin/content-v2/modules');
      return;
    }
    
    setModuleId(moduleIdParam);
    
    // Defining the function outside of the async/await section
    async function fetchModuleDetails(id: string) {
      setIsLoading(true);
      try {
        const moduleData = await courseWizardService.getModule(id);
        if (moduleData && moduleData.course_id) {
          setCourseId(moduleData.course_id);
        }
      } catch (error) {
        console.error('Failed to fetch module details:', error);
        toast({
          title: 'Error',
          description: 'Failed to fetch module details',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchModuleDetails(moduleIdParam);
  }, [searchParams, router, toast]);

  // Handle successful lesson creation
  const handleLessonCreated = () => {
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

  if (!moduleId) {
    return (
      <div className="container py-6">
        <div className="flex flex-col items-center justify-center h-40 space-y-4">
          <p className="text-muted-foreground">
            Missing required information to create a lesson.
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
            Create New Lesson
          </h1>
          <p className="text-muted-foreground">
            Add a new lesson to your module
          </p>
        </div>
      </div>

      <LessonForm
        moduleId={moduleId}
        onSuccess={handleLessonCreated}
        onCancel={handleCancel}
      />
    </div>
  );
} 