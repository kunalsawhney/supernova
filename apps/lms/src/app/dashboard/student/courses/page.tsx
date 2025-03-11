'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Breadcrumbs from '@/components/Breadcrumbs';

export default function StudentCoursesPage() {
  const router = useRouter();

  useEffect(() => {
    router.push('/dashboard/courses');
  }, [router]);

  return (
    <div className="p-4">
      <Breadcrumbs />
      <div className="text-text-secondary">Redirecting to courses...</div>
    </div>
  );
} 