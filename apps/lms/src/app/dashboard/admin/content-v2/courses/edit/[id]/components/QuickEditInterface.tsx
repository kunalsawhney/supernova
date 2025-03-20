'use client';

import { useState } from 'react';
import { Course, CourseStatus, DifficultyLevel } from '@/types/course';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { 
  ChevronUp, 
  ChevronDown, 
  Plus, 
  Trash, 
  X, 
  Save,
  Check,
  Move
} from 'lucide-react';

interface QuickEditInterfaceProps {
  course: Course;
  onSave: (course: Course) => void;
  saving: boolean;
}

export function QuickEditInterface({ course, onSave, saving }: QuickEditInterfaceProps) {
  const [formState, setFormState] = useState<Course>({ ...course });
  const [expandedSections, setExpandedSections] = useState({
    basicInfo: true,
    settings: true,
    modules: true
  });
  
  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections({
      ...expandedSections,
      [section]: !expandedSections[section]
    });
  };
  
  const updateCourse = (field: keyof Course, value: any) => {
    setFormState({
      ...formState,
      [field]: value
    });
  };

  const handleSaveClick = () => {
    onSave(formState);
  };
  
  // Module operations
  const addModule = () => {
    const modules = [...formState.modules];
    const newSequenceNumber = modules.length > 0 
      ? Math.max(...modules.map(m => m.sequence_number)) + 1 
      : 1;
    
    modules.push({
      id: `temp-${Date.now()}`, // Will be replaced by server
      title: 'New Module',
      description: 'Module description',
      sequence_number: newSequenceNumber,
      status: 'draft',
      is_mandatory: true,
      lessons: []
    });
    
    setFormState({
      ...formState,
      modules
    });
  };
  
  const updateModule = (moduleId: string, field: string, value: any) => {
    const modules = formState.modules.map(module => {
      if (module.id === moduleId) {
        return {
          ...module,
          [field]: value
        };
      }
      return module;
    });
    
    setFormState({
      ...formState,
      modules
    });
  };
  
  const deleteModule = (moduleId: string) => {
    if (!confirm('Are you sure you want to delete this module? This action cannot be undone.')) {
      return;
    }
    
    const modules = formState.modules.filter(module => module.id !== moduleId);
    
    setFormState({
      ...formState,
      modules
    });
  };
  
  // Lesson operations
  const addLesson = (moduleId: string) => {
    const modules = formState.modules.map(module => {
      if (module.id === moduleId) {
        const lessons = [...module.lessons];
        const newSequenceNumber = lessons.length > 0 
          ? Math.max(...lessons.map(l => l.sequence_number)) + 1 
          : 1;
        
        lessons.push({
          id: `temp-${Date.now()}`, // Will be replaced by server
          title: 'New Lesson',
          description: 'Lesson description',
          sequence_number: newSequenceNumber,
          content_type: 'text',
          content: {},
          is_mandatory: true
        });
        
        return {
          ...module,
          lessons
        };
      }
      return module;
    });
    
    setFormState({
      ...formState,
      modules
    });
  };
  
  const updateLesson = (moduleId: string, lessonId: string, field: string, value: any) => {
    const modules = formState.modules.map(module => {
      if (module.id === moduleId) {
        const lessons = module.lessons.map(lesson => {
          if (lesson.id === lessonId) {
            return {
              ...lesson,
              [field]: value
            };
          }
          return lesson;
        });
        
        return {
          ...module,
          lessons
        };
      }
      return module;
    });
    
    setFormState({
      ...formState,
      modules
    });
  };
  
  const deleteLesson = (moduleId: string, lessonId: string) => {
    const modules = formState.modules.map(module => {
      if (module.id === moduleId) {
        const lessons = module.lessons.filter(lesson => lesson.id !== lessonId);
        
        return {
          ...module,
          lessons
        };
      }
      return module;
    });
    
    setFormState({
      ...formState,
      modules
    });
  };
  
  return (
    <div className="space-y-6">
      {/* Save button (fixed) */}
      <div className="sticky top-4 z-10 flex justify-end">
        <Button 
          className="shadow-md"
          onClick={handleSaveClick}
          disabled={saving}
        >
          {saving ? (
            <>Saving<span className="loading loading-dots ml-1"></span></>
          ) : (
            <><Save className="h-4 w-4 mr-2" /> Save Changes</>
          )}
        </Button>
      </div>
      
      {/* Basic Information Section */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between py-4">
          <div className="space-y-1">
            <CardTitle>Basic Information</CardTitle>
            <CardDescription>Course title, description, and other basic details</CardDescription>
          </div>
          <Button variant="ghost" size="icon" onClick={() => toggleSection("basicInfo")}>
            {expandedSections.basicInfo ? <ChevronUp /> : <ChevronDown />}
          </Button>
        </CardHeader>
        
        {expandedSections.basicInfo && (
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Course Title</Label>
                <Input 
                  id="title" 
                  value={formState.title} 
                  onChange={(e) => updateCourse("title", e.target.value)} 
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="code">Course Code</Label>
                <Input 
                  id="code" 
                  value={formState.code} 
                  onChange={(e) => updateCourse("code", e.target.value)} 
                />
              </div>
              
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="description">Description</Label>
                <Textarea 
                  id="description" 
                  rows={4}
                  value={formState.description} 
                  onChange={(e) => updateCourse("description", e.target.value)} 
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select 
                  value={formState.status as string} 
                  onValueChange={(value) => updateCourse("status", value)}
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
                <Label htmlFor="cover_image_url">Cover Image URL</Label>
                <Input 
                  id="cover_image_url" 
                  value={formState.cover_image_url || ''} 
                  onChange={(e) => updateCourse("cover_image_url", e.target.value)} 
                />
              </div>
            </div>
          </CardContent>
        )}
      </Card>
      
      {/* Course Settings Section */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between py-4">
          <div className="space-y-1">
            <CardTitle>Course Settings</CardTitle>
            <CardDescription>Difficulty, grade level, duration, and other settings</CardDescription>
          </div>
          <Button variant="ghost" size="icon" onClick={() => toggleSection("settings")}>
            {expandedSections.settings ? <ChevronUp /> : <ChevronDown />}
          </Button>
        </CardHeader>
        
        {expandedSections.settings && (
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="difficulty_level">Difficulty Level</Label>
                <Select 
                  value={formState.difficulty_level as string} 
                  onValueChange={(value) => updateCourse("difficulty_level", value)}
                >
                  <SelectTrigger id="difficulty_level">
                    <SelectValue placeholder="Select difficulty" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="beginner">Beginner</SelectItem>
                    <SelectItem value="intermediate">Intermediate</SelectItem>
                    <SelectItem value="advanced">Advanced</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="grade_level">Grade Level</Label>
                <Select 
                  value={formState.grade_level} 
                  onValueChange={(value) => updateCourse("grade_level", value)}
                >
                  <SelectTrigger id="grade_level">
                    <SelectValue placeholder="Select grade level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="elementary">Elementary School</SelectItem>
                    <SelectItem value="middle">Middle School</SelectItem>
                    <SelectItem value="high-school">High School</SelectItem>
                    <SelectItem value="college">College</SelectItem>
                    <SelectItem value="professional">Professional</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="academic_year">Academic Year</Label>
                <Select 
                  value={formState.academic_year} 
                  onValueChange={(value) => updateCourse("academic_year", value)}
                >
                  <SelectTrigger id="academic_year">
                    <SelectValue placeholder="Select academic year" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="2023-2024">2023-2024</SelectItem>
                    <SelectItem value="2024-2025">2024-2025</SelectItem>
                    <SelectItem value="2025-2026">2025-2026</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="estimated_duration">Duration (hours)</Label>
                <Input 
                  id="estimated_duration" 
                  type="number"
                  value={formState.estimated_duration || ''} 
                  onChange={(e) => updateCourse("estimated_duration", parseInt(e.target.value) || 0)} 
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="sequence_number">Sequence Number</Label>
                <Input 
                  id="sequence_number" 
                  type="number"
                  value={formState.sequence_number} 
                  onChange={(e) => updateCourse("sequence_number", parseInt(e.target.value) || 1)} 
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="base_price">Base Price</Label>
                <Input 
                  id="base_price" 
                  type="number"
                  step="0.01"
                  value={formState.base_price || ''} 
                  onChange={(e) => updateCourse("base_price", parseFloat(e.target.value) || 0)} 
                />
              </div>
            </div>
          </CardContent>
        )}
      </Card>
      
      {/* Modules and Lessons Section */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between py-4">
          <div className="space-y-1">
            <CardTitle>Course Content</CardTitle>
            <CardDescription>Manage modules and lessons</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={addModule}>
              <Plus className="h-4 w-4 mr-1" /> Add Module
            </Button>
            <Button variant="ghost" size="icon" onClick={() => toggleSection("modules")}>
              {expandedSections.modules ? <ChevronUp /> : <ChevronDown />}
            </Button>
          </div>
        </CardHeader>
        
        {expandedSections.modules && (
          <CardContent>
            <div className="space-y-6">
              {formState.modules.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No modules yet. Click "Add Module" to create your first module.
                </div>
              ) : (
                formState.modules
                  .sort((a, b) => a.sequence_number - b.sequence_number)
                  .map((module, moduleIndex) => (
                    <div key={module.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-4">
                        <div className="space-y-2 flex-1">
                          <div className="flex items-center gap-2">
                            <span className="text-muted-foreground font-medium mr-2">
                              {module.sequence_number}.
                            </span>
                            <Input 
                              value={module.title} 
                              onChange={(e) => updateModule(module.id, "title", e.target.value)}
                              className="text-lg font-medium h-9" 
                            />
                            <Badge className={
                              module.status === 'published' 
                                ? 'bg-green-100 text-green-800'
                                : 'bg-yellow-100 text-yellow-800'
                            }>
                              {module.status === 'published' ? 'Published' : 'Draft'}
                            </Badge>
                          </div>
                          <Textarea 
                            value={module.description || ''} 
                            onChange={(e) => updateModule(module.id, "description", e.target.value)}
                            className="text-sm"
                            placeholder="Module description"
                            rows={2}
                          />
                          <div className="flex items-center gap-2">
                            <Label htmlFor={`module-${module.id}-status`} className="text-sm">Status:</Label>
                            <Select 
                              value={module.status} 
                              onValueChange={(value) => updateModule(module.id, "status", value)}
                            >
                              <SelectTrigger id={`module-${module.id}-status`} className="h-8 w-28">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="draft">Draft</SelectItem>
                                <SelectItem value="published">Published</SelectItem>
                                <SelectItem value="archived">Archived</SelectItem>
                              </SelectContent>
                            </Select>
                            
                            <Label className="text-sm ml-4 flex items-center gap-2">
                              <input 
                                type="checkbox"
                                checked={module.is_mandatory}
                                onChange={(e) => updateModule(module.id, "is_mandatory", e.target.checked)}
                                className="checkbox checkbox-sm"
                              />
                              Mandatory
                            </Label>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="ghost" size="icon" onClick={() => deleteModule(module.id)}>
                            <Trash className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </div>
                      
                      {/* Lessons */}
                      <div className="space-y-2 pl-4 border-l-2 border-muted mt-4">
                        <h4 className="font-medium text-sm ml-2 mb-2">Lessons</h4>
                        
                        {module.lessons.length === 0 ? (
                          <div className="text-sm text-muted-foreground ml-2 mb-2">
                            No lessons yet. Add your first lesson.
                          </div>
                        ) : (
                          module.lessons
                            .sort((a, b) => a.sequence_number - b.sequence_number)
                            .map((lesson, lessonIndex) => (
                              <div key={lesson.id} className="flex items-center justify-between gap-2 p-2 bg-muted/50 rounded-md">
                                <div className="flex items-center gap-2 flex-1">
                                  <span className="text-sm font-medium text-muted-foreground">{lesson.sequence_number}.</span>
                                  <Input 
                                    value={lesson.title} 
                                    onChange={(e) => updateLesson(module.id, lesson.id, "title", e.target.value)}
                                    className="h-8 text-sm flex-1" 
                                  />
                                  <Select 
                                    value={lesson.content_type} 
                                    onValueChange={(value) => updateLesson(module.id, lesson.id, "content_type", value)}
                                  >
                                    <SelectTrigger className="h-8 w-24">
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="text">Text</SelectItem>
                                      <SelectItem value="video">Video</SelectItem>
                                      <SelectItem value="quiz">Quiz</SelectItem>
                                      <SelectItem value="assignment">Assignment</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                                <Button variant="ghost" size="icon" onClick={() => deleteLesson(module.id, lesson.id)}>
                                  <X className="h-3 w-3" />
                                </Button>
                              </div>
                            ))
                        )}
                        
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="ml-2 mt-2" 
                          onClick={() => addLesson(module.id)}
                        >
                          <Plus className="h-3 w-3 mr-1" /> Add Lesson
                        </Button>
                      </div>
                    </div>
                  ))
              )}
            </div>
          </CardContent>
        )}
      </Card>
    </div>
  );
} 