'use client';

import { useState } from 'react';
import Link from 'next/link';

interface Lesson {
  id: number;
  title: string;
  duration: string;
  completed: boolean;
  unlocked: boolean;
  type: 'video' | 'practice';
  hasQuiz: boolean;
  quizScore?: number;
}

interface Module {
  id: number;
  title: string;
  description: string;
  progress: number;
  completed: boolean;
  unlocked: boolean;
  lessons: Lesson[];
}

interface Course {
  id: number;
  name: string;
  description: string;
  instructor: string;
  duration: string;
  level: string;
  enrolled: boolean;
  image: string;
  modules: Module[];
}

// This would come from an API in a real application
const courseData: Course = {
  id: 1,
  name: 'Introduction to Python Programming',
  description: 'Learn the fundamentals of Python programming language, from basic syntax to advanced concepts.',
  instructor: 'Dr. Sarah Chen',
  duration: '8 weeks',
  level: 'Beginner',
  enrolled: true,
  image: 'https://api.dicebear.com/7.x/shapes/svg?seed=python',
  modules: [
    {
      id: 1,
      title: 'Getting Started with Python',
      description: 'Learn the basics of Python programming and set up your development environment.',
      progress: 100,
      completed: true,
      unlocked: true,
      lessons: [
        {
          id: 1,
          title: 'Introduction to Programming',
          duration: '15 min',
          completed: true,
          unlocked: true,
          type: 'video',
          hasQuiz: true,
          quizScore: 90,
        },
        {
          id: 2,
          title: 'Setting Up Python Environment',
          duration: '20 min',
          completed: true,
          unlocked: true,
          type: 'video',
          hasQuiz: true,
          quizScore: 85,
        },
        {
          id: 3,
          title: 'Basic Syntax and Variables',
          duration: '25 min',
          completed: true,
          unlocked: true,
          type: 'video',
          hasQuiz: true,
          quizScore: 95,
        },
      ],
    },
    {
      id: 2,
      title: 'Control Flow',
      description: 'Master the concepts of conditional statements and loops in Python.',
      progress: 100,
      completed: true,
      unlocked: true,
      lessons: [
        {
          id: 4,
          title: 'Conditional Statements',
          duration: '30 min',
          completed: true,
          unlocked: true,
          type: 'video',
          hasQuiz: true,
          quizScore: 88,
        },
        {
          id: 5,
          title: 'Loops and Iterations',
          duration: '35 min',
          completed: true,
          unlocked: true,
          type: 'video',
          hasQuiz: true,
          quizScore: 92,
        },
        {
          id: 6,
          title: 'Practice Problems',
          duration: '45 min',
          completed: true,
          unlocked: true,
          type: 'practice',
          hasQuiz: true,
          quizScore: 87,
        },
      ],
    },
    {
      id: 3,
      title: 'Functions and Methods',
      description: 'Learn how to write and use functions effectively in Python.',
      progress: 0,
      completed: false,
      unlocked: true,
      lessons: [
        {
          id: 7,
          title: 'Introduction to Functions',
          duration: '25 min',
          completed: false,
          unlocked: true,
          type: 'video',
          hasQuiz: true,
        },
        {
          id: 8,
          title: 'Parameters and Return Values',
          duration: '30 min',
          completed: false,
          unlocked: false,
          type: 'video',
          hasQuiz: true,
        },
        {
          id: 9,
          title: 'Built-in Functions',
          duration: '25 min',
          completed: false,
          unlocked: false,
          type: 'video',
          hasQuiz: true,
        },
      ],
    },
    {
      id: 4,
      title: 'Data Structures',
      description: "Explore Python's built-in data structures and their applications.",
      progress: 0,
      completed: false,
      unlocked: false,
      lessons: [
        {
          id: 10,
          title: 'Lists and Tuples',
          duration: '35 min',
          completed: false,
          unlocked: false,
          type: 'video',
          hasQuiz: true,
        },
        {
          id: 11,
          title: 'Dictionaries and Sets',
          duration: '40 min',
          completed: false,
          unlocked: false,
          type: 'video',
          hasQuiz: true,
        },
        {
          id: 12,
          title: 'Advanced Data Structures',
          duration: '45 min',
          completed: false,
          unlocked: false,
          type: 'video',
          hasQuiz: true,
        },
      ],
    },
  ],
};

