'use client';

import React, { useState, useRef, useEffect } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiChevronLeft, FiChevronRight, FiList, FiMaximize, FiMinimize, 
  FiPause, FiPlay, FiDownload, FiBookmark, FiEdit, FiMessageSquare,
  FiCheck, FiClock, FiVolume2, FiVolumeX, FiSettings
} from 'react-icons/fi';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { User, BookOpen, Trophy, ArrowRight, Check, Clock } from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Slider } from "@/components/ui/slider";

// Temporary course data until we fetch from the API
const MOCK_COURSE = {
  id: 'course-001',
  title: 'Introduction to React Development',
  description: 'Learn the fundamentals of React development including hooks, state management, and modern patterns.',
  instructor: 'Alex Johnson',
  progress: 45,
  modules: [
    {
      id: 'module-1',
      title: 'Getting Started with React',
      lessons: [
        { id: 'lesson-1-1', title: 'Introduction to React', duration: '8:24', type: 'video', completed: true },
        { id: 'lesson-1-2', title: 'Setting Up Your Environment', duration: '12:10', type: 'video', completed: true },
        { id: 'lesson-1-3', title: 'Your First React Component', duration: '15:45', type: 'video', completed: false },
        { id: 'lesson-1-4', title: 'Module 1 Quiz', duration: '10:00', type: 'quiz', completed: false },
      ]
    },
    {
      id: 'module-2',
      title: 'React Hooks and State',
      lessons: [
        { id: 'lesson-2-1', title: 'Introduction to Hooks', duration: '10:15', type: 'video', completed: false },
        { id: 'lesson-2-2', title: 'useState Hook', duration: '14:30', type: 'video', completed: false },
        { id: 'lesson-2-3', title: 'useEffect Hook', duration: '16:20', type: 'video', completed: false },
        { id: 'lesson-2-4', title: 'Custom Hooks', duration: '12:45', type: 'video', completed: false },
        { id: 'lesson-2-5', title: 'Module 2 Quiz', duration: '15:00', type: 'quiz', completed: false },
      ]
    },
    {
      id: 'module-3',
      title: 'Component Patterns and Advanced Concepts',
      lessons: [
        { id: 'lesson-3-1', title: 'Component Composition', duration: '13:20', type: 'video', completed: false },
        { id: 'lesson-3-2', title: 'Context API', duration: '18:45', type: 'video', completed: false },
        { id: 'lesson-3-3', title: 'Performance Optimization', duration: '20:10', type: 'video', completed: false },
        { id: 'lesson-3-4', title: 'Final Project', duration: '25:00', type: 'project', completed: false },
      ]
    }
  ]
};

// Find current lesson based on ID
const findCurrentLesson = (lessonId: string | null) => {
  if (!lessonId) return null;
  
  for (const module of MOCK_COURSE.modules) {
    const lesson = module.lessons.find(l => l.id === lessonId);
    if (lesson) {
      return { 
        lesson, 
        module,
        moduleIndex: MOCK_COURSE.modules.indexOf(module),
        lessonIndex: module.lessons.indexOf(lesson) 
      };
    }
  }
  return null;
};

// Find next and previous lessons
const findAdjacentLessons = (currentLessonId: string | null) => {
  if (!currentLessonId) return { prev: null, next: null };
  
  let allLessons: { id: string; moduleId: string }[] = [];
  MOCK_COURSE.modules.forEach(module => {
    module.lessons.forEach(lesson => {
      allLessons.push({ id: lesson.id, moduleId: module.id });
    });
  });
  
  const currentIndex = allLessons.findIndex(l => l.id === currentLessonId);
  if (currentIndex === -1) return { prev: null, next: null };
  
  const prev = currentIndex > 0 ? allLessons[currentIndex - 1] : null;
  const next = currentIndex < allLessons.length - 1 ? allLessons[currentIndex + 1] : null;
  
  return { prev, next };
};

// Add types for lesson progress
interface LessonProgress {
  lessonId: string;
  progress: number;
  completed: boolean;
  lastPosition: number;
}

