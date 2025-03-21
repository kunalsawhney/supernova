'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AnimatePresence, motion } from 'framer-motion';
import { FiChevronDown, FiChevronUp, FiEdit2, FiTrash2, FiMenu, FiVideo, FiFileText, FiCheckSquare, FiEdit3 } from 'react-icons/fi';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

export interface LessonData {
  id?: string;
  title: string;
  description?: string;
  sequence_number: number;
  duration_minutes?: number;
  content_type: 'video' | 'text' | 'quiz' | 'assignment';
  content?: Record<string, any>;
  is_mandatory: boolean;
  module_id: string;
  completion_criteria?: Record<string, any>;
}

interface LessonCardProps {
  lesson: LessonData;
  isDraggable?: boolean;
  isEditing?: boolean;
  editingId?: string;
  onEdit?: (lesson: LessonData) => void;
  onDelete?: (id: string) => void;
  onToggleExpand?: (id: string) => void;
  isExpanded?: boolean;
  className?: string;
  onClick?: () => void;
}

export function LessonCard({
  lesson,
  isDraggable = false,
  isEditing = false,
  editingId,
  onEdit,
  onDelete,
  onToggleExpand,
  isExpanded = false,
  className = '',
  onClick,
}: LessonCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  
  // Setup sortable hooks if draggable
  const sortableProps = isDraggable
    ? useSortable({ id: lesson.id || `new-${lesson.sequence_number}` })
    : null;
  
  const style = sortableProps 
    ? { transform: CSS.Transform.toString(sortableProps.transform), transition: sortableProps.transition }
    : {};
    
  // Handle click on card
  const handleCardClick = () => {
    if (onClick) {
      onClick();
    } else if (onToggleExpand && lesson.id) {
      onToggleExpand(lesson.id);
    }
  };

  // Get icon for content type
  const getContentTypeIcon = () => {
    switch (lesson.content_type) {
      case 'video':
        return <FiVideo className="h-4 w-4" />;
      case 'text':
        return <FiFileText className="h-4 w-4" />;
      case 'quiz':
        return <FiCheckSquare className="h-4 w-4" />;
      case 'assignment':
        return <FiEdit3 className="h-4 w-4" />;
      default:
        return null;
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
          editingId === lesson.id 
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
              {lesson.sequence_number.toString().padStart(2, '0')}
            </span>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h3 className="font-medium">{lesson.title}</h3>
                <Badge variant="outline" className="flex items-center gap-1 capitalize">
                  {getContentTypeIcon()}
                  {lesson.content_type}
                </Badge>
              </div>
              {isExpanded && lesson.description && (
                <p className="text-sm text-muted-foreground mt-1">
                  {lesson.description}
                </p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            {(isHovered || isExpanded) && (
              <>
                {onToggleExpand && lesson.id && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleExpand(lesson.id || '');
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
                      onEdit(lesson);
                    }}
                  >
                    <FiEdit2 className="h-4 w-4" />
                  </Button>
                )}
                {onDelete && lesson.id && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete(lesson.id || '');
                    }}
                  >
                    <FiTrash2 className="h-4 w-4" />
                  </Button>
                )}
              </>
            )}
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
                  <div className="text-sm font-medium mb-1">Duration</div>
                  <div className="text-sm">
                    {lesson.duration_minutes 
                      ? `${lesson.duration_minutes} minutes` 
                      : 'Not specified'}
                  </div>
                </div>
                <div>
                  <div className="text-sm font-medium mb-1">Mandatory</div>
                  <div className="text-sm">
                    {lesson.is_mandatory ? 'Yes' : 'No'}
                  </div>
                </div>
                {lesson.content && lesson.content_type === 'video' && lesson.content.video_url && (
                  <div className="sm:col-span-2">
                    <div className="text-sm font-medium mb-1">Video URL</div>
                    <div className="text-sm truncate">
                      {lesson.content.video_url}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </Card>
    </div>
  );
} 