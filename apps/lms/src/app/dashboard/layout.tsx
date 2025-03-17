'use client';

import { SidebarProvider } from '@/contexts/SidebarContext';
import { DashboardShell } from '@/components/dashboard/DashboardShell';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <DashboardShell>{children}</DashboardShell>
    </SidebarProvider>
  );
} 