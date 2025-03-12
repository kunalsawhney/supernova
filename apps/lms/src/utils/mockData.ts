import { CourseViewModel } from '@/types/course';
import { UserViewModel as UserProfileViewModel } from '@/types/user';
import { SchoolViewModel } from '@/types/school';
import { EnrollmentViewModel } from '@/types/enrollment';
import { PlatformStats, SystemHealth, UserViewModel } from '@/types/admin';

/**
 * Mock data for development and testing
 * This can be used when the backend API is not available or during development
 */

// Mock Courses
export const mockCourses: CourseViewModel[] = [
  {
    id: '1',
    title: 'Introduction to Programming',
    description: 'A beginner-friendly course covering the basics of programming concepts and logic.',
    code: 'CS101',
    status: 'published',
    thumbnailUrl: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97',
    difficultyLevel: 'beginner',
    durationMinutes: 600, // 10 hours
    gradeLevel: '9th Grade',
    academicYear: '2023-2024',
    sequenceNumber: 1,
    createdAt: '2023-01-15T00:00:00Z',
    updatedAt: '2023-01-15T00:00:00Z',
    tags: ['programming', 'beginner', 'computer science'],
    prerequisites: [],
    metadata: {
      learningObjectives: [
        'Understand basic programming concepts',
        'Write simple programs using variables and control structures',
        'Debug basic code issues'
      ],
      targetAudience: [
        'High school students',
        'Beginners with no prior programming experience'
      ]
    }
  },
  {
    id: '2',
    title: 'Advanced Data Structures',
    description: 'Deep dive into complex data structures and algorithms for experienced programmers.',
    code: 'CS301',
    status: 'draft',
    thumbnailUrl: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c',
    difficultyLevel: 'advanced',
    durationMinutes: 1200, // 20 hours
    gradeLevel: 'College Junior',
    academicYear: '2023-2024',
    sequenceNumber: 3,
    createdAt: '2023-02-20T00:00:00Z',
    updatedAt: '2023-02-20T00:00:00Z',
    tags: ['data structures', 'algorithms', 'advanced'],
    prerequisites: ['CS101', 'CS201'],
    metadata: {
      learningObjectives: [
        'Implement complex data structures',
        'Analyze algorithm efficiency',
        'Apply advanced problem-solving techniques'
      ],
      targetAudience: [
        'Computer Science majors',
        'Experienced programmers'
      ]
    }
  },
  {
    id: '3',
    title: 'Web Development Fundamentals',
    description: 'Learn HTML, CSS, and JavaScript to build responsive websites from scratch.',
    code: 'WD101',
    status: 'published',
    thumbnailUrl: 'https://images.unsplash.com/photo-1547658719-da2b51169166',
    difficultyLevel: 'beginner',
    durationMinutes: 900, // 15 hours
    gradeLevel: '10th Grade',
    academicYear: '2023-2024',
    sequenceNumber: 1,
    createdAt: '2023-03-10T00:00:00Z',
    updatedAt: '2023-03-10T00:00:00Z',
    tags: ['web development', 'html', 'css', 'javascript'],
    prerequisites: [],
    metadata: {
      learningObjectives: [
        'Create static web pages using HTML and CSS',
        'Add interactivity with JavaScript',
        'Build responsive layouts'
      ],
      targetAudience: [
        'Aspiring web developers',
        'Design students',
        'Marketing professionals'
      ]
    }
  },
  {
    id: '4',
    title: 'Machine Learning Basics',
    description: 'Introduction to machine learning concepts, algorithms, and applications.',
    code: 'ML101',
    status: 'archived',
    thumbnailUrl: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485',
    difficultyLevel: 'intermediate',
    durationMinutes: 1500, // 25 hours
    gradeLevel: 'College Sophomore',
    academicYear: '2022-2023',
    sequenceNumber: 2,
    createdAt: '2022-11-05T00:00:00Z',
    updatedAt: '2023-04-15T00:00:00Z',
    tags: ['machine learning', 'AI', 'data science'],
    prerequisites: ['CS101', 'MATH201'],
    metadata: {
      learningObjectives: [
        'Understand core machine learning concepts',
        'Implement basic ML algorithms',
        'Evaluate model performance'
      ],
      targetAudience: [
        'Data science enthusiasts',
        'Computer science students',
        'Professionals seeking to upskill'
      ]
    }
  }
];

// Mock Schools
export const mockSchools: SchoolViewModel[] = [
  {
    id: '1',
    name: 'Westlake Academy',
    code: 'WLA',
    domain: 'westlake.edu',
    description: 'A premier institution focused on STEM education',
    contactEmail: 'admin@westlake.edu',
    contactPhone: '555-123-4567',
    timezone: 'America/New_York',
    address: '123 Education Ave, Boston, MA 02108',
    logoUrl: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1',
    subscriptionStatus: 'active',
    maxStudents: 1000,
    maxTeachers: 50,
    createdAt: '2022-01-10T00:00:00Z',
    updatedAt: '2023-01-15T00:00:00Z'
  },
  {
    id: '2',
    name: 'Bayside High School',
    code: 'BHS',
    domain: 'bayside.edu',
    description: 'Comprehensive education with focus on arts and humanities',
    contactEmail: 'admin@bayside.edu',
    contactPhone: '555-987-6543',
    timezone: 'America/Los_Angeles',
    address: '456 Learning Blvd, San Francisco, CA 94107',
    logoUrl: 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d',
    subscriptionStatus: 'trial',
    trialEndsAt: '2023-12-31T23:59:59Z',
    maxStudents: 500,
    maxTeachers: 25,
    createdAt: '2023-03-15T00:00:00Z',
    updatedAt: '2023-03-15T00:00:00Z'
  }
];

