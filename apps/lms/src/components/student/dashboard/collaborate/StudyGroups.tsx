'use client';

import { useState } from 'react';
import { UsersRound, Calendar, Users, MapPin, Clock, Video, ExternalLink, Search, Plus, Filter, ChevronRight } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface StudyGroup {
  id: string;
  name: string;
  course: string;
  courseId: string;
  description: string;
  topic: string;
  meetingTime: string | null;
  meetingType: 'online' | 'in-person' | 'hybrid';
  location: string | null;
  meetingLink: string | null;
  memberCount: number;
  maxMembers: number;
  leader: {
    id: string;
    name: string;
    avatar?: string;
  };
  members: {
    id: string;
    name: string;
    avatar?: string;
  }[];
  tags: string[];
  isJoined: boolean;
  isPrivate: boolean;
  nextMeeting: string | null;
}

// Mock data for study groups
const mockStudyGroups: StudyGroup[] = [
  {
    id: '1',
    name: 'React Experts',
    course: 'Advanced React Patterns',
    courseId: 'course-10',
    description: 'Weekly study group focusing on advanced React patterns, hooks, and state management.',
    topic: 'React Hooks and Context API',
    meetingTime: 'Thursdays, 7:00 PM - 9:00 PM',
    meetingType: 'online',
    location: null,
    meetingLink: 'https://zoom.us/j/123456789',
    memberCount: 8,
    maxMembers: 12,
    leader: {
      id: 'user-1',
      name: 'Alex Johnson',
      avatar: '/images/avatars/alex.jpg',
    },
    members: [
      {
        id: 'user-2',
        name: 'Maria Garcia',
        avatar: '/images/avatars/maria.jpg',
      },
      {
        id: 'user-5',
        name: 'James Smith',
        avatar: '/images/avatars/james.jpg',
      },
      {
        id: 'user-6',
        name: 'Sophia Chen',
      }
    ],
    tags: ['React', 'Hooks', 'JavaScript', 'Advanced'],
    isJoined: true,
    isPrivate: false,
    nextMeeting: '2023-12-07T19:00:00',
  },
  {
    id: '2',
    name: 'Algorithm Masters',
    course: 'Data Structures and Algorithms',
    courseId: 'course-11',
    description: 'Study group focused on algorithm problem-solving and competitive programming challenges.',
    topic: 'Dynamic Programming',
    meetingTime: 'Tuesdays and Fridays, 6:00 PM - 8:00 PM',
    meetingType: 'hybrid',
    location: 'Engineering Building, Room 302',
    meetingLink: 'https://zoom.us/j/987654321',
    memberCount: 15,
    maxMembers: 20,
    leader: {
      id: 'user-10',
      name: 'Michael Zhang',
      avatar: '/images/avatars/michael.jpg',
    },
    members: [
      {
        id: 'user-11',
        name: 'Sarah Johnson',
        avatar: '/images/avatars/sarah.jpg',
      },
      {
        id: 'user-12',
        name: 'Raj Patel',
      }
    ],
    tags: ['Algorithms', 'Data Structures', 'Python', 'Problem Solving'],
    isJoined: false,
    isPrivate: false,
    nextMeeting: '2023-12-08T18:00:00',
  },
  {
    id: '3',
    name: 'UI/UX Design Critique',
    course: 'UI/UX Design Fundamentals',
    courseId: 'course-6',
    description: 'Collaborative group for sharing and critiquing UI/UX design projects and portfolio pieces.',
    topic: 'Mobile App User Flows',
    meetingTime: 'Mondays, 5:30 PM - 7:30 PM',
    meetingType: 'online',
    location: null,
    meetingLink: 'https://meet.google.com/abc-defg-hij',
    memberCount: 12,
    maxMembers: 15,
    leader: {
      id: 'user-7',
      name: 'Carlos Rodriguez',
      avatar: '/images/avatars/carlos.jpg',
    },
    members: [
      {
        id: 'user-4',
        name: 'Emma Wilson',
      },
      {
        id: 'user-8',
        name: 'Priya Patel',
        avatar: '/images/avatars/priya.jpg',
      }
    ],
    tags: ['UI Design', 'UX Design', 'Design Critique', 'Portfolio Review'],
    isJoined: false,
    isPrivate: false,
    nextMeeting: '2023-12-11T17:30:00',
  },
  {
    id: '4',
    name: 'Database Concepts',
    course: 'Database Management',
    courseId: 'course-8',
    description: 'Study group for database concepts, SQL queries, normalization, and relational theory.',
    topic: 'Complex SQL Queries and Performance Optimization',
    meetingTime: 'Wednesdays, 4:00 PM - 6:00 PM',
    meetingType: 'in-person',
    location: 'Library, Study Room 5',
    meetingLink: null,
    memberCount: 5,
    maxMembers: 8,
    leader: {
      id: 'user-9',
      name: 'Olivia Brown',
    },
    members: [
      {
        id: 'user-1',
        name: 'Alex Johnson',
        avatar: '/images/avatars/alex.jpg',
      }
    ],
    tags: ['SQL', 'Databases', 'Normalization', 'Query Optimization'],
    isJoined: true,
    isPrivate: false,
    nextMeeting: '2023-12-06T16:00:00',
  },
  {
    id: '5',
    name: 'Machine Learning Projects',
    course: 'Machine Learning Fundamentals',
    courseId: 'course-9',
    description: 'Collaborative group working on machine learning projects and model implementations.',
    topic: 'Natural Language Processing Applications',
    meetingTime: 'Saturdays, 10:00 AM - 1:00 PM',
    meetingType: 'online',
    location: null,
    meetingLink: 'https://teams.microsoft.com/l/meeting/123',
    memberCount: 10,
    maxMembers: 12,
    leader: {
      id: 'user-11',
      name: 'Sarah Johnson',
      avatar: '/images/avatars/sarah.jpg',
    },
    members: [
      {
        id: 'user-10',
        name: 'Michael Zhang',
        avatar: '/images/avatars/michael.jpg',
      },
      {
        id: 'user-12',
        name: 'Raj Patel',
      }
    ],
    tags: ['Machine Learning', 'Python', 'NLP', 'AI', 'Data Science'],
    isJoined: false,
    isPrivate: true,
    nextMeeting: '2023-12-09T10:00:00',
  }
];

