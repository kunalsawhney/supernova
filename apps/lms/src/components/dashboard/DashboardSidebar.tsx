'use client';

import { useEffect, useState } from 'react';
import { useSidebar } from '@/contexts/SidebarContext';
import { DashboardNavigation } from './DashboardNavigation';
import { motion, AnimatePresence } from 'framer-motion';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

export function DashboardSidebar() {
  const { collapsed, sidebarOpen, isLargeScreen, toggleCollapsed } = useSidebar();
  const [mounted, setMounted] = useState(false);
  
  // Only animate after component is mounted
  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <motion.aside 
      initial={false}
      animate={mounted ? {
        width: collapsed ? 80 : 288,
        x: sidebarOpen || isLargeScreen ? 0 : -320,
      } : undefined}
      transition={{ 
        type: "spring", 
        stiffness: 400, 
        damping: 40,
        mass: 1
      }}
      className="fixed top-0 left-0 z-30 h-screen bg-card border-r border-border lg:relative shadow-sm overflow-hidden"
      style={{
        // Default styles before animation kicks in
        width: collapsed ? 80 : 288,
        transform: `translateX(${sidebarOpen || isLargeScreen ? 0 : -320}px)`
      }}
    >
      {/* Sidebar header with logo and brand */}
      <div className="h-16 flex items-center justify-between px-4 opacity-50 mt-6">
        <div className="flex items-center overflow-hidden">
          <div className="relative w-9 h-9">
            <div className="absolute inset-0 bg-gradient-to-tr from-primary to-secondary rounded-lg shadow-sm"></div>
            <div className="absolute inset-0.5 bg-card rounded-lg flex items-center justify-center">
              <span className="text-sm font-bold text-primary">SN</span>
            </div>
          </div>
          
          <AnimatePresence initial={false}>
            {!collapsed && mounted && (
              <motion.div 
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: "auto" }}
                exit={{ opacity: 0, width: 0 }}
                transition={{ duration: 0.2 }}
                className="ml-3 overflow-hidden whitespace-nowrap items-center"
              >
                <span className="heading-md block">SuperNova</span>
                <span className="text-xs text-muted-foreground">Learning Management</span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        
        {/* Collapse toggle button */}
        <button 
          className="p-1.5 rounded-md hover:bg-background-secondary hidden lg:flex items-center justify-center text-foreground hover:text-primary transition-colors"
          onClick={toggleCollapsed}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          <AnimatePresence initial={false} mode="wait">
            {mounted && (
              <motion.div
                key={collapsed ? 'collapsed' : 'expanded'}
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                {collapsed ? <FiChevronRight className="h-4 w-4" /> : <FiChevronLeft className="h-4 w-4" />}
              </motion.div>
            )}
          </AnimatePresence>
        </button>
      </div>
      
      {/* Navigation container */}
      <div className="h-[calc(100vh-4rem)] py-4 overflow-y-auto">
        <DashboardNavigation />
      </div>
    </motion.aside>
  );
} 