'use client';

import { DashboardSidebar } from '@/components/dashboard/DashboardSidebar';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { DashboardContent } from '@/components/dashboard/DashboardContent';
import { useAuth } from '@/contexts/AuthContext';
import { usePathname } from 'next/navigation';
import { SidebarProvider } from '@/components/ui/sidebar';
import { TooltipProvider } from '@/components/ui/tooltip';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isLoading } = useAuth();
  const pathname = usePathname();
  
  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }
  
  return (
    <div className="dashboard-container bg-background w-screen h-screen overflow-y-auto" style={{ maxWidth: '100vw' }}>
      <TooltipProvider>
        <SidebarProvider defaultOpen={true}>
          <div className="flex w-full h-screen">
            <DashboardSidebar />
            <div className="flex-1 flex flex-col max-w-full">
              <DashboardHeader />
              <DashboardContent>
                <div className="h-full">
                  {children}
                </div>
              </DashboardContent>
            </div>
          </div>
        </SidebarProvider>
      </TooltipProvider>
    </div>
  );
} 