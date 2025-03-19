'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { adminService } from '@/services/adminService';
import { Course, CreateCourseData, DifficultyLevel, CourseStatus, PricingType } from '@/types/course';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, BookOpen, Clock, Pencil, Save, TagIcon, X, CheckCircle2, Layers, ArrowRight } from 'lucide-react';

export default function AddCoursePage() {
  const router = useRouter();
  
  const [formData, setFormData] = useState<CreateCourseData>({
    title: 'Introduction to Python',
    description: 'This course provides an introduction to programming and the Python language.  Students are introduced to core programming concepts like data structures, conditionals, loops, variables, and functions.  This course includes an overview of the various tools available for writing and running Python, and gets students coding quickly.  It also provides hands-on coding exercises using commonly used data structures, writing custom functions, and reading and writing to files. This course may be more robust than some other introductory python courses, as it delves deeper into certain essential programming topics.',
    code: 'course-1',
    status: 'draft',
    cover_image_url: 'https://plus.unsplash.com/premium_photo-1678565999332-1cde462f7b24',
    settings: {},
    difficulty_level: 'beginner',
    tags: [
      'Python',
      'Programming',
      'Beginner',
      'Coding',
      'Data Structures',
      'Functions',
      'Files'
    ],
    estimated_duration: 300,
    learning_objectives: [
      'Learn the basics of Python programming',
      'Understand core programming concepts',
      'Write and run Python code',
      'Use data structures and functions',
      'Read and write to files'
    ],
    target_audience: [
      'Students interested in learning Python programming',
      'Beginners with no prior programming experience',
      'Developers looking to refresh their Python skills',
      'Data scientists and analysts interested in automation'
    ],
    prerequisites: [
      'Basic computer literacy',
    ],
    completion_criteria: {},
    grade_level: '1',
    academic_year: '2024-2025',
    sequence_number: 1,
    base_price: 99,
    currency: 'USD',
    pricing_type: 'one-time'
  });

  const [currentTag, setCurrentTag] = useState('');
  const [currentObjective, setCurrentObjective] = useState('');
  const [currentAudience, setCurrentAudience] = useState('');
  const [currentPrerequisite, setCurrentPrerequisite] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [createdCourseId, setCreatedCourseId] = useState<string | null>(null);

  const handleClose = () => {
    router.push('/dashboard/admin/content/courses');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Validate required fields
    if (!formData.title || !formData.code || !formData.description || 
        !formData.status ) {
      setError('Please fill in all required fields');
      setLoading(false);
      return;
    }

    try {
      // Format the data according to the API expectations
      const courseData: CreateCourseData = {
        title: formData.title,
        code: formData.code,
        description: formData.description,
        status: formData.status,
        difficulty_level: formData.difficulty_level,
        grade_level: formData.grade_level,
        academic_year: formData.academic_year,
        sequence_number: Number(formData.sequence_number),
        cover_image_url: formData.cover_image_url || undefined,
        estimated_duration: formData.estimated_duration ? Number(formData.estimated_duration) : undefined,
        prerequisites: formData.prerequisites,
        tags: formData.tags,
        learning_objectives: formData.learning_objectives,
        target_audience: formData.target_audience,
        completion_criteria: formData.completion_criteria,
        base_price: formData.base_price ? Number(formData.base_price) : undefined,
        currency: formData.currency,
        pricing_type: formData.pricing_type
      };

      const course = await adminService.createCourse(courseData);
      setCreatedCourseId(course.id);
      setShowSuccess(true);
    } catch (err: any) {
      // Extract the most useful error message
      let errorMessage = 'Failed to save course';
      
      if (err.response?.data?.detail) {
        errorMessage = err.response.data.detail;
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      setError(errorMessage);
      console.error('Error saving course:', err);
    } finally {
      setLoading(false);
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
    setFormData({ ...formData, learning_objectives: updatedObjectives });
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
    setFormData({ ...formData, target_audience: updatedAudience });
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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h2 className="text-3xl font-bold tracking-tight">Add New Course</h2>
          <p className="text-muted-foreground">
            Create a new educational course for your curriculum
          </p>
        </div>
        <Button 
          variant="outline" 
          onClick={handleClose}
          className="gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Courses
        </Button>
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

      {showSuccess && createdCourseId && (
        <Card className="border-green-200 bg-green-50">
          <CardContent className="pt-6">
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-2 text-green-700">
                <CheckCircle2 className="h-5 w-5" />
                <p className="font-medium text-lg">Course created successfully!</p>
              </div>
              <p className="text-green-700">Your course has been created. What would you like to do next?</p>
              <div className="flex flex-col sm:flex-row gap-3 mt-2">
                <Button 
                  onClick={() => router.push(`/dashboard/admin/content/courses/${createdCourseId}/add-module`)}
                  className="gap-2"
                >
                  <Layers className="h-4 w-4" />
                  Add Modules to Course
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => router.push(`/dashboard/admin/content/courses/${createdCourseId}`)}
                  className="gap-2"
                >
                  <Pencil className="h-4 w-4" />
                  Edit Course Details
                </Button>
                <Button 
                  variant="ghost" 
                  onClick={() => router.push('/dashboard/admin/content/courses')}
                  className="gap-2"
                >
                  <ArrowRight className="h-4 w-4" />
                  Go to Courses List
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {!showSuccess && (
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
                    <Label htmlFor="description">Description<span className="text-red-500">*</span></Label>
                    <textarea
                      id="description"
                      placeholder="Provide a detailed description of your course"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                      required
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
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="coverImageUrl">Course Cover Image URL</Label>
                    <Input
                      id="coverImageUrl"
                      placeholder="https://example.com/images/course-cover.jpg"
                      value={formData.cover_image_url}
                      onChange={(e) => setFormData({ ...formData, cover_image_url: e.target.value })}
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
                  <CardTitle className="flex items-center gap-2">
                    <Pencil className="h-5 w-5" />
                    Course Details
                  </CardTitle>
                  <CardDescription>
                    Additional information to describe your course
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="difficultyLevel">Difficulty Level<span className="text-red-500">*</span></Label>
                      <Select
                        value={formData.difficulty_level}
                        onValueChange={(value) => setFormData({ ...formData, difficulty_level: value as DifficultyLevel })}
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
                      <Label htmlFor="estimatedDuration">Estimated Duration (hours)</Label>
                      <Input
                        id="estimatedDuration"
                        type="number"
                        placeholder="e.g. 40"
                        min="0"
                        value={formData.estimated_duration || ''}
                        onChange={(e) => setFormData({ ...formData, estimated_duration: parseInt(e.target.value) || 0 })}
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="gradeLevel">Grade Level</Label>
                      <Input
                        id="gradeLevel"
                        placeholder="e.g. High School, College, Professional"
                        value={formData.grade_level || ''}
                        onChange={(e) => setFormData({ ...formData, grade_level: e.target.value })}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="academicYear">Academic Year</Label>
                      <Input
                        id="academicYear"
                        placeholder="e.g. 2023-2024"
                        value={formData.academic_year || ''}
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
                      value={formData.sequence_number || ''}
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
                        value={formData.base_price || ''}
                        onChange={(e) => setFormData({ ...formData, base_price: parseFloat(e.target.value) || 0 })}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="currency">Currency</Label>
                      <Input
                        id="currency"
                        placeholder="USD"
                        maxLength={3}
                        value={formData.currency || ''}
                        onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="pricingType">Pricing Type</Label>
                      <Select
                        value={formData.pricing_type || ''}
                        onValueChange={(value) => setFormData({ ...formData, pricing_type: value as PricingType })}
                      >
                        <SelectTrigger id="pricingType">
                          <SelectValue placeholder="Select pricing type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="one-time">One-time</SelectItem>
                          <SelectItem value="subscription">Subscription</SelectItem>
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
                  Save Course
                </>
              )}
            </Button>
          </div>
        </form>
      )}
    </div>
  );
} 