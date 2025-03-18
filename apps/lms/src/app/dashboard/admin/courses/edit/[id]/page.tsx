'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { adminService } from '@/services/adminService';
import { Course, CourseViewModel } from '@/types/course';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { ArrowLeft, BookOpen, Save, TagIcon, Trash2, X } from 'lucide-react';

type DifficultyLevel = 'beginner' | 'intermediate' | 'advanced' | 'expert';

export default function EditCoursePage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const courseId = params.id;
  
  const [formData, setFormData] = useState<CourseViewModel>({
    id: '',
    title: '',
    description: '',
    code: '',
    status: 'draft',
    thumbnailUrl: '',
    difficultyLevel: 'beginner' as DifficultyLevel,
    tags: [],
    durationMinutes: 0,
    prerequisites: [],
    gradeLevel: '',
    academicYear: '',
    sequenceNumber: 1,
    metadata: {
      learning_objectives: [],
      target_audience: [],
      base_price: 0,
      currency: 'USD',
      pricing_type: 'one-time',
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    schoolId: '',
    instructorId: '',
  });

  const [currentTag, setCurrentTag] = useState('');
  const [currentObjective, setCurrentObjective] = useState('');
  const [currentAudience, setCurrentAudience] = useState('');
  const [currentPrerequisite, setCurrentPrerequisite] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
  const fetchCourse = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // First try to get from localStorage to work smoothly with local dev
        const localData = localStorage.getItem(`course_${courseId}`);
        if (localData) {
          setFormData(JSON.parse(localData));
          setLoading(false);
          return;
        }
        
        // If not in localStorage, get from API
      const course = await adminService.getCourse(courseId);
        if (course) {
          setFormData(course);
        } else {
          setError('Course not found');
        }
      } catch (err: any) {
        setError(err.message || 'Failed to load course');
        console.error('Error loading course:', err);
    } finally {
      setLoading(false);
    }
  };
    
    fetchCourse();
  }, [courseId]);

  const handleClose = () => {
    router.push('/dashboard/admin/courses');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await adminService.updateCourse(courseId, formData);
      router.push('/dashboard/admin/courses');
    } catch (err: any) {
      setError(err.message || 'Failed to save course');
      console.error('Error saving course:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCourse = async () => {
    setIsDeleting(true);
    setError(null);

    try {
      await adminService.deleteCourse(courseId);
      router.push('/dashboard/admin/courses');
    } catch (err: any) {
      setError(err.message || 'Failed to delete course');
      console.error('Error deleting course:', err);
      setIsDeleting(false);
    }
  };

  const addTag = () => {
    if (currentTag.trim() && !formData.tags?.includes(currentTag.trim())) {
      setFormData({
        ...formData,
        tags: [...(formData.tags || []), currentTag.trim()],
      });
      setCurrentTag('');
    }
  };

  const removeTag = (tag: string) => {
    setFormData({
      ...formData,
      tags: formData.tags?.filter((t) => t !== tag) || [],
    });
  };

  const handleAddObjective = () => {
    if (currentObjective.trim()) {
      const updatedMetadata = {
        ...formData.metadata,
        learning_objectives: [...(formData.metadata?.learning_objectives || []), currentObjective.trim()]
      };
      setFormData({ ...formData, metadata: updatedMetadata });
      setCurrentObjective('');
    }
  };

  const handleRemoveObjective = (index: number) => {
    const updatedLearningObjectives = [...(formData.metadata?.learning_objectives || [])];
    updatedLearningObjectives.splice(index, 1);
    
    const updatedMetadata = {
      ...formData.metadata,
      learning_objectives: updatedLearningObjectives
    };
    
    setFormData({ ...formData, metadata: updatedMetadata });
  };

  const handleAddAudience = () => {
    if (currentAudience.trim()) {
      const updatedMetadata = {
        ...formData.metadata,
        target_audience: [...(formData.metadata?.target_audience || []), currentAudience.trim()]
      };
      setFormData({ ...formData, metadata: updatedMetadata });
      setCurrentAudience('');
    }
  };

  const handleRemoveAudience = (index: number) => {
    const updatedTargetAudience = [...(formData.metadata?.target_audience || [])];
    updatedTargetAudience.splice(index, 1);
    
    const updatedMetadata = {
      ...formData.metadata,
      target_audience: updatedTargetAudience
    };
    
    setFormData({ ...formData, metadata: updatedMetadata });
  };

  const addPrerequisite = () => {
    if (currentPrerequisite.trim() && !formData.prerequisites?.includes(currentPrerequisite.trim())) {
      setFormData({
        ...formData,
        prerequisites: [...(formData.prerequisites || []), currentPrerequisite.trim()],
      });
      setCurrentPrerequisite('');
    }
  };

  const removePrerequisite = (prerequisite: string) => {
    setFormData({
      ...formData,
      prerequisites: formData.prerequisites?.filter((p) => p !== prerequisite) || [],
    });
  };

  if (loading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
        <span className="ml-3">Loading course...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h2 className="text-3xl font-bold tracking-tight">Edit Course</h2>
          <p className="text-muted-foreground">
            Update course "{formData.title}"
          </p>
        </div>
        <div className="flex space-x-2">
          <Button 
            variant="outline" 
          onClick={handleClose}
            className="gap-2"
        >
            <ArrowLeft className="h-4 w-4" />
          Back to Courses
          </Button>
          
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" className="gap-2">
                <Trash2 className="h-4 w-4" />
                Delete
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete Course</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to delete "{formData.title}"? This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={(e: React.MouseEvent) => {
                    e.preventDefault();
                    handleDeleteCourse();
                  }}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  {isDeleting ? "Deleting..." : "Delete"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
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
        <Tabs defaultValue="basic" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="basic">Basic Information</TabsTrigger>
            <TabsTrigger value="details">Course Details</TabsTrigger>
            <TabsTrigger value="metadata">Metadata & SEO</TabsTrigger>
          </TabsList>

          {/* Basic Information Tab */}
          <TabsContent value="basic" className="space-y-4 pt-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  Course Essentials
                </CardTitle>
                <CardDescription>
                  Basic information about your course
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Course Title<span className="text-red-500">*</span></Label>
                  <Input
                    id="title"
                    placeholder="Enter course title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <textarea
                    id="description"
                    placeholder="Provide a detailed description of your course"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  />
                </div>
                
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="code">Course Code<span className="text-red-500">*</span></Label>
                    <Input
                      id="code"
                      placeholder="e.g. CS101"
                      value={formData.code}
                      onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                      required
                    />
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
                  
                  <div className="space-y-2">
                    <Label htmlFor="thumbnailUrl">Cover Image URL</Label>
                    <Input
                      id="thumbnailUrl"
                    placeholder="https://example.com/image.jpg"
                      value={formData.thumbnailUrl}
                      onChange={(e) => setFormData({ ...formData, thumbnailUrl: e.target.value })}
                  />
              </div>

                  <div className="space-y-2">
                    <Label htmlFor="difficultyLevel">Difficulty Level<span className="text-red-500">*</span></Label>
                    <Select
                      value={formData.difficultyLevel}
                      onValueChange={(value) => setFormData({ ...formData, difficultyLevel: value as DifficultyLevel })}
                    >
                      <SelectTrigger id="difficultyLevel">
                        <SelectValue placeholder="Select difficulty level" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="beginner">Beginner</SelectItem>
                        <SelectItem value="intermediate">Intermediate</SelectItem>
                        <SelectItem value="advanced">Advanced</SelectItem>
                        <SelectItem value="expert">Expert</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="durationMinutes">Duration (minutes)</Label>
                  <Input
                    id="durationMinutes"
                    type="number"
                    min="0"
                    placeholder="Duration in minutes"
                    value={formData.durationMinutes}
                    onChange={(e) => setFormData({ ...formData, durationMinutes: parseInt(e.target.value) || 0 })}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Tags & Keywords</CardTitle>
                <CardDescription>
                  Add relevant tags to make your course more discoverable
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-2">
                  <div className="relative flex-1">
                    <TagIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Add a tag..."
                      value={currentTag}
                      onChange={(e) => setCurrentTag(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                      className="pl-9"
                    />
                  </div>
                  <Button type="button" onClick={addTag} variant="secondary">Add</Button>
                </div>
                
                {formData.tags && formData.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {formData.tags.map((tag: string, i: number) => (
                      <Badge key={i} variant="secondary" className="gap-1">
                        {tag}
                        <Button 
                          type="button" 
                          onClick={() => removeTag(tag)} 
                          variant="ghost" 
                          className="h-auto p-0 px-1 text-muted-foreground hover:text-foreground"
                        >
                          <X className="h-3 w-3" />
                          <span className="sr-only">Remove</span>
                        </Button>
                      </Badge>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Course Details Tab */}
          <TabsContent value="details" className="space-y-4 pt-4">
            <Card>
              <CardHeader>
                <CardTitle>Academic Information</CardTitle>
                <CardDescription>
                  Provide academic context for your course
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="gradeLevel">Grade Level</Label>
                    <Input
                      id="gradeLevel"
                      placeholder="e.g. High School, Undergraduate"
                      value={formData.gradeLevel}
                      onChange={(e) => setFormData({ ...formData, gradeLevel: e.target.value })}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="academicYear">Academic Year</Label>
                    <Input
                      id="academicYear"
                      placeholder="e.g. 2023-2024"
                      value={formData.academicYear}
                      onChange={(e) => setFormData({ ...formData, academicYear: e.target.value })}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="sequenceNumber">Sequence Number</Label>
                    <Input
                      id="sequenceNumber"
                      type="number"
                      min="1"
                      value={formData.sequenceNumber}
                      onChange={(e) => setFormData({ ...formData, sequenceNumber: parseInt(e.target.value) || 1 })}
                    />
                    <p className="text-xs text-muted-foreground">Used for ordering courses in a sequence</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Prerequisites</CardTitle>
                <CardDescription>
                  Specify any prerequisites for this course
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-2">
                  <Input
                    placeholder="Add a prerequisite..."
                    value={currentPrerequisite}
                    onChange={(e) => setCurrentPrerequisite(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addPrerequisite())}
                  />
                  <Button type="button" onClick={addPrerequisite} variant="secondary">Add</Button>
            </div>

                {formData.prerequisites && formData.prerequisites.length > 0 && (
                  <div className="mt-2 space-y-2">
                    {formData.prerequisites.map((prereq: string, i: number) => (
                      <div key={i} className="flex items-center justify-between gap-2 rounded-md border p-2">
                        <span>{prereq}</span>
                        <Button 
                  type="button"
                          onClick={() => removePrerequisite(prereq)} 
                          variant="ghost" 
                          size="sm"
                          className="text-muted-foreground hover:text-foreground"
                        >
                          <X className="h-4 w-4" />
                          <span className="sr-only">Remove</span>
                        </Button>
              </div>
                    ))}
            </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Metadata Tab */}
          <TabsContent value="metadata" className="space-y-4 pt-4">
            <Card>
              <CardHeader>
                <CardTitle>Learning Objectives</CardTitle>
                <CardDescription>
                  Define what students will learn from this course
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-2">
                  <Input
                    placeholder="Add a learning objective..."
                  value={currentObjective}
                  onChange={(e) => setCurrentObjective(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddObjective())}
                  />
                  <Button type="button" onClick={handleAddObjective} variant="secondary">Add</Button>
              </div>
                
                {formData.metadata?.learning_objectives && formData.metadata.learning_objectives.length > 0 && (
                  <div className="mt-2 space-y-2">
                    {formData.metadata.learning_objectives.map((objective: string, i: number) => (
                      <div key={i} className="flex items-center justify-between gap-2 rounded-md border p-2">
                    <span>{objective}</span>
                        <Button 
                      type="button"
                          onClick={() => handleRemoveObjective(i)} 
                          variant="ghost" 
                          size="sm"
                          className="text-muted-foreground hover:text-foreground"
                        >
                          <X className="h-4 w-4" />
                          <span className="sr-only">Remove</span>
                        </Button>
                      </div>
                    ))}
            </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Target Audience</CardTitle>
                <CardDescription>
                  Specify who this course is designed for
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-2">
                  <Input
                    placeholder="Add target audience..."
                  value={currentAudience}
                  onChange={(e) => setCurrentAudience(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddAudience())}
                  />
                  <Button type="button" onClick={handleAddAudience} variant="secondary">Add</Button>
                </div>
                
                {formData.metadata?.target_audience && formData.metadata.target_audience.length > 0 && (
                  <div className="mt-2 space-y-2">
                    {formData.metadata.target_audience.map((audience: string, i: number) => (
                      <div key={i} className="flex items-center justify-between gap-2 rounded-md border p-2">
                        <span>{audience}</span>
                        <Button 
                  type="button"
                          onClick={() => handleRemoveAudience(i)} 
                          variant="ghost" 
                          size="sm"
                          className="text-muted-foreground hover:text-foreground"
                        >
                          <X className="h-4 w-4" />
                          <span className="sr-only">Remove</span>
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Pricing Information</CardTitle>
                <CardDescription>
                  Optional pricing details for this course
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                  <div className="space-y-2">
                    <Label htmlFor="base_price">Base Price</Label>
                    <Input
                      id="base_price"
                      type="number"
                      min="0"
                      step="0.01"
                      placeholder="0.00"
                      value={formData.metadata?.base_price || 0}
                      onChange={(e) => setFormData({ 
                        ...formData, 
                        metadata: { 
                          ...formData.metadata, 
                          base_price: parseFloat(e.target.value) || 0 
                        } 
                      })}
                    />
              </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="currency">Currency</Label>
                    <Select
                      value={formData.metadata?.currency || 'USD'}
                      onValueChange={(value) => setFormData({ 
                        ...formData, 
                        metadata: { 
                          ...formData.metadata, 
                          currency: value 
                        } 
                      })}
                    >
                      <SelectTrigger id="currency">
                        <SelectValue placeholder="Select currency" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="USD">USD</SelectItem>
                        <SelectItem value="EUR">EUR</SelectItem>
                        <SelectItem value="GBP">GBP</SelectItem>
                        <SelectItem value="CAD">CAD</SelectItem>
                        <SelectItem value="AUD">AUD</SelectItem>
                      </SelectContent>
                    </Select>
            </div>

                  <div className="space-y-2">
                    <Label htmlFor="pricing_type">Pricing Type</Label>
                    <Select
                      value={formData.metadata?.pricing_type || 'one-time'}
                      onValueChange={(value) => setFormData({ 
                        ...formData, 
                        metadata: { 
                          ...formData.metadata, 
                          pricing_type: value 
                        } 
                      })}
                    >
                      <SelectTrigger id="pricing_type">
                        <SelectValue placeholder="Select pricing type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="one-time">One-time Payment</SelectItem>
                        <SelectItem value="subscription">Subscription</SelectItem>
                        <SelectItem value="free">Free</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
            </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="mt-6 flex justify-end space-x-4">
          <Button
                type="button"
            variant="outline"
                onClick={handleClose}
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
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent"></div>
                Saving...
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                Save Changes
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
} 