import React, { createContext, useContext, useState, useEffect } from 'react';

type ContentType = 'video' | 'reading' | 'quiz' | 'project' | 'discussion';
type LayoutMode = 'default' | 'focused' | 'split' | 'theater';
type NotePosition = 'right' | 'bottom';

interface LessonProgress {
  lessonId: string;
  progress: number;
  completed: boolean;
  lastPosition: number; // video time or scroll position
  notes?: string;
  bookmarks?: Bookmark[];
}

interface LayoutPreference {
  mode: LayoutMode;
  notePosition: NotePosition;
  sidebarCollapsed: boolean;
}

interface Bookmark {
  id: string;
  position: number; // time for video, scroll position for text
  label: string;
  createdAt: string;
}

interface ContentPreferences {
  playbackSpeed: number;
  autoplay: boolean;
  volume: number;
  captions: boolean;
}

interface CoursePlayerContextProps {
  // Content state
  contentType: ContentType;
  setContentType: (type: ContentType) => void;
  
  // Layout state
  showNotes: boolean;
  toggleNotes: () => void;
  layoutMode: LayoutMode;
  setLayoutMode: (mode: LayoutMode) => void;
  notePosition: NotePosition;
  setNotePosition: (position: NotePosition) => void;
  sidebarCollapsed: boolean;
  setSidebarCollapsed: (collapsed: boolean) => void;
  
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
  
  // Bookmarks
  addBookmark: (lessonId: string, bookmark: Omit<Bookmark, 'id' | 'createdAt'>) => void;
  removeBookmark: (lessonId: string, bookmarkId: string) => void;
  getBookmarks: (lessonId: string) => Bookmark[];
  
  // Content preferences
  contentPreferences: ContentPreferences;
  updateContentPreferences: (prefs: Partial<ContentPreferences>) => void;
  
  // Layout preferences
  saveLayoutPreference: (contentType: ContentType, layoutPreference: Partial<LayoutPreference>) => void;
  getPreferredLayout: (contentType: ContentType) => LayoutPreference;
  
  // Next lesson preloading
  preloadNextLesson: (lessonId: string) => void;
  nextLessonId: string | null;
  isPreloading: boolean;
}

const defaultContentPreferences: ContentPreferences = {
  playbackSpeed: 1,
  autoplay: false,
  volume: 1,
  captions: false
};

const defaultLayoutPreference: LayoutPreference = {
  mode: 'default',
  notePosition: 'right',
  sidebarCollapsed: false
};

const CoursePlayerContext = createContext<CoursePlayerContextProps | undefined>(undefined);

