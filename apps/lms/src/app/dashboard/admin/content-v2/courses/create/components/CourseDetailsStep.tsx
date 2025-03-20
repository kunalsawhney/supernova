'use client';

import { useEffect } from 'react';
import { useCourseWizard } from '@/contexts/CourseWizardContext';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { DifficultyLevel } from '@/types/course';

const DIFFICULTY_LEVELS = [
  { value: 'beginner', label: 'Beginner' },
  { value: 'intermediate', label: 'Intermediate' },
  { value: 'advanced', label: 'Advanced' },
] as const;

const GRADE_LEVELS = [
  { value: 'elementary', label: 'Elementary School' },
  { value: 'middle', label: 'Middle School' },
  { value: 'high-school', label: 'High School' },
  { value: 'college', label: 'College' },
  { value: 'professional', label: 'Professional' },
];

const ACADEMIC_YEARS = [
  { value: '2023-2024', label: '2023-2024' },
  { value: '2024-2025', label: '2024-2025' },
  { value: '2025-2026', label: '2025-2026' },
];

const PRICING_TYPES = [
  { value: 'one-time', label: 'One-time Purchase' },
  { value: 'subscription', label: 'Subscription' },
];

const CURRENCIES = [
  { value: 'USD', label: 'USD - US Dollar' },
  { value: 'EUR', label: 'EUR - Euro' },
  { value: 'GBP', label: 'GBP - British Pound' },
  { value: 'INR', label: 'INR - Indian Rupee' },
];

export function CourseDetailsStep() {
  const { state, dispatch } = useCourseWizard();
  const { formData } = state;

  // Validate the step when data changes
  useEffect(() => {
    const isValid = Boolean(
      formData.title &&
      formData.description &&
      formData.code &&
      formData.difficulty_level &&
      formData.grade_level &&
      formData.academic_year
    );

    dispatch({
      type: 'VALIDATE_STEP',
      payload: { step: 1, isValid },
    });
  }, [formData, dispatch]);

  const handleInputChange = (field: string, value: any) => {
    dispatch({
      type: 'UPDATE_FORM',
      payload: { [field]: value },
    });
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="grid gap-6">
        {/* Basic Information */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Basic Information</h3>
          <div className="space-y-4">
            <div>
              <Label htmlFor="title">Course Title</Label>
              <Input
                id="title"
                value={formData.title || ''}
                onChange={(e) => handleInputChange('title', e.target.value)}
                placeholder="e.g., Complete Web Development Bootcamp"
              />
            </div>

            <div>
              <Label htmlFor="code">Course Code</Label>
              <Input
                id="code"
                value={formData.code || ''}
                onChange={(e) => handleInputChange('code', e.target.value.replace(/[^a-zA-Z0-9_-]/g, ''))}
                placeholder="e.g., web-dev-101"
                pattern="^[a-zA-Z0-9_-]+$"
                title="Only letters, numbers, underscores, and hyphens are allowed"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Only letters, numbers, underscores, and hyphens are allowed
              </p>
            </div>

            <div>
              <Label htmlFor="description">Course Description</Label>
              <Textarea
                id="description"
                value={formData.description || ''}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Provide a detailed description of what students will learn"
                className="h-32"
              />
            </div>
          </div>
        </Card>

        {/* Course Settings */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Course Settings</h3>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div>
              <Label htmlFor="difficulty_level">Difficulty Level</Label>
              <Select
                value={formData.difficulty_level || 'beginner'}
                onValueChange={(value) => handleInputChange('difficulty_level', value)}
              >
                <SelectTrigger id="difficulty_level">
                  <SelectValue placeholder="Select difficulty level" />
                </SelectTrigger>
                <SelectContent>
                  {DIFFICULTY_LEVELS.map((level) => (
                    <SelectItem key={level.value} value={level.value}>
                      {level.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="grade_level">Grade Level</Label>
              <Select
                value={formData.grade_level || ''}
                onValueChange={(value) => handleInputChange('grade_level', value)}
              >
                <SelectTrigger id="grade_level">
                  <SelectValue placeholder="Select grade level" />
                </SelectTrigger>
                <SelectContent>
                  {GRADE_LEVELS.map((level) => (
                    <SelectItem key={level.value} value={level.value}>
                      {level.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="academic_year">Academic Year</Label>
              <Select
                value={formData.academic_year || ''}
                onValueChange={(value) => handleInputChange('academic_year', value)}
              >
                <SelectTrigger id="academic_year">
                  <SelectValue placeholder="Select academic year" />
                </SelectTrigger>
                <SelectContent>
                  {ACADEMIC_YEARS.map((year) => (
                    <SelectItem key={year.value} value={year.value}>
                      {year.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="estimated_duration">Estimated Duration (hours)</Label>
              <Input
                id="estimated_duration"
                type="number"
                min="0"
                value={formData.estimated_duration || ''}
                onChange={(e) => handleInputChange('estimated_duration', parseInt(e.target.value) || '')}
                placeholder="e.g., 20"
              />
            </div>

            <div>
              <Label htmlFor="sequence_number">Sequence Number</Label>
              <Input
                id="sequence_number"
                type="number"
                min="1"
                value={formData.sequence_number || 1}
                onChange={(e) => handleInputChange('sequence_number', parseInt(e.target.value) || 1)}
              />
            </div>
          </div>
        </Card>

        {/* Pricing Information */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Pricing Information</h3>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div>
              <Label htmlFor="pricing_type">Pricing Type</Label>
              <Select
                value={formData.pricing_type || ''}
                onValueChange={(value) => handleInputChange('pricing_type', value)}
              >
                <SelectTrigger id="pricing_type">
                  <SelectValue placeholder="Select pricing type" />
                </SelectTrigger>
                <SelectContent>
                  {PRICING_TYPES.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="base_price">Base Price</Label>
              <Input
                id="base_price"
                type="number"
                min="0"
                step="0.01"
                value={formData.base_price || ''}
                onChange={(e) => handleInputChange('base_price', parseFloat(e.target.value) || '')}
                placeholder="e.g., 99.99"
              />
            </div>

            <div>
              <Label htmlFor="currency">Currency</Label>
              <Select
                value={formData.currency || ''}
                onValueChange={(value) => handleInputChange('currency', value)}
              >
                <SelectTrigger id="currency">
                  <SelectValue placeholder="Select currency" />
                </SelectTrigger>
                <SelectContent>
                  {CURRENCIES.map((currency) => (
                    <SelectItem key={currency.value} value={currency.value}>
                      {currency.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </Card>

        {/* Thumbnail Upload - To be implemented */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Course Thumbnail</h3>
          <div className="h-40 border-2 border-dashed border-border rounded-lg flex items-center justify-center">
            <p className="text-muted-foreground">Thumbnail upload coming soon...</p>
          </div>
        </Card>
      </div>
    </div>
  );
} 