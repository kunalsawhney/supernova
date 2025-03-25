'use client';

import { useState } from 'react';
import { FileCheck, Calendar, Clock, Eye, MessageSquare, ThumbsUp, ThumbsDown, CheckCircle2, CircleDashed, ArrowRightLeft, Filter, Search, Clipboard, Archive } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface PeerReview {
  id: string;
  assignmentName: string;
  course: string;
  courseId: string;
  submissionDate: string;
  deadline: string;
  status: 'pending' | 'in-review' | 'reviewed' | 'completed';
  type: 'to-review' | 'my-submission';
  reviewers?: {
    total: number;
    completed: number;
    names: string[];
  };
  submitter?: {
    name: string;
    avatar?: string;
  };
  feedbackCount?: number;
  rating?: {
    positive: number;
    negative: number;
  };
  reviewProgress?: number;
  tags: string[];
  isLate?: boolean;
}

// Mock data for peer reviews
const mockPeerReviews: PeerReview[] = [
  {
    id: '1',
    assignmentName: 'React Component Architecture',
    course: 'Advanced React Patterns',
    courseId: 'course-10',
    submissionDate: '2023-12-02T15:30:00',
    deadline: '2023-12-10T23:59:59',
    status: 'pending',
    type: 'to-review',
    submitter: {
      name: 'James Smith',
      avatar: '/images/avatars/james.jpg',
    },
    reviewProgress: 0,
    tags: ['React', 'Components', 'Architecture'],
  },
  {
    id: '2',
    assignmentName: 'UI Design System',
    course: 'UI/UX Design Fundamentals',
    courseId: 'course-6',
    submissionDate: '2023-12-01T11:45:00',
    deadline: '2023-12-08T23:59:59',
    status: 'in-review',
    type: 'my-submission',
    reviewers: {
      total: 3,
      completed: 1,
      names: ['Alex Johnson', 'Maria Garcia', 'David Kumar']
    },
    feedbackCount: 1,
    rating: {
      positive: 1,
      negative: 0
    },
    tags: ['UI Design', 'Design System', 'Figma'],
  },
  {
    id: '3',
    assignmentName: 'Algorithm Efficiency Analysis',
    course: 'Data Structures and Algorithms',
    courseId: 'course-11',
    submissionDate: '2023-11-28T09:20:00',
    deadline: '2023-12-05T23:59:59',
    status: 'reviewed',
    type: 'to-review',
    submitter: {
      name: 'Sophia Chen',
    },
    reviewProgress: 100,
    tags: ['Algorithms', 'Big O Notation', 'Analysis'],
  },
  {
    id: '4',
    assignmentName: 'Database Schema Design',
    course: 'Database Management',
    courseId: 'course-8',
    submissionDate: '2023-12-03T16:15:00',
    deadline: '2023-12-09T23:59:59',
    status: 'completed',
    type: 'my-submission',
    reviewers: {
      total: 2,
      completed: 2,
      names: ['Olivia Brown', 'Michael Zhang']
    },
    feedbackCount: 2,
    rating: {
      positive: 2,
      negative: 0
    },
    tags: ['Database', 'Schema Design', 'Normalization'],
  },
  {
    id: '5',
    assignmentName: 'CSS Grid Layout Implementation',
    course: 'Modern CSS Techniques',
    courseId: 'course-3',
    submissionDate: '2023-11-25T14:00:00',
    deadline: '2023-12-01T23:59:59',
    status: 'in-review',
    type: 'to-review',
    submitter: {
      name: 'Carlos Rodriguez',
      avatar: '/images/avatars/carlos.jpg',
    },
    reviewProgress: 60,
    tags: ['CSS', 'Grid Layout', 'Responsive Design'],
    isLate: true,
  },
  {
    id: '6',
    assignmentName: 'Machine Learning Model Evaluation',
    course: 'Machine Learning Fundamentals',
    courseId: 'course-9',
    submissionDate: '2023-11-30T17:30:00',
    deadline: '2023-12-07T23:59:59',
    status: 'pending',
    type: 'my-submission',
    reviewers: {
      total: 3,
      completed: 0,
      names: ['Sarah Johnson', 'Michael Zhang', 'Raj Patel']
    },
    feedbackCount: 0,
    tags: ['Machine Learning', 'Model Evaluation', 'Python'],
  }
];

