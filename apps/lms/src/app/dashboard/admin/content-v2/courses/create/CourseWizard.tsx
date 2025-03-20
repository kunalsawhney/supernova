"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiArrowLeft, FiArrowRight } from 'react-icons/fi';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { useCourseWizard } from '@/contexts/CourseWizardContext';
import { CourseDetailsStep } from './components/CourseDetailsStep';
import { CurriculumStep } from './components/CurriculumStep';
import { ContentStep } from './components/ContentStep';
import { ReviewStep } from './components/ReviewStep';
import { Card } from '@/components/ui/card';

const steps = [
  { id: 'details', title: 'Course Details' },
  { id: 'curriculum', title: 'Modules' },
  { id: 'content', title: 'Content' },
  { id: 'review', title: 'Review' },
] as const;

interface CourseWizardProps {
  isEditing?: boolean;
  onComplete?: (course: any) => void;
  onCancel?: () => void;
}

export function CourseWizard({ isEditing = false, onComplete, onCancel }: CourseWizardProps) {
  const router = useRouter();
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const { state } = useCourseWizard();

  const currentStep = steps[currentStepIndex].id;

  const handleNext = () => {
    if (currentStepIndex < steps.length - 1) {
      setCurrentStepIndex(prev => prev + 1);
    } else if (currentStepIndex === steps.length - 1) {
      // Last step - handle completion
      if (onComplete) {
        onComplete(state.formData);
      } else {
        router.push('/dashboard/admin/content-v2/courses');
      }
    }
  };

  const handleBack = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(prev => prev - 1);
    }
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    } else {
      router.push('/dashboard/admin/content-v2/courses');
    }
  };

  // Check if the current step is valid
  const isCurrentStepValid = state.metadata.validSteps.includes(currentStepIndex + 1);

  return (
    <div className="flex flex-col w-full">
    {/* <div className="flex flex-col h-[calc(100vh-theme(spacing.16))] overflow-hidden"> */}
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            {isEditing ? 'Edit Course' : 'Create New Course'}
          </h1>
          <p className="text-muted-foreground mt-1">Design and structure your course content</p>
        </div>
        <Button variant="ghost" onClick={handleCancel}>Cancel</Button>
      </div>

      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex items-center justify-between relative">
          {steps.map((step, index) => (
            <div
              key={step.id}
              className={`flex flex-col items-center relative z-10 ${
                index <= currentStepIndex ? 'text-primary' : 'text-muted-foreground'
              }`}
            >
              {/* Step Number */}
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
                  index <= currentStepIndex
                    ? 'border-primary bg-primary text-white'
                    : 'border-muted-foreground bg-background'
                }`}
              >
                {index + 1}
              </div>
              
              {/* Step Title */}
              <div className="mt-2 text-sm font-medium">{step.title}</div>
            </div>
          ))}

          {/* Progress Bar */}
          <div className="absolute top-4 left-0 h-[2px] bg-border w-full -z-10">
            <div
              className="h-full bg-primary transition-all duration-300"
              style={{ width: `${(currentStepIndex / (steps.length - 1)) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Step Content */}
      <div className="bg-card rounded-lg border border-border p-6 mb-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            {/* Step content will be rendered here */}
            <div className="min-h-[400px]">
              {currentStep === 'details' && <CourseDetailsStep />}
              {currentStep === 'curriculum' && <CurriculumStep />}
              {currentStep === 'content' && <ContentStep />}
              {currentStep === 'review' && <ReviewStep />}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between items-center">
        <Button
          variant="outline"
          onClick={handleBack}
          disabled={currentStepIndex === 0}
          className="gap-2"
        >
          <FiArrowLeft className="h-4 w-4" />
          Back
        </Button>

        <Button
          onClick={handleNext}
          disabled={currentStepIndex < steps.length - 1 && !isCurrentStepValid}
          className="gap-2"
        >
          {currentStepIndex === steps.length - 1 ? (
            isEditing ? 'Save Changes' : 'Create Course'
          ) : (
            <>
              Next
              <FiArrowRight className="h-4 w-4" />
            </>
          )}
        </Button>
      </div>
    </div>
  );
} 