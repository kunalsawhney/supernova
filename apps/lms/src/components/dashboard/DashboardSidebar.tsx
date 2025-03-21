/**
 * Dashboard sidebar component with collapsible navigation
 */

"use client";

import { useEffect, useState } from "react";
import { SidebarRail, useSidebar } from "@/components/ui/sidebar";
import { DashboardNavigation } from "./DashboardNavigation";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarTrigger,
  SidebarFooter
} from "@/components/ui/sidebar";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

// Configuration options for the sidebar
const SIDEBAR_CONFIG = {
  width: "16rem",
  collapsedWidth: "3rem",
  animationDuration: "200ms",
  logoTextPrimary: "SuperNova",
  logoTextSecondary: "Learning Management",
  logoInitials: "SN",
  version: "v1.0"
};

export interface DashboardSidebarProps {
  /**
   * Additional CSS classes to apply
   */
  className?: string;
  /**
   * Custom logo component to override the default
   */
  customLogo?: React.ReactNode;
  /**
   * Version text to display in the footer (overrides default)
   */
  versionText?: string;
}

export function DashboardSidebar({
  className,
  customLogo,
  versionText = SIDEBAR_CONFIG.version
}: DashboardSidebarProps) {
  const { state } = useSidebar();
  const [mounted, setMounted] = useState(false);
  const isCollapsed = state === "collapsed";
  
  // Only show components after initial mount to prevent hydration issues
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  // Use a wrapper div that has the same width as the sidebar to ensure proper layout
  return (
    <div 
      style={{ 
        width: isCollapsed ? SIDEBAR_CONFIG.collapsedWidth : SIDEBAR_CONFIG.width,
        transition: `width ${SIDEBAR_CONFIG.animationDuration} ease-linear`
      }}
      className={`flex-shrink-0 h-screen overflow-hidden relative ${className}`}
    >
      <Sidebar 
        variant="sidebar"
        collapsible="icon"
        className="h-screen border-r border-border shadow-sm bg-card"
      >
        <SidebarHeader className="px-4 py-4">
          <div className="flex items-center h-16">
            {customLogo || (
              <>
                <div className="relative w-9 h-9">
                  <div className="absolute inset-0 bg-gradient-to-tr from-primary to-secondary rounded-lg shadow-sm"></div>
                  <div className="absolute inset-0.5 bg-card rounded-lg flex items-center justify-center">
                    <span className="text-sm font-bold text-primary">{SIDEBAR_CONFIG.logoInitials}</span>
                  </div>
                </div>
                
                <div className={`${isCollapsed ? "hidden" : "ml-3 overflow-hidden whitespace-nowrap"}`}>
                  <span className="heading-md block">{SIDEBAR_CONFIG.logoTextPrimary}</span>
                  <span className="text-xs text-muted-foreground">{SIDEBAR_CONFIG.logoTextSecondary}</span>
                </div>
              </>
            )}
          </div>
          
          <SidebarTrigger className="p-1.5 rounded-md hover:bg-background-secondary hidden lg:flex items-center justify-center text-foreground hover:text-primary transition-colors">
            {isCollapsed ? <FiChevronRight className="h-4 w-4" /> : <FiChevronLeft className="h-4 w-4" />}
          </SidebarTrigger>
        </SidebarHeader>
        
        <SidebarContent className="flex-1 overflow-y-auto">
          <DashboardNavigation />
        </SidebarContent>
        
        <SidebarFooter className="px-3 py-2 border-t border-border/30">
          <div className={`${isCollapsed ? "hidden" : "text-xs text-muted-foreground"}`}>SuperNova LMS {versionText}</div>
        </SidebarFooter>
        {/* Uncomment to enable resize rail */}
        {/* <SidebarRail /> */}
      </Sidebar>
    </div>
  );
} 