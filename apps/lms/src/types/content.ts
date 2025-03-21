export interface Content {
  id: string;
  course_id: string;
  created_at: string;
  updated_at: string;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  image_url?: string;
  price?: number;
  status: 'draft' | 'published' | 'archived';
  content_id?: string;
  created_at: string;
  updated_at: string;
}

export interface Module {
  id: string;
  title: string;
  description?: string;
  sequence_number: number;
  course_id: string;
  content_id?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Lesson {
  id: string;
  title: string;
  description?: string;
  content_type: 'video' | 'text' | 'quiz' | 'assignment';
  module_id: string;
  course_id?: string;
  duration?: number; // in minutes
  sequence_number: number;
  video_url?: string;
  text_content?: string;
  quiz_id?: string;
  assignment_id?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Quiz {
  id: string;
  title: string;
  description?: string;
  questions: QuizQuestion[];
  passing_score: number;
  time_limit?: number; // in minutes
  lesson_id?: string;
  created_at?: string;
  updated_at?: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: QuizOption[];
  question_type: 'multiple_choice' | 'single_choice' | 'true_false' | 'text';
  points: number;
}

export interface QuizOption {
  id: string;
  text: string;
  is_correct: boolean;
}

export interface Assignment {
  id: string;
  title: string;
  description: string;
  instructions: string;
  due_date?: string;
  lesson_id?: string;
  created_at?: string;
  updated_at?: string;
}

export interface ContentTreeItem {
  id: string;
  title: string;
  type: 'module' | 'lesson';
  sequence_number: number;
  children?: ContentTreeItem[];
}

export interface ContentTree {
  id: string;
  course_id: string;
  items: ContentTreeItem[];
} 

export interface ContentStats {
  total_courses: number;
  published_courses: number;
  draft_courses: number;
  average_rating: number;
}

export interface ContentStatsViewModel {
  totalCourses: number;
  publishedCourses: number;
  draftCourses: number;
  averageRating: number;
}

export function transformContentStats(stats: ContentStats): ContentStatsViewModel {
  return {
    totalCourses: stats.total_courses,
    publishedCourses: stats.published_courses,
    draftCourses: stats.draft_courses,
    averageRating: stats.average_rating,
  };
} 