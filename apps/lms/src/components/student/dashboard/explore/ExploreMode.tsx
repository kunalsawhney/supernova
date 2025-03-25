'use client';

import { CourseDiscovery } from '@/components/student/dashboard/explore/CourseDiscovery';
import { LearningPathways } from '@/components/student/dashboard/explore/LearningPathways';
import { ResourceLibrary } from '@/components/student/dashboard/explore/ResourceLibrary';
import { TrendingTopics } from '@/components/student/dashboard/explore/TrendingTopics';

export function ExploreMode() {
  return (
    <div className="flex flex-col gap-6">
      <CourseDiscovery />
      <LearningPathways />
      <ResourceLibrary />
      <TrendingTopics />
    </div>
  );
} 