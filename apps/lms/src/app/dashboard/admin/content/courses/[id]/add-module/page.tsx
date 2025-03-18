'use client';

import { useState, use } from 'react';
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
  const [formData, setFormData] = useState<CreateModuleData>({
    title: '',
    description: '',
    course_id: courseId,
    sequence_number: 1,
    status: 'draft'
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      // This would be a real API call in production
      // For this example, we'll just simulate success
      
      // await adminService.createModule(formData);
      console.log('Creating module with data:', formData);
      
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