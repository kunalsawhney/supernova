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
  isSubmitting: boolean;
  error: string | null;
}

// API related state
interface ApiState {
  courseId: string | null;
  contentId: string | null;
  versionId: string | null;
  moduleIds: Record<string, string>; // Map from local id to API id
  lessonIds: Record<string, string>; // Map from local id to API id
}

interface CourseWizardState {
  formData: Partial<CourseData>;
  metadata: CourseMetadata;
  apiState: ApiState;
}

type CourseWizardAction =
  | { type: 'UPDATE_FORM'; payload: Partial<CourseData> }
  | { type: 'SET_STEP'; payload: { step: number } }
  | { type: 'SET_DRAFT_ID'; payload: { draftId: string } }
  | { type: 'SET_SAVED'; payload: { timestamp: string } }
  | { type: 'VALIDATE_STEP'; payload: { step: number; isValid: boolean } }
  | { type: 'SET_SUBMITTING'; payload: { isSubmitting: boolean } }
  | { type: 'SET_ERROR'; payload: { error: string | null } }
  | { type: 'SET_COURSE_IDS'; payload: { courseId: string; contentId: string; versionId: string } }
  | { type: 'ADD_MODULE_ID'; payload: { localId: string; apiId: string } }
  | { type: 'ADD_LESSON_ID'; payload: { localId: string; apiId: string } }
  | { type: 'RESET_API_STATE' };

// Initial state
const initialState: CourseWizardState = {
  formData: {
    title: '',
    description: '',
    code: '',
    status: 'draft',
    difficulty_level: 'beginner',
    grade_level: '',
    academic_year: '',
    sequence_number: 1,
    version: '1.0.0',
    content_status: 'draft',
    cover_image_url: '',
    estimated_duration: 0,
    pricing_type: undefined,
    base_price: 0,
    currency: '',
    modules: [],
  },
  metadata: {
    draftId: null,
    currentStep: 1,
    isDirty: false,
    lastSaved: null,
    validSteps: [],
    isSubmitting: false,
    error: null
  },
  apiState: {
    courseId: null,
    contentId: null,
    versionId: null,
    moduleIds: {},
    lessonIds: {}
  }
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
    
    case 'SET_SUBMITTING':
      return {
        ...state,
        metadata: {
          ...state.metadata,
          isSubmitting: action.payload.isSubmitting,
        },
      };
    
    case 'SET_ERROR':
      return {
        ...state,
        metadata: {
          ...state.metadata,
          error: action.payload.error,
        },
      };
    
    case 'SET_COURSE_IDS':
      return {
        ...state,
        apiState: {
          ...state.apiState,
          courseId: action.payload.courseId,
          contentId: action.payload.contentId,
          versionId: action.payload.versionId,
        },
      };
    
    case 'ADD_MODULE_ID':
      return {
        ...state,
        apiState: {
          ...state.apiState,
          moduleIds: {
            ...state.apiState.moduleIds,
            [action.payload.localId]: action.payload.apiId,
          },
        },
      };
    
    case 'ADD_LESSON_ID':
      return {
        ...state,
        apiState: {
          ...state.apiState,
          lessonIds: {
            ...state.apiState.lessonIds,
            [action.payload.localId]: action.payload.apiId,
          },
        },
      };
    
    case 'RESET_API_STATE':
      return {
        ...state,
        apiState: {
          courseId: null,
          contentId: null,
          versionId: null,
          moduleIds: {},
          lessonIds: {}
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
          },
          apiState: { ...initialState.apiState } // Include apiState to avoid type error
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