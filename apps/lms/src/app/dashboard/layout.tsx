'use client';

import { AdaptiveShell } from '@/components/shell/AdaptiveShell';
import { TooltipProvider } from '@/components/ui/tooltip';
import { Suspense } from 'react';

// Skeleton loader for the shell
function ShellSkeleton() {
  return (
    <div className="w-full h-screen bg-background animate-pulse">
      <div className="h-16 border-b border-border/30"></div>
      <div className="flex h-[calc(100vh-4rem)]">
        <div className="w-64 border-r border-border/30"></div>
        <div className="flex-1 overflow-auto">
          <div className="p-6 max-w-screen-2xl mx-auto">
            {/* Content placeholders */}
            <div className="h-8 w-1/3 bg-muted rounded mb-6"></div>
            <div className="grid gap-6">
              <div className="h-24 bg-muted rounded"></div>
              <div className="h-64 bg-muted rounded"></div>
              <div className="h-64 bg-muted rounded"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Content skeleton loader
function ContentSkeleton() {
  return (
    <div className="p-6 animate-pulse">
      <div className="h-8 w-1/3 bg-muted rounded mb-6"></div>
      <div className="grid gap-6">
        <div className="h-24 bg-muted rounded"></div>
        <div className="h-64 bg-muted rounded"></div>
        <div className="h-64 bg-muted rounded"></div>
      </div>
    </div>
  );
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="w-full h-full overflow-auto">
      <TooltipProvider>
        <Suspense fallback={<ShellSkeleton />}>
          <AdaptiveShell>
            <Suspense fallback={<ContentSkeleton />}>
              {children}
            </Suspense>
          </AdaptiveShell>
        </Suspense>
      </TooltipProvider>
    </div>
  );
} 