// Mock Admin Users
export const mockUsers: UserViewModel[] = [
  {
    id: '1',
    email: 'admin@example.com',
    firstName: 'Admin',
    lastName: 'User',
    role: 'admin',
    schoolId: null,
    isActive: true,
    createdAt: '2022-01-01T00:00:00Z'
  },
  {
    id: '2',
    email: 'teacher@westlake.edu',
    firstName: 'Jane',
    lastName: 'Smith',
    role: 'teacher',
    schoolId: '1',
    isActive: true,
    createdAt: '2022-02-15T00:00:00Z'
  },
  {
    id: '3',
    email: 'student@westlake.edu',
    firstName: 'John',
    lastName: 'Doe',
    role: 'student',
    schoolId: '1',
    isActive: true,
    createdAt: '2022-03-20T00:00:00Z'
  }
];

// Mock User Profiles (for user context)
export const mockUserProfiles: UserProfileViewModel[] = [
  {
    id: '1',
    email: 'admin@example.com',
    firstName: 'Admin',
    lastName: 'User',
    fullName: 'Admin User',
    role: 'admin',
    status: 'active',
    profileImageUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde',
    createdAt: '2022-01-01T00:00:00Z',
    updatedAt: '2023-01-01T00:00:00Z'
  },
  {
    id: '2',
    email: 'teacher@westlake.edu',
    firstName: 'Jane',
    lastName: 'Smith',
    fullName: 'Jane Smith',
    role: 'teacher',
    status: 'active',
    profileImageUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330',
    createdAt: '2022-02-15T00:00:00Z',
    updatedAt: '2023-01-10T00:00:00Z'
  },
  {
    id: '3',
    email: 'student@westlake.edu',
    firstName: 'John',
    lastName: 'Doe',
    fullName: 'John Doe',
    role: 'student',
    status: 'active',
    profileImageUrl: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36',
    createdAt: '2022-03-20T00:00:00Z',
    updatedAt: '2022-09-01T00:00:00Z'
  }
];

// Mock Enrollments
export const mockEnrollments: EnrollmentViewModel[] = [
  {
    id: '1',
    userId: '3',
    courseId: '1',
    status: 'active',
    progress: 35,
    enrollmentDate: '2023-01-20T00:00:00Z',
    completionDate: undefined,
    createdAt: '2023-01-20T00:00:00Z',
    updatedAt: '2023-05-15T14:30:00Z'
  },
  {
    id: '2',
    userId: '3',
    courseId: '3',
    status: 'completed',
    progress: 100,
    enrollmentDate: '2023-02-10T00:00:00Z',
    completionDate: '2023-04-20T16:45:00Z',
    createdAt: '2023-02-10T00:00:00Z',
    updatedAt: '2023-04-20T16:45:00Z'
  }
];

// Mock Platform Stats
export const mockPlatformStats: PlatformStats = {
  totalUsers: 1250,
  totalSchools: 8,
  totalRevenue: '$125,000',
  activeUsers: '980'
};

// Mock System Health
export const mockSystemHealth: SystemHealth = {
  serverStatus: 'healthy',
  uptime: '14 days',
  responseTime: '120ms',
  activeConnections: 32,
  cpuUsage: '32.1%',
  memoryUsage: '65.4%',
  storageUsed: '45.2%',
  lastBackup: '2023-05-01T00:00:00Z'
};

/**
 * Mock API functions that simulate API calls
 * These can be used as fallbacks when the real API is not available
 */
export const mockApi = {
  // Courses
  getCourses: () => Promise.resolve([...mockCourses]),
  getCourse: (id: string) => Promise.resolve(mockCourses.find(course => course.id === id) || null),
  
  // Schools
  getSchools: () => Promise.resolve([...mockSchools]),
  getSchool: (id: string) => Promise.resolve(mockSchools.find(school => school.id === id) || null),
  
  // Users
  getUsers: () => Promise.resolve([...mockUsers]),
  getUser: (id: string) => Promise.resolve(mockUsers.find(user => user.id === id) || null),
  
  // User Profiles
  getUserProfile: () => Promise.resolve(mockUserProfiles[0]),
  
  // Enrollments
  getEnrollments: () => Promise.resolve([...mockEnrollments]),
  getEnrollment: (id: string) => Promise.resolve(mockEnrollments.find(enrollment => enrollment.id === id) || null),
  
  // Admin
  getPlatformStats: () => Promise.resolve({...mockPlatformStats}),
  getSystemHealth: () => Promise.resolve({...mockSystemHealth})
}; 