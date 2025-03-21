'use client';

import { useEffect, useState, useRef, KeyboardEvent } from 'react';
import { useCourseWizard } from '@/contexts/CourseWizardContext';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { toast } from '@/hooks/use-toast';
import { FiPlus, FiChevronUp, FiChevronDown, FiEdit2, FiTrash2, FiX, FiMenu, FiSave, FiLoader, FiCheck } from 'react-icons/fi';
import { CourseStatus } from '@/types/course';
import { AnimatePresence, motion } from 'framer-motion';
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
import { adminService } from '@/services/adminService';

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
  const { formData } = state;
  const { contentId } = state.apiState;
  const [modules, setModules] = useState<Module[]>(formData.modules || []);
  const [isAddingModule, setIsAddingModule] = useState(false);
  const [editingModuleId, setEditingModuleId] = useState<string | undefined>();
  const [expandedModules, setExpandedModules] = useState<string[]>([]);
  const [savingModuleId, setSavingModuleId] = useState<string | null>(null);
  const [currentModule, setCurrentModule] = useState<Module>({
    title: '',
    description: '',
    sequence_number: (modules.length || 0) + 1,
    status: 'draft',
    is_mandatory: true,
    lessons: [],
  });

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Update the global state when modules change
  useEffect(() => {
    dispatch({
      type: 'UPDATE_FORM',
      payload: { modules },
    });
  }, [modules, dispatch]);

  // Validate the step - at least one module is required
  useEffect(() => {
    const isValid = modules.length > 0;
    dispatch({
      type: 'VALIDATE_STEP',
      payload: { step: 2, isValid },
    });
  }, [modules, dispatch]);

  const handleAddModule = () => {
    setCurrentModule({
      title: '',
      description: '',
      sequence_number: (modules.length || 0) + 1,
      status: 'draft',
      is_mandatory: true,
      lessons: [],
    });
    setIsAddingModule(true);
  };

  const handleEditModule = (module: Module) => {
    setCurrentModule({ ...module });
    setEditingModuleId(module.id);
  };

  const handleSaveModule = async () => {
    if (!currentModule.title) {
      toast({
        title: "Error",
        description: "Module title is required",
        variant: "destructive",
      });
      return;
    }

    // Generate a temporary ID if one doesn't exist
    const tempId = editingModuleId || `temp-${Date.now()}`;
    const moduleToSave = { ...currentModule, id: tempId };

    // If editing, update existing module, otherwise add new module
    const updatedModules = editingModuleId
      ? modules.map(m => (m.id === editingModuleId ? moduleToSave : m))
      : [...modules, moduleToSave];

    // Update local state
    setModules(updatedModules);
    setIsAddingModule(false);
    setEditingModuleId(undefined);
    console.log('contentId', contentId);
    // If we have a content ID from the previous step, save module to API
    if (contentId) {
      try {
        setSavingModuleId(tempId);
        
        // Prepare data for API
        const moduleData = {
          title: currentModule.title,
          description: currentModule.description || '',
          sequence_number: currentModule.sequence_number,
          status: currentModule.status,
          content_id: contentId,
          // Additional fields as needed
        };

        // Call API to save module
        const response = await courseWizardService.addModule(contentId, moduleData);
        
        // Store the API module ID in our context
        dispatch({
          type: 'ADD_MODULE_ID',
          payload: { localId: tempId, apiId: response.id }
        });

        toast({
          title: "Module saved",
          description: "Module has been saved successfully",
        });
      } catch (error) {
        toast({
          title: "Error saving module",
          description: error instanceof Error ? error.message : "Failed to save module",
          variant: "destructive",
        });
        console.error("Error saving module:", error);
      } finally {
        setSavingModuleId(null);
      }
    }
  };

  const handleCancelEdit = () => {
    setIsAddingModule(false);
    setEditingModuleId(undefined);
  };

  const handleDeleteModule = async (id: string) => {
    setModules(modules.filter(m => m.id !== id));
    if (contentId) {
      try {
        await adminService.deleteModule(id);
      } catch (error) {
        console.error("Error deleting module:", error);
      }
    }
  };

  const handleToggleExpand = (id: string) => {
    setExpandedModules(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setModules(items => {
        const oldIndex = items.findIndex(item => item.id === active.id);
        const newIndex = items.findIndex(item => item.id === over.id);
        
        // Update sequence numbers
        const reordered = arrayMove(items, oldIndex, newIndex).map((item, index) => ({
          ...item,
          sequence_number: index + 1,
        }));
        
        return reordered;
      });
    }
  };

  const handleInputChange = (field: keyof Module, value: any) => {
    setCurrentModule(prev => ({ ...prev, [field]: value }));
  };

  // Helper to check if a module has been saved to the API
  const isModuleSavedToApi = (moduleId: string) => {
    return Boolean(state.apiState.moduleIds[moduleId]);
  };

  return (
    <div className="space-y-6">
      {!editingModuleId && (
        <div className="flex items-center justify-between mb-4">
          <div className="text-sm text-muted-foreground">
            {modules?.length || 0} modules
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
          items={(modules || []).map(m => m.id || `new-${m.sequence_number}`)}
          strategy={verticalListSortingStrategy}
        >
          <div className="space-y-4">
            {modules?.map((module) => (
              <SortableModuleItem
                key={module.id || module.sequence_number}
                module={module}
                isEditing={!!editingModuleId}
                editingId={editingModuleId}
                onEdit={handleEditModule}
                onDelete={handleDeleteModule}
                onToggleExpand={handleToggleExpand}
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
        {isAddingModule && (
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
                  {editingModuleId ? 'Edit Module' : 'Add Module'}
                </h2>
                <div className="flex items-center gap-4">
                  <div className="text-sm text-muted-foreground">
                    Press <kbd className="px-2 py-1 bg-muted rounded text-xs">⌘/Ctrl + ↵</kbd> to save
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleCancelEdit}
                  >
                    <FiX className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="title">Module Title</Label>
                  <Input
                    id="title"
                    value={currentModule.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    placeholder="Enter module title"
                  />
                </div>

                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={currentModule.description || ''}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    placeholder="Describe what students will learn in this module"
                  />
                </div>

                <div>
                  <Label htmlFor="duration_weeks">Duration (weeks)</Label>
                  <Input
                    id="duration_weeks"
                    type="number"
                    min="1"
                    value={currentModule.duration_weeks || ''}
                    onChange={(e) => handleInputChange('duration_weeks', parseInt(e.target.value) || undefined)}
                    placeholder="e.g., 2"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="is_mandatory">Mandatory Module</Label>
                  <Switch
                    id="is_mandatory"
                    checked={currentModule.is_mandatory}
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
                    onClick={handleSaveModule}
                    disabled={!currentModule.title}
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