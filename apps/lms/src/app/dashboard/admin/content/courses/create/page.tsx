"use client";

import { CourseWizardProvider } from '@/contexts/CourseWizardContext';
import { CourseWizard } from './CourseWizard';

// Main page component with provider
export default function CreateCoursePage() {
  return (
    <CourseWizardProvider>
      <CourseWizard />
    </CourseWizardProvider>
  );
} 