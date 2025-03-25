'use client';

import { LearningMomentumHub } from '@/components/student/dashboard/focus/LearningMomentumHub';
import { LearningStats } from '@/components/student/dashboard/focus/LearningStats';
import { StudySessionPlanner } from '@/components/student/dashboard/focus/StudySessionPlanner';
import { KnowledgeGapIndicators } from '@/components/student/dashboard/focus/KnowledgeGapIndicators';
import { LearningRoadmapProgress } from '@/components/student/dashboard/focus/LearningRoadmapProgress';

export function FocusMode() {
  return (
    <div className='flex flex-col gap-6'>
        {/* Learning Momentum Hub - Only show in focus mode */}
        <LearningStats />
        <LearningMomentumHub />
        <StudySessionPlanner />
        <KnowledgeGapIndicators />
        <LearningRoadmapProgress />
    </div>
  );
}