export function StudyGroups() {
  const [searchQuery, setSearchQuery] = useState('');
  const [studyGroups, setStudyGroups] = useState<StudyGroup[]>(mockStudyGroups);
  const [activeTab, setActiveTab] = useState('all');
  const [meetingTypeFilter, setMeetingTypeFilter] = useState('all');
  
  // Filter study groups
  const filteredGroups = studyGroups.filter(group => {
    // Filter by search query
    const matchesSearch = !searchQuery || 
      group.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      group.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      group.topic.toLowerCase().includes(searchQuery.toLowerCase()) ||
      group.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    // Filter by tab
    const matchesTab = 
      (activeTab === 'all') ||
      (activeTab === 'my-groups' && group.isJoined) ||
      (activeTab === 'available' && !group.isJoined);
    
    // Filter by meeting type
    const matchesMeetingType = 
      (meetingTypeFilter === 'all') ||
      (meetingTypeFilter === group.meetingType);
    
    return matchesSearch && matchesTab && matchesMeetingType;
  });
  
  // Format next meeting time
  const formatNextMeeting = (nextMeeting: string | null) => {
    if (!nextMeeting) return 'No scheduled meetings';
    
    const meetingDate = new Date(nextMeeting);
    const now = new Date();
    const diffTime = meetingDate.getTime() - now.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
      if (diffHours === 0) {
        const diffMinutes = Math.floor(diffTime / (1000 * 60));
        return `Starting in ${diffMinutes} minutes`;
      }
      return `Today at ${meetingDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    } else if (diffDays === 1) {
      return `Tomorrow at ${meetingDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    } else if (diffDays > 1 && diffDays < 7) {
      return `${meetingDate.toLocaleDateString([], { weekday: 'long' })} at ${meetingDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    } else {
      return meetingDate.toLocaleDateString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
    }
  };
  
  // Get meeting type badge
  const getMeetingTypeBadge = (meetingType: StudyGroup['meetingType']) => {
    switch (meetingType) {
      case 'online':
        return <Badge variant="outline" className="bg-blue-50 text-blue-800 border-blue-200">Online</Badge>;
      case 'in-person':
        return <Badge variant="outline" className="bg-green-50 text-green-800 border-green-200">In-Person</Badge>;
      case 'hybrid':
        return <Badge variant="outline" className="bg-purple-50 text-purple-800 border-purple-200">Hybrid</Badge>;
      default:
        return null;
    }
  };
  
  // Join or leave a study group
  const toggleJoinGroup = (groupId: string) => {
    setStudyGroups(prevGroups => 
      prevGroups.map(group => 
        group.id === groupId 
          ? { ...group, isJoined: !group.isJoined, memberCount: group.isJoined ? group.memberCount - 1 : group.memberCount + 1 }
          : group
      )
    );
  };

  return (
    <Card className="overflow-visible">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <UsersRound className="h-5 w-5 text-primary" />
          Study Groups
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Search and Filters */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search study groups..."
              className="pl-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div className="flex flex-wrap gap-2">
            <Select value={meetingTypeFilter} onValueChange={setMeetingTypeFilter}>
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="Meeting Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="online">Online</SelectItem>
                <SelectItem value="in-person">In-Person</SelectItem>
                <SelectItem value="hybrid">Hybrid</SelectItem>
              </SelectContent>
            </Select>
            
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Create Group
            </Button>
          </div>
        </div>
        
        {/* Tabs */}
        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="all">All Groups</TabsTrigger>
            <TabsTrigger value="my-groups">My Groups</TabsTrigger>
            <TabsTrigger value="available">Available Groups</TabsTrigger>
          </TabsList>
          
          <TabsContent value={activeTab}>
            {filteredGroups.length === 0 ? (
              <div className="text-center p-8">
                <UsersRound className="h-12 w-12 text-muted-foreground/40 mx-auto mb-3" />
                <h3 className="text-lg font-medium">No study groups found</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  {searchQuery 
                    ? 'Try adjusting your search or filters' 
                    : activeTab === 'my-groups'
                      ? 'Join or create a study group to get started'
                      : 'Create a new study group to collaborate with others'}
                </p>
                <Button variant="outline" className="mt-4 gap-2">
                  <Plus className="h-4 w-4" />
                  Create New Study Group
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredGroups.map(group => (
                  <Card key={group.id} className="overflow-hidden hover:border-primary/20 transition-all">
                    <div className="p-5">
                      <div className="flex flex-col gap-3">
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="flex flex-wrap items-center gap-2 mb-1">
                              {getMeetingTypeBadge(group.meetingType)}
                              {group.isPrivate && (
                                <Badge variant="outline" className="bg-amber-50 text-amber-800 border-amber-200">Private</Badge>
                              )}
                              <div className="text-xs text-muted-foreground">{group.course}</div>
                            </div>
                            
                            <h3 className="font-medium">
                              {group.name}
                              {group.isJoined && (
                                <Badge variant="outline" className="ml-2 bg-emerald-50 text-emerald-800 border-emerald-200">Joined</Badge>
                              )}
                            </h3>
                            
                            <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                              {group.description}
                            </p>
                          </div>
                          
                          <div className="flex flex-col items-end ml-2">
                            <div className="flex items-center gap-0.5 text-sm">
                              <Users className="h-4 w-4 text-muted-foreground" />
                              <span className="font-medium">
                                {group.memberCount}/{group.maxMembers}
                              </span>
                            </div>
                          </div>
                        </div>
                        
                        {/* Topic and Meeting Details */}
                        <div className="mt-1 text-sm">
                          <div className="font-medium">Current topic: <span className="font-normal">{group.topic}</span></div>
                          
                          {group.nextMeeting && (
                            <div className="flex items-center gap-1 mt-1 text-muted-foreground">
                              <Calendar className="h-4 w-4" />
                              <span>Next: {formatNextMeeting(group.nextMeeting)}</span>
                            </div>
                          )}
                          
                          {group.meetingTime && (
                            <div className="flex items-center gap-1 mt-1 text-muted-foreground">
                              <Clock className="h-4 w-4" />
                              <span>{group.meetingTime}</span>
                            </div>
                          )}
                          
                          {group.location && (
                            <div className="flex items-center gap-1 mt-1 text-muted-foreground">
                              <MapPin className="h-4 w-4" />
                              <span>{group.location}</span>
                            </div>
                          )}
                        </div>
                        
                        {/* Tags */}
                        <div className="flex flex-wrap gap-1 mt-1">
                          {group.tags.map(tag => (
                            <Badge 
                              key={tag} 
                              variant="outline" 
                              className="text-xs px-1.5 py-0 h-5 bg-background"
                            >
                              {tag}
                            </Badge>
                          ))}
                        </div>
                        
                        {/* Group Members and Actions */}
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pt-3 border-t mt-1">
                          <div className="flex items-center gap-3">
                            <div className="flex -space-x-2">
                              <Avatar className="h-7 w-7 border-2 border-background">
                                {group.leader.avatar ? (
                                  <AvatarImage src={group.leader.avatar} alt={group.leader.name} />
                                ) : null}
                                <AvatarFallback className="text-xs">
                                  {group.leader.name.split(' ').map(n => n[0]).join('')}
                                </AvatarFallback>
                              </Avatar>
                              {group.members.slice(0, 3).map(member => (
                                <Avatar key={member.id} className="h-7 w-7 border-2 border-background">
                                  {member.avatar ? (
                                    <AvatarImage src={member.avatar} alt={member.name} />
                                  ) : null}
                                  <AvatarFallback className="text-xs">
                                    {member.name.split(' ').map(n => n[0]).join('')}
                                  </AvatarFallback>
                                </Avatar>
                              ))}
                              {group.memberCount > 4 && (
                                <div className="h-7 w-7 rounded-full bg-muted flex items-center justify-center text-xs font-medium border-2 border-background">
                                  +{group.memberCount - 4}
                                </div>
                              )}
                            </div>
                            <div className="text-xs">
                              <span className="font-medium">{group.leader.name}</span>
                              <span className="text-muted-foreground"> (Group Leader)</span>
                            </div>
                          </div>
                          
                          <div className="flex gap-2 self-end">
                            {group.isJoined && group.nextMeeting && new Date(group.nextMeeting) > new Date() && (
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="text-sm gap-1"
                                disabled={!group.meetingLink && group.meetingType !== 'in-person'}
                              >
                                {group.meetingType === 'online' || group.meetingType === 'hybrid' ? (
                                  <>
                                    <Video className="h-4 w-4" />
                                    Join Meeting
                                  </>
                                ) : (
                                  <>
                                    <MapPin className="h-4 w-4" />
                                    View Location
                                  </>
                                )}
                              </Button>
                            )}
                            
                            <Button 
                              variant={group.isJoined ? "outline" : "default"}
                              size="sm"
                              className="text-sm gap-1"
                              onClick={() => toggleJoinGroup(group.id)}
                              disabled={!group.isJoined && group.memberCount >= group.maxMembers}
                            >
                              {group.isJoined ? 'Leave Group' : 'Join Group'}
                            </Button>
                            
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <ChevronRight className="h-4 w-4" />
                            </Button>
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