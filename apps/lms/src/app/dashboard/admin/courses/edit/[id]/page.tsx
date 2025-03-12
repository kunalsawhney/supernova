'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { adminService } from '@/services/adminService';
import { Course, CourseViewModel, CreateCourseData } from '@/types/course';

type DifficultyLevel = 'beginner' | 'intermediate' | 'advanced' | 'expert';

export default function EditCoursePage() {
  const router = useRouter();
  const params = useParams();
  const courseId = params.id as string;
  
  const [formData, setFormData] = useState<CreateCourseData>({
    title: '',
    description: '',
    code: '',
    status: 'draft',
    difficulty_level: 'beginner' as DifficultyLevel,
    tags: [],
    duration_minutes: 0,
    prerequisites: [],
    grade_level: '',
    academic_year: '',
    sequence_number: 1,
    thumbnail_url: '',
    metadata: {},
  });

  const [currentTag, setCurrentTag] = useState('');
  const [currentObjective, setCurrentObjective] = useState('');
  const [currentAudience, setCurrentAudience] = useState('');
  const [currentPrerequisite, setCurrentPrerequisite] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const [learningObjectives, setLearningObjectives] = useState<string[]>([]);
  const [targetAudience, setTargetAudience] = useState<string[]>([]);

  useEffect(() => {
    // Load course data from localStorage
    const storedCourse = localStorage.getItem('editCourse');
    if (storedCourse) {
      try {
        const course = JSON.parse(storedCourse) as CourseViewModel;
        if (course.id === courseId) {
          setFormData({
            title: course.title || '',
            description: course.description || '',
            code: course.code || '',
            status: (course.status as 'draft' | 'published' | 'archived') || 'draft',
            difficulty_level: (course.difficultyLevel as DifficultyLevel) || 'beginner',
            tags: course.tags || [],
            duration_minutes: course.durationMinutes || 0,
            prerequisites: course.prerequisites || [],
            grade_level: course.gradeLevel || '',
            academic_year: course.academicYear || '',
            sequence_number: course.sequenceNumber || 1,
            thumbnail_url: course.thumbnailUrl || '',
            metadata: course.metadata || {},
          });
          
          setLearningObjectives(course.metadata?.learningObjectives || []);
          setTargetAudience(course.metadata?.targetAudience || []);
        }
      } catch (err) {
        console.error('Error parsing stored course:', err);
        setError('Failed to load course data');
      }
    } else {
      // If no stored course, fetch from API
      fetchCourse();
    }
  }, [courseId]);

  const fetchCourse = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const course = await adminService.getCourse(courseId);
      setFormData({
        title: course.title || '',
        description: course.description || '',
        code: course.code || '',
        status: (course.status as 'draft' | 'published' | 'archived') || 'draft',
        difficulty_level: (course.difficultyLevel as DifficultyLevel) || 'beginner',
        tags: course.tags || [],
        duration_minutes: course.durationMinutes || 0,
        prerequisites: course.prerequisites || [],
        grade_level: course.gradeLevel || '',
        academic_year: course.academicYear || '',
        sequence_number: course.sequenceNumber || 1,
        thumbnail_url: course.thumbnailUrl || '',
        metadata: course.metadata || {},
      });
      
      setLearningObjectives(course.metadata?.learningObjectives || []);
      setTargetAudience(course.metadata?.targetAudience || []);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch course';
      setError(errorMessage);
      console.error('Error fetching course:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    router.push('/dashboard/admin/courses');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const updatedFormData = {
        ...formData,
        metadata: {
          ...formData.metadata,
          learningObjectives,
          targetAudience
        }
      };
      
      await adminService.updateCourse(courseId, updatedFormData);
      router.push('/dashboard/admin/courses');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update course';
      setError(errorMessage);
      console.error('Error updating course:', err);
    } finally {
      setLoading(false);
    }
  };

  const addTag = () => {
    if (currentTag.trim() && !formData.tags?.includes(currentTag.trim())) {
      setFormData({
        ...formData,
        tags: [...(formData.tags || []), currentTag.trim()],
      });
      setCurrentTag('');
    }
  };

  const removeTag = (tag: string) => {
    setFormData({
      ...formData,
      tags: formData.tags?.filter((t: string) => t !== tag) || [],
    });
  };

  const addObjective = () => {
    if (currentObjective.trim() && !learningObjectives.includes(currentObjective.trim())) {
      setLearningObjectives([...learningObjectives, currentObjective.trim()]);
      setCurrentObjective('');
    }
  };

  const removeObjective = (objective: string) => {
    setLearningObjectives(learningObjectives.filter(o => o !== objective));
  };

  const addAudience = () => {
    if (currentAudience.trim() && !targetAudience.includes(currentAudience.trim())) {
      setTargetAudience([...targetAudience, currentAudience.trim()]);
      setCurrentAudience('');
    }
  };

  const removeAudience = (audience: string) => {
    setTargetAudience(targetAudience.filter(a => a !== audience));
  };

  const addPrerequisite = () => {
    if (currentPrerequisite.trim() && !formData.prerequisites?.includes(currentPrerequisite.trim())) {
      setFormData({
        ...formData,
        prerequisites: [...(formData.prerequisites || []), currentPrerequisite.trim()],
      });
      setCurrentPrerequisite('');
    }
  };

  const removePrerequisite = (prerequisite: string) => {
    setFormData({
      ...formData,
      prerequisites: formData.prerequisites?.filter((p: string) => p !== prerequisite) || [],
    });
  };

  if (loading && !formData.title) {
    return <div className="flex justify-center items-center h-64">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Edit Course: {formData.title}</h2>
        <button
          onClick={handleClose}
          className="px-4 py-2 border rounded border-text-secondary bg-background-secondary hover:bg-gray-50 text-text-primary section-text-small"
        >
          Back to Courses
        </button>
      </div>

      <div className="bg-background rounded-lg border border-text-secondary">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4 mx-6 mt-6">
            {error}
          </div>
        )}
        
        <div className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Basic Information */}
              <div className="space-y-4">
                <h4 className="font-medium text-lg">Basic Information</h4>
                <div>
                  <label className="section-text-small mb-1 block">Course Title</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full p-2 border rounded border-text-secondary bg-background-secondary text-text-primary"
                    required
                  />
                </div>
                <div>
                  <label className="section-text-small mb-1 block">Course Code</label>
                  <input
                    type="text"
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                    className="w-full p-2 border rounded border-text-secondary bg-background-secondary text-text-primary"
                    required
                  />
                </div>
                <div>
                  <label className="section-text-small mb-1 block">Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full p-2 border rounded border-text-secondary bg-background-secondary text-text-primary"
                    rows={3}
                  />
                </div>
                <div>
                  <label className="section-text-small mb-1 block">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as 'draft' | 'published' | 'archived' })}
                    className="w-full p-2 border rounded border-text-secondary bg-background-secondary text-text-primary"
                    required
                  >
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>
                <div>
                  <label className="section-text-small mb-1 block">Cover Image URL</label>
                  <input
                    type="text"
                    value={formData.thumbnail_url}
                    onChange={(e) => setFormData({ ...formData, thumbnail_url: e.target.value })}
                    className="w-full p-2 border rounded border-text-secondary bg-background-secondary text-text-primary"
                    placeholder="https://example.com/image.jpg"
                  />
                </div>
              </div>

              {/* Course Details */}
              <div className="space-y-4">
                <h4 className="font-medium text-lg">Course Details</h4>
                <div>
                  <label className="section-text-small mb-1 block">Difficulty Level</label>
                  <select
                    value={formData.difficulty_level}
                    onChange={(e) => setFormData({ ...formData, difficulty_level: e.target.value as DifficultyLevel })}
                    className="w-full p-2 border rounded border-text-secondary bg-background-secondary text-text-primary"
                  >
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                    <option value="expert">Expert</option>
                  </select>
                </div>
                <div>
                  <label className="section-text-small mb-1 block">Estimated Duration (hours)</label>
                  <input
                    type="number"
                    value={formData.duration_minutes}
                    onChange={(e) => setFormData({ ...formData, duration_minutes: parseFloat(e.target.value) || 0 })}
                    className="w-full p-2 border rounded border-text-secondary bg-background-secondary text-text-primary"
                    min="0"
                    step="0.5"
                  />
                </div>
                <div>
                  <label className="section-text-small mb-1 block">Grade Level</label>
                  <input
                    type="text"
                    value={formData.grade_level}
                    onChange={(e) => setFormData({ ...formData, grade_level: e.target.value })}
                    className="w-full p-2 border rounded border-text-secondary bg-background-secondary text-text-primary"
                    placeholder="e.g., 9th Grade, College Freshman"
                  />
                </div>
                <div>
                  <label className="section-text-small mb-1 block">Academic Year</label>
                  <input
                    type="text"
                    value={formData.academic_year}
                    onChange={(e) => setFormData({ ...formData, academic_year: e.target.value })}
                    className="w-full p-2 border rounded border-text-secondary bg-background-secondary text-text-primary"
                    placeholder="e.g., 2023-2024"
                  />
                </div>
                <div>
                  <label className="section-text-small mb-1 block">Sequence Number</label>
                  <input
                    type="number"
                    value={formData.sequence_number}
                    onChange={(e) => setFormData({ ...formData, sequence_number: parseInt(e.target.value) || 1 })}
                    className="w-full p-2 border rounded border-text-secondary bg-background-secondary text-text-primary"
                    min="1"
                  />
                </div>
              </div>
            </div>

            {/* Tags */}
            <div className="space-y-4">
              <h4 className="font-medium text-lg">Tags</h4>
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  value={currentTag}
                  onChange={(e) => setCurrentTag(e.target.value)}
                  className="flex-1 p-2 border rounded border-text-secondary bg-background-secondary text-text-primary"
                  placeholder="Add a tag"
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                />
                <button
                  type="button"
                  onClick={addTag}
                  className="px-4 py-2 bg-button-primary text-white rounded-lg hover:bg-button-primary/90"
                >
                  Add
                </button>
              </div>
              <ul className="flex flex-wrap gap-2">
                {formData.tags?.map((tag: string, index: number) => (
                  <li key={index} className="px-3 py-1 bg-background-secondary rounded-full flex items-center space-x-2">
                    <span>{tag}</span>
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="text-text-secondary hover:text-text-primary"
                    >
                      ✕
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Learning Objectives */}
            <div className="space-y-4">
              <h4 className="font-medium text-lg">Learning Objectives</h4>
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  value={currentObjective}
                  onChange={(e) => setCurrentObjective(e.target.value)}
                  className="flex-1 p-2 border rounded border-text-secondary bg-background-secondary text-text-primary"
                  placeholder="Add a learning objective"
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addObjective())}
                />
                <button
                  type="button"
                  onClick={addObjective}
                  className="px-4 py-2 bg-button-primary text-white rounded-lg hover:bg-button-primary/90"
                >
                  Add
                </button>
              </div>
              <ul className="list-disc pl-5 space-y-1">
                {learningObjectives.map((objective: string, index: number) => (
                  <li key={index} className="flex items-center justify-between">
                    <span>{objective}</span>
                    <button
                      type="button"
                      onClick={() => removeObjective(objective)}
                      className="text-text-secondary hover:text-text-primary"
                    >
                      ✕
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Target Audience */}
            <div className="space-y-4">
              <h4 className="font-medium text-lg">Target Audience</h4>
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  value={currentAudience}
                  onChange={(e) => setCurrentAudience(e.target.value)}
                  className="flex-1 p-2 border rounded border-text-secondary bg-background-secondary text-text-primary"
                  placeholder="Add target audience"
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addAudience())}
                />
                <button
                  type="button"
                  onClick={addAudience}
                  className="px-4 py-2 bg-button-primary text-white rounded-lg hover:bg-button-primary/90"
                >
                  Add
                </button>
              </div>
              <ul className="list-disc pl-5 space-y-1">
                {targetAudience.map((audience: string, index: number) => (
                  <li key={index} className="flex items-center justify-between">
                    <span>{audience}</span>
                    <button
                      type="button"
                      onClick={() => removeAudience(audience)}
                      className="text-text-secondary hover:text-text-primary"
                    >
                      ✕
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Prerequisites */}
            <div className="space-y-4">
              <h4 className="font-medium text-lg">Prerequisites</h4>
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  value={currentPrerequisite}
                  onChange={(e) => setCurrentPrerequisite(e.target.value)}
                  className="flex-1 p-2 border rounded border-text-secondary bg-background-secondary text-text-primary"
                  placeholder="Add prerequisite"
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addPrerequisite())}
                />
                <button
                  type="button"
                  onClick={addPrerequisite}
                  className="px-4 py-2 bg-button-primary text-white rounded-lg hover:bg-button-primary/90"
                >
                  Add
                </button>
              </div>
              <ul className="list-disc pl-5 space-y-1">
                {formData.prerequisites?.map((prerequisite: string, index: number) => (
                  <li key={index} className="flex items-center justify-between">
                    <span>{prerequisite}</span>
                    <button
                      type="button"
                      onClick={() => removePrerequisite(prerequisite)}
                      className="text-text-secondary hover:text-text-primary"
                    >
                      ✕
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex justify-end space-x-4 pt-4 border-t border-text-secondary">
              <button
                type="button"
                onClick={handleClose}
                className="px-4 py-2 border border-text-secondary rounded-lg hover:bg-background-secondary"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-button-primary text-white rounded-lg hover:bg-button-primary/90"
                disabled={loading}
              >
                {loading ? 'Saving...' : 'Update Course'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
} 