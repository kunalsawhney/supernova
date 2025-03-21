'use client';

import { useEffect, useState } from 'react';
import { useCourseWizard } from '@/contexts/CourseWizardContext';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FiPlus, FiChevronUp, FiChevronDown, FiEdit2, FiTrash2, FiX, FiMenu, FiFile, FiLoader, FiCheck } from 'react-icons/fi';
import { AnimatePresence, motion } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';
import { courseWizardService } from '@/services/courseWizardService';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface Lesson {
  id?: string;
  title: string;
  description?: string;
  sequence_number: number;
  duration_minutes?: number;
  content_type: 'video' | 'text' | 'quiz' | 'assignment';
  content: Record<string, any>;
  is_mandatory: boolean;
  module_id: string;
  completion_criteria?: Record<string, any>;
}

interface SortableLessonItemProps {
  lesson: Lesson;
  isEditing: boolean;
  editingId: string | undefined;
  onEdit: (lesson: Lesson) => void;
  onDelete: (id: string) => void;
  onToggleExpand: (id: string) => void;
  isExpanded: boolean;
}

function SortableLessonItem({
  lesson,
  isEditing,
  editingId,
  onEdit,
  onDelete,
  onToggleExpand,
  isExpanded,
}: SortableLessonItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: lesson.id || `new-${lesson.sequence_number}` });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes}>
      <Card 
        className={`p-4 transition-all duration-200 ${
          editingId === lesson.id 
            ? 'ring-2 ring-primary ring-offset-2' 
            : isEditing 
              ? 'opacity-50 scale-98 pointer-events-none' 
              : 'hover:shadow-md'
        } ${isDragging ? 'shadow-lg' : ''}`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 flex-1">
            <button
              className="cursor-move touch-none p-1 opacity-50 hover:opacity-100 transition-opacity"
              {...listeners}
            >
              <FiMenu className="h-4 w-4" />
            </button>
            <span className="text-muted-foreground font-mono">
              {lesson.sequence_number.toString().padStart(2, '0')}
            </span>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h3 className="font-medium">{lesson.title}</h3>
                <span className="text-xs px-2 py-1 bg-muted rounded-full capitalize">
                  {lesson.content_type}
                </span>
              </div>
              {isExpanded && (
                <p className="text-sm text-muted-foreground mt-1">
                  {lesson.description}
                </p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onToggleExpand(lesson.id || '')}
            >
              {isExpanded ? (
                <FiChevronUp className="h-4 w-4" />
              ) : (
                <FiChevronDown className="h-4 w-4" />
              )}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onEdit(lesson)}
            >
              <FiEdit2 className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => lesson.id && onDelete(lesson.id)}
            >
              <FiTrash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Expanded Lesson Content */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="mt-4 pt-4 border-t"
            >
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label>Duration (minutes)</Label>
                  <div className="text-sm">
                    {lesson.duration_minutes || 'Not specified'}
                  </div>
                </div>
                <div>
                  <Label>Mandatory</Label>
                  <div className="text-sm">
                    {lesson.is_mandatory ? 'Yes' : 'No'}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </Card>
    </div>
  );
}

