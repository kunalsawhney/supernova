'use client';

import { ReactNode, useRef, useEffect } from 'react';
import { useRole } from '@/contexts/RoleContext';
import { useShell, ShellMode } from '@/contexts/ShellContext';
import { cn } from '@/lib/utils';
import { Breadcrumbs } from '@/components/shell/Breadcrumbs';
import { ModeToggle } from '@/components/shell/ModeToggle';
import { TaskSidebar } from '@/components/shell/TaskSidebar';
import { CommandPalette } from '@/components/shell/CommandPalette';
import { KeyboardShortcutsDialog } from '@/components/shell/KeyboardShortcutsDialog';
import { HeaderActions } from '@/components/shell/HeaderActions';
import { SidebarProvider } from '@/components/ui/sidebar';

interface AdaptiveShellProps {
  children: ReactNode;
}

export function AdaptiveShell({ children }: AdaptiveShellProps) {
  const { role } = useRole();
  const { mode, availableModes, isCompactView, setMode } = useShell();
  
  // Create a ref to the keyboard shortcuts dialog component
  const shortcutsDialogRef = useRef<HTMLElement>(null);
  
  // Function to open the shortcuts dialog programmatically
  const openShortcutsDialog = () => {
    if (shortcutsDialogRef.current) {
      shortcutsDialogRef.current.click();
    }
  };
  
  // Listen for mode change events from ModeToggle
  useEffect(() => {
    const handleModeChange = (event: CustomEvent<ShellMode>) => {
      setMode(event.detail);
    };
    
    window.addEventListener('shell:modeChange', handleModeChange as EventListener);
    
    return () => {
      window.removeEventListener('shell:modeChange', handleModeChange as EventListener);
    };
  }, [setMode]);
  
  return (
    <SidebarProvider>
      <div className="grid min-h-screen w-full [grid-template-areas:'sidebar_main'] [grid-template-columns:auto_1fr]">
        {/* Task-oriented sidebar */}
        <div className="[grid-area:sidebar]">
          <TaskSidebar role={role} />
        </div>
        
        {/* Main content area */}
        <div 
          className={cn(
            "[grid-area:main] flex flex-col",
            isCompactView && "max-w-screen-md mx-auto"
          )}
        >
          <header className="h-16 border-b sticky top-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-10">
            <div className="h-full px-4 md:container flex items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <Breadcrumbs />
              </div>
              
              <div className="flex items-center gap-2">
                  <CommandPalette openShortcutsDialog={openShortcutsDialog} />
                  <span ref={shortcutsDialogRef as any}>
                    <KeyboardShortcutsDialog />
                  </span>
              </div>

              <div className="flex items-center gap-2">
                {/* Only show mode toggle if we have multiple modes available */}
                {availableModes.length > 1 && (
                  <ModeToggle 
                    currentMode={mode} 
                    availableModes={availableModes}
                  />
                )}
              </div>

              <div className="flex items-center gap-2">
                <HeaderActions />
              </div>
            </div>
          </header>
          
          <main className={cn(
            "flex-1 overflow-auto",
            mode === 'focus' && "bg-background",
            mode === 'explore' && "bg-muted/30",
            mode === 'collaborate' && "bg-primary/5"
          )}>
            <div className={cn(
              "px-4 py-6 md:container",
              mode === 'focus' && "max-w-4xl mx-auto"
            )}>
              {children}
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
} 