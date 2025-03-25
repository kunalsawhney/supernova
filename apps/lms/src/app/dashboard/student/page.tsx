'use client';

import Breadcrumbs from '@/components/Breadcrumbs';
import {
  Calendar,
  Search,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { useShell } from '@/contexts/ShellContext';
import { ExploreMode } from '@/components/student/dashboard/explore/ExploreMode';
import { CollaborateMode } from '@/components/student/dashboard/collaborate/CollaborateMode';
import { FocusMode } from '@/components/student/dashboard/focus/FocusMode';


export default function StudentDashboard() {
  const { mode } = useShell();

  return (
    <div className="space-y-6 pb-8 container mx-auto px-4 max-w-7xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Learning Dashboard</h1>
          <p className="text-muted-foreground mt-1">Track your progress and continue your learning journey</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button variant="outline" className="gap-2">
            <Search className="h-4 w-4" />
            Browse Courses
          </Button>
          <Button className="gap-2">
            <Calendar className="h-4 w-4" />
            Book Live Class
          </Button>
        </div>
      </div>

      {/* Content based on mode */}
      {mode === 'focus' && (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold">Focus Mode</h2>
          <p className="text-muted-foreground">Stay focused and achieve your goals with our focus mode</p>
          <FocusMode />
        </div>
      )}
      
      {mode === 'explore' && (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold">Explore Courses</h2>
          <p className="text-muted-foreground">Discover new learning opportunities and expand your knowledge</p>
          <ExploreMode />
        </div>
      )}
      
      {mode === 'collaborate' && (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold">Collaboration Space</h2>
          <p className="text-muted-foreground">Connect with peers, join study groups, and collaborate on projects</p>
          <CollaborateMode />
        </div>
      )}
    </div>
  );
} 