'use client';

import React, { Suspense } from 'react';
import { EnhancedCoursePlayer } from './EnhancedCoursePlayer';
import { Loader2 } from 'lucide-react';

interface CoursePlayerPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function CoursePlayerPage({ params }: CoursePlayerPageProps) {
  // Unwrap params using React.use() since we're in a client component
  const unwrappedParams = React.use(params);
  
  return (
    <Suspense 
      fallback={
        <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
          <Loader2 className="h-12 w-12 animate-spin text-primary/70" />
        </div>
      }
    >
      <EnhancedCoursePlayer courseId={unwrappedParams.id} />
    </Suspense>
  );
} 