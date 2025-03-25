import React, { useEffect } from 'react';
import { VideoRenderer } from './renderers/VideoRenderer';
import { ReadingRenderer } from './renderers/ReadingRenderer';
import { QuizRenderer } from './renderers/QuizRenderer';
import { useCoursePlayer } from '@/contexts/CoursePlayerContext';

interface ContentDetectorProps {
  content: any; // Content data from API
  lessonId: string;
}

export function ContentDetector({ content, lessonId }: ContentDetectorProps) {
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
  
  // No content to render
  if (!content) {
    return <div>No content available</div>;
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