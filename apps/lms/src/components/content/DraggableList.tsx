'use client';

import { ReactNode } from 'react';
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
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';

interface DraggableListProps<T> {
  items: T[];
  getItemId: (item: T) => string;
  onReorder: (reorderedItems: T[]) => void;
  renderItem: (item: T, index: number) => ReactNode;
  className?: string;
}

export function DraggableList<T>({
  items,
  getItemId,
  onReorder,
  renderItem,
  className = '',
}: DraggableListProps<T>) {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = items.findIndex(item => getItemId(item) === active.id);
      const newIndex = items.findIndex(item => getItemId(item) === over.id);
      
      if (oldIndex !== -1 && newIndex !== -1) {
        const reorderedItems = arrayMove(items, oldIndex, newIndex);
        
        // Update sequence numbers
        const updatedItems = reorderedItems.map((item, index) => ({
          ...item,
          sequence_number: index + 1,
        }));
        
        onReorder(updatedItems);
      }
    }
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={items.map(item => getItemId(item))}
        strategy={verticalListSortingStrategy}
      >
        <div className={`space-y-3 ${className}`}>
          {items.map((item, index) => renderItem(item, index))}
        </div>
      </SortableContext>
    </DndContext>
  );
} 