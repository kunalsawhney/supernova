// Server Component
import { EditCourseClient } from './EditCourseClient';
import { Suspense } from 'react';

interface PageProps {
  params: Promise<{ id: string }> | { id: string };
}

export default async function EditCoursePage({ params }: PageProps) {
  // Await the params before accessing its properties
  const resolvedParams = await params;
  
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <EditCourseClient courseId={resolvedParams.id} />
    </Suspense>
  );
} 