export default function CoursePlayer() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const videoRef = useRef<HTMLVideoElement>(null);
  
  // State
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [showVolumeSlider, setShowVolumeSlider] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [activeLessonId, setActiveLessonId] = useState<string | null>(
    searchParams.get('lessonId') || MOCK_COURSE.modules[0].lessons[0].id
  );
  const [watchProgress, setWatchProgress] = useState(0);
  const volumeControlRef = useRef<HTMLDivElement>(null);
  const [lessonProgress, setLessonProgress] = useState<Record<string, LessonProgress>>(() => {
    // Initialize from localStorage if available
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('lessonProgress');
      return saved ? JSON.parse(saved) : {};
    }
    return {};
  });
  
  // Get current lesson details
  const currentLessonData = findCurrentLesson(activeLessonId);
  const { prev, next } = findAdjacentLessons(activeLessonId);
  
  // Save progress to localStorage when it changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('lessonProgress', JSON.stringify(lessonProgress));
    }
  }, [lessonProgress]);

  // Update progress when time updates
  const handleTimeUpdate = () => {
    if (videoRef.current && activeLessonId) {
      const currentTime = videoRef.current.currentTime;
      const duration = videoRef.current.duration;
      const progress = (currentTime / duration) * 100;
      
      setCurrentTime(currentTime);
      
      // Update lesson progress
      setLessonProgress(prev => {
        const isCompleted = progress >= 90; // Mark as completed when 90% watched
        return {
          ...prev,
          [activeLessonId]: {
            lessonId: activeLessonId,
            progress: Math.round(progress),
            completed: isCompleted,
            lastPosition: currentTime
          }
        };
      });
    }
  };

  // Resume from last position when changing lessons
  useEffect(() => {
    if (videoRef.current && activeLessonId && lessonProgress[activeLessonId]) {
      const { lastPosition } = lessonProgress[activeLessonId];
      videoRef.current.currentTime = lastPosition;
    }
  }, [activeLessonId]);

  // Calculate overall course progress
  const calculateCourseProgress = () => {
    let completedLessons = 0;
    let totalLessons = 0;

    MOCK_COURSE.modules.forEach(module => {
      module.lessons.forEach(lesson => {
        totalLessons++;
        if (lessonProgress[lesson.id]?.completed) {
          completedLessons++;
        }
      });
    });

    return Math.round((completedLessons / totalLessons) * 100);
  };
  
  // Handle different actions
  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };
  
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
        setIsFullscreen(false);
      }
    }
  };
  
  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
    }
  };
  
  const handleProgressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = parseFloat(e.target.value);
    if (videoRef.current) {
      videoRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };
  
  const formatTime = (timeInSeconds: number) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };
  
  const changeLesson = (lessonId: string) => {
    setActiveLessonId(lessonId);
    router.push(`/dashboard/student/course-player?lessonId=${lessonId}`);
  };
  
  const navigateToLesson = (direction: 'prev' | 'next') => {
    const target = direction === 'prev' ? prev : next;
    if (target) {
      changeLesson(target.id);
    }
  };
  
  // Handle volume change
  const handleVolumeChange = (value: number) => {
    if (videoRef.current) {
      const newVolume = value / 100;
      videoRef.current.volume = newVolume;
      setVolume(newVolume);
      setIsMuted(newVolume === 0);
    }
  };

  // Handle mute toggle
  const toggleMute = () => {
    if (videoRef.current) {
      if (isMuted) {
        videoRef.current.volume = volume;
        setIsMuted(false);
      } else {
        videoRef.current.volume = 0;
        setIsMuted(true);
      }
    }
  };

  // Handle playback speed change
  const changePlaybackSpeed = (speed: number) => {
    if (videoRef.current) {
      videoRef.current.playbackRate = speed;
      setPlaybackSpeed(speed);
    }
  };

  // Close volume slider when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (volumeControlRef.current && !volumeControlRef.current.contains(event.target as Node)) {
        setShowVolumeSlider(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (!videoRef.current) return;

      switch (e.key.toLowerCase()) {
        case ' ':
        case 'k':
          e.preventDefault();
          togglePlay();
          break;
        case 'm':
          e.preventDefault();
          toggleMute();
          break;
        case 'f':
          e.preventDefault();
          toggleFullscreen();
          break;
        case 'arrowleft':
          e.preventDefault();
          videoRef.current.currentTime -= 5;
          break;
        case 'arrowright':
          e.preventDefault();
          videoRef.current.currentTime += 5;
          break;
        case 'arrowup':
          e.preventDefault();
          handleVolumeChange(Math.min((volume + 0.1) * 100, 100));
          break;
        case 'arrowdown':
          e.preventDefault();
          handleVolumeChange(Math.max((volume - 0.1) * 100, 0));
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [volume]);
  
  return (
    <div className="flex h-full overflow-hidden bg-background">
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Navigation Bar */}
        <div className="h-16 border-b border-border flex items-center justify-between px-6 bg-gradient-to-r from-background to-background/95">
          <div className="flex items-center gap-4">
            <div>
              <h1 className="text-lg font-semibold text-foreground">
                {currentLessonData?.lesson?.title || "Course Player"}
              </h1>
              <p className="text-sm text-muted-foreground">
                {currentLessonData?.module?.title || ""}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => navigateToLesson('prev')}
              disabled={!prev}
              className="gap-2 hover:bg-accent/50"
            >
              <FiChevronLeft className="h-4 w-4" />
              <span className="hidden sm:inline">Previous</span>
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => navigateToLesson('next')}
              disabled={!next}
              className="gap-2 hover:bg-accent/50"
            >
              <span className="hidden sm:inline">Next</span>
              <FiChevronRight className="h-4 w-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="hover:bg-accent/50 ml-2"
            >
              <FiList className="h-5 w-5" />
            </Button>
          </div>
        </div>
        
        {/* Content Viewing Area */}
        <div className="flex-1 overflow-hidden flex flex-col">
          {/* Video Player */}
          <div className="relative bg-black aspect-video max-h-[70vh] w-full">
            <video
              ref={videoRef}
              src="https://storage.googleapis.com/webfundamentals-assets/videos/chrome.mp4"
              className="w-full h-full"
              onTimeUpdate={handleTimeUpdate}
              onLoadedMetadata={handleLoadedMetadata}
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
            />
            
            {/* Video Controls */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent p-6 flex flex-col">
              {/* Progress bar */}
              <div className="w-full flex items-center gap-3">
                <span className="text-xs font-medium text-white/90">{formatTime(currentTime)}</span>
                <div className="relative flex-1 group">
                  <input
                    type="range"
                    min={0}
                    max={duration || 100}
                    value={currentTime}
                    onChange={handleProgressChange}
                    className="w-full h-1.5 bg-white/20 rounded-full overflow-hidden appearance-none cursor-pointer group-hover:h-2 transition-all"
                    style={{
                      backgroundImage: `linear-gradient(to right, white ${(currentTime / duration) * 100}%, transparent 0)`,
                    }}
                  />
                </div>
                <span className="text-xs font-medium text-white/90">{formatTime(duration)}</span>
              </div>
              
              {/* Control buttons */}
              <div className="flex items-center justify-between mt-4">
                <div className="flex items-center gap-4">
                  <button 
                    onClick={togglePlay}
                    className="text-white hover:text-primary transition-colors rounded-full p-1 hover:bg-white/10"
                  >
                    {isPlaying ? <FiPause className="h-6 w-6" /> : <FiPlay className="h-6 w-6" />}
                  </button>

                  {/* Volume Control */}
                  <div ref={volumeControlRef} className="relative flex items-center">
                    <button
                      onClick={toggleMute}
                      onMouseEnter={() => setShowVolumeSlider(true)}
                      className="text-white hover:text-primary transition-colors rounded-full p-1 hover:bg-white/10"
                    >
                      {isMuted || volume === 0 ? (
                        <FiVolumeX className="h-6 w-6" />
                      ) : (
                        <FiVolume2 className="h-6 w-6" />
                      )}
                    </button>
                    
                    {/* Volume Slider */}
                    <AnimatePresence>
                      {showVolumeSlider && (
                        <motion.div
                          initial={{ opacity: 0, width: 0 }}
                          animate={{ opacity: 1, width: 'auto' }}
                          exit={{ opacity: 0, width: 0 }}
                          className="absolute left-8 bg-black/90 rounded-full px-3 py-2"
                          onMouseLeave={() => setShowVolumeSlider(false)}
                        >
                          <Slider
                            value={[volume * 100]}
                            max={100}
                            step={1}
                            className="w-24"
                            onValueChange={(values: number[]) => handleVolumeChange(values[0])}
                          />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Playback Speed */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button className="text-white hover:text-primary transition-colors rounded-full p-1 hover:bg-white/10 flex items-center gap-1">
                        <FiSettings className="h-5 w-5" />
                        <span className="text-xs font-medium">{playbackSpeed}x</span>
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start" className="w-40">
                      {[0.5, 0.75, 1, 1.25, 1.5, 1.75, 2].map((speed) => (
                        <DropdownMenuItem
                          key={speed}
                          onClick={() => changePlaybackSpeed(speed)}
                          className={cn(
                            "flex items-center justify-between",
                            playbackSpeed === speed && "bg-primary/10 text-primary"
                          )}
                        >
                          {speed}x
                          {playbackSpeed === speed && <Check className="h-4 w-4" />}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                
                <div className="flex items-center gap-4">
                  <button 
                    className="text-white hover:text-primary transition-colors rounded-full p-1 hover:bg-white/10"
                    onClick={toggleFullscreen}
                  >
                    {isFullscreen ? 
                      <FiMinimize className="h-5 w-5" /> : 
                      <FiMaximize className="h-5 w-5" />
                    }
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          {/* Content Tabs */}
          <div className="flex-1 overflow-y-auto border-t border-border bg-gradient-to-b from-background to-background/95">
            <Tabs defaultValue="overview" className="w-full h-full">
              <div className="border-b border-border px-6">
                <TabsList className="h-14 bg-transparent">
                  <TabsTrigger value="overview" className="gap-2">
                    <BookOpen className="h-4 w-4" />
                    Overview
                  </TabsTrigger>
                  <TabsTrigger value="notes" className="gap-2">
                    <FiEdit className="h-4 w-4" />
                    Notes
                  </TabsTrigger>
                  <TabsTrigger value="resources" className="gap-2">
                    <FiDownload className="h-4 w-4" />
                    Resources
                  </TabsTrigger>
                  <TabsTrigger value="discussion" className="gap-2">
                    <FiMessageSquare className="h-4 w-4" />
                    Discussion
                  </TabsTrigger>
                </TabsList>
              </div>
              
              {/* Overview Tab */}
              <TabsContent value="overview" className="p-6">
                <div className="max-w-3xl">
                  <h2 className="text-2xl font-semibold mb-4">
                    {currentLessonData?.lesson?.title || "Lesson Overview"}
                  </h2>
                  <p className="text-muted-foreground mb-6 leading-relaxed">
                    This lesson covers the fundamentals of React component structure and JSX syntax.
                    You'll learn how to create, structure, and compose components effectively.
                  </p>
                  
                  <div className="bg-card border border-border rounded-lg p-6 mb-8">
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                      <Trophy className="h-5 w-5 text-primary" />
                      Key Learning Objectives
                    </h3>
                    <ul className="space-y-3 text-muted-foreground">
                      <li className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-primary/70" />
                        Understand the React component lifecycle
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-primary/70" />
                        Create functional and class components
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-primary/70" />
                        Work with JSX syntax and expressions
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-primary/70" />
                        Learn component composition patterns
                      </li>
                    </ul>
                  </div>
                  
                  <div className="flex gap-4">
                    <Button variant="outline" size="lg" className="gap-2">
                      <FiDownload className="h-4 w-4" />
                      Download Transcript
                    </Button>
                    <Button variant="outline" size="lg" className="gap-2">
                      <FiBookmark className="h-4 w-4" />
                      Bookmark Lesson
                    </Button>
                  </div>
                </div>
              </TabsContent>
              
              {/* Notes Tab */}
              <TabsContent value="notes" className="p-6">
                <div className="max-w-3xl">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-semibold">Your Notes</h2>
                    <Button size="lg" variant="default" className="gap-2">
                      <FiEdit className="h-4 w-4" />
                      Edit Notes
                    </Button>
                  </div>
                  
                  <div className="bg-card border border-border rounded-lg p-6">
                    <p className="text-muted-foreground italic">
                      You haven't added any notes for this lesson yet. Click the Edit Notes button to start taking notes.
                    </p>
                  </div>
                </div>
              </TabsContent>
              
              {/* Resources Tab */}
              <TabsContent value="resources" className="p-6">
                <div className="max-w-3xl">
                  <h2 className="text-2xl font-semibold mb-6">Lesson Resources</h2>
                  
                  <div className="space-y-4">
                    <div className="group border border-border rounded-lg p-4 hover:border-primary/50 hover:bg-accent/50 transition-all duration-200">
                      <div className="flex items-center gap-4">
                        <div className="bg-primary/10 p-3 rounded-lg">
                          <FiDownload className="h-6 w-6 text-primary" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg group-hover:text-primary transition-colors">Lesson Slides</h3>
                          <p className="text-sm text-muted-foreground mt-1">PDF Document • 2.4 MB</p>
                        </div>
                        <Button variant="ghost" size="sm" className="gap-2">
                          Download
                          <ArrowRight className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    
                    <div className="group border border-border rounded-lg p-4 hover:border-primary/50 hover:bg-accent/50 transition-all duration-200">
                      <div className="flex items-center gap-4">
                        <div className="bg-primary/10 p-3 rounded-lg">
                          <FiDownload className="h-6 w-6 text-primary" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg group-hover:text-primary transition-colors">Example Code</h3>
                          <p className="text-sm text-muted-foreground mt-1">ZIP Archive • 1.1 MB</p>
                        </div>
                        <Button variant="ghost" size="sm" className="gap-2">
                          Download
                          <ArrowRight className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    
                    <div className="group border border-border rounded-lg p-4 hover:border-primary/50 hover:bg-accent/50 transition-all duration-200">
                      <div className="flex items-center gap-4">
                        <div className="bg-primary/10 p-3 rounded-lg">
                          <FiDownload className="h-6 w-6 text-primary" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg group-hover:text-primary transition-colors">Additional Reading</h3>
                          <p className="text-sm text-muted-foreground mt-1">PDF Document • 3.7 MB</p>
                        </div>
                        <Button variant="ghost" size="sm" className="gap-2">
                          Download
                          <ArrowRight className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              {/* Discussion Tab */}
              <TabsContent value="discussion" className="p-6">
                <div className="max-w-3xl">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-semibold">Discussion</h2>
                    <Button size="lg" className="gap-2">
                      <FiMessageSquare className="h-4 w-4" />
                      New Comment
                    </Button>
                  </div>
                  
                  <div className="space-y-6">
                    <div className="bg-card border border-border rounded-lg p-6 hover:border-primary/50 transition-all duration-200">
                      <div className="flex items-start gap-4">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src="/avatars/01.png" alt="Jane Smith" />
                          <AvatarFallback>JS</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <h3 className="font-semibold text-lg">Jane Smith</h3>
                            <span className="text-sm text-muted-foreground">2 days ago</span>
                          </div>
                          <p className="mt-2 text-muted-foreground leading-relaxed">
                            Is there a recommendation for when to use class components versus functional components with hooks?
                          </p>
                          <div className="mt-4 flex items-center gap-4 text-sm">
                            <button className="text-primary hover:text-primary/80 font-medium">Reply</button>
                            <span className="text-border">•</span>
                            <span className="text-muted-foreground">2 replies</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-card border border-border rounded-lg p-6 hover:border-primary/50 transition-all duration-200">
                      <div className="flex items-start gap-4">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src="/avatars/02.png" alt="Alex Johnson" />
                          <AvatarFallback>AJ</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <h3 className="font-semibold text-lg">Alex Johnson</h3>
                            <span className="text-sm text-muted-foreground">1 week ago</span>
                          </div>
                          <p className="mt-2 text-muted-foreground leading-relaxed">
                            Great explanation of component composition! I found the examples really helpful for understanding how to break down UI into smaller components.
                          </p>
                          <div className="mt-4 flex items-center gap-4 text-sm">
                            <button className="text-primary hover:text-primary/80 font-medium">Reply</button>
                            <span className="text-border">•</span>
                            <span className="text-muted-foreground">0 replies</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>

      {/* Course Content Sidebar */}
      <AnimatePresence initial={false}>
        {sidebarOpen && (
          <motion.div
            initial={{ width: 0, opacity: 0, x: "100%" }}
            animate={{ width: 320, opacity: 1, x: 0 }}
            exit={{ width: 0, opacity: 0, x: "100%" }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="h-full border-l border-border bg-card flex-shrink-0 overflow-hidden"
          >
            <div className="flex flex-col h-full">
              {/* Course Info Header */}
              <div className="p-6 border-b border-border bg-gradient-to-br from-primary/5 to-primary/10">
                <h2 className="text-xl font-semibold text-foreground">
                  {MOCK_COURSE.title}
                </h2>
                {/* <p className="text-sm text-muted-foreground mt-2 flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Instructor: {MOCK_COURSE.instructor}
                </p> */}
                <div className="mt-4 space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Course Progress</span>
                    <span className="font-medium">{calculateCourseProgress()}%</span>
                  </div>
                  <Progress value={calculateCourseProgress()} className="h-2" />
                </div>
              </div>
              
              {/* Course Content List */}
              <div className="flex-1 overflow-y-auto p-4">
                {MOCK_COURSE.modules.map((module, moduleIndex) => (
                  <div key={module.id} className="mb-6">
                    <div className="px-2 py-2">
                      <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                        <BookOpen className="h-4 w-4 text-primary" />
                        Module {moduleIndex + 1}: {module.title}
                      </h3>
                    </div>
                    <div className="mt-2 space-y-1">
                      {module.lessons.map((lesson) => {
                        const progress = lessonProgress[lesson.id];
                        return (
                          <button
                            key={lesson.id}
                            onClick={() => changeLesson(lesson.id)}
                            className={cn(
                              "w-full flex items-center px-3 py-2.5 rounded-md text-sm gap-3 transition-colors duration-200",
                              activeLessonId === lesson.id 
                                ? "bg-primary/10 text-primary font-medium" 
                                : "text-foreground hover:bg-accent/50"
                            )}
                          >
                            {progress?.completed ? (
                              <Check className="h-4 w-4 text-success flex-shrink-0" />
                            ) : (
                              <div className={cn(
                                "relative h-4 w-4 rounded-full border-2 flex-shrink-0",
                                activeLessonId === lesson.id ? "border-primary" : "border-muted-foreground"
                              )}>
                                {progress?.progress > 0 && (
                                  <div 
                                    className="absolute inset-0.5 rounded-full bg-primary/50" 
                                    style={{ 
                                      clipPath: `circle(${progress.progress}% at center)` 
                                    }} 
                                  />
                                )}
                              </div>
                            )}
                            <div className="flex-1 text-left">
                              <div className="font-medium">{lesson.title}</div>
                              <div className="text-xs text-muted-foreground flex items-center justify-between mt-0.5">
                                <div className="flex items-center gap-2">
                                  <Clock className="h-3 w-3" />
                                  {lesson.duration}
                                </div>
                                {progress?.progress > 0 && !progress.completed && (
                                  <span className="text-primary">{progress.progress}%</span>
                                )}
                              </div>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
} 