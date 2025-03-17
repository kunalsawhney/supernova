'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useRole } from '@/contexts/RoleContext';
import RoleBasedNavigation from '@/components/RoleBasedNavigation';
import DashboardHeader from '@/components/DashboardHeader';
import { ReactNode, Suspense, useState } from 'react';
import { FiMenu, FiX, FiChevronLeft, FiChevronRight } from 'react-icons/fi';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Since we can't use auth() in a client component, we'll use the RoleContext directly
  return (
    <DashboardLayoutContent>
      {children}
    </DashboardLayoutContent>
  );
}

function DashboardLayoutContent({ children }: { children: ReactNode }) {
  const router = useRouter();
  const { role } = useRole();
  const [collapsed, setCollapsed] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  // Initialize sidebar state from localStorage on client side
  useEffect(() => {
    const savedCollapsed = localStorage.getItem('sidebarCollapsed') === 'true';
    setCollapsed(savedCollapsed);
  }, []);
  
  // Save sidebar state to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('sidebarCollapsed', String(collapsed));
  }, [collapsed]);

  // Toggle sidebar collapsed state
  const toggleSidebar = () => {
    setCollapsed(prev => !prev);
  };


  return (
    <div className="flex h-screen overflow-hidden bg-background">
      
      {/* Sidebar */}
      <aside 
        className={`fixed top-0 left-0 z-30 h-screen bg-card border-r border-border transition-all duration-300
                  ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} 
                  ${collapsed ? 'lg:w-20' : 'lg:w-72'} 
                  lg:relative lg:translate-x-0`}
      >
        {/* Sidebar header with logo and toggle buttons */}
        <div className="h-16 flex items-center justify-between px-4">
          {/* Logo and Brand */}
          <div className="flex items-center overflow-hidden">
            <div className="mr-3 relative w-8 h-8">
              <div className="absolute inset-0 bg-gradient-to-tr from-button-primary to-button-secondary rounded-lg"></div>
              <div className="absolute inset-0.5 bg-background rounded-lg flex items-center justify-center">
                <span className="text-sm font-bold text-button-primary">SN</span>
              </div>
            </div>
            {!collapsed && (
              <span className="font-semibold text-xl ml-2 whitespace-nowrap">SuperNova LMS</span>
            )}
          </div>
          
          {/* Collapse button for desktop */}
          <button 
            className="p-1.5 rounded-md hover:bg-background-secondary hidden lg:block"
            onClick={toggleSidebar}
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {collapsed ? <FiChevronRight className="h-5 w-5" /> : <FiChevronLeft className="h-5 w-5" />}
          </button>
        </div>
        
        {/* Navigation container */}
        <div className="h-[calc(100vh-4rem)] py-4 overflow-hidden">
          <RoleBasedNavigation collapsed={collapsed} />
        </div>
      </aside>
      
      {/* Main content area */}
      <div className="flex flex-col flex-1 w-full h-screen overflow-y-auto">
        <Suspense fallback={<HeaderSkeleton />}>
          <DashboardHeader />
        </Suspense>
        
        <main className="flex-1 p-4 md:p-6 overflow-y-auto">
          <div className="max-w-screen-2xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

// Loading skeletons
function HeaderSkeleton() {
  return (
    <div className="h-16 border-b border-border px-4 bg-card animate-pulse">
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