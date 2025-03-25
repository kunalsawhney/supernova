'use client';

import { 
  createContext, 
  useContext, 
  useState, 
  ReactNode, 
  useEffect 
} from 'react';
import { useRole } from './RoleContext';

// Define shell modes
export type ShellMode = 'focus' | 'explore' | 'collaborate';

// Define descriptions for each mode
export const modeDescriptions: Record<ShellMode, string> = {
  focus: 'Distraction-free environment for deep learning',
  explore: 'Discover new content and explore learning opportunities',
  collaborate: 'Connect and work with other learners'
};

// Role-specific available modes
const roleModes: Record<string, ShellMode[]> = {
  student: ['focus', 'explore', 'collaborate'],
  instructor: ['focus', 'explore', 'collaborate'],
  admin: ['focus', 'explore'],
  school_admin: ['focus', 'explore', 'collaborate'],
  super_admin: ['focus', 'explore']
};

// Default mode for each role
const defaultModes: Record<string, ShellMode> = {
  student: 'focus',
  instructor: 'focus',
  admin: 'focus',
  school_admin: 'focus',
  super_admin: 'focus'
};

interface ShellContextType {
  mode: ShellMode;
  setMode: (mode: ShellMode) => void;
  availableModes: ShellMode[];
  isCompactView: boolean;
  setCompactView: (compact: boolean) => void;
  toggleCompactView: () => void;
}

const ShellContext = createContext<ShellContextType | undefined>(undefined);

export function ShellProvider({ children }: { children: ReactNode }) {
  const { role } = useRole();
  console.log(role);
  // Get available modes based on role
  const availableModes = roleModes[role] || roleModes.student;
  
  // Set default mode based on role
  const [mode, setMode] = useState<ShellMode>(defaultModes[role] || 'focus');
  
  // Compact view state for focus mode
  const [isCompactView, setIsCompactView] = useState(false);
  
  // Update mode when role changes
  useEffect(() => {
    const availableModes = roleModes[role] || roleModes.student;
    const defaultMode = defaultModes[role] || 'focus';
    
    // If current mode is not available for this role, reset to default
    if (!availableModes.includes(mode)) {
      setMode(defaultMode);
    }
  }, [role, mode]);
  
  // Helper function to toggle compact view
  const toggleCompactView = () => setIsCompactView(prev => !prev);
  
  // Persist mode and view preferences in localStorage
  useEffect(() => {
    localStorage.setItem('shell_mode', mode);
    localStorage.setItem('compact_view', isCompactView.toString());
  }, [mode, isCompactView]);
  
  // Load saved preferences
  useEffect(() => {
    const savedMode = localStorage.getItem('shell_mode') as ShellMode;
    if (savedMode && availableModes.includes(savedMode)) {
      setMode(savedMode);
    }
    
    const savedCompactView = localStorage.getItem('compact_view');
    if (savedCompactView !== null) {
      setIsCompactView(savedCompactView === 'true');
    }
  }, [availableModes]);
  
  // Set compact view when in focus mode
  useEffect(() => {
    if (mode === 'focus') {
      // Only apply compact view in focus mode if the user has explicitly enabled it
      // Don't force it to be enabled/disabled when changing modes
    } else {
      // In other modes, we don't want compact view
      setIsCompactView(false);
    }
  }, [mode]);
  
  return (
    <ShellContext.Provider 
      value={{ 
        mode, 
        setMode, 
        availableModes, 
        isCompactView, 
        setCompactView: setIsCompactView, 
        toggleCompactView 
      }}
    >
      {children}
    </ShellContext.Provider>
  );
}

export function useShell() {
  const context = useContext(ShellContext);
  if (context === undefined) {
    throw new Error('useShell must be used within a ShellProvider');
  }
  return context;
} 