'use client';

import { useEffect, useState, useRef, KeyboardEvent } from 'react';
import { useCourseWizard } from '@/contexts/CourseWizardContext';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { FiPlus, FiChevronUp, FiChevronDown, FiEdit2, FiTrash2, FiX, FiMenu } from 'react-icons/fi';
import { CourseStatus } from '@/types/course';
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

interface Module {
  id?: string;
  title: string;
  description?: string;
  sequence_number: number;
  duration_weeks?: number;
  status: CourseStatus;
  completion_criteria?: Record<string, any>;
  is_mandatory: boolean;
  lessons: any[]; // We'll implement lessons in the next step
}

interface SortableModuleItemProps {
  module: Module;
  isEditing: boolean;
  editingId: string | undefined;
  onEdit: (module: Module) => void;
  onDelete: (id: string) => void;
  onToggleExpand: (id: string) => void;
  isExpanded: boolean;
}

function SortableModuleItem({
  module,
  isEditing,
  editingId,
  onEdit,
  onDelete,
  onToggleExpand,
  isExpanded,
}: SortableModuleItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: module.id || `new-${module.sequence_number}` });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes}>
      <Card 
        className={`p-4 transition-all duration-200 ${
          editingId === module.id 
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
              {module.sequence_number.toString().padStart(2, '0')}
            </span>
            <div className="flex-1">
              <h3 className="font-medium">{module.title}</h3>
              {isExpanded && (
                <p className="text-sm text-muted-foreground mt-1">
                  {module.description}
                </p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onToggleExpand(module.id || '')}
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
              onClick={() => onEdit(module)}
            >
              <FiEdit2 className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => module.id && onDelete(module.id)}
            >
              <FiTrash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Expanded Module Content */}
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
                  <Label>Duration (weeks)</Label>
                  <div className="text-sm">
                    {module.duration_weeks || 'Not specified'}
                  </div>
                </div>
                <div>
                  <Label>Status</Label>
                  <div className="text-sm capitalize">
                    {module.status}
                  </div>
                </div>
                <div>
                  <Label>Mandatory</Label>
                  <div className="text-sm">
                    {module.is_mandatory ? 'Yes' : 'No'}
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

export function CurriculumStep() {
  const { state, dispatch } = useCourseWizard();
  const [editingModule, setEditingModule] = useState<Module | null>(null);
  const [expandedModules, setExpandedModules] = useState<string[]>([]);
  const titleInputRef = useRef<HTMLInputElement>(null);
  const isEditingRef = useRef(false);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Focus title input only when starting to edit
  useEffect(() => {
    if (editingModule && !isEditingRef.current) {
      titleInputRef.current?.focus();
      isEditingRef.current = true;
    } else if (!editingModule) {
      isEditingRef.current = false;
    }
  }, [editingModule]);

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
      // Escape to cancel editing
      if (e.key === 'Escape' && editingModule) {
        setEditingModule(null);
      }
      // Enter + Cmd/Ctrl to save
      if (e.key === 'Enter' && (e.metaKey || e.ctrlKey) && editingModule?.title) {
        handleSaveModule();
      }
      // N + Cmd/Ctrl to add new module when not editing
      if (e.key === 'n' && (e.metaKey || e.ctrlKey) && !editingModule) {
        e.preventDefault();
        handleAddModule();
      }
    };

    document.addEventListener('keydown', handleKeyDown as any);
    return () => document.removeEventListener('keydown', handleKeyDown as any);
  }, [editingModule]);

  // Initialize modules from state or create empty array
  useEffect(() => {
    if (!state.formData.modules) {
      dispatch({
        type: 'UPDATE_FORM',
        payload: { modules: [] }
      });
    }
  }, [state.formData.modules, dispatch]);

  // Validate step when modules change
  useEffect(() => {
    const isValid = Boolean(state.formData.modules && state.formData.modules.length > 0);
    dispatch({
      type: 'VALIDATE_STEP',
      payload: { step: 2, isValid }
    });
  }, [state.formData.modules, dispatch]);

  const handleAddModule = () => {
    isEditingRef.current = false; // Reset the ref when adding a new module
    const newModule: Module = {
      title: '',
      sequence_number: (state.formData.modules?.length || 0) + 1,
      status: 'draft',
      is_mandatory: true,
      lessons: []
    };
    setEditingModule(newModule);
  };

  const handleEditModule = (module: Module) => {
    isEditingRef.current = false; // Reset the ref when starting a new edit
    setEditingModule({ ...module });
  };

  const handleSaveModule = () => {
    if (!editingModule) return;

    const modules = [...(state.formData.modules || [])];
    const index = editingModule.id 
      ? modules.findIndex(m => m.id === editingModule.id)
      : -1;

    if (index >= 0) {
      modules[index] = editingModule;
    } else {
      modules.push(editingModule);
    }

    dispatch({
      type: 'UPDATE_FORM',
      payload: { modules }
    });
    setEditingModule(null);
  };

  const handleDeleteModule = (moduleId: string) => {
    const modules = state.formData.modules?.filter(m => m.id !== moduleId) || [];
    // Reorder sequence numbers
    modules.forEach((module, index) => {
      module.sequence_number = index + 1;
    });
    dispatch({
      type: 'UPDATE_FORM',
      payload: { modules }
    });
  };

  const handleMoveModule = (moduleId: string, direction: 'up' | 'down') => {
    const modules = [...(state.formData.modules || [])];
    const index = modules.findIndex(m => m.id === moduleId);
    if (index === -1) return;

    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= modules.length) return;

    // Swap modules
    [modules[index], modules[newIndex]] = [modules[newIndex], modules[index]];
    // Update sequence numbers
    modules.forEach((module, idx) => {
      module.sequence_number = idx + 1;
    });

    dispatch({
      type: 'UPDATE_FORM',
      payload: { modules }
    });
  };

  const toggleModuleExpanded = (moduleId: string) => {
    setExpandedModules(prev => 
      prev.includes(moduleId)
        ? prev.filter(id => id !== moduleId)
        : [...prev, moduleId]
    );
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const modules = [...(state.formData.modules || [])];
    const oldIndex = modules.findIndex(m => (m.id || `new-${m.sequence_number}`) === active.id);
    const newIndex = modules.findIndex(m => (m.id || `new-${m.sequence_number}`) === over.id);

    const reorderedModules = arrayMove(modules, oldIndex, newIndex);
    // Update sequence numbers
    reorderedModules.forEach((module, idx) => {
      module.sequence_number = idx + 1;
    });

    dispatch({
      type: 'UPDATE_FORM',
      payload: { modules: reorderedModules }
    });
  };

  return (
    <div className="space-y-6">
      {!editingModule && (
        <div className="flex items-center justify-between mb-4">
          <div className="text-sm text-muted-foreground">
            {state.formData.modules?.length || 0} modules
          </div>
          <div className="flex items-center gap-4">
            <div className="text-sm text-muted-foreground">
              Drag modules to reorder
            </div>
            <div className="text-sm text-muted-foreground">
              Press <kbd className="px-2 py-1 bg-muted rounded text-xs">⌘/Ctrl + N</kbd> to add module
            </div>
          </div>
        </div>
      )}

      {/* Module List */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={(state.formData.modules || []).map(m => m.id || `new-${m.sequence_number}`)}
          strategy={verticalListSortingStrategy}
        >
          <div className="space-y-4">
            {state.formData.modules?.map((module) => (
              <SortableModuleItem
                key={module.id || module.sequence_number}
                module={module}
                isEditing={!!editingModule}
                editingId={editingModule?.id}
                onEdit={handleEditModule}
                onDelete={handleDeleteModule}
                onToggleExpand={toggleModuleExpanded}
                isExpanded={expandedModules.includes(module.id || '')}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>

      <Button onClick={handleAddModule} className="w-full gap-2">
        <FiPlus className="h-4 w-4" />
        Add Module
      </Button>

      {/* Inline Module Edit Form */}
      <AnimatePresence>
        {editingModule && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="mt-6 relative"
          >
            <div className="absolute inset-0 bg-gradient-to-b from-background/50 to-background blur-xl -z-10" />
            <Card className="p-6 border-primary/50 shadow-lg">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold">
                  {editingModule.id ? 'Edit Module' : 'Add Module'}
                </h2>
                <div className="flex items-center gap-4">
                  <div className="text-sm text-muted-foreground">
                    Press <kbd className="px-2 py-1 bg-muted rounded text-xs">⌘/Ctrl + ↵</kbd> to save
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setEditingModule(null)}
                  >
                    <FiX className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="title">Module Title</Label>
                  <Input
                    ref={titleInputRef}
                    id="title"
                    value={editingModule.title}
                    onChange={(e) => setEditingModule({
                      ...editingModule,
                      title: e.target.value
                    })}
                    placeholder="Enter module title"
                  />
                </div>

                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={editingModule.description || ''}
                    onChange={(e) => setEditingModule({
                      ...editingModule,
                      description: e.target.value
                    })}
                    placeholder="Describe what students will learn in this module"
                  />
                </div>

                <div>
                  <Label htmlFor="duration_weeks">Duration (weeks)</Label>
                  <Input
                    id="duration_weeks"
                    type="number"
                    min="1"
                    value={editingModule.duration_weeks || ''}
                    onChange={(e) => setEditingModule({
                      ...editingModule,
                      duration_weeks: parseInt(e.target.value) || undefined
                    })}
                    placeholder="e.g., 2"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="is_mandatory">Mandatory Module</Label>
                  <Switch
                    id="is_mandatory"
                    checked={editingModule.is_mandatory}
                    onCheckedChange={(checked) => setEditingModule({
                      ...editingModule,
                      is_mandatory: checked
                    })}
                  />
                </div>

                <div className="flex justify-end gap-2 mt-6">
                  <Button
                    variant="outline"
                    onClick={() => setEditingModule(null)}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleSaveModule}
                    disabled={!editingModule.title}
                  >
                    Save Module
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