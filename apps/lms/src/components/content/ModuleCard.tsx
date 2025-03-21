'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AnimatePresence, motion } from 'framer-motion';
import { FiChevronDown, FiChevronUp, FiEdit2, FiTrash2, FiMenu } from 'react-icons/fi';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { CourseStatus } from '@/types/course';

export interface ModuleData {
  id?: string;
  title: string;
  description?: string;
  sequence_number: number;
  duration_weeks?: number;
  status: CourseStatus;
  completion_criteria?: Record<string, any>;
  is_mandatory: boolean;
  lessons?: any[];
}

interface ModuleCardProps {
  module: ModuleData;
  isDraggable?: boolean;
  isEditing?: boolean;
  editingId?: string;
  onEdit?: (module: ModuleData) => void;
  onDelete?: (id: string) => void;
  onToggleExpand?: (id: string) => void;
  isExpanded?: boolean;
  showLessonsCount?: boolean;
  className?: string;
  onClick?: () => void;
}

export function ModuleCard({
  module,
  isDraggable = false,
  isEditing = false,
  editingId,
  onEdit,
  onDelete,
  onToggleExpand,
  isExpanded = false,
  showLessonsCount = true,
  className = '',
  onClick,
}: ModuleCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  
  // Setup sortable hooks if draggable
  const sortableProps = isDraggable
    ? useSortable({ id: module.id || `new-${module.sequence_number}` })
    : null;
  
  const style = sortableProps 
    ? { transform: CSS.Transform.toString(sortableProps.transform), transition: sortableProps.transition }
    : {};
    
  // Handle click on card
  const handleCardClick = () => {
    if (onClick) {
      onClick();
    } else if (onToggleExpand && module.id) {
      onToggleExpand(module.id);
    }
  };

  return (
    <div 
      ref={sortableProps?.setNodeRef} 
      style={style} 
      {...(sortableProps?.attributes || {})}
      className={className}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Card 
        onClick={handleCardClick}
        className={`p-4 transition-all duration-200 ${
          editingId === module.id 
            ? 'ring-2 ring-primary ring-offset-2' 
            : isEditing 
              ? 'opacity-50 scale-98 pointer-events-none' 
              : 'hover:shadow-md cursor-pointer'
        } ${sortableProps?.isDragging ? 'shadow-lg' : ''}`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 flex-1">
            {isDraggable && (
              <button
                className="cursor-move touch-none p-1 opacity-50 hover:opacity-100 transition-opacity"
                {...(sortableProps?.listeners || {})}
                onClick={(e) => e.stopPropagation()}
              >
                <FiMenu className="h-4 w-4" />
              </button>
            )}
            <span className="text-muted-foreground font-mono">
              {module.sequence_number.toString().padStart(2, '0')}
            </span>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h3 className="font-medium">{module.title}</h3>
                <Badge variant={module.status === 'published' ? 'default' : 'outline'} className="capitalize">
                  {module.status}
                </Badge>
                {showLessonsCount && module.lessons && (
                  <Badge variant="secondary">
                    {module.lessons.length} {module.lessons.length === 1 ? 'lesson' : 'lessons'}
                  </Badge>
                )}
              </div>
              {isExpanded && module.description && (
                <p className="text-sm text-muted-foreground mt-1">
                  {module.description}
                </p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            {(isHovered || isExpanded) && (
              <>
                {onToggleExpand && module.id && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleExpand(module.id || '');
                    }}
                  >
                    {isExpanded ? (
                      <FiChevronUp className="h-4 w-4" />
                    ) : (
                      <FiChevronDown className="h-4 w-4" />
                    )}
                  </Button>
                )}
                {onEdit && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={(e) => {
                      e.stopPropagation();
                      onEdit(module);
                    }}
                  >
                    <FiEdit2 className="h-4 w-4" />
                  </Button>
                )}
                {onDelete && module.id && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete(module.id || '');
                    }}
                  >
                    <FiTrash2 className="h-4 w-4" />
                  </Button>
                )}
              </>
            )}
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
                  <div className="text-sm font-medium mb-1">Duration</div>
                  <div className="text-sm">
                    {module.duration_weeks 
                      ? `${module.duration_weeks} ${module.duration_weeks === 1 ? 'week' : 'weeks'}`
                      : 'Not specified'}
                  </div>
                </div>
                <div>
                  <div className="text-sm font-medium mb-1">Mandatory</div>
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