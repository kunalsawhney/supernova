'use client';

import { ReactNode, Suspense, useState, useEffect, memo } from 'react';
import dynamic from 'next/dynamic';
import { useSidebar } from '@/components/ui/sidebar';

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

  const MemoizedSidebar = memo(DashboardSidebar);
  const MemoizedHeader = memo(DashboardHeader);
  const MemoizedContent = memo(DashboardContent);

  
  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="flex w-full h-screen overflow-hidden">
      {/* Sidebar */}
      {mounted && <MemoizedSidebar />}
      
      {/* Main content area */}
      <div className="flex-1 flex flex-col min-w-0 h-full w-full">
        <Suspense fallback={<HeaderSkeleton />}>
          {mounted && <MemoizedHeader />}
        </Suspense>
        
        {mounted ? (
          <MemoizedContent>{children}</MemoizedContent>
        ) : (
          <div className="flex-1 p-4 md:p-6 overflow-y-auto">
            <div className="max-w-screen-2xl mx-auto">
              {children}
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 