export default function CoursePage({ params }: { params: { id: string } }) {
  const [activeTab, setActiveTab] = useState('curriculum');

  const completedLessons = courseData.modules.reduce((acc, module) => {
    return acc + module.lessons.filter(lesson => lesson.completed).length;
  }, 0);

  const totalLessons = courseData.modules.reduce((acc, module) => {
    return acc + module.lessons.length;
  }, 0);

  const overallProgress = Math.round((completedLessons / totalLessons) * 100);

  return (
    <div className="space-y-6">
      {/* Course Header */}
      <div className="card">
        <div className="flex items-start space-x-6">
          <img
            src={courseData.image}
            alt={courseData.name}
            className="w-24 h-24 rounded-lg bg-background"
          />
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-text-primary">{courseData.name}</h1>
            <p className="text-text-secondary mt-2">{courseData.description}</p>
            <div className="mt-4 flex items-center space-x-4 text-sm text-text-secondary">
              <span>Instructor: {courseData.instructor}</span>
              <span>•</span>
              <span>{courseData.duration}</span>
              <span>•</span>
              <span>{courseData.level}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Overview */}
      <div className="card">
        <h3 className="text-lg font-semibold text-text-primary mb-4">Your Progress</h3>
        <div className="flex items-center justify-between mb-2">
          <span className="text-text-secondary">
            {completedLessons} of {totalLessons} lessons completed
          </span>
          <span className="text-text-primary font-medium">{overallProgress}%</span>
        </div>
        <div className="w-full bg-background rounded-full h-2">
          <div
            className="bg-button-primary h-2 rounded-full"
            style={{ width: `${overallProgress}%` }}
          ></div>
        </div>
      </div>

      {/* Course Content */}
      <div className="card">
        <div className="flex space-x-4 border-b border-border">
          <button
            className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px transition-colors ${
              activeTab === 'curriculum'
                ? 'border-button-primary text-button-primary'
                : 'border-transparent text-text-secondary hover:text-text-primary'
            }`}
            onClick={() => setActiveTab('curriculum')}
          >
            Curriculum
          </button>
          <button
            className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px transition-colors ${
              activeTab === 'resources'
                ? 'border-button-primary text-button-primary'
                : 'border-transparent text-text-secondary hover:text-text-primary'
            }`}
            onClick={() => setActiveTab('resources')}
          >
            Resources
          </button>
        </div>

        <div className="mt-6">
          {activeTab === 'curriculum' && (
            <div className="space-y-6">
              {courseData.modules.map((module, moduleIndex) => (
                <div 
                  key={module.id} 
                  className={`border border-border rounded-lg overflow-hidden ${
                    !module.unlocked ? 'opacity-50' : ''
                  }`}
                >
                  <div className="flex items-center justify-between p-4 bg-background-secondary">
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <span className="text-text-primary font-medium">
                          Module {moduleIndex + 1}: {module.title}
                        </span>
                        {module.completed && (
                          <span className="text-green-500 text-sm">✓ Completed</span>
                        )}
                      </div>
                      <p className="text-sm text-text-secondary">{module.description}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-text-secondary mb-1">
                        {module.progress}% Complete
                      </div>
                      <div className="w-32 bg-background rounded-full h-1">
                        <div
                          className="bg-button-primary h-1 rounded-full"
                          style={{ width: `${module.progress}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                  <div className="divide-y divide-border">
                    {module.lessons.map((lesson) => (
                      <div
                        key={lesson.id}
                        className={`flex items-center justify-between p-4 ${
                          lesson.unlocked
                            ? 'hover:bg-background-secondary transition-colors'
                            : 'cursor-not-allowed'
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          {lesson.completed ? (
                            <div className="flex items-center space-x-1 text-green-500">
                              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                              {lesson.hasQuiz && lesson.quizScore !== undefined && (
                                <span className="text-sm">{lesson.quizScore}%</span>
                              )}
                            </div>
                          ) : lesson.unlocked ? (
                            <svg className="w-5 h-5 text-text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          ) : (
                            <svg className="w-5 h-5 text-text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                            </svg>
                          )}
                          <div>
                            <span className="text-text-primary">{lesson.title}</span>
                            <div className="flex items-center space-x-2 text-xs text-text-secondary">
                              <span>{lesson.type === 'video' ? '📹' : '📝'} {lesson.duration}</span>
                              {lesson.hasQuiz && <span>• 📋 Quiz</span>}
                            </div>
                          </div>
                        </div>
                        {lesson.unlocked && (
                          <Link
                            href={`/dashboard/courses/${params.id}/lessons/${lesson.id}`}
                            className={`text-sm ${
                              lesson.completed
                                ? 'text-button-primary hover:opacity-80'
                                : 'btn-primary'
                            }`}
                          >
                            {lesson.completed ? 'Review' : 'Start'}
                          </Link>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'resources' && (
            <div className="text-text-secondary">
              Course resources and materials will be displayed here.
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 