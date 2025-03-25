'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Keyboard } from 'lucide-react';
import { useRole } from '@/contexts/RoleContext';

// Define section of shortcuts
interface ShortcutSection {
  title: string;
  shortcuts: Shortcut[];
}

// Define keyboard shortcut
interface Shortcut {
  label: string;
  keys: string[];
  description?: string;
}

export function KeyboardShortcutsDialog() {
  const [open, setOpen] = useState(false);
  const { role } = useRole();

  // Detect keyboard shortcut (Shift + ?)
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === '?' && e.shiftKey) {
        e.preventDefault();
        setOpen(true);
      }
    };

    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);
  
  // Define global shortcuts available to all user roles
  const globalShortcuts: ShortcutSection = {
    title: 'Global',
    shortcuts: [
      { label: 'Open Command Palette', keys: ['⌘', 'K'] },
      { label: 'Show Keyboard Shortcuts', keys: ['Shift', '?'] },
      { label: 'Toggle Dark Mode', keys: ['⌘', 'D'] },
      { label: 'Go to Dashboard', keys: ['G', 'H'] },
      { label: 'Go to Profile', keys: ['G', 'P'] },
      { label: 'Search', keys: ['⌘', '/'] },
      { label: 'Save', keys: ['⌘', 'S'] },
    ]
  };
  
  // Define role-specific shortcuts
  const roleShortcuts: Record<string, ShortcutSection> = {
    student: {
      title: 'Learning',
      shortcuts: [
        { label: 'Resume Last Course', keys: ['⌘', 'R'] },
        { label: 'Next Lesson', keys: ['Alt', 'Right'] },
        { label: 'Previous Lesson', keys: ['Alt', 'Left'] },
        { label: 'Toggle Fullscreen', keys: ['F'] },
        { label: 'Toggle Notes Panel', keys: ['N'] },
        { label: 'Mark Complete', keys: ['⌘', 'Enter'] },
      ]
    },
    instructor: {
      title: 'Teaching',
      shortcuts: [
        { label: 'Grade Assignment', keys: ['G', 'A'] },
        { label: 'Send Announcement', keys: ['⌘', 'N'] },
        { label: 'View Student List', keys: ['S', 'L'] },
        { label: 'Add Resource', keys: ['⌘', '⇧', 'R'] },
        { label: 'Preview Course', keys: ['P', 'C'] },
      ]
    },
    admin: {
      title: 'Administration',
      shortcuts: [
        { label: 'Create User', keys: ['⌘', 'U'] },
        { label: 'Create Course', keys: ['⌘', 'C'] },
        { label: 'Export Data', keys: ['⌘', 'E'] },
        { label: 'System Settings', keys: ['S', 'S'] },
        { label: 'Quick Reports', keys: ['⌘', 'Q'] },
      ]
    }
  };
  
  // Navigation shortcuts for all roles
  const navigationShortcuts: ShortcutSection = {
    title: 'Navigation',
    shortcuts: [
      { label: 'Go to Next Page', keys: ['Alt', 'Right'] },
      { label: 'Go to Previous Page', keys: ['Alt', 'Left'] },
      { label: 'Go Back', keys: ['⌘', '['] },
      { label: 'Go Forward', keys: ['⌘', ']'] },
      { label: 'Scroll to Top', keys: ['Home'] },
      { label: 'Scroll to Bottom', keys: ['End'] }
    ]
  };
  
  // Get shortcuts specific to the current role, or default to student
  const currentRoleShortcuts = roleShortcuts[role] || roleShortcuts.student;
  
  // Combine shortcut sections
  const shortcutSections = [globalShortcuts, currentRoleShortcuts, navigationShortcuts];

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setOpen(true)}
        className="h-9 w-9"
        title="Keyboard Shortcuts"
      >
        <Keyboard className="h-5 w-5" />
        <span className="sr-only">Keyboard Shortcuts</span>
      </Button>
      
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl">Keyboard Shortcuts</DialogTitle>
            <DialogDescription>
              Boost your productivity with these keyboard shortcuts
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-8 py-4">
            {shortcutSections.map((section) => (
              <div key={section.title} className="space-y-4">
                <h3 className="text-lg font-medium">{section.title}</h3>
                <div className="grid gap-2">
                  {section.shortcuts.map((shortcut) => (
                    <div
                      key={shortcut.label}
                      className="flex items-center justify-between py-2"
                    >
                      <span className="text-sm">{shortcut.label}</span>
                      <div className="flex items-center gap-1">
                        {shortcut.keys.map((key, index) => (
                          <span key={index}>
                            {index > 0 && <span className="mx-1 text-muted-foreground">+</span>}
                            <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
                              {key}
                            </kbd>
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
} 