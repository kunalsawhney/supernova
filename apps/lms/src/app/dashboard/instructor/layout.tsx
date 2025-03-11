'use client';

import { useRole } from '@/contexts/RoleContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function InstructorDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { role } = useRole();
  const router = useRouter();

  useEffect(() => {
    // Redirect if not an instructor
    if (role !== 'instructor') {
      router.push(`/dashboard/${role}`);
    }
  }, [role, router]);

  if (role !== 'instructor') {
    return null; // Prevent flash of wrong content
  }

  return <>{children}</>;
} 