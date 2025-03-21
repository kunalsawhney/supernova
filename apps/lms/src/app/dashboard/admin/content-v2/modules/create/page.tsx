'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ModuleForm } from '@/components/content/ModuleForm';
import { Button } from '@/components/ui/button';
import { FiArrowLeft } from 'react-icons/fi';
import { useToast } from '@/hooks/use-toast';
import { courseWizardService } from '@/services/courseWizardService';

export default function CreateModulePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  
  const [courseId, setCourseId] = useState<string | null>(null);
  const [contentId, setContentId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Get course ID from URL query params
  useEffect(() => {
    const courseIdParam = searchParams.get('courseId');
    if (!courseIdParam) {
      // No course ID provided, show error
      toast({
        title: 'No course selected',
        description: 'Please select a course first',
        variant: 'destructive',
      });
      router.push('/dashboard/admin/content-v2/courses');
      return;
    }
    
    setCourseId(courseIdParam);
    
    // Fetch course content ID using the course ID
    async function fetchContentId() {
      setIsLoading(true);
      try {
        // This would be an API call to get course details
        // For now, let's assume the content ID is supplied or we use a dummy
        // const courseDetails = await courseWizardService.getCourse(courseIdParam);
        // setContentId(courseDetails.content_id);
        
        // Temporary: use the courseId as contentId for now
        // In a real app, you would get this from the API
        setContentId(courseIdParam);
      } catch (error) {
        console.error('Failed to fetch course details:', error);
        toast({
          title: 'Error',
          description: 'Failed to fetch course details',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchContentId();
  }, [searchParams, router, toast]);

  // Handle successful module creation
  const handleModuleCreated = (moduleId: string) => {
    router.push(`/dashboard/admin/content-v2/lessons?moduleId=${moduleId}`);
  };
  
  // Cancel and go back to modules list
  const handleCancel = () => {
    router.push(
      courseId
        ? `/dashboard/admin/content-v2/modules?courseId=${courseId}`
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

  if (!courseId || !contentId) {
    return (
      <div className="container py-6">
        <div className="flex flex-col items-center justify-center h-40 space-y-4">
          <p className="text-muted-foreground">
            Missing required information to create a module.
          </p>
          <Button variant="outline" onClick={() => router.push('/dashboard/admin/content-v2/courses')}>
            Go to Courses
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
            Create New Module
          </h1>
          <p className="text-muted-foreground">
            Add a new module to your course
          </p>
        </div>
      </div>

      <ModuleForm
        courseId={courseId}
        contentId={contentId}
        onSuccess={handleModuleCreated}
        onCancel={handleCancel}
      />
    </div>
  );
} 