'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ModuleForm } from '@/components/content/ModuleForm';
import { Button } from '@/components/ui/button';
import { FiArrowLeft } from 'react-icons/fi';
import { useToast } from '@/hooks/use-toast';
import { courseWizardService } from '@/services/courseWizardService';
import { Module } from '@/types/content';

export default function EditModulePage({ params }: { params: { moduleId: string } }) {
  const router = useRouter();
  const { toast } = useToast();
  const { moduleId } = params;
  
  const [module, setModule] = useState<Module | null>(null);
  const [courseId, setCourseId] = useState<string | null>(null);
  const [contentId, setContentId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    async function fetchModuleData() {
      if (!moduleId) {
        toast({
          title: 'No module selected',
          description: 'Please select a module to edit',
          variant: 'destructive',
        });
        router.push('/dashboard/admin/content-v2/modules');
        return;
      }
      
      setIsLoading(true);
      try {
        // Fetch module data
        const moduleData = await courseWizardService.getModule(moduleId);
        setModule(moduleData);
        
        // Set course ID from the module data
        if (moduleData.course_id) {
          setCourseId(moduleData.course_id);
        }
        
        // Set content ID (in a real app, this might come from the module or course data)
        // For now, we'll just use the course ID as the content ID
        setContentId(moduleData.course_id);
      } catch (error) {
        console.error('Failed to fetch module:', error);
        toast({
          title: 'Error',
          description: 'Failed to fetch module data',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchModuleData();
  }, [moduleId, router, toast]);

  // Handle successful module update
  const handleModuleUpdated = (updatedModuleId: string) => {
    toast({
      title: 'Success',
      description: 'Module has been updated successfully',
    });
    
    router.push(`/dashboard/admin/content-v2/modules?courseId=${courseId}`);
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

  if (!module || !courseId || !contentId) {
    return (
      <div className="container py-6">
        <div className="flex flex-col items-center justify-center h-40 space-y-4">
          <p className="text-muted-foreground">
            Module not found or missing required information.
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
            Edit Module
          </h1>
          <p className="text-muted-foreground">
            Update module information
          </p>
        </div>
      </div>

      <ModuleForm
        module={module}
        courseId={courseId}
        contentId={contentId}
        onSuccess={handleModuleUpdated}
        onCancel={handleCancel}
        isEditing={true}
      />
    </div>
  );
} 