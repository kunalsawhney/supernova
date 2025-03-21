'use client';

import { SidebarProvider } from '@/components/ui/sidebar';
import { DashboardShell } from '@/components/dashboard/DashboardShell';
import { TooltipProvider } from '@/components/ui/tooltip';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="w-full overflow-hidden">
      <TooltipProvider>
        <SidebarProvider defaultOpen={true}>
          <DashboardShell>{children}</DashboardShell>
        </SidebarProvider>
      </TooltipProvider>
    </div>
  );
} 