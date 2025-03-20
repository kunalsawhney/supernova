'use client';

import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { CourseStatus, DifficultyLevel } from '@/types/course';

// Types
interface CourseData {
  // Basic Info
  title: string;
  description: string;
  code: string;
  status: CourseStatus;
  cover_image_url?: string;
  settings?: Record<string, any>;
  difficulty_level: DifficultyLevel;
  tags?: string[];
  estimated_duration?: number;  // in hours
  learning_objectives?: string[];
  target_audience?: string[];
  prerequisites?: string[];
  completion_criteria?: Record<string, any>;
  grade_level: string;
  academic_year: string;
  sequence_number: number;
  base_price?: number;
  currency?: string;
  pricing_type?: 'one-time' | 'subscription';

  // Content Version
  version?: string;
  syllabus_url?: string;
  start_date?: string;
  end_date?: string;
  duration_weeks?: number;
  content_status?: CourseStatus;
  resources?: Array<{
    title: string;
    type: string;
    url: string;
    description?: string;
  }>;

  // Modules
  modules: Array<{
    id?: string;
    title: string;
    description?: string;
    sequence_number: number;
    duration_weeks?: number;
    status: CourseStatus;
    completion_criteria?: Record<string, any>;
    is_mandatory: boolean;
    lessons: Array<{
      id?: string;
      title: string;
      description?: string;
      sequence_number: number;
      content_type: 'video' | 'text' | 'quiz' | 'assignment';
      content: Record<string, any>;
      duration_minutes?: number;
      is_mandatory: boolean;
      completion_criteria?: Record<string, any>;
    }>;
  }>;
}

interface CourseMetadata {
  draftId: string | null;
  currentStep: number;
  isDirty: boolean;
  lastSaved: string | null;
  validSteps: number[];
}

interface CourseWizardState {
  formData: Partial<CourseData>;
  metadata: CourseMetadata;
}

type CourseWizardAction =
  | { type: 'UPDATE_FORM'; payload: Partial<CourseData> }
  | { type: 'SET_STEP'; payload: { step: number } }
  | { type: 'SET_DRAFT_ID'; payload: { draftId: string } }
  | { type: 'SET_SAVED'; payload: { timestamp: string } }
  | { type: 'VALIDATE_STEP'; payload: { step: number; isValid: boolean } };

// Initial state
const initialState: CourseWizardState = {
  formData: {
    title: 'Block Based Programming',
    description: 'Block Based Programming : A course for beginners to learn about block based programming.',
    code: 'BCP-101',
    status: 'draft',
    difficulty_level: 'beginner',
    grade_level: 'elementary',
    academic_year: '2024-2025',
    sequence_number: 1,
    version: '1.0.0',
    content_status: 'draft',
    cover_image_url: 'https://via.placeholder.com/150',
    estimated_duration: 20,
    pricing_type: 'one-time',
    base_price: 99.99,
    currency: 'USD',
    modules: [
      {
        id: '1',
        title: 'Introduction to Block Based Programming',
        description: 'Introduction to Block Based Programming',
        sequence_number: 1,
        status: 'draft',
        is_mandatory: true,
        lessons: [
          {
            id: '1',
            title: 'What is Block Based Programming?',
            description: 'What is Block Based Programming?',
            sequence_number: 1,
            content_type: 'video',
            content: {
              video_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
            },
            is_mandatory: true,
            completion_criteria: {
              type: 'video_completion',
              percentage: 100,
            },
            duration_minutes: 10,
          },
          {
            id: '2',
            title: 'Setting up the Block Editor',
            description: 'Setting up the Block Editor',
            sequence_number: 2,
            content_type: 'video',
            content: {
              video_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
            },
            is_mandatory: true,
            completion_criteria: {
              type: 'video_completion', 
              percentage: 100,
            },
            duration_minutes: 10,
          },
        ],
      },
      {
        id: '2',
        title: 'Variables and Data Types',
        description: 'Variables and Data Types',
        sequence_number: 2,
        status: 'draft',
        is_mandatory: true,
        lessons: [
          {
            id: '1',
            title: 'Introduction to Variables',
            description: 'Introduction to Variables',
            sequence_number: 1,
            content_type: 'video',
            content: {
              video_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
            },
            is_mandatory: true,
          }
        ]
      },
    ],
  },
  metadata: {
    draftId: null,
    currentStep: 1,
    isDirty: false,
    lastSaved: null,
    validSteps: [],
  },
};

// Reducer
function courseWizardReducer(
  state: CourseWizardState,
  action: CourseWizardAction
): CourseWizardState {
  switch (action.type) {
    case 'UPDATE_FORM':
      return {
        ...state,
        formData: {
          ...state.formData,
          ...action.payload,
        },
        metadata: {
          ...state.metadata,
          isDirty: true,
        },
      };
    
    case 'SET_STEP':
      return {
        ...state,
        metadata: {
          ...state.metadata,
          currentStep: action.payload.step,
        },
      };
    
    case 'SET_DRAFT_ID':
      return {
        ...state,
        metadata: {
          ...state.metadata,
          draftId: action.payload.draftId,
        },
      };
    
    case 'SET_SAVED':
      return {
        ...state,
        metadata: {
          ...state.metadata,
          isDirty: false,
          lastSaved: action.payload.timestamp,
        },
      };
    
    case 'VALIDATE_STEP':
      return {
        ...state,
        metadata: {
          ...state.metadata,
          validSteps: action.payload.isValid
            ? [...state.metadata.validSteps, action.payload.step]
            : state.metadata.validSteps.filter(step => step !== action.payload.step),
        },
      };
    
    default:
      return state;
  }
}

// Context
const CourseWizardContext = createContext<{
  state: CourseWizardState;
  dispatch: React.Dispatch<CourseWizardAction>;
} | null>(null);

// Provider component
export function CourseWizardProvider({ children, initialData }: { children: ReactNode, initialData?: Partial<CourseData> }) {
  const [state, dispatch] = useReducer(
    courseWizardReducer,
    initialData 
      ? {
          formData: { ...initialState.formData, ...initialData },
          metadata: {
            ...initialState.metadata,
            // Mark all steps as valid when in edit mode
            validSteps: [1, 2, 3, 4]
          }
        }
      : initialState
  );

  return (
    <CourseWizardContext.Provider value={{ state, dispatch }}>
      {children}
    </CourseWizardContext.Provider>
  );
}

// Hook for using the context
export function useCourseWizard() {
  const context = useContext(CourseWizardContext);
  if (!context) {
    throw new Error('useCourseWizard must be used within a CourseWizardProvider');
  }
  return context;
} 