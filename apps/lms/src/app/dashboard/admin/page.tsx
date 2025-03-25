'use client';

import { useShell } from '@/contexts/ShellContext';

import { FocusMode } from '@/components/admin/dashboard/focus/FocusMode';
import { ExploreMode } from '@/components/admin/dashboard/explore/ExploreMode';

export default function AdminDashboardPage() {
  const { mode } = useShell();
  
  return (
    <div className="space-y-6">      
      {/* Focus Mode */}
      {mode === 'focus' && (
        <FocusMode />
      )}
      
      {/* Explore Mode */}
      {mode === 'explore' && (
        <ExploreMode />
      )}
    </div>
  );
} 