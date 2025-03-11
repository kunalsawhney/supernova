'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useRole } from '@/contexts/RoleContext';
import RoleBasedNavigation from '@/components/RoleBasedNavigation';
import DashboardHeader from '@/components/DashboardHeader';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { role } = useRole();
  const router = useRouter();

  useEffect(() => {
    // Redirect to role-specific dashboard if at root dashboard
    if (window.location.pathname === '/dashboard') {
      router.push(`/dashboard/${role}`);
    }
  }, [role, router]);

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />
      <div className="flex h-screen overflow-hidden">
        {/* Sidebar */}
        <div className="hidden md:flex md:flex-shrink-0">
          <div className="flex flex-col w-64 border-r border-border">
            <div className="flex flex-col flex-grow pt-5 pb-4 overflow-y-auto">
              <div className="flex items-center flex-shrink-0 px-4">
                <h1 className="text-xl font-bold text-text-primary">LMS Platform</h1>
              </div>
              <div className="mt-5 flex-grow">
                <RoleBasedNavigation />
              </div>
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="flex flex-col flex-1 overflow-hidden">
          <main className="flex-1 relative overflow-y-auto focus:outline-none">
            <div className="py-6">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
                {children}
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
} 