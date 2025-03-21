/**
 * Module type definitions
 */

export interface Module {
  id: string;
  title: string;
  description?: string;
  course_id: string;
  sequence_number: number;
  status: 'draft' | 'published' | 'archived';
  created_at: string;
  updated_at: string;
  metadata?: Record<string, any>;
  content_id: string;
}

export interface ModuleViewModel {
  id: string;
  title: string;
  description?: string;
  courseId?: string;
  sequenceNumber: number;
  lessonCount: number;
  totalDuration: number;
  status: 'draft' | 'published' | 'archived';
  createdAt?: string;
  updatedAt?: string;
  contentId?: string;
}

export interface CreateModuleData {
  title: string;
  description?: string;
  content_id: string;
  sequence_number: number;
  status?: 'draft' | 'published' | 'archived';
}

export interface UpdateModuleData {
  title?: string;
  description?: string;
  sequence_number?: number;
  status?: 'draft' | 'published' | 'archived';
}

export function transformModule(module: Module): ModuleViewModel {
  return {
    id: module.id,
    title: module.title,
    description: module.description,
    courseId: module.course_id,
    sequenceNumber: module.sequence_number,
    lessonCount: 0, // This would be filled in by the application code
    totalDuration: 0, // This would be filled in by the application code
    status: module.status,
    createdAt: module.created_at,
    updatedAt: module.updated_at,
    contentId: module.content_id
  };
} 