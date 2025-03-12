import { useState } from 'react';
import { useRouter } from 'next/navigation';

// Mock data - would come from API in real application
const lessonData = {
  id: 1,
  title: 'Introduction to Programming',
  content: `
    <h2>Welcome to Programming</h2>
    <p>In this lesson, you'll learn the fundamental concepts of programming...</p>
    <!-- More content would be here -->
  `,
  video: 'https://example.com/lesson-video',
  duration: '15 min',
  quiz: {
    id: 1,
    title: 'Programming Basics Quiz',
    questions: [
      {
        id: 1,
        question: 'What is a variable?',
        options: [
          'A container for storing data values',
          'A mathematical equation',
          'A programming language',
          'A type of computer',
        ],
        correctAnswer: 0,
      },
      {
        id: 2,
        question: 'Which of the following is a programming language?',
        options: [
          'HTML',
          'CSS',
          'Python',
          'All of the above',
        ],
        correctAnswer: 3,
      },
      // More questions...
    ],
    passingScore: 70,
  },
  nextLesson: {
    id: 2,
    title: 'Setting Up Python Environment',
  },
};

import LessonClient from './LessonClient';

export default function LessonPage({ 
  params 
}: { 
  params: { courseId: string; lessonId: string } 
}) {
  // In a real app, we would fetch the lesson data here
  // const lessonData = await fetchLessonData(params.courseId, params.lessonId);

  return (
    <div className="max-w-4xl mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">{lessonData.title}</h1>
      <div className="text-text-secondary mb-8">
        Duration: {lessonData.duration}
      </div>
      
      <LessonClient 
        lessonData={lessonData}
        courseId={params.courseId}
        lessonId={params.lessonId}
      />
    </div>
  );
} 