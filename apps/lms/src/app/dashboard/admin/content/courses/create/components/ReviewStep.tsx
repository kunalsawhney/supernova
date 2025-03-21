'use client';

import { useRouter } from 'next/navigation';
import { useCourseWizard } from '@/contexts/CourseWizardContext';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { FiClock, FiBook, FiAward, FiDollarSign, FiCheckCircle, FiAlertCircle, FiDatabase, FiCheck, FiX } from 'react-icons/fi';

export function ReviewStep() {
  const { state } = useCourseWizard();
  const { formData } = state;
  const { courseId, contentId, moduleIds, lessonIds } = state.apiState;
  const router = useRouter();
  const { toast } = useToast();

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
  const missingFields: string[] = [];
  if (!formData.title) missingFields.push('Course Title');
  if (!formData.description) missingFields.push('Course Description');
  if (!formData.difficulty_level) missingFields.push('Difficulty Level');
  if (!formData.grade_level) missingFields.push('Grade Level');
  if (!formData.academic_year) missingFields.push('Academic Year');
  if (!formData.modules?.length) missingFields.push('Modules');
  if (!totalLessons) missingFields.push('Lessons');

  // Calculate API submission status
  const apiSubmissionStatus = {
    course: Boolean(courseId),
    allModules: formData.modules?.every(module => Boolean(moduleIds[module.id || ''])) || false,
    allLessons: formData.modules?.every(module => 
      module.lessons?.every(lesson => Boolean(lessonIds[lesson.id || ''])) || false
    ) || false
  };

  const handleFinish = () => {
    if (missingFields.length > 0) {
      toast({
        title: "Incomplete Course",
        description: `Please complete the following: ${missingFields.join(', ')}`,
        variant: "destructive"
      });
      return;
    }

    // Navigate to courses page
    router.push('/dashboard/admin/content-v2/courses');
  };

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

      {/* API Submission Status */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold mb-4">API Submission Status</h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FiDatabase className="h-4 w-4" />
              <span>Course Details</span>
            </div>
            <div>
              {apiSubmissionStatus.course ? (
                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                  <FiCheck className="h-3 w-3 mr-1" /> Submitted
                </Badge>
              ) : (
                <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
                  <FiX className="h-3 w-3 mr-1" /> Not Submitted
                </Badge>
              )}
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FiDatabase className="h-4 w-4" />
              <span>Modules</span>
            </div>
            <div>
              {apiSubmissionStatus.allModules ? (
                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                  <FiCheck className="h-3 w-3 mr-1" /> All Submitted
                </Badge>
              ) : (
                <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
                  <FiX className="h-3 w-3 mr-1" /> Partially Submitted
                </Badge>
              )}
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FiDatabase className="h-4 w-4" />
              <span>Lessons</span>
            </div>
            <div>
              {apiSubmissionStatus.allLessons ? (
                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                  <FiCheck className="h-3 w-3 mr-1" /> All Submitted
                </Badge>
              ) : (
                <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
                  <FiX className="h-3 w-3 mr-1" /> Partially Submitted
                </Badge>
              )}
            </div>
          </div>
        </div>
      </Card>

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
                  <div>
                    {moduleIds[module.id || ''] ? (
                      <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200">
                        <FiCheck className="h-3 w-3 mr-1" /> API Saved
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="text-xs bg-amber-50 text-amber-700 border-amber-200">
                        <FiX className="h-3 w-3 mr-1" /> Not Saved
                      </Badge>
                    )}
                  </div>
                </div>
                {module.description && (
                  <p className="text-sm text-muted-foreground">{module.description}</p>
                )}
                <div className="pl-6 space-y-2">
                  {module.lessons?.map((lesson, lessonIndex) => (
                    <div key={lesson.id || lessonIndex} className="flex items-center justify-between py-1">
                      <div className="text-sm">
                        {lesson.sequence_number.toString().padStart(2, '0')}. {lesson.title}
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground">
                          {lesson.duration_minutes} min
                        </span>
                        {lessonIds[lesson.id || ''] ? (
                          <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200">
                            <FiCheck className="h-3 w-3 mr-1" /> API Saved
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="text-xs bg-amber-50 text-amber-700 border-amber-200">
                            <FiX className="h-3 w-3 mr-1" /> Not Saved
                          </Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Completion Button */}
      <div className="flex justify-center pt-4">
        <Button size="lg" onClick={handleFinish}>
          Complete & Return to Courses
        </Button>
      </div>

      {missingFields.length > 0 && (
        <div className="flex items-center gap-2 p-4 bg-amber-50 border border-amber-200 rounded-md">
          <FiAlertCircle className="h-5 w-5 text-amber-500" />
          <div>
            <p className="font-medium text-amber-700">Incomplete Course</p>
            <p className="text-sm text-amber-600">
              The following fields are missing: {missingFields.join(', ')}
            </p>
          </div>
        </div>
      )}
    </div>
  );
} 