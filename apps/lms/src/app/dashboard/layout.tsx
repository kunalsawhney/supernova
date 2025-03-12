'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useRole } from '@/contexts/RoleContext';
import { useSidebar } from '@/contexts/SidebarContext';
import RoleBasedNavigation from '@/components/RoleBasedNavigation';
import DashboardHeader from '@/components/DashboardHeader';
import { FaAnglesLeft, FaAnglesRight } from 'react-icons/fa6';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { role } = useRole();
  const router = useRouter();
  const { sidebarCollapsed, toggleSidebar } = useSidebar();

  useEffect(() => {
    // Redirect to role-specific dashboard if at root dashboard
    if (window.location.pathname === '/dashboard') {
      router.push(`/dashboard/${role}`);
    }
  }, [role, router]);

  return (
    <div className="h-screen flex flex-col bg-background">
      <DashboardHeader />

      <div className="flex flex-1 overflow-hidden">
        {/* Desktop Sidebar */}
        <div className={`transition-all duration-300 ease-in-out ${
          sidebarCollapsed ? 'w-16' : 'w-64'
        }`}>
          <div className={`h-full border-r-2 border-border rounded-r-xl ${
            sidebarCollapsed ? 'w-16' : 'w-64'
          }`}>
            <div className="h-full pt-5 pb-4 relative">
              {/* Toggle button */}
              <button 
                onClick={toggleSidebar}
                className="absolute -right-3 top-5 bg-background border border-border rounded-full p-1.5 z-10 hover:bg-background-secondary shadow-sm transition-colors duration-200"
                aria-label={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
              >
                {sidebarCollapsed ? (
                  <FaAnglesRight className="text-text-secondary hover:text-button-primary" />
                ) : (
                  <FaAnglesLeft className="text-text-secondary hover:text-button-primary" />
                )}
              </button>
              <RoleBasedNavigation collapsed={sidebarCollapsed} />
            </div>
          </div>
        </div>

        {/* Main content - ONLY scrollable container */}
        <div className="flex-1 overflow-y-auto">
          <div className="py-6 px-4 sm:px-6 md:px-8">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
} 