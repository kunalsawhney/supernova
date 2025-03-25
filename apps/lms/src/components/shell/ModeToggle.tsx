'use client';

import { useState, useEffect } from 'react';
import { ShellMode, modeDescriptions } from '@/contexts/ShellContext';
import { Button } from '@/components/ui/button';
import { 
  Tooltip, 
  TooltipContent, 
  TooltipProvider, 
  TooltipTrigger 
} from '@/components/ui/tooltip';
import { BookOpen, Target, Users } from 'lucide-react';

// Icons for each mode
const modeIcons: Record<ShellMode, React.ReactNode> = {
  focus: <Target className="h-4 w-4" />,
  explore: <BookOpen className="h-4 w-4" />,
  collaborate: <Users className="h-4 w-4" />
};

// Display names for each mode
const modeLabels: Record<ShellMode, string> = {
  focus: 'Focus',
  explore: 'Explore',
  collaborate: 'Collaborate'
};

interface ModeToggleProps {
  currentMode: ShellMode;
  availableModes: ShellMode[];
}

export function ModeToggle({ currentMode, availableModes }: ModeToggleProps) {
  const [mounted, setMounted] = useState(false);
  
  // After hydration, we can show the component
  useEffect(() => {
    setMounted(true);
  }, []);
  
  const handleModeChange = (mode: ShellMode) => {
    // Using window.location for now, but ideally this would be handled by the ShellContext
    const event = new CustomEvent('shell:modeChange', { detail: mode });
    window.dispatchEvent(event);
  };

  // Don't render anything during SSR to prevent hydration errors
  if (!mounted) {
    return null;
  }

  return (
    <div className="flex items-center gap-1 bg-muted rounded-md p-1">
      <TooltipProvider>
        {availableModes.map((mode) => (
          <Tooltip key={mode}>
            <TooltipTrigger asChild>
              <Button
                variant={currentMode === mode ? "default" : "ghost"}
                size="sm"
                className="h-8 gap-2"
                onClick={() => handleModeChange(mode)}
                aria-pressed={currentMode === mode}
              >
                {modeIcons[mode]}
                <span className="hidden md:inline-block">
                  {modeLabels[mode]}
                </span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{modeDescriptions[mode]}</p>
            </TooltipContent>
          </Tooltip>
        ))}
      </TooltipProvider>
    </div>
  );
} 