import React, { useEffect } from 'react';
import { VideoRenderer } from './renderers/VideoRenderer';
import { ReadingRenderer } from './renderers/ReadingRenderer';
import { QuizRenderer } from './renderers/QuizRenderer';
import { useCoursePlayer } from '@/contexts/CoursePlayerContext';
import { AlertTriangle } from 'lucide-react';

interface ContentDetectorProps {
  content: any; // Content data from API
  lessonId: string;
  onVideoTimeUpdate?: (time: number) => void; // Add callback for video time updates
}

export function ContentDetector({ content, lessonId, onVideoTimeUpdate }: ContentDetectorProps) {
  const { setContentType } = useCoursePlayer();
  
  // Detect content type and update context
  useEffect(() => {
    if (!content) return;
    
    // Determine content type based on content properties
    let detectedType: 'video' | 'reading' | 'quiz' | 'project' | 'discussion';
    
    if (content.videoUrl || content.type === 'video') {
      detectedType = 'video';
    } else if (content.quizData || content.type === 'quiz') {
      detectedType = 'quiz';
    } else if (content.htmlContent || content.markdownContent || content.type === 'reading') {
      detectedType = 'reading';
    } else if (content.projectDetails || content.type === 'project') {
      detectedType = 'project';
    } else if (content.discussionPrompt || content.type === 'discussion') {
      detectedType = 'discussion';
    } else {
      // Default to reading if can't determine
      detectedType = 'reading';
    }
    
    // Update content type in context
    setContentType(detectedType);
  }, [content, setContentType]);
  
  // Error state if content is missing required properties
  if (content && !isValidContent(content)) {
    return (
      <div className="p-4 border-2 border-red-200 rounded-lg bg-red-50 dark:bg-red-900/20 dark:border-red-800 text-red-700 dark:text-red-300" role="alert">
        <div className="flex items-center gap-2 mb-3">
          <AlertTriangle className="h-5 w-5" aria-hidden="true" />
          <h3 className="font-medium">Invalid Content</h3>
        </div>
        <p>The content for this lesson is missing required properties or has an invalid format.</p>
      </div>
    );
  }
  
  // No content to render
  if (!content) {
    return (
      <div className="p-4 border rounded-lg" role="alert">
        <p>No content available</p>
      </div>
    );
  }
  
  // Video content
  if (content.videoUrl || content.type === 'video') {
    return (
      <VideoRenderer
        src={content.videoUrl || ''}
        title={content.title || ''}
        lessonId={lessonId}
        transcript={content.transcript}
        thumbnailUrl={content.thumbnailUrl}
        onTimeUpdate={onVideoTimeUpdate}
      />
    );
  }
  
  // Reading content
  if (content.htmlContent || content.markdownContent || content.type === 'reading') {
    return (
      <ReadingRenderer
        content={content.htmlContent || content.markdownContent || ''}
        title={content.title || ''}
        lessonId={lessonId}
        estimatedReadTime={content.estimatedReadTime}
      />
    );
  }
  
  // Quiz content
  if (content.quizData || content.type === 'quiz') {
    return (
      <QuizRenderer
        quizData={content.quizData || {
          id: lessonId,
          title: content.title || 'Quiz',
          passingScore: 70,
          questions: content.questions || []
        }}
        lessonId={lessonId}
      />
    );
  }
  
  // Project content (placeholder for future implementation)
  if (content.projectDetails || content.type === 'project') {
    return (
      <div className="p-4 border rounded-lg">
        <h2 className="text-xl font-bold mb-4">Project: {content.title}</h2>
        <p>Project content will be rendered here</p>
      </div>
    );
  }
  
  // Discussion content (placeholder for future implementation)
  if (content.discussionPrompt || content.type === 'discussion') {
    return (
      <div className="p-4 border rounded-lg">
        <h2 className="text-xl font-bold mb-4">Discussion: {content.title}</h2>
        <p>Discussion content will be rendered here</p>
      </div>
    );
  }
  
  // Default fallback
  return (
    <div className="p-4 border rounded-lg">
      <h2 className="text-xl font-bold mb-4">{content.title || 'Content'}</h2>
      <p>This content type is not supported yet</p>
    </div>
  );
}

// Helper function to validate content structure
function isValidContent(content: any): boolean {
  // Check if content has required structure based on type
  if (content.type === 'video' || content.videoUrl) {
    return !!content.videoUrl; // Must have video URL
  }
  
  if (content.type === 'reading') {
    return !!(content.htmlContent || content.markdownContent); // Must have content
  }
  
  if (content.type === 'quiz' || content.quizData) {
    return content.quizData && Array.isArray(content.quizData.questions); // Must have questions array
  }
  
  // Default to true for other content types as they may be placeholders
  return true;
}

// Export as default for lazy loading
export default ContentDetector; 