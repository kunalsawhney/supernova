'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { adminService } from '@/services/adminService';
import { UpdateCourseData, CourseViewModel, CourseStatus, DifficultyLevel as CourseDifficultyLevel, PricingType } from '@/types/course';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { ArrowLeft, BookOpen, Save, TagIcon, Trash2, X } from 'lucide-react';
import { use } from 'react';

export default function EditCoursePage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const courseId = resolvedParams.id;
  const router = useRouter();
  
  const [formData, setFormData] = useState<UpdateCourseData>({
    id: '',
    title: '',
    description: '',
    code: '',
    status: 'draft',
    cover_image_url: '',
    difficulty_level: 'beginner',
    tags: [],
    estimated_duration: 0,
    prerequisites: [],
    grade_level: '',
    academic_year: '',
    sequence_number: 1,
    base_price: 0,
    currency: 'USD',
    pricing_type: 'one-time',
    learning_objectives: [],
    target_audience: [],
    completion_criteria: {},
    metadata: {},
  });

  const [currentTag, setCurrentTag] = useState('');
  const [currentObjective, setCurrentObjective] = useState('');
  const [currentAudience, setCurrentAudience] = useState('');
  const [currentPrerequisite, setCurrentPrerequisite] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saveLoading, setSaveLoading] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  useEffect(() => {
    const loadEditCourse = () => {
      const editCourseJson = localStorage.getItem('editCourse');
      if (editCourseJson) {
        try {
          const course = JSON.parse(editCourseJson);
          setFormData(course);
        } catch (err) {
          console.error('Error parsing course data from localStorage', err);
          fetchCourse();
        }
      } else {
        fetchCourse();
      }
    };

    loadEditCourse();
  }, [courseId]);

  const fetchCourse = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const courseViewModel = await adminService.getCourse(courseId);
      if (courseViewModel) {
        // Convert CourseViewModel to UpdateCourseData
        const updateData: UpdateCourseData = {
          id: courseViewModel.id,
          title: courseViewModel.title,
          description: courseViewModel.description,
          code: courseViewModel.code,
          status: courseViewModel.status as CourseStatus,
          cover_image_url: courseViewModel.coverImageUrl,
          difficulty_level: courseViewModel.difficultyLevel as CourseDifficultyLevel,
          tags: courseViewModel.tags,
          estimated_duration: courseViewModel.estimatedDuration ? Number(courseViewModel.estimatedDuration) : undefined,
          learning_objectives: courseViewModel.learningObjectives,
          target_audience: courseViewModel.targetAudience,
          prerequisites: courseViewModel.prerequisites,
          completion_criteria: courseViewModel.completionCriteria,
          grade_level: courseViewModel.gradeLevel,
          academic_year: courseViewModel.academicYear,
          sequence_number: courseViewModel.sequenceNumber,
          base_price: courseViewModel.basePrice,
          currency: courseViewModel.currency,
          pricing_type: courseViewModel.pricingType as PricingType,
          metadata: courseViewModel.metadata,
        };
        setFormData(updateData);
      } else {
        setError('Course not found');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch course';
      setError(errorMessage);
      console.error('Error fetching course:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Clean up localStorage when component unmounts
    return () => {
      localStorage.removeItem('editCourse');
    };
  }, []);

  const handleClose = () => {
    router.push('/dashboard/admin/content/courses');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaveLoading(true);
    setError(null);

    try {
      await adminService.updateCourse(courseId, formData);
      router.push('/dashboard/admin/content/courses');
    } catch (err: any) {
      setError(err.message || 'Failed to save course');
      console.error('Error saving course:', err);
    } finally {
      setSaveLoading(false);
    }
  };

  const handleDeleteCourse = async () => {
    try {
      await adminService.deleteCourse(courseId);
      // Redirect after successful deletion
      router.push('/dashboard/admin/content/courses');
    } catch (err: any) {
      setError(err.message || 'Failed to delete course');
      console.error('Error deleting course:', err);
      setShowDeleteDialog(false);
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
      tags: formData.tags?.filter((t: string) => t !== tag) || [],
    });
  };

  const handleAddObjective = () => {
    if (currentObjective.trim()) {
      setFormData({
        ...formData,
        learning_objectives: [...(formData.learning_objectives || []), currentObjective.trim()]
      });
      setCurrentObjective('');
    }
  };

  const handleRemoveObjective = (index: number) => {
    const updatedObjectives = [...(formData.learning_objectives || [])];
    updatedObjectives.splice(index, 1);
    setFormData({
      ...formData,
      learning_objectives: updatedObjectives
    });
  };

  const handleAddAudience = () => {
    if (currentAudience.trim()) {
      setFormData({
        ...formData,
        target_audience: [...(formData.target_audience || []), currentAudience.trim()]
      });
      setCurrentAudience('');
    }
  };

  const handleRemoveAudience = (index: number) => {
    const updatedAudience = [...(formData.target_audience || [])];
    updatedAudience.splice(index, 1);
    setFormData({
      ...formData,
      target_audience: updatedAudience
    });
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
      prerequisites: formData.prerequisites?.filter((p: string) => p !== prerequisite) || [],
    });
  };

  const handleCoverImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value;
    setFormData({
      ...formData,
      cover_image_url: url
    });
  };

  const handleDurationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const duration = e.target.value ? parseInt(e.target.value) : undefined;
    setFormData({
      ...formData,
      estimated_duration: duration
    });
  };

  // Input handling helper to avoid null values
  const getInputValue = (value: any): string => {
    return value === null || value === undefined ? '' : String(value);
  };

  // Duration handling
  const getDurationValue = (): string => {
    if (formData.estimated_duration === null || formData.estimated_duration === undefined) {
      return '';
    }
    return String(formData.estimated_duration);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-80">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading course...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h2 className="text-3xl font-bold tracking-tight">Edit Course</h2>
          <p className="text-muted-foreground">
            Update course information and settings
          </p>
        </div>
        <div className="flex gap-3">
          <Button 
            variant="outline"
            onClick={handleClose}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
          <Button 
            variant="outline" 
            className="text-red-500 border-red-200 hover:bg-red-50 hover:text-red-600 gap-2"
            onClick={() => setShowDeleteDialog(true)}
          >
            <Trash2 className="h-4 w-4" />
            Delete
          </Button>
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
                <CardTitle>Course Essentials</CardTitle>
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
                    value={getInputValue(formData.title)}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <textarea
                    id="description"
                    placeholder="Provide a detailed description of your course"
                    value={getInputValue(formData.description)}
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
                      value={getInputValue(formData.code)}
                      onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="status">Status<span className="text-red-500">*</span></Label>
                    <Select
                      value={getInputValue(formData.status)}
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
                
                <div className="space-y-2">
                  <Label htmlFor="thumbnailUrl">Course Thumbnail URL</Label>
                  <Input
                    id="thumbnailUrl"
                    placeholder="https://example.com/images/course-thumbnail.jpg"
                    value={getInputValue(formData.cover_image_url)}
                    onChange={handleCoverImageChange}
                  />
                  <p className="text-sm text-muted-foreground">Provide a URL to an image that represents your course</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Course Details Tab */}
          <TabsContent value="details" className="space-y-4 pt-4">
            <Card>
              <CardHeader>
                <CardTitle>Course Details</CardTitle>
                <CardDescription>
                  Additional information to describe your course
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="difficultyLevel">Difficulty Level<span className="text-red-500">*</span></Label>
                    <Select
                      value={getInputValue(formData.difficulty_level)}
                      onValueChange={(value) => setFormData({ ...formData, difficulty_level: value as CourseDifficultyLevel })}
                    >
                      <SelectTrigger id="difficultyLevel">
                        <SelectValue placeholder="Select difficulty" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="beginner">Beginner</SelectItem>
                        <SelectItem value="intermediate">Intermediate</SelectItem>
                        <SelectItem value="advanced">Advanced</SelectItem>
                        <SelectItem value="expert">Expert</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="durationMinutes">Duration (minutes)</Label>
                    <Input
                      id="durationMinutes"
                      type="number"
                      placeholder="e.g. 180"
                      min="0"
                      value={getDurationValue()}
                      onChange={handleDurationChange}
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="gradeLevel">Grade Level</Label>
                    <Input
                      id="gradeLevel"
                      placeholder="e.g. High School, College, Professional"
                      value={getInputValue(formData.grade_level)}
                      onChange={(e) => setFormData({ ...formData, grade_level: e.target.value })}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="academicYear">Academic Year</Label>
                    <Input
                      id="academicYear"
                      placeholder="e.g. 2023-2024"
                      value={getInputValue(formData.academic_year)}
                      onChange={(e) => setFormData({ ...formData, academic_year: e.target.value })}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="sequenceNumber">Sequence Number</Label>
                  <Input
                    id="sequenceNumber"
                    type="number"
                    placeholder="e.g. 1"
                    min="1"
                    value={getInputValue(formData.sequence_number)}
                    onChange={(e) => setFormData({ ...formData, sequence_number: parseInt(e.target.value) || 1 })}
                  />
                  <p className="text-sm text-muted-foreground">Order in which this course appears in lists</p>
                </div>
                
                <div className="space-y-2">
                  <Label>Tags</Label>
                  <div className="flex space-x-2">
                    <Input
                      placeholder="Add a tag and press enter"
                      value={currentTag}
                      onChange={(e) => setCurrentTag(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          addTag();
                        }
                      }}
                    />
                    <Button type="button" onClick={addTag} variant="outline">
                      Add
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {formData.tags?.map((tag: string, index: number) => (
                      <Badge key={index} variant="secondary" className="gap-1 pl-2">
                        <TagIcon className="h-3 w-3" />
                        {tag}
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="h-5 w-5 p-0 ml-1 hover:bg-transparent"
                          onClick={() => removeTag(tag)}
                        >
                          <X className="h-3 w-3" />
                          <span className="sr-only">Remove</span>
                        </Button>
                      </Badge>
                    ))}
                    {formData.tags?.length === 0 && (
                      <span className="text-sm text-muted-foreground">No tags added yet</span>
                    )}
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label>Prerequisites</Label>
                  <div className="flex space-x-2">
                    <Input
                      placeholder="Add a prerequisite and press enter"
                      value={currentPrerequisite}
                      onChange={(e) => setCurrentPrerequisite(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          addPrerequisite();
                        }
                      }}
                    />
                    <Button type="button" onClick={addPrerequisite} variant="outline">
                      Add
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {formData.prerequisites?.map((prerequisite: string, index: number) => (
                      <Badge key={index} variant="secondary" className="gap-1 pl-2">
                        <BookOpen className="h-3 w-3" />
                        {prerequisite}
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="h-5 w-5 p-0 ml-1 hover:bg-transparent"
                          onClick={() => removePrerequisite(prerequisite)}
                        >
                          <X className="h-3 w-3" />
                          <span className="sr-only">Remove</span>
                        </Button>
                      </Badge>
                    ))}
                    {formData.prerequisites?.length === 0 && (
                      <span className="text-sm text-muted-foreground">No prerequisites added yet</span>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Metadata Tab */}
          <TabsContent value="metadata" className="space-y-4 pt-4">
            <Card>
              <CardHeader>
                <CardTitle>Metadata & SEO</CardTitle>
                <CardDescription>
                  Additional metadata and information for course discovery
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Learning Objectives</Label>
                  <div className="flex space-x-2">
                    <Input
                      placeholder="Add a learning objective and press enter"
                      value={currentObjective}
                      onChange={(e) => setCurrentObjective(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddObjective();
                        }
                      }}
                    />
                    <Button type="button" onClick={handleAddObjective} variant="outline">
                      Add
                    </Button>
                  </div>
                  <div className="mt-2 space-y-2">
                    {formData.learning_objectives?.map((objective: string, index: number) => (
                      <div key={index} className="flex justify-between items-center bg-muted p-2 rounded-md">
                        <span>{objective}</span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveObjective(index)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                    {(!formData.learning_objectives || formData.learning_objectives.length === 0) && (
                      <span className="text-sm text-muted-foreground">No learning objectives added yet</span>
                    )}
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label>Target Audience</Label>
                  <div className="flex space-x-2">
                    <Input
                      placeholder="Add target audience and press enter"
                      value={currentAudience}
                      onChange={(e) => setCurrentAudience(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddAudience();
                        }
                      }}
                    />
                    <Button type="button" onClick={handleAddAudience} variant="outline">
                      Add
                    </Button>
                  </div>
                  <div className="mt-2 space-y-2">
                    {formData.target_audience?.map((audience: string, index: number) => (
                      <div key={index} className="flex justify-between items-center bg-muted p-2 rounded-md">
                        <span>{audience}</span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveAudience(index)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                    {(!formData.target_audience || formData.target_audience.length === 0) && (
                      <span className="text-sm text-muted-foreground">No target audience defined yet</span>
                    )}
                  </div>
                </div>
                
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                  <div className="space-y-2">
                    <Label htmlFor="basePrice">Base Price</Label>
                    <Input
                      id="basePrice"
                      type="number"
                      min="0"
                      step="0.01"
                      placeholder="0.00"
                      value={getInputValue(formData.base_price)}
                      onChange={(e) => {
                        setFormData({
                          ...formData, 
                          base_price: parseFloat(e.target.value) || 0
                        });
                      }}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="currency">Currency</Label>
                    <Input
                      id="currency"
                      placeholder="USD"
                      value={getInputValue(formData.currency)}
                      onChange={(e) => {
                        setFormData({
                          ...formData, 
                          currency: e.target.value
                        });
                      }}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="pricingType">Pricing Type</Label>
                    <Select
                      value={getInputValue(formData.pricing_type)}
                      onValueChange={(value) => {
                        setFormData({
                          ...formData, 
                          pricing_type: value as PricingType
                        });
                      }}
                    >
                      <SelectTrigger id="pricingType">
                        <SelectValue placeholder="Select pricing type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="one-time">One-time</SelectItem>
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

        <div className="flex items-center justify-end gap-4">
          <Button 
            type="button" 
            variant="outline" 
            onClick={handleClose}
          >
            Cancel
          </Button>
          <Button 
            type="submit" 
            disabled={saveLoading}
            className="gap-2"
          >
            {saveLoading ? (
              <>
                <span className="animate-spin">...</span>
                Saving
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

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this course and all of its content. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteCourse} className="bg-red-600 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
} 