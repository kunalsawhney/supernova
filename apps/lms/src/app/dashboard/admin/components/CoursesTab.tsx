import { useState, useEffect } from 'react';
import { adminService } from '@/services/adminService';
import Image from 'next/image';
import { CourseViewModel } from '@/types/course';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

const CourseCard = ({ course, onEdit }: { course: CourseViewModel; onEdit: (course: CourseViewModel) => void }) => {
  return (
    <div className="card p-6">
      <div className="relative w-full h-28 lg:h-48">
        <Image 
          src={course.thumbnailUrl || '/placeholder-course.jpg'} 
          alt={course.title} 
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          priority={false}
          className="object-cover rounded-lg"
        />
      </div>
      <div className="flex flex-col gap-2 mt-4">
        <h3 className="text-md font-medium">{course.title}</h3>
        <p className="text-secondary-md">{course.description || ''}</p>
        <div className="flex justify-between w-full">
          <p className="text-secondary-md">{course.durationMinutes ? `${Math.round(course.durationMinutes / 60)} hours` : 'Duration N/A'}</p>
          <span className={`text-sm rounded-full px-2 outline outline-1 ${
            course.status === 'published' ? 'text-green-500 outline-green-500' : 
            course.status === 'draft' ? 'text-yellow-500 outline-yellow-500' : 
            'text-red-500 outline-red-500'
          }`}>
            <p className={`text-sm ${
              course.status === 'published' ? 'text-green-500' : 
              course.status === 'draft' ? 'text-yellow-500' : 
              'text-red-500'
            }`}>{course.status}</p>
          </span>
        </div>
        <div className="flex justify-between items-center mt-2">
          <span className="text-secondary-md">{course.difficultyLevel}</span>
          <button 
            onClick={() => onEdit(course)}
            className="text-button-primary hover:underline text-sm"
          >
            Edit
          </button>
        </div>
      </div>
    </div>
  );
};

export default function CoursesTab() {
  const router = useRouter();
  const [courses, setCourses] = useState<CourseViewModel[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const data = await adminService.getCourses();
      setCourses(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch courses';
      setError(errorMessage);
      console.error('Error fetching courses:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleEditCourse = (course: CourseViewModel) => {
    // Store the course data in localStorage for the edit page to use
    localStorage.setItem('editCourse', JSON.stringify(course));
    router.push(`/dashboard/admin/courses/edit/${course.id}`);
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64 section-title">Loading...</div>;
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded section-title">
        {error}
        <button 
          onClick={fetchCourses}
          className="ml-4 underline"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="space-y-6">
        <div className="flex justify-end">
          <Link href="/dashboard/admin/courses/add">
            <Button
              variant="default"
              size="md"
            >
              Add Course
            </Button>
          </Link>
        </div>

        {courses.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-text-secondary mb-4">No courses found</p>
            <Link href="/dashboard/admin/courses/add">
              <button
                className="text-md-medium px-4 py-2 bg-button-primary text-white rounded-lg hover:bg-button-primary/90"
              >
                Create Your First Course
              </button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
              <CourseCard 
                key={course.id} 
                course={course} 
                onEdit={handleEditCourse}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 