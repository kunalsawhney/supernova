'use client';

import { useRole } from '@/contexts/RoleContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { role } = useRole();
  const router = useRouter();

  useEffect(() => {
    // Redirect if not an admin
    if (role !== 'admin') {
      router.push(`/dashboard/${role}`);
    }
  }, [role, router]);

  if (role !== 'admin') {
    return null; // Prevent flash of wrong content
  }

  return <>{children}</>;
} 