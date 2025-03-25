// Mock course data for the enhanced course player

export const MOCK_COURSE = {
  id: 'course-001',
  title: 'Introduction to React Development',
  description: 'Learn the fundamentals of React development including hooks, state management, and modern patterns.',
  instructor: 'Alex Johnson',
  modules: [
    {
      id: 'module-1',
      title: 'Getting Started with React',
      lessons: [
        { 
          id: 'lesson-1-1', 
          title: 'Introduction to React', 
          duration: '8:24', 
          type: 'video', 
        },
        { 
          id: 'lesson-1-2', 
          title: 'Setting Up Your Environment', 
          duration: '12:10', 
          type: 'video', 
        },
        { 
          id: 'lesson-1-3', 
          title: 'Core React Concepts', 
          type: 'reading', 
        },
        { 
          id: 'lesson-1-4', 
          title: 'Module 1 Quiz', 
          duration: '10:00', 
          type: 'quiz', 
        },
      ]
    },
    {
      id: 'module-2',
      title: 'React Hooks and State',
      lessons: [
        { 
          id: 'lesson-2-1', 
          title: 'Introduction to Hooks', 
          duration: '10:15', 
          type: 'video', 
        },
        { 
          id: 'lesson-2-2', 
          title: 'useState Hook', 
          duration: '14:30', 
          type: 'video', 
        },
        { 
          id: 'lesson-2-3', 
          title: 'State Management Patterns', 
          type: 'reading', 
        },
        { 
          id: 'lesson-2-4', 
          title: 'useEffect Hook', 
          duration: '16:20', 
          type: 'video', 
        },
        { 
          id: 'lesson-2-5', 
          title: 'Custom Hooks', 
          duration: '12:45', 
          type: 'video', 
        },
        { 
          id: 'lesson-2-6', 
          title: 'Module 2 Quiz', 
          duration: '15:00', 
          type: 'quiz', 
        },
      ]
    },
    {
      id: 'module-3',
      title: 'Component Patterns and Advanced Concepts',
      lessons: [
        { 
          id: 'lesson-3-1', 
          title: 'Component Composition', 
          duration: '13:20', 
          type: 'video', 
        },
        { 
          id: 'lesson-3-2', 
          title: 'Advanced Component Patterns', 
          type: 'reading', 
        },
        { 
          id: 'lesson-3-3', 
          title: 'Context API', 
          duration: '18:45', 
          type: 'video', 
        },
        { 
          id: 'lesson-3-4', 
          title: 'Performance Optimization', 
          duration: '20:10', 
          type: 'video', 
        },
        { 
          id: 'lesson-3-5', 
          title: 'Final Project Discussion', 
          type: 'discussion', 
        },
        { 
          id: 'lesson-3-6', 
          title: 'Final Project: Build a React Application', 
          duration: '25:00', 
          type: 'project', 
        },
      ]
    }
  ]
}; 