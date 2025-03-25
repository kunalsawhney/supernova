import React, { useState } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  Maximize2, Minimize2, Sidebar, X, 
  BookOpen, PlayCircle, FileText, 
  HelpCircle, Settings, Layers
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

interface CoursePlayerShellProps {
  children: React.ReactNode;
  contentType: 'video' | 'reading' | 'quiz' | 'project' | 'discussion';
  title: string;
  description?: string;
  moduleTitle?: string;
  progress: number;
  showNotes?: boolean;
  onToggleNotes?: () => void;
  sidebarContent: React.ReactNode;
}

export function CoursePlayerShell({
  children,
  contentType,
  title,
  description,
  moduleTitle,
  progress,
  showNotes = false,
  onToggleNotes,
  sidebarContent
}: CoursePlayerShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [currentTab, setCurrentTab] = useState<string>('content');

  // Style for content type
  const contentTypeStyles = {
    video: {
      bg: 'bg-blue-50 dark:bg-blue-950/20',
      border: 'border-blue-200 dark:border-blue-800',
      text: 'text-blue-700 dark:text-blue-300',
      icon: <PlayCircle className="h-5 w-5" />
    },
    reading: {
      bg: 'bg-amber-50 dark:bg-amber-950/20',
      border: 'border-amber-200 dark:border-amber-800',
      text: 'text-amber-700 dark:text-amber-300',
      icon: <BookOpen className="h-5 w-5" />
    },
    quiz: {
      bg: 'bg-purple-50 dark:bg-purple-950/20',
      border: 'border-purple-200 dark:border-purple-800',
      text: 'text-purple-700 dark:text-purple-300',
      icon: <FileText className="h-5 w-5" />
    },
    project: {
      bg: 'bg-green-50 dark:bg-green-950/20',
      border: 'border-green-200 dark:border-green-800',
      text: 'text-green-700 dark:text-green-300',
      icon: <Layers className="h-5 w-5" />
    },
    discussion: {
      bg: 'bg-rose-50 dark:bg-rose-950/20',
      border: 'border-rose-200 dark:border-rose-800',
      text: 'text-rose-700 dark:text-rose-300',
      icon: <HelpCircle className="h-5 w-5" />
    }
  };

  const style = contentTypeStyles[contentType];

  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().then(() => {
        setIsFullScreen(true);
      });
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().then(() => {
          setIsFullScreen(false);
        });
      }
    }
  };

  return (
    <div className={cn(
      "course-player-shell flex flex-col h-[calc(100vh-4rem)]",
      isFullScreen && "fixed inset-0 z-50 bg-background h-screen"
    )}>
      {/* Header */}
      <header className={cn(
        // "border-b py-2 px-4 flex items-center justify-between",
        "py-2 px-4 flex items-center justify-between",
        style.border
      )}>
        <div className="flex items-center">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="mr-2"
          >
            <Sidebar className="h-5 w-5" />
          </Button>
          <div>
            {moduleTitle && (
              <div className="text-sm text-muted-foreground">{moduleTitle}</div>
            )}
            <h1 className="text-xl font-semibold">{title}</h1>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onToggleNotes}
                >
                  <BookOpen className="h-5 w-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                {showNotes ? 'Hide Notes' : 'Show Notes'}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={toggleFullScreen}
                >
                  {isFullScreen ? 
                    <Minimize2 className="h-5 w-5" /> : 
                    <Maximize2 className="h-5 w-5" />
                  }
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                {isFullScreen ? 'Exit Fullscreen' : 'Fullscreen'}
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
                  <Settings className="h-5 w-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                Settings
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </header>
      
      {/* Main content area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <motion.div 
          className={cn(
            // "border-r h-full overflow-y-auto",
            "h-full overflow-y-auto",
            style.border,
            sidebarOpen ? "w-80" : "w-0"
          )}
          initial={{ width: sidebarOpen ? 320 : 0 }}
          animate={{ width: sidebarOpen ? 320 : 0 }}
          transition={{ type: "spring", bounce: 0, duration: 0.4 }}
        >
          {sidebarContent}
        </motion.div>
        
        {/* Content area */}
        <div className="flex-1 overflow-hidden flex flex-col">
          {/* Progress bar */}
          <div className="px-4 py-2">
            <div className="flex justify-between text-sm mb-1">
              <span className="font-medium">Progress</span>
              <span>{progress}%</span>
            </div>
            <Progress value={progress} className="h-1.5" />
          </div>
          
          {/* Content tabs */}
          <Tabs 
            defaultValue="content" 
            value={currentTab}
            onValueChange={setCurrentTab}
            className="flex-1 flex flex-col overflow-hidden"
          >
            <TabsList className="mx-4 my-2 bg-muted/50">
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
                  <span className={cn("text-sm font-medium", style.text)}>
                    {contentType.charAt(0).toUpperCase() + contentType.slice(1)} Content
                  </span>
                </div>
                {children}
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
        
        {/* Notes panel (optional) */}
        {showNotes && (
          <motion.div 
            className="border-l h-full w-80 overflow-y-auto bg-background"
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 320, opacity: 1 }}
            transition={{ type: "spring", bounce: 0, duration: 0.4 }}
          >
            <div className="p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-medium">My Notes</h3>
                <Button variant="ghost" size="icon" onClick={onToggleNotes}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <div className="border rounded-md p-4 h-[calc(100vh-12rem)]">
                <textarea 
                  className="w-full h-full bg-transparent resize-none focus:outline-none"
                  placeholder="Take notes here..."
                />
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
} 