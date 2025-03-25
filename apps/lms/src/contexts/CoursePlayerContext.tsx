import React, { createContext, useContext, useState, useEffect } from 'react';

type ContentType = 'video' | 'reading' | 'quiz' | 'project' | 'discussion';

interface LessonProgress {
  lessonId: string;
  progress: number;
  completed: boolean;
  lastPosition: number; // video time or scroll position
  notes?: string;
}

interface CoursePlayerContextProps {
  // Content state
  contentType: ContentType;
  setContentType: (type: ContentType) => void;
  
  // Layout state
  showNotes: boolean;
  toggleNotes: () => void;
  
  // Progress tracking
  lessonProgress: Record<string, LessonProgress>;
  updateProgress: (lessonId: string, progressData: Partial<LessonProgress>) => void;
  markComplete: (lessonId: string) => void;
  
  // UI preferences
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  
  // Current lesson
  currentLessonId: string | null;
  setCurrentLessonId: (id: string | null) => void;
  
  // Notes
  saveNote: (lessonId: string, noteContent: string) => void;
  getNotes: (lessonId: string) => string;
}

const CoursePlayerContext = createContext<CoursePlayerContextProps | undefined>(undefined);

export function CoursePlayerProvider({ children }: { children: React.ReactNode }) {
  // State for content type
  const [contentType, setContentType] = useState<ContentType>('video');
  
  // State for notes visibility
  const [showNotes, setShowNotes] = useState(false);
  
  // State for lesson progress tracking
  const [lessonProgress, setLessonProgress] = useState<Record<string, LessonProgress>>({});
  
  // State for dark mode
  const [isDarkMode, setIsDarkMode] = useState(false);
  
  // Current lesson ID
  const [currentLessonId, setCurrentLessonId] = useState<string | null>(null);
  
  // Load progress data from localStorage on initial render
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedProgress = localStorage.getItem('lessonProgress');
      if (savedProgress) {
        setLessonProgress(JSON.parse(savedProgress));
      }
      
      // Check for dark mode preference
      const darkModePreference = localStorage.getItem('darkMode') === 'true';
      setIsDarkMode(darkModePreference);
    }
  }, []);
  
  // Save progress to localStorage when it changes
  useEffect(() => {
    if (typeof window !== 'undefined' && Object.keys(lessonProgress).length > 0) {
      localStorage.setItem('lessonProgress', JSON.stringify(lessonProgress));
    }
  }, [lessonProgress]);
  
  // Toggle notes visibility
  const toggleNotes = () => {
    setShowNotes(prev => !prev);
  };
  
  // Update progress for a lesson
  const updateProgress = (lessonId: string, progressData: Partial<LessonProgress>) => {
    setLessonProgress(prev => {
      const existing = prev[lessonId] || {
        lessonId,
        progress: 0,
        completed: false,
        lastPosition: 0
      };
      
      return {
        ...prev,
        [lessonId]: {
          ...existing,
          ...progressData
        }
      };
    });
  };
  
  // Mark a lesson as complete
  const markComplete = (lessonId: string) => {
    updateProgress(lessonId, { completed: true, progress: 100 });
  };
  
  // Toggle dark mode
  const toggleDarkMode = () => {
    const newValue = !isDarkMode;
    setIsDarkMode(newValue);
    localStorage.setItem('darkMode', String(newValue));
    
    // Update document class for dark mode
    if (newValue) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };
  
  // Save a note for a lesson
  const saveNote = (lessonId: string, noteContent: string) => {
    updateProgress(lessonId, { notes: noteContent });
  };
  
  // Get notes for a lesson
  const getNotes = (lessonId: string): string => {
    return lessonProgress[lessonId]?.notes || '';
  };
  
  return (
    <CoursePlayerContext.Provider
      value={{
        contentType,
        setContentType,
        showNotes,
        toggleNotes,
        lessonProgress,
        updateProgress,
        markComplete,
        isDarkMode,
        toggleDarkMode,
        currentLessonId,
        setCurrentLessonId,
        saveNote,
        getNotes
      }}
    >
      {children}
    </CoursePlayerContext.Provider>
  );
}

export function useCoursePlayer() {
  const context = useContext(CoursePlayerContext);
  if (context === undefined) {
    throw new Error('useCoursePlayer must be used within a CoursePlayerProvider');
  }
  return context;
} 