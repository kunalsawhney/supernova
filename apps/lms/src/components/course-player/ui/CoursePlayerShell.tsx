import React, { useState, useRef, useEffect } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { ErrorBoundary } from 'react-error-boundary';
import { 
  Maximize2, Minimize2, Sidebar, X, 
  BookOpen, PlayCircle, FileText, 
  HelpCircle, Settings, Layers,
  ArrowLeft, ArrowUp, ArrowDown,
  LayoutPanelTop, BookmarkPlus,
  Bookmark, ScreenShare, AlertTriangle,
  ArrowRight
} from 'lucide-react';

import { useCoursePlayer } from '@/contexts/CoursePlayerContext';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { 
  Tooltip, 
  TooltipContent, 
  TooltipProvider, 
  TooltipTrigger 
} from '@/components/ui/tooltip';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';

interface CoursePlayerShellProps {
  children: React.ReactNode;
  contentType: 'video' | 'reading' | 'quiz' | 'project' | 'discussion';
  title: string;
  description?: string;
  moduleTitle?: string;
  progress: number;
  sidebarContent: React.ReactNode;
  notesContent?: React.ReactNode;
}

// Layout modes described with their features
const layoutModeDescriptions = {
  default: "Standard view with all panels",
  focused: "Content-focused view with minimal UI",
  split: "Content and notes side-by-side",
  theater: "Maximized content view"
};

// Simple error fallback component
function ErrorFallback({ error, resetErrorBoundary }: { error: Error; resetErrorBoundary: () => void }) {
  return (
    <div 
      role="alert"
      className="p-4 rounded-lg bg-red-50 border border-red-200 text-red-700 dark:bg-red-900/20 dark:border-red-800 dark:text-red-300"
    >
      <div className="flex items-center gap-2 mb-2">
        <AlertTriangle className="h-5 w-5" />
        <h3 className="font-medium">Something went wrong</h3>
      </div>
      <pre className="text-sm bg-white/50 dark:bg-black/20 p-2 rounded mt-2 overflow-auto">
        {error.message}
      </pre>
      <div className="mt-4">
        <Button 
          variant="outline" 
          onClick={resetErrorBoundary}
          aria-label="Try again"
        >
          Try again
        </Button>
      </div>
    </div>
  );
}

