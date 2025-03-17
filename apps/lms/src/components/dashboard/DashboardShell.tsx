'use client';

import { ReactNode, Suspense, useState, useEffect } from 'react';
import dynamic from 'next/dynamic';

// Import the HeaderSkeleton directly since it doesn't have hydration issues
export function HeaderSkeleton() {
  return (
    <div className="h-16 border-b border-border opacity-30 px-4 bg-card opacity-80 backdrop-blur-sm animate-pulse">
      <div className="h-full flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="h-8 w-8 bg-muted rounded-md"></div>
          <div className="h-5 w-40 bg-muted rounded-md"></div>
        </div>
        <div className="flex items-center gap-4">
          <div className="h-8 w-8 bg-muted rounded-md"></div>
          <div className="h-8 w-8 bg-muted rounded-md"></div>
          <div className="h-10 w-10 bg-muted rounded-full"></div>
        </div>
      </div>
    </div>
  );
}

// Import components with no SSR to avoid hydration mismatches
const DashboardSidebar = dynamic(
  () => import('@/components/dashboard/DashboardSidebar').then(mod => ({ default: mod.DashboardSidebar })), 
  { ssr: false }
);

const DashboardHeader = dynamic(
  () => import('@/components/dashboard/DashboardHeader').then(mod => ({ default: mod.DashboardHeader })), 
  { ssr: false }
);

const DashboardContent = dynamic(
  () => import('@/components/dashboard/DashboardContent').then(mod => ({ default: mod.DashboardContent })), 
  { ssr: false }
);

interface DashboardShellProps {
  children: ReactNode;
}

export function DashboardShell({ children }: DashboardShellProps) {
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {mounted && <DashboardSidebar />}
      
      <div className="flex flex-col flex-1 w-full h-screen overflow-y-auto bg-background">
        <Suspense fallback={<HeaderSkeleton />}>
          {mounted && <DashboardHeader />}
        </Suspense>
        
        {mounted ? (
          <DashboardContent>{children}</DashboardContent>
        ) : (
          <main className="flex-1 p-4 md:p-6 overflow-y-auto bg-gradient-to-b from-transparent to-background-secondary">
            <div className="max-w-screen-2xl mx-auto">
              {children}
            </div>
          </main>
        )}
      </div>
    </div>
  );
} 