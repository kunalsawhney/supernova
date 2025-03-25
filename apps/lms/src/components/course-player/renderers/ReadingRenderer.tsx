import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Bookmark, TextQuote, Share2, Printer, Sun, Moon } from 'lucide-react';

import { useCoursePlayer } from '@/contexts/CoursePlayerContext';
import { 
  Tooltip, 
  TooltipContent, 
  TooltipProvider, 
  TooltipTrigger 
} from '@/components/ui/tooltip';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';

interface ReadingRendererProps {
  content: string;
  title: string;
  lessonId: string;
  estimatedReadTime?: number;
}

export function ReadingRenderer({
  content,
  title,
  lessonId,
  estimatedReadTime = 5
}: ReadingRendererProps) {
  // Refs
  const contentRef = useRef<HTMLDivElement>(null);
  const scrollPositionRef = useRef(0);
  
  // Context
  const { updateProgress, lessonProgress, markComplete, isDarkMode, toggleDarkMode } = useCoursePlayer();
  
  // State
  const [fontSize, setFontSize] = useState(16);
  const [readingMode, setReadingMode] = useState<'normal' | 'focus'>('normal');
  const [contentWidth, setContentWidth] = useState<'narrow' | 'medium' | 'wide'>('medium');
  const [hasReachedEnd, setHasReachedEnd] = useState(false);
  
  // Track reading progress
  useEffect(() => {
    // Load previous reading position
    const savedProgress = lessonProgress[lessonId];
    if (savedProgress?.lastPosition && contentRef.current) {
      // Set scroll position with a slight delay to ensure content is rendered
      setTimeout(() => {
        if (contentRef.current) {
          contentRef.current.scrollTop = savedProgress.lastPosition;
          scrollPositionRef.current = savedProgress.lastPosition;
        }
      }, 100);
    }
    
    // Mark as complete if previously completed
    if (savedProgress?.completed) {
      setHasReachedEnd(true);
    }
  }, [lessonId, lessonProgress]);
  
  // Add scroll listener to track reading progress
  useEffect(() => {
    const contentElement = contentRef.current;
    if (!contentElement) return;
    
    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = contentElement;
      scrollPositionRef.current = scrollTop;
      
      // Calculate reading progress
      const scrollPercent = Math.min(100, Math.round((scrollTop / (scrollHeight - clientHeight)) * 100));
      
      // Update progress
      updateProgress(lessonId, {
        progress: scrollPercent,
        lastPosition: scrollTop
      });
      
      // Check if user has reached end (90% scrolled)
      if (scrollPercent >= 90 && !hasReachedEnd) {
        setHasReachedEnd(true);
        markComplete(lessonId);
      }
    };
    
    contentElement.addEventListener('scroll', handleScroll);
    return () => contentElement.removeEventListener('scroll', handleScroll);
  }, [lessonId, updateProgress, hasReachedEnd, markComplete]);
  
  // Calculate width class based on contentWidth setting
  const getWidthClass = () => {
    switch (contentWidth) {
      case 'narrow': return 'max-w-2xl';
      case 'wide': return 'max-w-5xl';
      default: return 'max-w-3xl'; // medium
    }
  };
  
  // Font size adjustment
  const increaseFontSize = () => {
    setFontSize(prev => Math.min(prev + 2, 24));
  };
  
  const decreaseFontSize = () => {
    setFontSize(prev => Math.max(prev - 2, 12));
  };
  
  // Toggle reading mode
  const toggleReadingMode = () => {
    setReadingMode(prev => prev === 'normal' ? 'focus' : 'normal');
  };
  
  // Cycle through width options
  const cycleContentWidth = () => {
    setContentWidth(prev => {
      if (prev === 'narrow') return 'medium';
      if (prev === 'medium') return 'wide';
      return 'narrow';
    });
  };
  
  return (
    <div className="flex flex-col h-full">
      {/* Reading controls */}
      <div className={cn(
        "flex items-center justify-between px-2 py-2 border-b", 
        readingMode === 'focus' ? 'opacity-0 hover:opacity-100 transition-opacity' : ''
      )}>
        <div className="flex items-center space-x-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={toggleReadingMode}
                >
                  <BookOpen className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                {readingMode === 'normal' ? 'Focus Mode' : 'Normal Mode'}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={cycleContentWidth}
                >
                  <TextQuote className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                Change Width ({contentWidth})
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={toggleDarkMode}
                >
                  {isDarkMode ? (
                    <Sun className="h-4 w-4" />
                  ) : (
                    <Moon className="h-4 w-4" />
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                {isDarkMode ? 'Light Mode' : 'Dark Mode'}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-1 border rounded-md">
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8"
              onClick={decreaseFontSize}
              disabled={fontSize <= 12}
            >
              <span className="text-sm">A-</span>
            </Button>
            <Separator orientation="vertical" className="h-4" />
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8"
              onClick={increaseFontSize}
              disabled={fontSize >= 24}
            >
              <span className="text-sm">A+</span>
            </Button>
          </div>
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon"
                >
                  <Bookmark className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                Bookmark
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon"
                >
                  <Share2 className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                Share
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon"
                >
                  <Printer className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                Print
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
      
      {/* Reading content */}
      <div 
        ref={contentRef}
        className={cn(
          "flex-1 overflow-y-auto py-8 px-4 mx-auto",
          readingMode === 'focus' ? 'bg-amber-50 dark:bg-amber-950/20' : '',
          getWidthClass()
        )}
        style={{ fontSize: `${fontSize}px` }}
      >
        <div className="prose prose-amber dark:prose-invert max-w-none">
          <h1 className="mb-6">{title}</h1>
          <div 
            className="space-y-4"
            dangerouslySetInnerHTML={{ __html: content }}
          />
        </div>
      </div>
      
      {/* Completion indicator */}
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={hasReachedEnd ? { y: 0, opacity: 1 } : { y: 50, opacity: 0 }}
        transition={{ duration: 0.5, type: 'spring' }}
        className={cn(
          "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 px-4 py-3 text-center",
          !hasReachedEnd && "hidden"
        )}
      >
        <p className="font-medium">
          You've completed this reading! 🎉
        </p>
      </motion.div>
    </div>
  );
} 