export function ContentStep() {
  const { state, dispatch } = useCourseWizard();
  const { toast } = useToast();
  const { moduleIds } = state.apiState;
  const [selectedModuleId, setSelectedModuleId] = useState<string | null>(null);
  const [isAddingLesson, setIsAddingLesson] = useState(false);
  const [editingLessonId, setEditingLessonId] = useState<string | null>(null);
  const [expandedLessons, setExpandedLessons] = useState<string[]>([]);
  const [savingLessonId, setSavingLessonId] = useState<string | null>(null);
  const [currentLesson, setCurrentLesson] = useState<Partial<Lesson>>({
    title: '',
    description: '',
    content_type: 'video',
    content: { video_url: '' },
    is_mandatory: true,
    duration_minutes: 10,
  });

  const modules = state.formData.modules || [];
  
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Pre-select the first module if none is selected and modules exist
  useEffect(() => {
    if (!selectedModuleId && modules.length > 0) {
      setSelectedModuleId(modules[0].id || null);
    }
  }, [modules, selectedModuleId]);

  // Get lessons for the currently selected module
  const currentModuleLessons = selectedModuleId
    ? modules.find(m => m.id === selectedModuleId)?.lessons || []
    : [];

  // Validate the step - at least one lesson in each module
  useEffect(() => {
    const isValid = modules.every(module => module.lessons && module.lessons.length > 0);
    dispatch({
      type: 'VALIDATE_STEP',
      payload: { step: 3, isValid },
    });
  }, [modules, dispatch]);

  const handleAddLesson = () => {
    if (!selectedModuleId) {
      toast({
        title: "No module selected",
        description: "Please select a module first",
        variant: "destructive"
      });
      return;
    }

    setCurrentLesson({
      title: '',
      description: '',
      sequence_number: (currentModuleLessons.length || 0) + 1,
      content_type: 'video',
      content: { video_url: '' },
      is_mandatory: true,
      module_id: selectedModuleId,
      duration_minutes: 10,
    });
    setIsAddingLesson(true);
    setEditingLessonId(null);
  };

  const handleEditLesson = (lesson: any) => {
    setCurrentLesson({ ...lesson });
    setEditingLessonId(lesson.id);
    setIsAddingLesson(true);
  };

  const handleSaveLesson = async () => {
    if (!currentLesson.title || !selectedModuleId) {
      toast({
        title: "Missing required fields",
        description: "Lesson title is required",
        variant: "destructive"
      });
      return;
    }

    // Generate a temporary ID if one doesn't exist
    const tempId = editingLessonId || `temp-${Date.now()}`;
    const lessonToSave = { 
      ...currentLesson, 
      id: tempId,
      module_id: selectedModuleId 
    };

    // Update local state first
    const updatedModules = modules.map(module => {
      if (module.id === selectedModuleId) {
        const existingLessons = module.lessons || [];
        let updatedLessons;
        
        if (editingLessonId) {
          // Update existing lesson
          updatedLessons = existingLessons.map(lesson => 
            lesson.id === editingLessonId ? lessonToSave : lesson
          );
        } else {
          // Add new lesson
          updatedLessons = [...existingLessons, lessonToSave];
        }
        
        return { ...module, lessons: updatedLessons };
      }
      return module;
    });

    dispatch({
      type: 'UPDATE_FORM',
      payload: { modules: updatedModules }
    });

    setIsAddingLesson(false);
    setEditingLessonId(null);

    // If we have the module ID from the API, save the lesson
    const apiModuleId = moduleIds[selectedModuleId];
    if (apiModuleId) {
      try {
        setSavingLessonId(tempId);
        
        // Prepare data for API
        const lessonData = {
          title: currentLesson.title,
          description: currentLesson.description || '',
          sequence_number: currentLesson.sequence_number,
          duration_minutes: currentLesson.duration_minutes,
          content_type: currentLesson.content_type,
          content: currentLesson.content,
          is_mandatory: currentLesson.is_mandatory,
          module_id: apiModuleId,
        };

        // Call API to save lesson
        const response = await courseWizardService.addLesson(apiModuleId, lessonData);
        
        // Store the API lesson ID in our context
        dispatch({
          type: 'ADD_LESSON_ID',
          payload: { localId: tempId, apiId: response.id }
        });

        toast({
          title: "Lesson saved",
          description: "Lesson has been saved successfully to the API",
        });
      } catch (error) {
        toast({
          title: "Error saving lesson",
          description: error instanceof Error ? error.message : "Failed to save lesson to the API",
          variant: "destructive",
        });
        console.error("Error saving lesson:", error);
      } finally {
        setSavingLessonId(null);
      }
    } else {
      toast({
        title: "Module not saved to API",
        description: "Cannot save lesson to API because the module hasn't been saved yet",
        variant: "warning",
      });
    }
  };

  const handleCancelEdit = () => {
    setIsAddingLesson(false);
    setEditingLessonId(null);
  };

  const handleDeleteLesson = (lessonId: string) => {
    const updatedModules = modules.map(module => {
      if (module.id === selectedModuleId) {
        return {
          ...module,
          lessons: (module.lessons || []).filter(lesson => lesson.id !== lessonId)
        };
      }
      return module;
    });

    dispatch({
      type: 'UPDATE_FORM',
      payload: { modules: updatedModules }
    });

    // TODO: Add API call to delete lesson if implemented
  };

  const handleToggleExpand = (id: string) => {
    setExpandedLessons(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const updatedModules = modules.map(module => {
        if (module.id === selectedModuleId) {
          const lessons = [...(module.lessons || [])];
          const oldIndex = lessons.findIndex(lesson => lesson.id === active.id);
          const newIndex = lessons.findIndex(lesson => lesson.id === over.id);
          
          // Reorder and update sequence numbers
          const reorderedLessons = arrayMove(lessons, oldIndex, newIndex).map((lesson, index) => ({
            ...lesson,
            sequence_number: index + 1,
          }));
          
          return { ...module, lessons: reorderedLessons };
        }
        return module;
      });

      dispatch({
        type: 'UPDATE_FORM',
        payload: { modules: updatedModules }
      });
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setCurrentLesson(prev => ({ ...prev, [field]: value }));
  };

  const handleContentChange = (key: string, value: any) => {
    setCurrentLesson(prev => ({
      ...prev,
      content: { ...prev.content, [key]: value }
    }));
  };

  // Helper to check if a lesson has been saved to the API
  const isLessonSavedToApi = (lessonId: string) => {
    return Boolean(state.apiState.lessonIds[lessonId]);
  };

  if (!state.formData.modules?.length) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <FiFile className="h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-lg font-medium">No Modules Created</h3>
        <p className="text-sm text-muted-foreground mt-2">
          Please create at least one module in the previous step before adding lessons.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Module Selection */}
      <div className="flex items-center gap-4">
        <div className="flex-1">
          <Label htmlFor="module">Select Module</Label>
          <Select
            value={selectedModuleId || ''}
            onValueChange={(value) => setSelectedModuleId(value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Choose a module" />
            </SelectTrigger>
            <SelectContent>
              {(state.formData.modules || []).map((module) => (
                <SelectItem 
                  key={module.id || `module-${module.sequence_number}`} 
                  value={module.id || `module-${module.sequence_number}`}
                >
                  {module.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="pt-6">
          <Button onClick={handleAddLesson} disabled={!selectedModuleId}>
            <FiPlus className="h-4 w-4 mr-2" />
            Add Lesson
          </Button>
        </div>
      </div>

      {/* Lesson List */}
      {selectedModuleId && (
        <>
          <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              {currentModuleLessons.length || 0} lessons
            </div>
            {!editingLessonId && currentModuleLessons.length > 0 && (
              <div className="text-sm text-muted-foreground">
                Drag lessons to reorder
              </div>
            )}
          </div>

          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={currentModuleLessons.map(l => l.id || `lesson-${l.sequence_number}`)}
              strategy={verticalListSortingStrategy}
            >
              <div className={`space-y-4 transition-all duration-200 ${editingLessonId ? 'opacity-50 pointer-events-none' : ''}`}>
                {currentModuleLessons.map((lesson) => (
                  <SortableLessonItem
                    key={lesson.id || `lesson-${lesson.sequence_number}`}
                    lesson={lesson}
                    isEditing={!!editingLessonId}
                    editingId={editingLessonId}
                    onEdit={handleEditLesson}
                    onDelete={handleDeleteLesson}
                    onToggleExpand={handleToggleExpand}
                    isExpanded={expandedLessons.includes(lesson.id || '')}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        </>
      )}

      {/* Lesson Edit Form */}
      <AnimatePresence>
        {isAddingLesson && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="mt-6 relative z-10"
          >
            <div className="absolute inset-0 bg-gradient-to-b from-background/50 to-background blur-xl -z-10" />
            <Card className="p-6 border-primary/50 shadow-lg">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold">
                  {editingLessonId ? 'Edit Lesson' : 'Add Lesson'}
                </h2>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleCancelEdit}
                >
                  <FiX className="h-4 w-4" />
                </Button>
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="title">Lesson Title</Label>
                  <Input
                    id="title"
                    value={currentLesson.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    placeholder="Enter lesson title"
                  />
                </div>

                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={currentLesson.description || ''}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    placeholder="Describe what students will learn in this lesson"
                  />
                </div>

                <div>
                  <Label htmlFor="content_type">Content Type</Label>
                  <Select
                    value={currentLesson.content_type}
                    onValueChange={(value: 'video' | 'text' | 'quiz' | 'assignment') => 
                      handleInputChange('content_type', value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="video">Video</SelectItem>
                      <SelectItem value="text">Text/Document</SelectItem>
                      <SelectItem value="quiz">Quiz</SelectItem>
                      <SelectItem value="assignment">Assignment</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="duration_minutes">Duration (minutes)</Label>
                  <Input
                    id="duration_minutes"
                    type="number"
                    min="1"
                    value={currentLesson.duration_minutes || ''}
                    onChange={(e) => handleInputChange('duration_minutes', parseInt(e.target.value) || undefined)}
                    placeholder="e.g., 30"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="is_mandatory">Mandatory Lesson</Label>
                  <Switch
                    id="is_mandatory"
                    checked={currentLesson.is_mandatory}
                    onCheckedChange={(checked) => handleInputChange('is_mandatory', checked)}
                  />
                </div>

                <div className="flex justify-end gap-2 mt-6">
                  <Button
                    variant="outline"
                    onClick={handleCancelEdit}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleSaveLesson}
                    disabled={!currentLesson.title || !selectedModuleId}
                  >
                    Save Lesson
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
} 