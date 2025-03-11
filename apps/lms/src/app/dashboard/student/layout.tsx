'use client';

import { useRole } from '@/contexts/RoleContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function StudentDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { role } = useRole();
  const router = useRouter();

  useEffect(() => {
    // Redirect if not a student
    if (role !== 'student') {
      router.push(`/dashboard/${role}`);
    }
  }, [role, router]);

  if (role !== 'student') {
    return null; // Prevent flash of wrong content
  }

  return <>{children}</>;
} 