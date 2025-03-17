'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { adminService } from '@/services/adminService';
import { Course, CreateCourseData } from '@/types/course';

type DifficultyLevel = 'beginner' | 'intermediate' | 'advanced' | 'expert';

export default function AddCoursePage() {
  const router = useRouter();
  
  const [formData, setFormData] = useState<CreateCourseData>({
    title: '',
    description: '',
    code: '',
    status: 'draft',
    thumbnail_url: '',
    difficulty_level: 'beginner' as DifficultyLevel,
    tags: [],
    duration_minutes: 0,
    prerequisites: [],
    grade_level: '',
    academic_year: '',
    sequence_number: 1,
    metadata: {
      learning_objectives: [],
      target_audience: [],
      base_price: 0,
      currency: 'USD',
      pricing_type: 'one-time',
    }
  });

  const [currentTag, setCurrentTag] = useState('');
  const [currentObjective, setCurrentObjective] = useState('');
  const [currentAudience, setCurrentAudience] = useState('');
  const [currentPrerequisite, setCurrentPrerequisite] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleClose = () => {
    router.push('/dashboard/admin/courses');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await adminService.createCourse(formData);
      router.push('/dashboard/admin/courses');
    } catch (err: any) {
      setError(err.message || 'Failed to save course');
      console.error('Error saving course:', err);
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

  const handleAddObjective = () => {
    if (currentObjective.trim()) {
      const updatedMetadata = {
        ...formData.metadata,
        learning_objectives: [...(formData.metadata?.learning_objectives || []), currentObjective.trim()]
      };
      setFormData({ ...formData, metadata: updatedMetadata });
      setCurrentObjective('');
    }
  };

  const handleRemoveObjective = (index: number) => {
    const updatedLearningObjectives = [...(formData.metadata?.learning_objectives || [])];
    updatedLearningObjectives.splice(index, 1);
    
    const updatedMetadata = {
      ...formData.metadata,
      learning_objectives: updatedLearningObjectives
    };
    
    setFormData({ ...formData, metadata: updatedMetadata });
  };

  const handleAddAudience = () => {
    if (currentAudience.trim()) {
      const updatedMetadata = {
        ...formData.metadata,
        target_audience: [...(formData.metadata?.target_audience || []), currentAudience.trim()]
      };
      setFormData({ ...formData, metadata: updatedMetadata });
      setCurrentAudience('');
    }
  };

  const handleRemoveAudience = (index: number) => {
    const updatedTargetAudience = [...(formData.metadata?.target_audience || [])];
    updatedTargetAudience.splice(index, 1);
    
    const updatedMetadata = {
      ...formData.metadata,
      target_audience: updatedTargetAudience
    };
    
    setFormData({ ...formData, metadata: updatedMetadata });
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

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="heading-lg">Add New Course</h2>
        <button
          onClick={handleClose}
          className="px-4 py-2 border rounded border-border bg-background-secondary hover:bg-gray-50 text-md"
        >
          Back to Courses
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Information */}
        <div className="bg-background rounded-lg p-6 border border-border">
          <h3 className="heading-md mb-4">Basic Information</h3>
          <div className="space-y-4">
            <div>
              <label className="text-secondary-sm mb-1 block font-medium">Course Title*</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full p-2 border rounded border-border bg-background-secondary text-text-primary"
                required
              />
            </div>
            
            <div>
              <label className="text-secondary-sm mb-1 block font-medium">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full p-2 border rounded border-border bg-background-secondary text-text-primary h-32"
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-secondary-sm mb-1 block font-medium">Course Code*</label>
                <input
                  type="text"
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                  className="w-full p-2 border rounded border-border bg-background-secondary text-text-primary"
                  required
                  placeholder="e.g. CS101"
                />
              </div>
              
              <div>
                <label className="text-secondary-sm mb-1 block font-medium">Status*</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="w-full p-2 border rounded border-border bg-background-secondary text-text-primary"
                  required
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                  <option value="archived">Archived</option>
                </select>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-secondary-sm mb-1 block font-medium">Cover Image URL</label>
                <input
                  type="url"
                  value={formData.thumbnail_url}
                  onChange={(e) => setFormData({ ...formData, thumbnail_url: e.target.value })}
                  className="w-full p-2 border rounded border-border bg-background-secondary text-text-primary"
                  placeholder="https://example.com/image.jpg"
                />
              </div>
              
              <div>
                <label className="text-secondary-sm mb-1 block font-medium">Difficulty Level*</label>
                <select
                  value={formData.difficulty_level}
                  onChange={(e) => setFormData({ ...formData, difficulty_level: e.target.value as DifficultyLevel })}
                  className="w-full p-2 border rounded border-border bg-background-secondary text-text-primary"
                  required
                >
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                  <option value="expert">Expert</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Course Details */}
        <div className="bg-background rounded-lg p-6 border border-border">
          <h3 className="heading-md mb-4">Course Details</h3>
          <div className="space-y-4">
            <div>
              <label className="text-secondary-sm mb-1 block font-medium">Estimated Duration (hours)</label>
              <input
                type="number"
                value={formData.duration_minutes}
                onChange={(e) => setFormData({ ...formData, duration_minutes: parseFloat(e.target.value) || 0 })}
                className="w-full p-2 border rounded border-border bg-background-secondary text-text-primary"
                min="0"
                step="0.5"
              />
            </div>
            <div>
              <label className="text-secondary-sm mb-1 block font-medium">Grade Level</label>
              <input
                type="text"
                value={formData.grade_level}
                onChange={(e) => setFormData({ ...formData, grade_level: e.target.value })}
                className="w-full p-2 border rounded border-border bg-background-secondary text-text-primary"
                placeholder="e.g., 9th Grade, College Freshman"
              />
            </div>
            <div>
              <label className="text-secondary-sm mb-1 block font-medium">Academic Year</label>
              <input
                type="text"
                value={formData.academic_year}
                onChange={(e) => setFormData({ ...formData, academic_year: e.target.value })}
                className="w-full p-2 border rounded border-border bg-background-secondary text-text-primary"
                placeholder="e.g., 2023-2024"
              />
            </div>
            <div>
              <label className="text-secondary-sm mb-1 block font-medium">Sequence Number</label>
              <input
                type="number"
                value={formData.sequence_number}
                onChange={(e) => setFormData({ ...formData, sequence_number: parseInt(e.target.value) || 1 })}
                className="w-full p-2 border rounded border-border bg-background-secondary text-text-primary"
                min="1"
              />
            </div>
          </div>
        </div>

        {/* Tags */}
        <div className="bg-background rounded-lg p-6 border border-border">
          <h3 className="heading-md mb-4">Tags</h3>
          <div className="flex items-center space-x-2">
            <input
              type="text"
              value={currentTag}
              onChange={(e) => setCurrentTag(e.target.value)}
              className="flex-1 p-2 border rounded border-border bg-background-secondary text-text-primary"
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
        <div className="bg-background rounded-lg p-6 border border-border">
          <h3 className="heading-md mb-4">Learning Objectives</h3>
          <div className="flex items-center space-x-2">
            <input
              type="text"
              value={currentObjective}
              onChange={(e) => setCurrentObjective(e.target.value)}
              className="flex-1 p-2 border rounded border-border bg-background-secondary text-text-primary"
              placeholder="Add a learning objective"
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddObjective())}
            />
            <button
              type="button"
              onClick={handleAddObjective}
              className="px-4 py-2 bg-button-primary text-white rounded-lg hover:bg-button-primary/90"
            >
              Add
            </button>
          </div>
          <ul className="list-disc pl-5 space-y-1">
            {formData.metadata?.learning_objectives?.map((objective: string, index: number) => (
              <li key={index} className="flex items-center justify-between">
                <span>{objective}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveObjective(index)}
                  className="text-text-secondary hover:text-text-primary"
                >
                  ✕
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Target Audience */}
        <div className="bg-background rounded-lg p-6 border border-border">
          <h3 className="heading-md mb-4">Target Audience</h3>
          <div className="flex items-center space-x-2">
            <input
              type="text"
              value={currentAudience}
              onChange={(e) => setCurrentAudience(e.target.value)}
              className="flex-1 p-2 border rounded border-border bg-background-secondary text-text-primary"
              placeholder="Add target audience"
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddAudience())}
            />
            <button
              type="button"
              onClick={handleAddAudience}
              className="px-4 py-2 bg-button-primary text-white rounded-lg hover:bg-button-primary/90"
            >
              Add
            </button>
          </div>
          <ul className="list-disc pl-5 space-y-1">
            {formData.metadata?.target_audience?.map((audience: string, index: number) => (
              <li key={index} className="flex items-center justify-between">
                <span>{audience}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveAudience(index)}
                  className="text-text-secondary hover:text-text-primary"
                >
                  ✕
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Prerequisites */}
        <div className="bg-background rounded-lg p-6 border border-border">
          <h3 className="heading-md mb-4">Prerequisites</h3>
          <div className="flex items-center space-x-2">
            <input
              type="text"
              value={currentPrerequisite}
              onChange={(e) => setCurrentPrerequisite(e.target.value)}
              className="flex-1 p-2 border rounded border-border bg-background-secondary text-text-primary"
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

        {/* Pricing */}
        <div className="bg-background rounded-lg p-6 border border-border">
          <h3 className="heading-md mb-4">Pricing</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-secondary-sm mb-1 block font-medium">Base Price</label>
              <input
                type="number"
                value={formData.metadata?.base_price}
                onChange={(e) => setFormData({ ...formData, metadata: { ...formData.metadata, base_price: parseFloat(e.target.value) || 0 } })}
                className="w-full p-2 border rounded border-border bg-background-secondary text-text-primary"
                min="0"
                step="0.01"
              />
            </div>
            <div>
              <label className="text-secondary-sm mb-1 block font-medium">Currency</label>
              <select
                value={formData.metadata?.currency}
                onChange={(e) => setFormData({ ...formData, metadata: { ...formData.metadata, currency: e.target.value } })}
                className="w-full p-2 border rounded border-border bg-background-secondary text-text-primary"
              >
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
                <option value="GBP">GBP</option>
                <option value="INR">INR</option>
              </select>
            </div>
            <div>
              <label className="text-secondary-sm mb-1 block font-medium">Pricing Type</label>
              <select
                value={formData.metadata?.pricing_type}
                onChange={(e) => setFormData({ ...formData, metadata: { ...formData.metadata, pricing_type: e.target.value } })}
                className="w-full p-2 border rounded border-border bg-background-secondary text-text-primary"
              >
                <option value="one-time">One-time</option>
                <option value="subscription">Subscription</option>
                <option value="free">Free</option>
              </select>
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-4 pt-4 border-t border-border">
          <button
            type="button"
            onClick={handleClose}
            className="px-4 py-2 border border-border rounded-lg hover:bg-background-secondary"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-button-primary text-white rounded-lg hover:bg-button-primary/90"
            disabled={loading}
          >
            {loading ? 'Saving...' : 'Create Course'}
          </button>
        </div>
      </form>
    </div>
  );
} 