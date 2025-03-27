import React, { useState, useEffect, useRef, Suspense, lazy } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

import { CoursePlayerShell } from '@/components/course-player/ui/CoursePlayerShell';
import { NavigationPanel } from '@/components/course-player/ui/NavigationPanel';
import { NoteTakingPanel } from '@/components/course-player/note-taking/NoteTakingPanel';
import { CoursePlayerProvider, useCoursePlayer } from '@/contexts/CoursePlayerContext';
import { Loader2 } from 'lucide-react';

// Define types for course structure
type ContentType = 'video' | 'reading' | 'quiz' | 'project' | 'discussion';

interface Lesson {
  id: string;
  title: string;
  type: ContentType;
  duration?: string;
}

interface Module {
  id: string;
  title: string;
  lessons: Lesson[];
}

interface Course {
  id: string;
  title: string;
  description: string;
  instructor: string;
  modules: Module[];
}

// Lazy loading content components for better performance
const ContentDetector = lazy(() => import('@/components/course-player/ContentDetector').then(mod => ({ default: mod.ContentDetector })));

// Mock data - to be replaced with API calls
import { MOCK_COURSE } from './mockData';

interface EnhancedCoursePlayerProps {
  courseId: string;
}

function CoursePlayerContent({ courseId }: EnhancedCoursePlayerProps) {
  // Hooks
  const router = useRouter();
  const searchParams = useSearchParams();
  const videoTimeRef = useRef(0);
  
  // Get the context
  const { 
    contentType, 
    showNotes, 
    toggleNotes, 
    currentLessonId, 
    setCurrentLessonId,
    lessonProgress,
    preloadNextLesson,
    nextLessonId,
    isPreloading,
    notePosition,
    addBookmark
  } = useCoursePlayer();
  
  // State
  const [course, setCourse] = useState<Course>(MOCK_COURSE as Course);
  const [currentContent, setCurrentContent] = useState<any>(null);
  const [isLoadingContent, setIsLoadingContent] = useState(false);
  const [preloadedContent, setPreloadedContent] = useState<Record<string, any>>({});
  
  // Initialize with lesson from URL or first lesson
  useEffect(() => {
    const lessonIdFromUrl = searchParams.get('lessonId');
    
    if (lessonIdFromUrl) {
      setCurrentLessonId(lessonIdFromUrl);
    } else if (course.modules[0]?.lessons[0]) {
      setCurrentLessonId(course.modules[0].lessons[0].id);
    }
  }, [searchParams, course, setCurrentLessonId]);
  
  // Update URL when lesson changes
  useEffect(() => {
    if (currentLessonId) {
      const params = new URLSearchParams(searchParams.toString());
      params.set('lessonId', currentLessonId);
      
      // Update URL without refreshing the page
      router.replace(`/dashboard/student/course-player/${courseId}?${params.toString()}`);
      
      // Load content for current lesson
      loadLessonContent(currentLessonId);
      
      // Determine and preload next lesson
      const nextLesson = findNextLesson(currentLessonId);
      if (nextLesson) {
        preloadNextLesson(nextLesson.id);
        preloadLessonContent(nextLesson.id);
      }
    }
  }, [currentLessonId, courseId, router, searchParams]);
  
  // Handler for lesson selection
  const handleLessonSelect = (lessonId: string) => {
    // If we've preloaded this content, it will be available immediately
    if (preloadedContent[lessonId]) {
      setCurrentLessonId(lessonId);
    } else {
      setIsLoadingContent(true);
      setCurrentLessonId(lessonId);
    }
  };
  
  // Find the next lesson in sequence
  const findNextLesson = (currentLessonId: string) => {
    let foundCurrent = false;
    let nextLesson = null;
    
    // Iterate through modules and lessons to find the next one
    for (const module of course.modules) {
      for (let i = 0; i < module.lessons.length; i++) {
        const lesson = module.lessons[i];
        
        if (foundCurrent) {
          // This is the next lesson after the current one
          nextLesson = lesson;
          return nextLesson;
        }
        
        if (lesson.id === currentLessonId) {
          foundCurrent = true;
          
          // If this is the last lesson in the module, the next one will be in the next iteration
          if (i === module.lessons.length - 1) {
            continue;
          }
          
          // Otherwise, the next lesson is the next one in this module
          nextLesson = module.lessons[i + 1];
          return nextLesson;
        }
      }
    }
    
    return nextLesson;
  };
  
  // Preload content for a lesson
  const preloadLessonContent = (lessonId: string) => {
    // If we've already preloaded this content, skip
    if (preloadedContent[lessonId]) return;
    
    // In a real app, this would make a low-priority API call to fetch the content
    // For now, we'll simulate it with a mock content load
    setTimeout(() => {
      const content = createMockContent(lessonId);
      
      // Store the preloaded content
      setPreloadedContent(prev => ({
        ...prev,
        [lessonId]: content
      }));
    }, 1000); // Simulate a network delay
  };
  
  // Find lesson details 
  const findLessonDetails = (lessonId: string) => {
    let foundLesson = null;
    let moduleTitle = '';
    
    // Find the lesson and its module
    for (const module of course.modules) {
      const lesson = module.lessons.find(l => l.id === lessonId);
      if (lesson) {
        foundLesson = lesson;
        moduleTitle = module.title;
        break;
      }
    }
    
    return { foundLesson, moduleTitle };
  };
  
  // Create mock content based on lesson type
  const createMockContent = (lessonId: string) => {
    const { foundLesson, moduleTitle } = findLessonDetails(lessonId);
    
    if (!foundLesson) return null;
    
    // Create mock content based on lesson type
    let content: any;
    
    switch (foundLesson.type) {
      case 'video':
        content = {
          type: 'video',
          title: foundLesson.title,
          videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
          transcript: 'This is a sample transcript for the video lesson. In a real application, this would contain the full transcript text.',
          thumbnailUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/images/BigBuckBunny.jpg'
        };
        break;
        
      case 'reading':
        content = {
          type: 'reading',
          title: foundLesson.title,
          htmlContent: `
            <h2>Introduction</h2>
            <p>This is a sample reading content. In a real application, this would be actual lesson content with proper formatting and possibly images and other media.</p>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam auctor, nisl eget ultricies tincidunt, nisl nisl aliquam nisl, eget ultricies nisl nisl eget nisl.</p>
            <h3>Key Concepts</h3>
            <ul>
              <li>First key concept explanation</li>
              <li>Second key concept with more details</li>
              <li>Third important point to remember</li>
            </ul>
            <p>More detailed explanation would follow here with examples and illustrations. This is just placeholder text to demonstrate the reading renderer capabilities.</p>
            <h3>Summary</h3>
            <p>To summarize the key points discussed in this lesson:</p>
            <ol>
              <li>First summary point with conclusion</li>
              <li>Second important takeaway</li>
              <li>Final thought to consider</li>
            </ol>
          `
        };
        break;
        
      case 'quiz':
        content = {
          type: 'quiz',
          title: foundLesson.title,
          quizData: {
            id: lessonId,
            title: foundLesson.title,
            description: 'Test your knowledge with this quiz.',
            passingScore: 70,
            questions: [
              {
                id: `${lessonId}-q1`,
                type: 'single',
                question: 'What is the main purpose of this quiz?',
                options: [
                  'To demonstrate the quiz renderer',
                  'To test actual knowledge',
                  'To confuse the user',
                  'None of the above'
                ],
                correctAnswer: 'To demonstrate the quiz renderer',
                points: 10
              },
              {
                id: `${lessonId}-q2`,
                type: 'multiple',
                question: 'Which of the following are front-end technologies? (Select all that apply)',
                options: [
                  'React',
                  'Express',
                  'Vue',
                  'MongoDB'
                ],
                correctAnswer: ['React', 'Vue'],
                points: 15
              },
              {
                id: `${lessonId}-q3`,
                type: 'true-false',
                question: 'This quiz is part of the enhanced course player implementation.',
                options: ['True', 'False'],
                correctAnswer: 'True',
                explanation: 'This quiz is being implemented as part of the enhanced course player for the LMS system.',
                points: 5
              }
            ]
          }
        };
        break;
        
      default:
        content = {
          type: foundLesson.type,
          title: foundLesson.title
        };
    }
    
    // Set the content with module title
    return {
      ...content,
      moduleTitle
    };
  };
  
  // Load lesson content
  const loadLessonContent = (lessonId: string) => {
    setIsLoadingContent(true);
    
    // Check if we have preloaded this content
    if (preloadedContent[lessonId]) {
      setCurrentContent(preloadedContent[lessonId]);
      setIsLoadingContent(false);
      return;
    }
    
    // Create mock content based on lesson type
    const content = createMockContent(lessonId);
    setCurrentContent(content);
    setIsLoadingContent(false);
  };
  
  // Calculate overall progress
  const calculateProgress = () => {
    if (!currentLessonId) return 0;
    return lessonProgress[currentLessonId]?.progress || 0;
  };
  
  // Handle video time updates for note timestamps
  const handleVideoTimeUpdate = (time: number) => {
    videoTimeRef.current = time;
  };
  
  // Add bookmark at current position for video content
  const handleAddBookmark = (label: string) => {
    if (!currentLessonId) return;
    
    // For video content, use the current time
    if (contentType === 'video') {
      addBookmark(currentLessonId, {
        position: videoTimeRef.current,
        label: label || `Bookmark at ${formatTime(videoTimeRef.current)}`
      });
    } 
    // For reading content, use scroll position (would need to be implemented)
    else if (contentType === 'reading') {
      // Mock scroll position
      const mockScrollPosition = 0.5; // 50% through the content
      addBookmark(currentLessonId, {
        position: mockScrollPosition,
        label: label || `Bookmark at position ${Math.round(mockScrollPosition * 100)}%`
      });
    }
  };
  
  // Format time for display (seconds to MM:SS)
  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };
  
  return (
    <CoursePlayerShell
      contentType={contentType}
      title={currentContent?.title || ''}
      moduleTitle={currentContent?.moduleTitle}
      progress={calculateProgress()}
      sidebarContent={
        <NavigationPanel
          course={course}
          currentLessonId={currentLessonId || ''}
          onLessonSelect={handleLessonSelect}
        />
      }
      notesContent={
        currentLessonId && (
          <NoteTakingPanel
            lessonId={currentLessonId}
            contentType={contentType}
            currentTime={contentType === 'video' ? videoTimeRef.current : undefined}
            position={notePosition}
          />
        )
      }
    >
      {isLoadingContent ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary/70" />
          <span className="ml-3 text-muted-foreground">Loading content...</span>
        </div>
      ) : (
        <Suspense fallback={
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary/70" />
          </div>
        }>
          {currentContent && currentLessonId && (
            <ContentDetector
              content={currentContent}
              lessonId={currentLessonId}
              onVideoTimeUpdate={handleVideoTimeUpdate}
            />
          )}
        </Suspense>
      )}
      
      {/* Next lesson preloading indicator - only shown during development */}
      {process.env.NODE_ENV === 'development' && isPreloading && (
        <div className="fixed bottom-4 right-4 bg-black/80 text-white text-xs px-3 py-1 rounded-full">
          Preloading next lesson...
        </div>
      )}
    </CoursePlayerShell>
  );
}

export function EnhancedCoursePlayer({ courseId }: EnhancedCoursePlayerProps) {
  return (
    <CoursePlayerProvider>
      <CoursePlayerContent courseId={courseId} />
    </CoursePlayerProvider>
  );
} 