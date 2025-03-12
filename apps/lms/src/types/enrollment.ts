import { PaginationParams } from './api';

export interface Enrollment {
  id: string;
  user_id: string;
  course_id: string;
  status: string;
  enrollment_date: string;
  completion_date?: string;
  expiry_date?: string;
  progress?: number;
  grade?: number;
  certificate_id?: string;
  metadata?: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface Progress {
  id: string;
  enrollment_id: string;
  module_id?: string;
  lesson_id?: string;
  status: string;
  progress: number;
  completed: boolean;
  completion_date?: string;
  time_spent?: number;
  score?: number;
  attempts?: number;
  metadata?: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface EnrollmentProgress {
  overall_progress: number;
  completed_modules: number;
  total_modules: number;
  completed_lessons: number;
  total_lessons: number;
  average_score?: number;
  time_spent?: number;
}

// View Models for UI
export interface EnrollmentViewModel {
  id: string;
  userId: string;
  courseId: string;
  status: string;
  enrollmentDate: string;
  completionDate?: string;
  expiryDate?: string;
  progress?: number;
  grade?: number;
  certificateId?: string;
  metadata?: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

export interface ProgressViewModel {
  id: string;
  enrollmentId: string;
  moduleId?: string;
  lessonId?: string;
  status: string;
  progress: number;
  completed: boolean;
  completionDate?: string;
  timeSpent?: number;
  score?: number;
  attempts?: number;
  metadata?: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

export interface EnrollmentProgressViewModel {
  overallProgress: number;
  completedModules: number;
  totalModules: number;
  completedLessons: number;
  totalLessons: number;
  averageScore?: number;
  timeSpent?: number;
}

// Transformation functions
export const transformEnrollment = (enrollment: Enrollment): EnrollmentViewModel => ({
  id: enrollment.id,
  userId: enrollment.user_id,
  courseId: enrollment.course_id,
  status: enrollment.status,
  enrollmentDate: enrollment.enrollment_date,
  completionDate: enrollment.completion_date,
  expiryDate: enrollment.expiry_date,
  progress: enrollment.progress,
  grade: enrollment.grade,
  certificateId: enrollment.certificate_id,
  metadata: enrollment.metadata,
  createdAt: enrollment.created_at,
  updatedAt: enrollment.updated_at,
});

export const transformProgress = (progress: Progress): ProgressViewModel => ({
  id: progress.id,
  enrollmentId: progress.enrollment_id,
  moduleId: progress.module_id,
  lessonId: progress.lesson_id,
  status: progress.status,
  progress: progress.progress,
  completed: progress.completed,
  completionDate: progress.completion_date,
  timeSpent: progress.time_spent,
  score: progress.score,
  attempts: progress.attempts,
  metadata: progress.metadata,
  createdAt: progress.created_at,
  updatedAt: progress.updated_at,
});

export const transformEnrollmentProgress = (progress: EnrollmentProgress): EnrollmentProgressViewModel => ({
  overallProgress: progress.overall_progress,
  completedModules: progress.completed_modules,
  totalModules: progress.total_modules,
  completedLessons: progress.completed_lessons,
  totalLessons: progress.total_lessons,
  averageScore: progress.average_score,
  timeSpent: progress.time_spent,
});

export interface CreateEnrollmentData {
  course_id: string;
  user_id?: string; // Optional if enrolling the current user
}

export interface UpdateProgressData {
  lesson_id: string;
  completed?: boolean;
  score?: number;
  time_spent?: number;
} 