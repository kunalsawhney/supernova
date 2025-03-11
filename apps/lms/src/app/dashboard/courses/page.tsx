'use client';

import { useState } from 'react';
import Link from 'next/link';

const courses = [
  {
    id: 1,
    name: 'Introduction to Python Programming',
    description: 'Learn the fundamentals of Python programming language, from basic syntax to advanced concepts.',
    level: 'Beginner',
    duration: '8 weeks',
    instructor: 'Dr. Sarah Chen',
    enrolled: true,
    progress: 65,
    image: 'https://api.dicebear.com/7.x/shapes/svg?seed=python',
    categories: ['Programming', 'Computer Science'],
  },
  {
    id: 2,
    name: 'Web Development Fundamentals',
    description: 'Master HTML, CSS, and JavaScript to build modern, responsive websites.',
    level: 'Beginner',
    duration: '10 weeks',
    instructor: 'Alex Thompson',
    enrolled: true,
    progress: 42,
    image: 'https://api.dicebear.com/7.x/shapes/svg?seed=web',
    categories: ['Web Development', 'Programming'],
  },
  {
    id: 3,
    name: 'Data Structures & Algorithms',
    description: 'Deep dive into fundamental data structures and algorithms used in software development.',
    level: 'Intermediate',
    duration: '12 weeks',
    instructor: 'Prof. James Wilson',
    enrolled: true,
    progress: 28,
    image: 'https://api.dicebear.com/7.x/shapes/svg?seed=dsa',
    categories: ['Computer Science', 'Programming'],
  },
  {
    id: 4,
    name: 'Machine Learning Basics',
    description: 'Introduction to machine learning concepts, algorithms, and practical applications.',
    level: 'Intermediate',
    duration: '10 weeks',
    instructor: 'Dr. Emily Zhang',
    enrolled: false,
    image: 'https://api.dicebear.com/7.x/shapes/svg?seed=ml',
    categories: ['AI/ML', 'Data Science'],
  },
  // Add more courses as needed
];

const categories = ['All', 'Programming', 'Computer Science', 'Web Development', 'AI/ML', 'Data Science'];
const levels = ['All', 'Beginner', 'Intermediate', 'Advanced'];

export default function CoursesPage() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedLevel, setSelectedLevel] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredCourses = courses.filter(course => {
    const matchesCategory = selectedCategory === 'All' || course.categories.includes(selectedCategory);
    const matchesLevel = selectedLevel === 'All' || course.level === selectedLevel;
    const matchesSearch = course.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         course.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesLevel && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Courses</h1>
          <p className="text-text-secondary mt-1">Explore our comprehensive course catalog</p>
        </div>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div>
          <input
            type="text"
            placeholder="Search courses..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2 rounded-md border border-border bg-background text-text-primary placeholder-text-secondary focus:outline-none focus:ring-2 focus:ring-button-primary"
          />
        </div>
        <div>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full px-4 py-2 rounded-md border border-border bg-background text-text-primary focus:outline-none focus:ring-2 focus:ring-button-primary"
          >
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>
        <div>
          <select
            value={selectedLevel}
            onChange={(e) => setSelectedLevel(e.target.value)}
            className="w-full px-4 py-2 rounded-md border border-border bg-background text-text-primary focus:outline-none focus:ring-2 focus:ring-button-primary"
          >
            {levels.map(level => (
              <option key={level} value={level}>{level}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Course Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCourses.map((course) => (
          <div key={course.id} className="card hover:shadow-lg transition-shadow">
            <div className="flex items-start space-x-4">
              <img
                src={course.image}
                alt={course.name}
                className="w-16 h-16 rounded-lg bg-background"
              />
              <div className="flex-1">
                <h3 className="font-semibold text-text-primary">{course.name}</h3>
                <p className="text-text-secondary text-sm">{course.instructor}</p>
              </div>
            </div>
            
            <p className="mt-4 text-sm text-text-secondary line-clamp-2">
              {course.description}
            </p>

            <div className="mt-4 flex items-center justify-between text-sm">
              <span className="text-text-secondary">{course.duration}</span>
              <span className="text-text-secondary">{course.level}</span>
            </div>

            {course.enrolled ? (
              <div className="mt-4">
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-text-secondary">Progress</span>
                  <span className="text-text-primary font-medium">{course.progress}%</span>
                </div>
                <div className="w-full bg-background rounded-full h-2">
                  <div
                    className="bg-button-primary h-2 rounded-full"
                    style={{ width: `${course.progress}%` }}
                  ></div>
                </div>
                <Link
                  href={`/dashboard/courses/${course.id}`}
                  className="mt-4 btn-primary w-full text-center block"
                >
                  Continue Learning
                </Link>
              </div>
            ) : (
              <Link
                href={`/dashboard/courses/${course.id}`}
                className="mt-4 btn-secondary w-full text-center block"
              >
                Enroll Now
              </Link>
            )}
          </div>
        ))}
      </div>
    </div>
  );
} 