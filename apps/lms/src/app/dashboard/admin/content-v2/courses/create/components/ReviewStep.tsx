'use client';

import { useCourseWizard } from '@/contexts/CourseWizardContext';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { FiClock, FiBook, FiAward, FiDollarSign, FiCheckCircle, FiAlertCircle } from 'react-icons/fi';

export function ReviewStep() {
  const { state } = useCourseWizard();
  const { formData } = state;

  // Calculate total duration
  const totalDuration = formData.modules?.reduce((total, module) => {
    const moduleDuration = module.lessons?.reduce((sum, lesson) => 
      sum + (lesson.duration_minutes || 0), 0) || 0;
    return total + moduleDuration;
  }, 0);

  // Calculate total lessons
  const totalLessons = formData.modules?.reduce((total, module) => 
    total + (module.lessons?.length || 0), 0) || 0;

  // Check if any required fields are missing
  const missingFields = [];
  if (!formData.title) missingFields.push('Course Title');
  if (!formData.description) missingFields.push('Course Description');
  if (!formData.difficulty_level) missingFields.push('Difficulty Level');
  if (!formData.grade_level) missingFields.push('Grade Level');
  if (!formData.academic_year) missingFields.push('Academic Year');
  if (!formData.modules?.length) missingFields.push('Modules');
  if (!totalLessons) missingFields.push('Lessons');

  return (
    <div className="space-y-8">
      {/* Header with Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4 flex items-center gap-3">
          <FiBook className="h-5 w-5 text-primary" />
          <div>
            <div className="text-sm text-muted-foreground">Total Modules</div>
            <div className="text-2xl font-semibold">{formData.modules?.length || 0}</div>
          </div>
        </Card>
        <Card className="p-4 flex items-center gap-3">
          <FiAward className="h-5 w-5 text-primary" />
          <div>
            <div className="text-sm text-muted-foreground">Total Lessons</div>
            <div className="text-2xl font-semibold">{totalLessons}</div>
          </div>
        </Card>
        <Card className="p-4 flex items-center gap-3">
          <FiClock className="h-5 w-5 text-primary" />
          <div>
            <div className="text-sm text-muted-foreground">Total Duration</div>
            <div className="text-2xl font-semibold">
              {totalDuration} minutes
            </div>
          </div>
        </Card>
      </div>

      {/* Course Overview */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold mb-4">Course Overview</h2>
        <div className="space-y-4">
          <div>
            <div className="text-sm text-muted-foreground">Title</div>
            <div className="font-medium">{formData.title}</div>
          </div>
          <div>
            <div className="text-sm text-muted-foreground">Description</div>
            <div className="text-sm">{formData.description}</div>
          </div>
          <div className="flex flex-wrap gap-2">
            {formData.difficulty_level && (
              <Badge variant="secondary">{formData.difficulty_level}</Badge>
            )}
            {formData.grade_level && (
              <Badge variant="secondary">{formData.grade_level}</Badge>
            )}
            {formData.academic_year && (
              <Badge variant="secondary">{formData.academic_year}</Badge>
            )}
          </div>
        </div>
      </Card>

      {/* Module Overview */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold mb-4">Course Structure</h2>
        <div className="space-y-6">
          {formData.modules?.map((module, index) => (
            <div key={module.id || index}>
              {index > 0 && <Separator className="my-4" />}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium">
                    {module.sequence_number.toString().padStart(2, '0')}. {module.title}
                  </h3>
                  <Badge variant={module.is_mandatory ? 'default' : 'secondary'}>
                    {module.is_mandatory ? 'Mandatory' : 'Optional'}
                  </Badge>
                </div>
                {module.description && (
                  <p className="text-sm text-muted-foreground">{module.description}</p>
                )}
                <div className="pl-6 space-y-2">
                  {module.lessons?.map((lesson, lessonIndex) => (
                    <div key={lesson.id || lessonIndex} className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <span className="text-muted-foreground">
                          {lesson.sequence_number.toString().padStart(2, '0')}.
                        </span>
                        {lesson.title}
                        <Badge variant="outline" className="ml-2">
                          {lesson.content_type}
                        </Badge>
                      </div>
                      {lesson.duration_minutes && (
                        <span className="text-muted-foreground flex items-center gap-1">
                          <FiClock className="h-3 w-3" />
                          {lesson.duration_minutes} min
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Validation Summary */}
      {missingFields.length > 0 && (
        <Card className="p-6 border-destructive/50">
          <div className="flex items-center gap-2 text-destructive mb-2">
            <FiAlertCircle className="h-5 w-5" />
            <h2 className="font-semibold">Missing Information</h2>
          </div>
          <p className="text-sm text-muted-foreground mb-3">
            The following information is required before publishing:
          </p>
          <ul className="list-disc list-inside text-sm space-y-1">
            {missingFields.map((field) => (
              <li key={field} className="text-destructive">{field}</li>
            ))}
          </ul>
        </Card>
      )}

      {/* Ready to Publish */}
      {missingFields.length === 0 && (
        <Card className="p-6 border-primary/50">
          <div className="flex items-center gap-2 text-primary mb-2">
            <FiCheckCircle className="h-5 w-5" />
            <h2 className="font-semibold">Ready to Publish</h2>
          </div>
          <p className="text-sm text-muted-foreground">
            All required information has been provided. You can now publish your course.
          </p>
        </Card>
      )}
    </div>
  );
} 