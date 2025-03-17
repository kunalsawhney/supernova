'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

interface SidebarContextType {
  collapsed: boolean;
  sidebarOpen: boolean;
  isLargeScreen: boolean;
  toggleCollapsed: () => void;
  setSidebarOpen: (open: boolean) => void;
  closeSidebar: () => void;
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

export function SidebarProvider({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isLargeScreen, setIsLargeScreen] = useState(true); // Default to true to avoid layout shift
  const [mounted, setMounted] = useState(false);

  // Initialize sidebar state and setup event listeners after mount
  useEffect(() => {
    setMounted(true);
    
    // Only access localStorage/window after component is mounted
    const savedCollapsed = typeof window !== 'undefined' 
      ? localStorage.getItem('sidebarCollapsed') === 'true'
      : false;
    
    setCollapsed(savedCollapsed);
    
    // Check screen size on mount
    if (typeof window !== 'undefined') {
      setIsLargeScreen(window.innerWidth >= 1024);
      
      const handleResize = () => {
        const largeScreen = window.innerWidth >= 1024;
        setIsLargeScreen(largeScreen);
        
        // Auto close sidebar on mobile when resizing
        if (!largeScreen && sidebarOpen) {
          setSidebarOpen(false);
        }
      };
      
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }
    
    return undefined;
  }, [sidebarOpen]);
  
  // Save sidebar state to localStorage when it changes (client-side only)
  useEffect(() => {
    if (mounted && typeof window !== 'undefined') {
      localStorage.setItem('sidebarCollapsed', String(collapsed));
    }
  }, [collapsed, mounted]);

  // Toggle sidebar collapsed state
  const toggleCollapsed = () => {
    setCollapsed(prev => !prev);
  };

  // Explicitly close sidebar (for mobile)
  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  return (
    <SidebarContext.Provider value={{ 
      collapsed, 
      sidebarOpen,
      isLargeScreen,
      toggleCollapsed,
      setSidebarOpen,
      closeSidebar
    }}>
      {children}
    </SidebarContext.Provider>
  );
}

export function useSidebar() {
  const context = useContext(SidebarContext);
  if (context === undefined) {
    throw new Error('useSidebar must be used within a SidebarProvider');
  }
  return context;
} 