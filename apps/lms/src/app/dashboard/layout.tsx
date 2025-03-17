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
      
      {/* Enhanced Sidebar */}
      <aside 
        className={`fixed top-0 left-0 z-30 h-screen bg-card border-r border-border opacity-100 transition-all duration-300
                  ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} 
                  ${collapsed ? 'lg:w-20' : 'lg:w-72'} 
                  lg:relative lg:translate-x-0 shadow-sm`}
      >
        {/* Sidebar header with improved brand presentation */}
        <div className="h-16 flex items-center justify-between px-4 opacity-30">
          <div className="flex items-center overflow-hidden">
            <div className="relative w-9 h-9">
              <div className="absolute inset-0 bg-gradient-to-tr from-button-primary to-button-secondary rounded-lg shadow-sm"></div>
              <div className="absolute inset-0.5 bg-card rounded-lg flex items-center justify-center">
                <span className="text-sm font-bold text-button-primary">SN</span>
              </div>
            </div>
            {!collapsed && (
              <div className="ml-3 transition-opacity duration-200">
                <span className="font-semibold text-lg block">SuperNova</span>
                <span className="text-xs text-text-secondary">Learning Management</span>
              </div>
            )}
          </div>
          
          {/* Improved collapse button */}
          <button 
            className="p-1.5 rounded-md hover:bg-background-secondary hidden lg:flex items-center justify-center text-text-secondary hover:text-text-primary transition-colors"
            onClick={toggleSidebar}
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {collapsed ? <FiChevronRight className="h-4 w-4" /> : <FiChevronLeft className="h-4 w-4" />}
          </button>
        </div>
        
        {/* Navigation container with improved styling */}
        <div className="h-[calc(100vh-4rem)] py-4 overflow-y-auto">
          <RoleBasedNavigation collapsed={collapsed} />
        </div>
      </aside>
      
      {/* Enhanced main content area */}
      <div className="flex flex-col flex-1 w-full h-screen overflow-y-auto bg-background">
        <Suspense fallback={<HeaderSkeleton />}>
          <DashboardHeader setSidebarOpen={setSidebarOpen} sidebarOpen={sidebarOpen} />
        </Suspense>
        
        <main className="flex-1 p-4 md:p-6 overflow-y-auto bg-gradient-to-b from-transparent to-background-secondary">
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