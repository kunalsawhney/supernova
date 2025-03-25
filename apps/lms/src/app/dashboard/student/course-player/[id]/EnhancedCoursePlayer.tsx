import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

import { CoursePlayerShell } from '@/components/course-player/ui/CoursePlayerShell';
import { NavigationPanel } from '@/components/course-player/ui/NavigationPanel';
import { ContentDetector } from '@/components/course-player/ContentDetector';
import { NoteTakingPanel } from '@/components/course-player/note-taking/NoteTakingPanel';
import { CoursePlayerProvider, useCoursePlayer } from '@/contexts/CoursePlayerContext';

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
    lessonProgress
  } = useCoursePlayer();
  
  // State
  const [course, setCourse] = useState(MOCK_COURSE);
  const [currentContent, setCurrentContent] = useState<any>(null);
  
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
    }
  }, [currentLessonId, courseId, router, searchParams]);
  
  // Handler for lesson selection
  const handleLessonSelect = (lessonId: string) => {
    setCurrentLessonId(lessonId);
  };
  
  // Load lesson content
  const loadLessonContent = (lessonId: string) => {
    // In a real app, this would fetch from the API
    // For now, we'll use mock data based on the lesson type
    
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
    
    if (!foundLesson) return;
    
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
    setCurrentContent({
      ...content,
      moduleTitle
    });
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
  
  return (
    <CoursePlayerShell
      contentType={contentType}
      title={currentContent?.title || ''}
      moduleTitle={currentContent?.moduleTitle}
      progress={calculateProgress()}
      showNotes={showNotes}
      onToggleNotes={toggleNotes}
      sidebarContent={
        <NavigationPanel
          course={course}
          currentLessonId={currentLessonId || ''}
          onLessonSelect={handleLessonSelect}
        />
      }
    >
      {currentContent && currentLessonId && (
        <ContentDetector
          content={currentContent}
          lessonId={currentLessonId}
        />
      )}
      
      {showNotes && currentLessonId && (
        <NoteTakingPanel
          lessonId={currentLessonId}
          contentType={contentType}
          currentTime={contentType === 'video' ? videoTimeRef.current : undefined}
        />
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