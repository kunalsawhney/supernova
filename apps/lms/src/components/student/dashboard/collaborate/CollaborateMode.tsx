'use client';

import { DiscussionBoards } from '@/components/student/dashboard/collaborate/DiscussionBoards';
import { GroupProjects } from '@/components/student/dashboard/collaborate/GroupProjects';
import { StudyGroups } from '@/components/student/dashboard/collaborate/StudyGroups';
import { PeerReviews } from '@/components/student/dashboard/collaborate/PeerReviews';

export function CollaborateMode() {
  return (
    <div className="flex flex-col gap-6">
        <DiscussionBoards />
        <StudyGroups />
        <GroupProjects />
        <PeerReviews />
    </div>
  );
} 