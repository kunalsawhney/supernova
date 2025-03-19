'use client';

import { useState, use, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { adminService } from '@/services/adminService';
import { CourseViewModel } from '@/types/course';
import { CreateModuleData } from '@/types/module';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Layers, Save } from 'lucide-react';

export default function AddModulePage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const courseId = resolvedParams.id;
  const router = useRouter();
  
  const [course, setCourse] = useState<CourseViewModel | null>(null);
  const [contentId, setContentId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<CreateModuleData>>({
    title: '',
    description: '',
    sequence_number: 1,
    status: 'draft'
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Fetch course data to get content ID
  useEffect(() => {
    const fetchCourse = async () => {
      try {
        setLoading(true);
        setError(null);
        console.log('Fetching course data for ID:', courseId);
        
        const courseData = await adminService.getCourse(courseId);
        console.log('Course data received:', JSON.stringify(courseData, null, 2));
        setCourse(courseData);
        
        // Try multiple sources for content ID
        let foundContentId = null;
        let source = 'unknown';
        
        // Option 1: Check latestVersionId directly
        if (courseData.latestVersionId) {
          console.log('Found content ID from latestVersionId:', courseData.latestVersionId);
          foundContentId = courseData.latestVersionId;
          source = 'latestVersionId';
        } 
        // Option 2: Check contentVersions array for content ID
        else if (courseData.contentVersions && courseData.contentVersions.length > 0) {
          console.log('Found content ID from contentVersions[0]:', courseData.contentVersions[0].id);
          foundContentId = courseData.contentVersions[0].id;
          source = 'contentVersions';
        }
        // Option 3: Check localStorage
        else {
          const storedVersionId = localStorage.getItem(`course_${courseId}_latest_version`);
          if (storedVersionId) {
            console.log('Found content ID from localStorage:', storedVersionId);
            foundContentId = storedVersionId;
            source = 'localStorage';
          }
        }
        
        if (foundContentId) {
          console.log(`Setting content ID to ${foundContentId} (source: ${source})`);
          setContentId(foundContentId);
        } else {
          // No content ID found - this shouldn't happen with our new backend logic
          console.error('No content ID found for course:', courseId);
          setError(`Could not determine content ID for this course. The course data appears incomplete. Please try again or contact support if the problem persists.`);
        }
      } catch (err) {
        console.error('Error fetching course:', err);
        const errorMessage = err instanceof Error ? err.message : 'Failed to fetch course data';
        setError(`${errorMessage}. Please try again or contact support if the problem persists.`);
      } finally {
        setLoading(false);
      }
    };
    
    fetchCourse();
  }, [courseId]);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    if (!contentId) {
      setError("Missing content ID - cannot create module");
      setLoading(false);
      return;
    }
    
    try {
      // Create the module with the content ID
      const moduleData: CreateModuleData = {
        ...formData as any,
        content_id: contentId
      };
      
      await adminService.addModule(moduleData);
      console.log('Creating module with data:', moduleData);
      
      // Return to the course details page after creating the module
      router.push(`/dashboard/admin/content/courses/${courseId}`);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create module';
      setError(errorMessage);
      console.error('Error creating module:', err);
    } finally {
      setLoading(false);
    }
  };
  
  const handleCancel = () => {
    router.push(`/dashboard/admin/content/courses/${courseId}`);
  };
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <button 
              onClick={handleCancel}
              className="text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="h-4 w-4" />
            </button>
            <h2 className="text-2xl font-bold">Add New Module</h2>
          </div>
          <p className="text-muted-foreground">
            Create a new module for this course
          </p>
        </div>
      </div>
      
      {error && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <div className="text-red-700">
              <p className="font-medium">Error</p>
              <p>{error}</p>
            </div>
          </CardContent>
        </Card>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Layers className="h-5 w-5 text-primary" />
              Module Information
            </CardTitle>
            <CardDescription>
              Enter the details for your new module
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Module Title<span className="text-red-500">*</span></Label>
              <Input
                id="title"
                placeholder="Enter module title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Provide a description of this module"
                value={formData.description || ''}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="min-h-[120px]"
              />
            </div>
            
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="sequenceNumber">Sequence Number<span className="text-red-500">*</span></Label>
                <Input
                  id="sequenceNumber"
                  type="number"
                  placeholder="e.g. 1"
                  min="1"
                  value={formData.sequence_number}
                  onChange={(e) => setFormData({ ...formData, sequence_number: parseInt(e.target.value) || 1 })}
                  required
                />
                <p className="text-sm text-muted-foreground">
                  The order in which this module appears in the course
                </p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="status">Status<span className="text-red-500">*</span></Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) => setFormData({ ...formData, status: value as 'draft' | 'published' | 'archived' })}
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
            </div>
          </CardContent>
        </Card>
        
        <div className="flex justify-end gap-3">
          <Button 
            type="button" 
            variant="outline" 
            onClick={handleCancel}
          >
            Cancel
          </Button>
          <Button 
            type="submit" 
            disabled={loading}
            className="gap-2"
          >
            {loading ? (
              <>
                <span className="animate-spin">...</span>
                Saving
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                Save Module
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
} 