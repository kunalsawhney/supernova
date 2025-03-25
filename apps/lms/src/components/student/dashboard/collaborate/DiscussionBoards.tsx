'use client';

import { useState } from 'react';
import { MessageSquare, Users, Clock, Flag, ThumbsUp, MessageCircle, ChevronRight, Filter, Search, PlusCircle } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface Discussion {
  id: string;
  title: string;
  preview: string;
  author: {
    name: string;
    avatar?: string;
  };
  course: string;
  courseId: string;
  category: 'question' | 'discussion' | 'announcement' | 'general';
  createdAt: string;
  updatedAt: string;
  replies: number;
  views: number;
  likes: number;
  status: 'active' | 'resolved' | 'pinned';
  isNew?: boolean;
  lastActivity: string;
  tags: string[];
}

// Mock data for discussions
const mockDiscussions: Discussion[] = [
  {
    id: '1',
    title: 'How to implement authentication with JWT in React?',
    preview: 'I\'m trying to set up authentication in my React app using JWT tokens. I\'ve followed several tutorials but I\'m running into CORS issues...',
    author: {
      name: 'Alex Johnson',
      avatar: '/images/avatars/alex.jpg',
    },
    course: 'Full-Stack Web Development',
    courseId: 'course-1',
    category: 'question',
    createdAt: '2023-12-05T14:30:00',
    updatedAt: '2023-12-06T10:15:00',
    replies: 8,
    views: 124,
    likes: 12,
    status: 'active',
    lastActivity: '2023-12-06T10:15:00',
    tags: ['React', 'Authentication', 'JWT'],
  },
  {
    id: '2',
    title: 'Week 3 Assignment Clarification',
    preview: 'I\'m a bit confused about the requirements for the week 3 assignment. The instructions say to implement a "responsive layout" but don\'t specify which breakpoints...',
    author: {
      name: 'Maria Garcia',
      avatar: '/images/avatars/maria.jpg',
    },
    course: 'Modern CSS Techniques',
    courseId: 'course-3',
    category: 'question',
    createdAt: '2023-12-04T09:45:00',
    updatedAt: '2023-12-06T11:20:00',
    replies: 5,
    views: 78,
    likes: 4,
    status: 'resolved',
    lastActivity: '2023-12-06T11:20:00',
    tags: ['CSS', 'Assignments', 'Help'],
  },
  {
    id: '3',
    title: 'Important: Final Project Submission Guidelines',
    preview: 'Please read the updated guidelines for the final project submission. There have been some changes to the requirements and deadline...',
    author: {
      name: 'Dr. Robert Chen',
      avatar: '/images/avatars/robert.jpg',
    },
    course: 'Advanced JavaScript',
    courseId: 'course-4',
    category: 'announcement',
    createdAt: '2023-12-06T08:00:00',
    updatedAt: '2023-12-06T08:00:00',
    replies: 2,
    views: 235,
    likes: 45,
    status: 'pinned',
    isNew: true,
    lastActivity: '2023-12-06T10:30:00',
    tags: ['Final Project', 'Announcement', 'Important'],
  },
  {
    id: '4',
    title: 'Share your portfolio projects!',
    preview: 'I thought it would be nice to have a thread where we can all share our portfolio projects and give each other feedback...',
    author: {
      name: 'Emma Wilson',
    },
    course: 'UI/UX Design Fundamentals',
    courseId: 'course-6',
    category: 'general',
    createdAt: '2023-12-03T15:10:00',
    updatedAt: '2023-12-06T09:45:00',
    replies: 23,
    views: 197,
    likes: 32,
    status: 'active',
    lastActivity: '2023-12-06T09:45:00',
    tags: ['Portfolio', 'Feedback', 'Design'],
  },
  {
    id: '5',
    title: 'TypeScript type narrowing best practices',
    preview: 'What are some of the best practices you\'ve found for type narrowing in TypeScript? I\'m working on a complex app and finding myself writing a lot of type guards...',
    author: {
      name: 'David Kumar',
      avatar: '/images/avatars/david.jpg',
    },
    course: 'Advanced TypeScript',
    courseId: 'course-5',
    category: 'discussion',
    createdAt: '2023-12-05T11:25:00',
    updatedAt: '2023-12-06T14:00:00',
    replies: 15,
    views: 143,
    likes: 18,
    status: 'active',
    isNew: true,
    lastActivity: '2023-12-06T14:00:00',
    tags: ['TypeScript', 'Best Practices', 'Types'],
  },
];