export function CoursePlayerProvider({ children }: { children: React.ReactNode }) {
  // State for content type
  const [contentType, setContentType] = useState<ContentType>('video');
  
  // State for layout
  const [showNotes, setShowNotes] = useState(false);
  const [layoutMode, setLayoutMode] = useState<LayoutMode>('default');
  const [notePosition, setNotePosition] = useState<NotePosition>('right');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  
  // State for lesson progress tracking
  const [lessonProgress, setLessonProgress] = useState<Record<string, LessonProgress>>({});
  
  // State for dark mode
  const [isDarkMode, setIsDarkMode] = useState(false);
  
  // State for content preferences
  const [contentPreferences, setContentPreferences] = useState<ContentPreferences>(defaultContentPreferences);
  
  // State for layout preferences by content type
  const [layoutPreferences, setLayoutPreferences] = useState<Record<ContentType, LayoutPreference>>({
    video: { ...defaultLayoutPreference, mode: 'theater' },
    reading: { ...defaultLayoutPreference, mode: 'focused' },
    quiz: { ...defaultLayoutPreference, mode: 'focused' },
    project: { ...defaultLayoutPreference },
    discussion: { ...defaultLayoutPreference }
  });
  
  // Current lesson ID
  const [currentLessonId, setCurrentLessonId] = useState<string | null>(null);
  
  // State for next lesson preloading
  const [nextLessonId, setNextLessonId] = useState<string | null>(null);
  const [isPreloading, setIsPreloading] = useState(false);
  
  // Load data from localStorage on initial render
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Load progress data
      const savedProgress = localStorage.getItem('lessonProgress');
      if (savedProgress) {
        setLessonProgress(JSON.parse(savedProgress));
      }
      
      // Load dark mode preference
      const darkModePreference = localStorage.getItem('darkMode') === 'true';
      setIsDarkMode(darkModePreference);
      
      // Load content preferences
      const savedContentPrefs = localStorage.getItem('contentPreferences');
      if (savedContentPrefs) {
        setContentPreferences(JSON.parse(savedContentPrefs));
      }
      
      // Load layout preferences
      const savedLayoutPrefs = localStorage.getItem('layoutPreferences');
      if (savedLayoutPrefs) {
        setLayoutPreferences(JSON.parse(savedLayoutPrefs));
      }
      
      // Apply dark mode to document
      if (darkModePreference) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
  }, []);
  
  // Apply layout preferences when content type changes
  useEffect(() => {
    if (contentType) {
      const prefs = layoutPreferences[contentType];
      setLayoutMode(prefs.mode);
      setNotePosition(prefs.notePosition);
      setSidebarCollapsed(prefs.sidebarCollapsed);
    }
  }, [contentType, layoutPreferences]);
  
  // Save progress to localStorage when it changes
  useEffect(() => {
    if (typeof window !== 'undefined' && Object.keys(lessonProgress).length > 0) {
      localStorage.setItem('lessonProgress', JSON.stringify(lessonProgress));
    }
  }, [lessonProgress]);
  
  // Save content preferences when they change
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('contentPreferences', JSON.stringify(contentPreferences));
    }
  }, [contentPreferences]);
  
  // Save layout preferences when they change
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('layoutPreferences', JSON.stringify(layoutPreferences));
    }
  }, [layoutPreferences]);
  
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
        lastPosition: 0,
        bookmarks: []
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
  
  // Bookmark functions
  const addBookmark = (lessonId: string, bookmark: Omit<Bookmark, 'id' | 'createdAt'>) => {
    setLessonProgress(prev => {
      const existing = prev[lessonId] || {
        lessonId,
        progress: 0,
        completed: false,
        lastPosition: 0,
        bookmarks: []
      };
      
      const newBookmark: Bookmark = {
        ...bookmark,
        id: `bookmark-${Date.now()}`,
        createdAt: new Date().toISOString()
      };
      
      return {
        ...prev,
        [lessonId]: {
          ...existing,
          bookmarks: [...(existing.bookmarks || []), newBookmark]
        }
      };
    });
  };
  
  const removeBookmark = (lessonId: string, bookmarkId: string) => {
    setLessonProgress(prev => {
      const existing = prev[lessonId];
      if (!existing || !existing.bookmarks) return prev;
      
      return {
        ...prev,
        [lessonId]: {
          ...existing,
          bookmarks: existing.bookmarks.filter(b => b.id !== bookmarkId)
        }
      };
    });
  };
  
  const getBookmarks = (lessonId: string): Bookmark[] => {
    return lessonProgress[lessonId]?.bookmarks || [];
  };
  
  // Content preferences update
  const updateContentPreferences = (prefs: Partial<ContentPreferences>) => {
    setContentPreferences(prev => ({
      ...prev,
      ...prefs
    }));
  };
  
  // Layout preferences
  const saveLayoutPreference = (contentType: ContentType, layoutPreference: Partial<LayoutPreference>) => {
    setLayoutPreferences(prev => ({
      ...prev,
      [contentType]: {
        ...prev[contentType],
        ...layoutPreference
      }
    }));
    
    // If this is the current content type, apply changes immediately
    if (contentType === contentType) {
      if (layoutPreference.mode !== undefined) {
        setLayoutMode(layoutPreference.mode);
      }
      if (layoutPreference.notePosition !== undefined) {
        setNotePosition(layoutPreference.notePosition);
      }
      if (layoutPreference.sidebarCollapsed !== undefined) {
        setSidebarCollapsed(layoutPreference.sidebarCollapsed);
      }
    }
  };
  
  const getPreferredLayout = (contentType: ContentType): LayoutPreference => {
    return layoutPreferences[contentType] || defaultLayoutPreference;
  };
  
  // Next lesson preloading
  const preloadNextLesson = (lessonId: string) => {
    // In a real implementation, this would determine the next lesson
    // and begin fetching its data. For now, we'll simulate this behavior.
    setIsPreloading(true);
    
    // Simulate determining the next lesson ID based on course structure
    // In a real app, this would involve API calls or traversing course data
    setTimeout(() => {
      // Mock next lesson determination
      const mockNextId = `next-${lessonId}`;
      setNextLessonId(mockNextId);
      setIsPreloading(false);
    }, 1000);
  };
  
  return (
    <CoursePlayerContext.Provider
      value={{
        contentType,
        setContentType,
        showNotes,
        toggleNotes,
        layoutMode,
        setLayoutMode,
        notePosition,
        setNotePosition,
        sidebarCollapsed,
        setSidebarCollapsed,
        lessonProgress,
        updateProgress,
        markComplete,
        isDarkMode,
        toggleDarkMode,
        currentLessonId,
        setCurrentLessonId,
        saveNote,
        getNotes,
        addBookmark,
        removeBookmark,
        getBookmarks,
        contentPreferences,
        updateContentPreferences,
        saveLayoutPreference,
        getPreferredLayout,
        preloadNextLesson,
        nextLessonId,
        isPreloading
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