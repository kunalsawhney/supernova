"use client";

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { adminService } from '@/services/adminService';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { ChevronUp, ChevronDown, Save, RefreshCw, ArrowLeft } from 'lucide-react';
import { CourseWizardProvider } from '@/contexts/CourseWizardContext';
import { CourseWizard } from '../../create/CourseWizard';
import { QuickEditInterface } from './components/QuickEditInterface';
import { Spinner } from '@/components/ui/spinner';
import { useToast } from '@/hooks/use-toast';
import { Course, CourseViewModel } from '@/types/course';
import { courseService } from '@/services/courseService';


export function EditCourseClient({ courseId }: { courseId: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialMode = searchParams.get('mode') === 'wizard' ? 'wizard' : 'quick';
  const [editMode, setEditMode] = useState<'quick' | 'wizard'>(initialMode);
  const [course, setCourse] = useState<CourseViewModel | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  // Fetch course data on component mount
  useEffect(() => {
    const fetchCourse = async () => {
      try {
        setLoading(true);
        setError(null);
        // Fetch course with all related data (modules, lessons)
        const courseData = await courseService.getCourse(courseId, true);
        setCourse(courseData);
      } catch (err) {
        console.error('Failed to fetch course:', err);
        setError('Failed to load course data. Please try again.');
        toast({
          title: 'Error',
          description: 'Failed to load course data. Please try again.',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [courseId, toast]);

  const handleSaveCourse = async (updatedCourse: Course | CourseViewModel) => {
    try {
      setSaving(true);
      // Update course in the backend
      await adminService.updateCourse(updatedCourse.id, updatedCourse as any);
      
      // Type assertion to make TypeScript happy
      setCourse(updatedCourse as CourseViewModel);
      
      toast({
        title: 'Success',
        description: 'Course updated successfully',
      });
    } catch (err) {
      console.error('Failed to save course:', err);
      toast({
        title: 'Error',
        description: 'Failed to save course. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  const handleBackToCourses = () => {
    router.push('/dashboard/admin/content-v2/courses');
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-80 space-y-4">
        <Spinner size="lg" />
        <p className="text-muted-foreground">Loading course data...</p>
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="space-y-4">
        <div className="rounded-lg border border-red-200 bg-red-50 dark:bg-red-900/20 p-4">
          <p className="text-red-700 dark:text-red-300">{error || 'Course not found'}</p>
        </div>
        <Button onClick={handleBackToCourses}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Courses
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold">Edit Course: {course.title}</h1>
          <p className="text-muted-foreground">Make changes to your course content and settings</p>
        </div>
        
        <div className="flex gap-2 self-end sm:self-auto">
          <Button 
            variant="outline" 
            onClick={() => setEditMode(editMode === 'quick' ? 'wizard' : 'quick')}
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Switch to {editMode === 'quick' ? 'Wizard' : 'Quick Edit'} Mode
          </Button>
          
          <Button 
            variant="default" 
            onClick={() => handleBackToCourses()}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        </div>
      </div>
      
      {/* Edit Interface */}
      <div className="mt-6">
        {editMode === 'quick' ? (
          <QuickEditInterface 
            course={course as any} 
            onSave={handleSaveCourse}
            saving={saving}
          />
        ) : (
          <div>
            <Card className="p-6">
              <CourseWizardProvider initialData={course as any}>
                <CourseWizard 
                  isEditing={true}
                  onComplete={(updatedCourse) => {
                    handleSaveCourse(updatedCourse);
                    setEditMode('quick');
                  }}
                  onCancel={() => setEditMode('quick')} 
                />
              </CourseWizardProvider>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
} 