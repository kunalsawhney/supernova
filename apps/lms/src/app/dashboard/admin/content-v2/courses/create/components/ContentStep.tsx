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
import { FiPlus, FiChevronUp, FiChevronDown, FiEdit2, FiTrash2, FiX, FiMenu, FiFile } from 'react-icons/fi';
import { AnimatePresence, motion } from 'framer-motion';
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
  const [selectedModuleId, setSelectedModuleId] = useState<string | null>(null);
  const [editingLesson, setEditingLesson] = useState<Lesson | null>(null);
  const [expandedLessons, setExpandedLessons] = useState<string[]>([]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Initialize selected module
  useEffect(() => {
    const modules = state.formData.modules || [];
    if (!selectedModuleId && modules.length > 0) {
      const firstModuleId = modules[0].id;
      if (firstModuleId) {
        setSelectedModuleId(firstModuleId);
      }
    }
  }, [state.formData.modules, selectedModuleId]);

  // Validate step when lessons change
  useEffect(() => {
    const hasLessons = state.formData.modules?.some(m => m.lessons?.length > 0);
    dispatch({
      type: 'VALIDATE_STEP',
      payload: { step: 3, isValid: Boolean(hasLessons) }
    });
  }, [state.formData.modules, dispatch]);

  const currentModule = state.formData.modules?.find(m => m.id === selectedModuleId);
  const currentLessons = currentModule?.lessons || [];

  const handleAddLesson = () => {
    if (!selectedModuleId) return;

    const newLesson: Lesson = {
      title: '',
      sequence_number: (currentLessons?.length || 0) + 1,
      content_type: 'video',
      content: {},
      is_mandatory: true,
      module_id: selectedModuleId,
      completion_criteria: {}
    };
    setEditingLesson(newLesson);
  };

  const handleEditLesson = (lesson: Lesson) => {
    setEditingLesson({ 
      ...lesson,
      content: lesson.content || {},
      completion_criteria: lesson.completion_criteria || {}
    });
  };

  const handleSaveLesson = () => {
    if (!editingLesson || !selectedModuleId) return;

    const modules = [...(state.formData.modules || [])];
    const moduleIndex = modules.findIndex(m => m.id === selectedModuleId);
    if (moduleIndex === -1) return;

    const lessons = [...(modules[moduleIndex].lessons || [])];
    const lessonIndex = editingLesson.id 
      ? lessons.findIndex(l => l.id === editingLesson.id)
      : -1;

    // Ensure all required properties are present
    const updatedLesson: Lesson = {
      ...editingLesson,
      module_id: selectedModuleId,
      content: editingLesson.content || {},
      completion_criteria: editingLesson.completion_criteria || {},
      sequence_number: lessonIndex >= 0 
        ? editingLesson.sequence_number 
        : (lessons.length + 1)
    };

    if (lessonIndex >= 0) {
      lessons[lessonIndex] = updatedLesson;
    } else {
      lessons.push(updatedLesson);
    }

    // Update the module with the new lessons
    const updatedModule = {
      ...modules[moduleIndex],
      lessons: lessons
    };
    modules[moduleIndex] = updatedModule;

    // Update the form state
    dispatch({
      type: 'UPDATE_FORM',
      payload: { modules }
    });

    // Close the edit form
    setEditingLesson(null);
  };

  const handleDeleteLesson = (lessonId: string) => {
    if (!selectedModuleId) return;

    const modules = [...(state.formData.modules || [])];
    const moduleIndex = modules.findIndex(m => m.id === selectedModuleId);
    if (moduleIndex === -1) return;

    const lessons = modules[moduleIndex].lessons?.filter(l => l.id !== lessonId) || [];
    // Reorder sequence numbers
    lessons.forEach((lesson, index) => {
      lesson.sequence_number = index + 1;
    });

    modules[moduleIndex] = {
      ...modules[moduleIndex],
      lessons
    };

    dispatch({
      type: 'UPDATE_FORM',
      payload: { modules }
    });
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id || !selectedModuleId) return;

    const modules = [...(state.formData.modules || [])];
    const moduleIndex = modules.findIndex(m => m.id === selectedModuleId);
    if (moduleIndex === -1) return;

    const lessons = [...(modules[moduleIndex].lessons || [])];
    const oldIndex = lessons.findIndex(l => (l.id || `new-${l.sequence_number}`) === active.id);
    const newIndex = lessons.findIndex(l => (l.id || `new-${l.sequence_number}`) === over.id);

    const reorderedLessons = arrayMove(lessons, oldIndex, newIndex);
    // Update sequence numbers
    reorderedLessons.forEach((lesson, idx) => {
      lesson.sequence_number = idx + 1;
    });

    modules[moduleIndex] = {
      ...modules[moduleIndex],
      lessons: reorderedLessons
    };

    dispatch({
      type: 'UPDATE_FORM',
      payload: { modules }
    });
  };

  const toggleLessonExpanded = (lessonId: string) => {
    setExpandedLessons(prev => 
      prev.includes(lessonId)
        ? prev.filter(id => id !== lessonId)
        : [...prev, lessonId]
    );
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
              {currentLessons.length || 0} lessons
            </div>
            {!editingLesson && currentLessons.length > 0 && (
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
              items={currentLessons.map(l => l.id || `lesson-${l.sequence_number}`)}
              strategy={verticalListSortingStrategy}
            >
              <div className={`space-y-4 transition-all duration-200 ${editingLesson ? 'opacity-50 pointer-events-none' : ''}`}>
                {currentLessons.map((lesson) => (
                  <SortableLessonItem
                    key={lesson.id || `lesson-${lesson.sequence_number}`}
                    lesson={lesson}
                    isEditing={!!editingLesson}
                    editingId={editingLesson?.id}
                    onEdit={handleEditLesson}
                    onDelete={handleDeleteLesson}
                    onToggleExpand={toggleLessonExpanded}
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
        {editingLesson && (
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
                  {editingLesson.id ? 'Edit Lesson' : 'Add Lesson'}
                </h2>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setEditingLesson(null)}
                >
                  <FiX className="h-4 w-4" />
                </Button>
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="title">Lesson Title</Label>
                  <Input
                    id="title"
                    value={editingLesson.title}
                    onChange={(e) => setEditingLesson({
                      ...editingLesson,
                      title: e.target.value
                    })}
                    placeholder="Enter lesson title"
                  />
                </div>

                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={editingLesson.description || ''}
                    onChange={(e) => setEditingLesson({
                      ...editingLesson,
                      description: e.target.value
                    })}
                    placeholder="Describe what students will learn in this lesson"
                  />
                </div>

                <div>
                  <Label htmlFor="content_type">Content Type</Label>
                  <Select
                    value={editingLesson.content_type}
                    onValueChange={(value: 'video' | 'text' | 'quiz' | 'assignment') => 
                      setEditingLesson({
                        ...editingLesson,
                        content_type: value
                      })
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
                    value={editingLesson.duration_minutes || ''}
                    onChange={(e) => setEditingLesson({
                      ...editingLesson,
                      duration_minutes: parseInt(e.target.value) || undefined
                    })}
                    placeholder="e.g., 30"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="is_mandatory">Mandatory Lesson</Label>
                  <Switch
                    id="is_mandatory"
                    checked={editingLesson.is_mandatory}
                    onCheckedChange={(checked) => setEditingLesson({
                      ...editingLesson,
                      is_mandatory: checked
                    })}
                  />
                </div>

                <div className="flex justify-end gap-2 mt-6">
                  <Button
                    variant="outline"
                    onClick={() => setEditingLesson(null)}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleSaveLesson}
                    disabled={!editingLesson?.title || !selectedModuleId}
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