export function CoursePlayerShell({
  children,
  contentType,
  title,
  description,
  moduleTitle,
  progress,
  sidebarContent,
  notesContent
}: CoursePlayerShellProps) {
  // Get layout state from context
  const { 
    showNotes, 
    toggleNotes, 
    layoutMode, 
    setLayoutMode,
    notePosition, 
    setNotePosition,
    sidebarCollapsed, 
    setSidebarCollapsed,
    saveLayoutPreference,
    getBookmarks,
    addBookmark,
    removeBookmark,
    currentLessonId
  } = useCoursePlayer();
  
  // Local state
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [currentTab, setCurrentTab] = useState<string>('content');
  const [addingBookmark, setAddingBookmark] = useState(false);
  const [bookmarkLabel, setBookmarkLabel] = useState('');
  const [error, setError] = useState<Error | null>(null);
  
  // Refs
  const shellRef = useRef<HTMLDivElement>(null);
  const mainRef = useRef<HTMLDivElement>(null);
  
  // Get bookmarks if we have a current lesson
  const bookmarks = currentLessonId ? getBookmarks(currentLessonId) : [];
  
  // Style for content type
  const contentTypeStyles = {
    video: {
      bg: 'bg-blue-50 dark:bg-blue-950/20',
      border: 'border-blue-200 dark:border-blue-800',
      text: 'text-blue-700 dark:text-blue-300',
      icon: <PlayCircle className="h-5 w-5" aria-hidden="true" />
    },
    reading: {
      bg: 'bg-amber-50 dark:bg-amber-950/20',
      border: 'border-amber-200 dark:border-amber-800',
      text: 'text-amber-700 dark:text-amber-300',
      icon: <BookOpen className="h-5 w-5" aria-hidden="true" />
    },
    quiz: {
      bg: 'bg-purple-50 dark:bg-purple-950/20',
      border: 'border-purple-200 dark:border-purple-800',
      text: 'text-purple-700 dark:text-purple-300',
      icon: <FileText className="h-5 w-5" aria-hidden="true" />
    },
    project: {
      bg: 'bg-green-50 dark:bg-green-950/20',
      border: 'border-green-200 dark:border-green-800',
      text: 'text-green-700 dark:text-green-300',
      icon: <Layers className="h-5 w-5" aria-hidden="true" />
    },
    discussion: {
      bg: 'bg-rose-50 dark:bg-rose-950/20',
      border: 'border-rose-200 dark:border-rose-800',
      text: 'text-rose-700 dark:text-rose-300',
      icon: <HelpCircle className="h-5 w-5" aria-hidden="true" />
    }
  };

  const style = contentTypeStyles[contentType];

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Only process if no input/textarea elements are focused
      const activeElement = document.activeElement as HTMLElement;
      const isInputFocused = activeElement?.tagName === 'INPUT' || 
                           activeElement?.tagName === 'TEXTAREA';
      
      if (isInputFocused) return;
      
      // Keyboard shortcuts
      switch (e.key) {
        case 'f': // Toggle fullscreen
          if (e.ctrlKey || e.metaKey) {
            e.preventDefault();
            toggleFullScreen();
          }
          break;
        case 'n': // Toggle notes
          if (e.ctrlKey || e.metaKey) {
            e.preventDefault();
            toggleNotes();
          }
          break;
        case 's': // Toggle sidebar
          if (e.ctrlKey || e.metaKey) {
            e.preventDefault();
            setSidebarCollapsed(!sidebarCollapsed);
          }
          break;
        case 'b': // Add bookmark at current position
          if (e.ctrlKey || e.metaKey) {
            e.preventDefault();
            setAddingBookmark(true);
          }
          break;
        case 'Escape': // Exit fullscreen or close dialogs
          if (isFullScreen) {
            toggleFullScreen();
          }
          if (addingBookmark) {
            setAddingBookmark(false);
          }
          break;
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isFullScreen, sidebarCollapsed, addingBookmark, toggleNotes, setSidebarCollapsed]);

  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      shellRef.current?.requestFullscreen().then(() => {
        setIsFullScreen(true);
      }).catch(err => {
        console.error(`Error attempting to enable fullscreen: ${err.message}`);
      });
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().then(() => {
          setIsFullScreen(false);
        }).catch(err => {
          console.error(`Error attempting to exit fullscreen: ${err.message}`);
        });
      }
    }
  };
  
  // Toggle note position
  const toggleNotePosition = () => {
    const newPosition = notePosition === 'right' ? 'bottom' : 'right';
    setNotePosition(newPosition);
    saveLayoutPreference(contentType, { notePosition: newPosition });
  };
  
  // Apply the layout mode
  const applyLayoutMode = (mode: 'default' | 'focused' | 'split' | 'theater') => {
    setLayoutMode(mode);
    
    // Configure settings based on the mode
    switch (mode) {
      case 'focused':
        setSidebarCollapsed(true);
        setCurrentTab('content');
        break;
      case 'split':
        setSidebarCollapsed(false);
        if (!showNotes) toggleNotes();
        break;
      case 'theater':
        setSidebarCollapsed(true);
        setCurrentTab('content');
        break;
      default: // default mode
        setSidebarCollapsed(false);
        setCurrentTab('content');
        break;
    }
    
    // Save preference
    saveLayoutPreference(contentType, { mode });
  };
  
  // Handle bookmark creation
  const handleAddBookmark = () => {
    if (!currentLessonId) return;
    
    // Get current position (time for video, scroll position for reading)
    // In a real implementation, we would get this from the active content component
    const mockPosition = Math.floor(Math.random() * 100); // Simulate a position
    
    addBookmark(currentLessonId, {
      position: mockPosition,
      label: bookmarkLabel || `Bookmark at ${new Date().toLocaleTimeString()}`,
    });
    
    setAddingBookmark(false);
    setBookmarkLabel('');
  };
  
  // Get container class based on layout mode
  const getContainerClass = () => {
    switch (layoutMode) {
      case 'focused':
        return 'course-player-focused';
      case 'split':
        return 'course-player-split';
      case 'theater':
        return 'course-player-theater';
      default:
        return 'course-player-default';
    }
  };
  
  return (
    <div 
      ref={shellRef}
      className={cn(
        "course-player-shell flex flex-col h-[calc(100vh-4rem)]",
        getContainerClass(),
        isFullScreen && "fixed inset-0 z-50 bg-background h-screen"
      )}
      data-layout-mode={layoutMode}
      data-note-position={notePosition}
      data-sidebar-collapsed={sidebarCollapsed}
    >
      {/* Header */}
      <header 
        className={cn(
          "py-2 px-4 flex items-center justify-between",
          style.border,
          layoutMode === 'focused' && 'h-12 opacity-60 hover:opacity-100 transition-opacity'
        )}
        aria-label="Course player controls"
      >
        <div className="flex items-center">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="mr-2"
            aria-label={sidebarCollapsed ? "Show navigation sidebar" : "Hide navigation sidebar"}
            aria-expanded={!sidebarCollapsed}
          >
            <Sidebar className="h-5 w-5" aria-hidden="true" />
          </Button>
          <div>
            {moduleTitle && (
              <div className="text-sm text-muted-foreground" aria-label="Module title">{moduleTitle}</div>
            )}
            <h1 className={cn(
              "text-xl font-semibold",
              layoutMode === 'focused' && 'text-base'
            )} aria-label="Lesson title">{title}</h1>
          </div>
        </div>
        
        <div className="flex items-center space-x-1">
          {/* Layout mode selector */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                aria-label="Change layout mode"
              >
                <LayoutPanelTop className="h-5 w-5" aria-hidden="true" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Layout Mode</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem 
                  onClick={() => applyLayoutMode('default')}
                  className={cn(layoutMode === 'default' && "bg-muted")}
                >
                  Default
                  <span className="ml-2 text-xs text-muted-foreground">
                    {layoutModeDescriptions.default}
                  </span>
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => applyLayoutMode('focused')}
                  className={cn(layoutMode === 'focused' && "bg-muted")}
                >
                  Focused
                  <span className="ml-2 text-xs text-muted-foreground">
                    {layoutModeDescriptions.focused}
                  </span>
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => applyLayoutMode('split')}
                  className={cn(layoutMode === 'split' && "bg-muted")}
                >
                  Split View
                  <span className="ml-2 text-xs text-muted-foreground">
                    {layoutModeDescriptions.split}
                  </span>
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => applyLayoutMode('theater')}
                  className={cn(layoutMode === 'theater' && "bg-muted")}
                >
                  Theater
                  <span className="ml-2 text-xs text-muted-foreground">
                    {layoutModeDescriptions.theater}
                  </span>
                </DropdownMenuItem>
              </DropdownMenuGroup>
              
              <DropdownMenuSeparator />
              
              <DropdownMenuGroup>
                <DropdownMenuLabel>Notes Position</DropdownMenuLabel>
                <DropdownMenuItem onClick={toggleNotePosition}>
                  {notePosition === 'right' ? (
                    <>
                      <ArrowDown className="h-4 w-4 mr-2" aria-hidden="true" />
                      Move to Bottom
                    </>
                  ) : (
                    <>
                      <ArrowRight className="h-4 w-4 mr-2" aria-hidden="true" />
                      Move to Side
                    </>
                  )}
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
          
          {/* Bookmarks dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                aria-label="Bookmarks"
              >
                <Bookmark className="h-5 w-5" aria-hidden="true" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Bookmarks</DropdownMenuLabel>
              <DropdownMenuSeparator />
              
              {bookmarks.length > 0 ? (
                bookmarks.map(bookmark => (
                  <DropdownMenuItem 
                    key={bookmark.id}
                    onClick={() => {
                      // In a real app, this would seek to the bookmark position
                      console.log(`Seeking to ${bookmark.position}`);
                    }}
                  >
                    <div className="flex items-center justify-between w-full">
                      <span>{bookmark.label}</span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 ml-2"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (currentLessonId) {
                            removeBookmark(currentLessonId, bookmark.id);
                          }
                        }}
                        aria-label={`Delete bookmark: ${bookmark.label}`}
                      >
                        <X className="h-3 w-3" aria-hidden="true" />
                      </Button>
                    </div>
                  </DropdownMenuItem>
                ))
              ) : (
                <div className="px-2 py-1.5 text-sm text-muted-foreground">
                  No bookmarks yet
                </div>
              )}
              
              <DropdownMenuSeparator />
              
              <DropdownMenuItem 
                onClick={() => setAddingBookmark(true)}
                className="text-primary"
              >
                <BookmarkPlus className="h-4 w-4 mr-2" aria-hidden="true" />
                Add Bookmark
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          {/* Notes toggle */}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={toggleNotes}
                  aria-label={showNotes ? "Hide notes" : "Show notes"}
                  aria-pressed={showNotes}
                >
                  <BookOpen className="h-5 w-5" aria-hidden="true" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                {showNotes ? 'Hide Notes' : 'Show Notes'}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          {/* Fullscreen toggle */}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={toggleFullScreen}
                  aria-label={isFullScreen ? "Exit fullscreen" : "Enter fullscreen"}
                >
                  {isFullScreen ? 
                    <Minimize2 className="h-5 w-5" aria-hidden="true" /> : 
                    <Maximize2 className="h-5 w-5" aria-hidden="true" />
                  }
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                {isFullScreen ? 'Exit Fullscreen' : 'Fullscreen'}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </header>
      
      {/* Main content area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Navigation sidebar */}
        <AnimatePresence initial={false}>
          {!sidebarCollapsed && (
            <motion.div 
              key="sidebar"
              className={cn(
                "h-full overflow-y-auto",
                style.border
              )}
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 320, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ type: "spring", bounce: 0, duration: 0.4 }}
              role="navigation"
              aria-label="Course navigation"
            >
              {sidebarContent}
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Content area */}
        <div 
          ref={mainRef}
          className={cn(
            "flex-1 overflow-hidden flex",
            notePosition === 'right' ? 'flex-row' : 'flex-col'
          )}
        >
          <div className={cn(
            "flex flex-col",
            notePosition === 'right' ? 'flex-1' : 'w-full',
            showNotes && notePosition === 'right' ? 'w-[60%]' : ''
          )}>
            {/* Progress bar */}
            <div className="px-4 py-2">
              <div className="flex justify-between text-sm mb-1">
                <span className="font-medium">Progress</span>
                <span>{progress}%</span>
              </div>
              <Progress 
                value={progress} 
                className="h-1.5" 
                aria-label={`Course progress: ${progress}%`}
              />
            </div>
            
            {/* Content tabs */}
            <Tabs 
              defaultValue="content" 
              value={currentTab}
              onValueChange={setCurrentTab}
              className="flex-1 flex flex-col overflow-hidden"
            >
              <TabsList className={cn(
                "mx-4 my-2 bg-muted/50",
                layoutMode === 'focused' && 'mb-1 mt-1' 
              )}>
                <TabsTrigger value="content" className="flex-1">Content</TabsTrigger>
                <TabsTrigger value="discussion" className="flex-1">Discussion</TabsTrigger>
                <TabsTrigger value="resources" className="flex-1">Resources</TabsTrigger>
              </TabsList>
              
              <TabsContent value="content" className="flex-1 overflow-y-auto p-4 m-0">
                <div className={cn(
                  "p-4 rounded-lg",
                  style.bg
                )}>
                  <div className="flex items-center space-x-2 mb-3">
                    {style.icon}
                    <span className={cn("text-sm font-medium", style.text)} aria-label={`Content type: ${contentType}`}>
                      {contentType.charAt(0).toUpperCase() + contentType.slice(1)} Content
                    </span>
                  </div>
                  <ErrorBoundary
                    FallbackComponent={ErrorFallback}
                    onReset={() => setError(null)}
                    resetKeys={[currentLessonId]}
                  >
                    {children}
                  </ErrorBoundary>
                </div>
              </TabsContent>
              
              <TabsContent value="discussion" className="flex-1 overflow-y-auto p-4 m-0">
                <div className="p-4 border rounded-lg">
                  <h3 className="text-lg font-medium mb-4">Discussion</h3>
                  <p className="text-muted-foreground">
                    This is where discussions related to this content will appear.
                  </p>
                </div>
              </TabsContent>
              
              <TabsContent value="resources" className="flex-1 overflow-y-auto p-4 m-0">
                <div className="p-4 border rounded-lg">
                  <h3 className="text-lg font-medium mb-4">Resources</h3>
                  <p className="text-muted-foreground">
                    Additional resources related to this content will appear here.
                  </p>
                </div>
              </TabsContent>
            </Tabs>
          </div>
          
          {/* Notes panel */}
          <AnimatePresence initial={false}>
            {showNotes && (
              <motion.div 
                key="notes"
                className={cn(
                  "overflow-hidden border-l",
                  notePosition === 'right' 
                    ? 'w-[40%] border-l' 
                    : 'h-[250px] min-h-[250px] max-h-[40%] border-t mt-auto'
                )}
                initial={notePosition === 'right' 
                  ? { width: 0, opacity: 0 } 
                  : { height: 0, opacity: 0 }
                }
                animate={notePosition === 'right' 
                  ? { width: '40%', opacity: 1 } 
                  : { height: '250px', opacity: 1 }
                }
                exit={notePosition === 'right' 
                  ? { width: 0, opacity: 0 } 
                  : { height: 0, opacity: 0 }
                }
                transition={{ type: "spring", bounce: 0, duration: 0.4 }}
                aria-label="Notes panel"
              >
                {notesContent}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
      
      {/* Add bookmark dialog */}
      <AnimatePresence>
        {addingBookmark && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
            onClick={() => setAddingBookmark(false)}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="bg-background rounded-lg shadow-lg p-4 w-full max-w-md"
              onClick={(e: React.MouseEvent) => e.stopPropagation()}
              role="dialog"
              aria-label="Add bookmark"
              aria-modal="true"
            >
              <h3 className="text-lg font-medium mb-4">Add Bookmark</h3>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="bookmark-label" className="text-sm font-medium">
                    Bookmark Label
                  </label>
                  <input
                    id="bookmark-label"
                    type="text"
                    className="w-full p-2 border rounded-md"
                    placeholder="Enter a label for this bookmark"
                    value={bookmarkLabel}
                    onChange={(e) => setBookmarkLabel(e.target.value)}
                    autoFocus
                  />
                </div>
                <div className="flex justify-end space-x-2">
                  <Button
                    variant="outline"
                    onClick={() => setAddingBookmark(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleAddBookmark}
                  >
                    Add Bookmark
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Keyboard shortcuts help - displayed when ? is pressed - would be implemented later */}
    </div>
  );
} 