export function PeerReviews() {
  const [reviews, setReviews] = useState<PeerReview[]>(mockPeerReviews);
  const [activeTab, setActiveTab] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  
  // Filter reviews based on active tab and status filter
  const filteredReviews = reviews.filter(review => {
    // Filter by tab
    const matchesTab = 
      (activeTab === 'all') ||
      (activeTab === 'to-review' && review.type === 'to-review') ||
      (activeTab === 'my-submissions' && review.type === 'my-submission');
    
    // Filter by status
    const matchesStatus = 
      (statusFilter === 'all') ||
      (statusFilter === review.status);
    
    return matchesTab && matchesStatus;
  });
  
  // Format deadline for display
  const formatDeadline = (deadline: string) => {
    const date = new Date(deadline);
    const now = new Date();
    const diffTime = date.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays <= 0) {
      return 'Due Today';
    } else if (diffDays === 1) {
      return 'Due Tomorrow';
    } else if (diffDays <= 7) {
      return `${diffDays} days left`;
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
  };

  // Format submission date for display
  const formatSubmissionDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      return 'Today';
    } else if (diffDays === 1) {
      return 'Yesterday';
    } else if (diffDays < 7) {
      return `${diffDays} days ago`;
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
  };
  
  // Get status badge
  const getStatusBadge = (status: PeerReview['status'], isLate: boolean = false) => {
    if (isLate) {
      return <Badge className="bg-red-500 text-white">Late</Badge>;
    }
    
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="bg-blue-50 text-blue-800 border-blue-200">Pending</Badge>;
      case 'in-review':
        return <Badge variant="outline" className="bg-amber-50 text-amber-800 border-amber-200">In Review</Badge>;
      case 'reviewed':
        return <Badge variant="outline" className="bg-purple-50 text-purple-800 border-purple-200">Reviewed</Badge>;
      case 'completed':
        return <Badge variant="outline" className="bg-green-50 text-green-800 border-green-200">Completed</Badge>;
      default:
        return null;
    }
  };
  
  return (
    <Card className="overflow-visible">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <FileCheck className="h-5 w-5 text-primary" />
          Peer Reviews
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Filter Controls */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="to-review">To Review</TabsTrigger>
              <TabsTrigger value="my-submissions">My Submissions</TabsTrigger>
            </TabsList>
          </Tabs>
          
          <div className="flex gap-2 items-center">
            <span className="text-sm text-muted-foreground whitespace-nowrap">Status:</span>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="in-review">In Review</SelectItem>
                <SelectItem value="reviewed">Reviewed</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        {/* Review List */}
        {filteredReviews.length === 0 ? (
          <div className="text-center p-8">
            <FileCheck className="h-12 w-12 text-muted-foreground/40 mx-auto mb-3" />
            <h3 className="text-lg font-medium">No peer reviews found</h3>
            <p className="text-sm text-muted-foreground mt-1">
              {activeTab === 'to-review'
                ? 'You don\'t have any peer reviews assigned to you at this time'
                : activeTab === 'my-submissions'
                  ? 'You haven\'t submitted any assignments for peer review yet'
                  : 'There are no peer reviews matching your filters'}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredReviews.map(review => (
              <Card key={review.id} className="overflow-hidden hover:border-primary/20 transition-all">
                <div className="p-5">
                  <div className="flex flex-col gap-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                          {getStatusBadge(review.status, review.isLate)}
                          <div className="text-xs text-muted-foreground">{review.course}</div>
                        </div>
                        
                        <h3 className="font-medium">{review.assignmentName}</h3>
                      </div>
                      
                      <div className="flex flex-col items-end ml-2">
                        <div className="flex items-center gap-1 text-sm">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span className={`font-medium ${
                            new Date(review.deadline) < new Date() ? 'text-red-500' : ''
                          }`}>
                            {formatDeadline(review.deadline)}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Tags */}
                    <div className="flex flex-wrap gap-1">
                      {review.tags.map(tag => (
                        <Badge 
                          key={tag} 
                          variant="outline" 
                          className="text-xs px-1.5 py-0 h-5 bg-background"
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    
                    {/* Progress Bar (for to-review) or Feedback Stats (for my-submission) */}
                    {review.type === 'to-review' ? (
                      <div className="flex flex-col gap-2">
                        <div className="flex justify-between items-center">
                          <div className="text-sm font-medium">
                            Review Progress
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {review.reviewProgress}%
                          </div>
                        </div>
                        <Progress value={review.reviewProgress} className="h-2" />
                      </div>
                    ) : (
                      <div className="flex items-center justify-between">
                        <div className="flex flex-col">
                          <div className="text-sm font-medium">
                            Review Status: {review.reviewers?.completed}/{review.reviewers?.total} completed
                          </div>
                          {review.feedbackCount !== undefined && review.feedbackCount > 0 ? (
                            <div className="flex items-center gap-3 mt-1 text-sm">
                              <div className="flex items-center gap-1">
                                <MessageSquare className="h-4 w-4 text-muted-foreground" />
                                <span>{review.feedbackCount} comment{review.feedbackCount !== 1 ? 's' : ''}</span>
                              </div>
                              {review.rating && (
                                <>
                                  <div className="flex items-center gap-1">
                                    <ThumbsUp className="h-4 w-4 text-green-500" />
                                    <span>{review.rating.positive}</span>
                                  </div>
                                  {review.rating.negative > 0 && (
                                    <div className="flex items-center gap-1">
                                      <ThumbsDown className="h-4 w-4 text-red-500" />
                                      <span>{review.rating.negative}</span>
                                    </div>
                                  )}
                                </>
                              )}
                            </div>
                          ) : null}
                        </div>
                      </div>
                    )}
                    
                    {/* Submission Info and Actions */}
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pt-3 border-t mt-1">
                      <div className="flex items-center gap-3">
                        {review.type === 'to-review' && review.submitter ? (
                          <div className="flex items-center gap-2">
                            <Avatar className="h-7 w-7">
                              {review.submitter.avatar ? (
                                <AvatarImage src={review.submitter.avatar} alt={review.submitter.name} />
                              ) : null}
                              <AvatarFallback className="text-xs">
                                {review.submitter.name.split(' ').map(n => n[0]).join('')}
                              </AvatarFallback>
                            </Avatar>
                            <div className="text-xs">
                              <span>Submitted by </span>
                              <span className="font-medium">{review.submitter.name}</span>
                            </div>
                          </div>
                        ) : review.type === 'my-submission' && review.reviewers ? (
                          <div className="text-xs">
                            <span>Assigned to: </span>
                            <span className="font-medium">
                              {review.reviewers.names.slice(0, 2).join(', ')}
                              {review.reviewers.names.length > 2 ? ` and ${review.reviewers.names.length - 2} more` : ''}
                            </span>
                          </div>
                        ) : null}
                        
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Clock className="h-3.5 w-3.5" />
                          <span>Submitted {formatSubmissionDate(review.submissionDate)}</span>
                        </div>
                      </div>
                      
                      <div className="flex gap-2 self-end">
                        {review.type === 'to-review' ? (
                          <>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="text-sm gap-1"
                            >
                              <Eye className="h-4 w-4" />
                              View Work
                            </Button>
                            
                            <Button 
                              variant={review.status === 'reviewed' || review.status === 'completed' ? "outline" : "default"} 
                              size="sm"
                              className="text-sm gap-1"
                              disabled={review.status === 'completed'}
                            >
                              {review.status === 'reviewed' || review.status === 'completed' ? (
                                <>
                                  <CheckCircle2 className="h-4 w-4" />
                                  Already Reviewed
                                </>
                              ) : (
                                <>
                                  <ArrowRightLeft className="h-4 w-4" />
                                  {review.status === 'in-review' ? 'Continue Review' : 'Start Review'}
                                </>
                              )}
                            </Button>
                          </>
                        ) : (
                          <>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="text-sm gap-1"
                            >
                              <Clipboard className="h-4 w-4" />
                              View Feedback
                            </Button>
                            
                            <Button 
                              variant="outline" 
                              size="sm"
                              className="text-sm gap-1"
                            >
                              <Archive className="h-4 w-4" />
                              Archive
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
} 