export function DiscussionBoards() {
  const [searchQuery, setSearchQuery] = useState('');
  const [discussions, setDiscussions] = useState<Discussion[]>(mockDiscussions);
  const [activeTab, setActiveTab] = useState('all');
  
  // Filter discussions based on search query
  const filteredDiscussions = discussions.filter(discussion => {
    // Basic search filter
    const matchesSearch = !searchQuery || 
      discussion.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      discussion.preview.toLowerCase().includes(searchQuery.toLowerCase()) ||
      discussion.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    // Filter by tab
    if (activeTab === 'all') return matchesSearch;
    if (activeTab === 'questions') return matchesSearch && discussion.category === 'question';
    if (activeTab === 'announcements') return matchesSearch && discussion.category === 'announcement';
    if (activeTab === 'discussions') return matchesSearch && (discussion.category === 'discussion' || discussion.category === 'general');
    
    return matchesSearch;
  });
  
  // Format date/time for display
  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      const hours = Math.floor(diffTime / (1000 * 60 * 60));
      if (hours === 0) {
        const minutes = Math.floor(diffTime / (1000 * 60));
        return `${minutes} ${minutes === 1 ? 'minute' : 'minutes'} ago`;
      }
      return `${hours} ${hours === 1 ? 'hour' : 'hours'} ago`;
    } else if (diffDays === 1) {
      return 'Yesterday';
    } else if (diffDays < 7) {
      return `${diffDays} days ago`;
    } else {
      return date.toLocaleDateString();
    }
  };
  
  // Get category badge
  const getCategoryBadge = (category: Discussion['category']) => {
    switch (category) {
      case 'question':
        return <Badge variant="outline" className="bg-blue-50 text-blue-800 border-blue-200">Question</Badge>;
      case 'announcement':
        return <Badge variant="outline" className="bg-red-50 text-red-800 border-red-200">Announcement</Badge>;
      case 'discussion':
        return <Badge variant="outline" className="bg-purple-50 text-purple-800 border-purple-200">Discussion</Badge>;
      case 'general':
        return <Badge variant="outline" className="bg-green-50 text-green-800 border-green-200">General</Badge>;
      default:
        return null;
    }
  };
  
  // Get status indicator
  const getStatusIndicator = (status: Discussion['status'], isNew: boolean = false) => {
    if (isNew) {
      return <Badge className="bg-blue-500">New</Badge>;
    }
    
    switch (status) {
      case 'resolved':
        return <Badge variant="outline" className="bg-green-50 text-green-800 border-green-200">Resolved</Badge>;
      case 'pinned':
        return <Badge variant="outline" className="bg-amber-50 text-amber-800 border-amber-200">Pinned</Badge>;
      default:
        return null;
    }
  };

  return (
    <Card className="overflow-visible">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5 text-primary" />
          Discussion Boards
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Search and New Post */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search discussions..."
              className="pl-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <Button className="gap-2">
            <PlusCircle className="h-4 w-4" />
            New Discussion
          </Button>
        </div>
        
        {/* Tabs */}
        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="all">All Topics</TabsTrigger>
            <TabsTrigger value="questions">Questions</TabsTrigger>
            <TabsTrigger value="announcements">Announcements</TabsTrigger>
            <TabsTrigger value="discussions">Discussions</TabsTrigger>
          </TabsList>
          
          <TabsContent value={activeTab}>
            {filteredDiscussions.length === 0 ? (
              <div className="text-center p-8">
                <MessageSquare className="h-12 w-12 text-muted-foreground/40 mx-auto mb-3" />
                <h3 className="text-lg font-medium">No discussions found</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  {searchQuery 
                    ? 'Try adjusting your search' 
                    : 'Start the conversation by creating a new discussion'}
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredDiscussions.map(discussion => (
                  <Card key={discussion.id} className="overflow-hidden hover:border-primary/20 transition-all">
                    <div className="p-4">
                      <div className="flex flex-col sm:flex-row gap-4">
                        <div className="sm:w-16 flex sm:flex-col items-center justify-center gap-2 sm:border-r sm:pr-4">
                          <div className="flex flex-col items-center">
                            <div className="text-lg font-bold text-primary">{discussion.replies}</div>
                            <div className="text-xs text-muted-foreground">replies</div>
                          </div>
                          <div className="flex flex-col items-center">
                            <div className="text-lg font-bold text-muted-foreground">{discussion.views}</div>
                            <div className="text-xs text-muted-foreground">views</div>
                          </div>
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <div className="flex flex-wrap items-center gap-2 mb-1">
                                {getCategoryBadge(discussion.category)}
                                {getStatusIndicator(discussion.status, discussion.isNew)}
                                <div className="text-xs text-muted-foreground">
                                  {discussion.course}
                                </div>
                              </div>
                              
                              <h3 className="font-medium">{discussion.title}</h3>
                              
                              <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                                {discussion.preview}
                              </p>
                            </div>
                          </div>
                          
                          <div className="flex flex-wrap gap-1 mt-2">
                            {discussion.tags.map(tag => (
                              <Badge 
                                key={tag} 
                                variant="outline" 
                                className="text-xs px-1.5 py-0 h-5 bg-background"
                              >
                                {tag}
                              </Badge>
                            ))}
                          </div>
                          
                          <div className="flex flex-wrap justify-between items-center mt-3 pt-2 border-t text-sm">
                            <div className="flex items-center gap-2">
                              <Avatar className="h-6 w-6">
                                {discussion.author.avatar ? (
                                  <AvatarImage src={discussion.author.avatar} alt={discussion.author.name} />
                                ) : null}
                                <AvatarFallback className="text-[10px]">
                                  {discussion.author.name.split(' ').map(n => n[0]).join('')}
                                </AvatarFallback>
                              </Avatar>
                              <div className="text-xs">{discussion.author.name}</div>
                              <div className="text-xs text-muted-foreground flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                <span>
                                  {discussion.replies > 0 
                                    ? `Last reply ${formatDateTime(discussion.lastActivity)}` 
                                    : `Posted ${formatDateTime(discussion.createdAt)}`}
                                </span>
                              </div>
                            </div>
                            
                            <div className="flex gap-1 text-muted-foreground">
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                className="h-8 w-8"
                              >
                                <ThumbsUp className="h-4 w-4" />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                className="h-8 w-8"
                              >
                                <Flag className="h-4 w-4" />
                              </Button>
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="h-8 hidden sm:flex"
                              >
                                <MessageCircle className="h-4 w-4 mr-2" />
                                Reply
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
} 