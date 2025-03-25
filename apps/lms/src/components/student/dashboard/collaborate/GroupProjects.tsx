'use client';

import { useState } from 'react';
import { Users, Calendar, Clock, ArrowRight, CheckCircle2, CircleDashed, FolderKanban, FileText, MessageSquare, Plus, Filter } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface TeamMember {
  id: string;
  name: string;
  avatar?: string;
  role: string;
}

interface GroupProject {
  id: string;
  title: string;
  description: string;
  course: string;
  courseId: string;
  deadline: string;
  status: 'not-started' | 'in-progress' | 'review' | 'completed';
  progress: number;
  teamMembers: TeamMember[];
  tasks: {
    total: number;
    completed: number;
  };
  discussions: number;
  files: number;
  tags: string[];
  lastActivity: string;
}

// Mock data for group projects
const mockProjects: GroupProject[] = [
  {
    id: '1',
    title: 'E-Commerce Platform UI Design',
    description: 'Collaborate to create a complete UI design for an e-commerce platform with responsive layouts.',
    course: 'UI/UX Design Fundamentals',
    courseId: 'course-6',
    deadline: '2023-12-20T23:59:59',
    status: 'in-progress',
    progress: 65,
    teamMembers: [
      {
        id: 'user-1',
        name: 'Alex Johnson',
        avatar: '/images/avatars/alex.jpg',
        role: 'UI Designer'
      },
      {
        id: 'user-2',
        name: 'Maria Garcia',
        avatar: '/images/avatars/maria.jpg',
        role: 'UX Researcher'
      },
      {
        id: 'user-3',
        name: 'David Kumar',
        avatar: '/images/avatars/david.jpg',
        role: 'Project Manager'
      },
      {
        id: 'user-4',
        name: 'Emma Wilson',
        role: 'UI Designer'
      }
    ],
    tasks: {
      total: 24,
      completed: 16
    },
    discussions: 8,
    files: 12,
    tags: ['UI Design', 'E-commerce', 'Team Project'],
    lastActivity: '2023-12-06T14:30:00'
  },
  {
    id: '2',
    title: 'Full-Stack MERN Application',
    description: 'Build a complete MERN stack application with authentication, database integration, and responsive frontend.',
    course: 'Full-Stack Web Development',
    courseId: 'course-1',
    deadline: '2023-12-15T23:59:59',
    status: 'in-progress',
    progress: 42,
    teamMembers: [
      {
        id: 'user-5',
        name: 'James Smith',
        avatar: '/images/avatars/james.jpg',
        role: 'Backend Developer'
      },
      {
        id: 'user-6',
        name: 'Sophia Chen',
        role: 'Frontend Developer'
      },
      {
        id: 'user-1',
        name: 'Alex Johnson',
        avatar: '/images/avatars/alex.jpg',
        role: 'Database Engineer'
      }
    ],
    tasks: {
      total: 32,
      completed: 14
    },
    discussions: 12,
    files: 8,
    tags: ['MERN Stack', 'JavaScript', 'React', 'Node.js'],
    lastActivity: '2023-12-06T09:15:00'
  },
  {
    id: '3',
    title: 'Mobile App Wireframing',
    description: 'Create detailed wireframes for a fitness tracking mobile application with social features.',
    course: 'Mobile App Design',
    courseId: 'course-7',
    deadline: '2023-12-10T23:59:59',
    status: 'review',
    progress: 90,
    teamMembers: [
      {
        id: 'user-4',
        name: 'Emma Wilson',
        role: 'UI Designer'
      },
      {
        id: 'user-7',
        name: 'Carlos Rodriguez',
        avatar: '/images/avatars/carlos.jpg',
        role: 'UX Designer'
      },
      {
        id: 'user-8',
        name: 'Priya Patel',
        avatar: '/images/avatars/priya.jpg',
        role: 'Product Manager'
      }
    ],
    tasks: {
      total: 18,
      completed: 16
    },
    discussions: 6,
    files: 15,
    tags: ['Wireframing', 'Mobile App', 'Fitness', 'UI/UX'],
    lastActivity: '2023-12-05T16:40:00'
  },
  {
    id: '4',
    title: 'Database Schema Design',
    description: 'Design and implement a normalized database schema for a university management system.',
    course: 'Database Management',
    courseId: 'course-8',
    deadline: '2023-12-18T23:59:59',
    status: 'not-started',
    progress: 0,
    teamMembers: [
      {
        id: 'user-1',
        name: 'Alex Johnson',
        avatar: '/images/avatars/alex.jpg',
        role: 'Database Designer'
      },
      {
        id: 'user-9',
        name: 'Olivia Brown',
        role: 'Systems Analyst'
      }
    ],
    tasks: {
      total: 12,
      completed: 0
    },
    discussions: 2,
    files: 3,
    tags: ['Database', 'SQL', 'Schema Design'],
    lastActivity: '2023-12-04T11:20:00'
  },
  {
    id: '5',
    title: 'Machine Learning Model Implementation',
    description: 'Implement and train a machine learning model for sentiment analysis on customer reviews.',
    course: 'Machine Learning Fundamentals',
    courseId: 'course-9',
    deadline: '2023-12-28T23:59:59',
    status: 'in-progress',
    progress: 30,
    teamMembers: [
      {
        id: 'user-10',
        name: 'Michael Zhang',
        avatar: '/images/avatars/michael.jpg',
        role: 'ML Engineer'
      },
      {
        id: 'user-11',
        name: 'Sarah Johnson',
        avatar: '/images/avatars/sarah.jpg',
        role: 'Data Scientist'
      },
      {
        id: 'user-12',
        name: 'Raj Patel',
        role: 'Data Analyst'
      }
    ],
    tasks: {
      total: 28,
      completed: 9
    },
    discussions: 15,
    files: 10,
    tags: ['Machine Learning', 'Python', 'Sentiment Analysis', 'NLP'],
    lastActivity: '2023-12-06T13:10:00'
  }
];

export function GroupProjects() {
  const [projects, setProjects] = useState<GroupProject[]>(mockProjects);
  const [activeTab, setActiveTab] = useState('all');
  const [sortBy, setSortBy] = useState('deadline');
  
  // Filter projects based on status
  const filteredProjects = projects.filter(project => {
    if (activeTab === 'all') return true;
    if (activeTab === 'in-progress') return project.status === 'in-progress';
    if (activeTab === 'review') return project.status === 'review';
    if (activeTab === 'completed') return project.status === 'completed';
    if (activeTab === 'not-started') return project.status === 'not-started';
    return true;
  });
  
  // Sort projects
  const sortedProjects = [...filteredProjects].sort((a, b) => {
    if (sortBy === 'deadline') {
      return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
    }
    if (sortBy === 'progress') {
      return b.progress - a.progress;
    }
    if (sortBy === 'activity') {
      return new Date(b.lastActivity).getTime() - new Date(a.lastActivity).getTime();
    }
    return 0;
  });
  
  // Format deadline for display
  const formatDeadline = (deadline: string) => {
    const date = new Date(deadline);
    const now = new Date();
    const diffTime = Math.abs(date.getTime() - now.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      // Check if it's today but in the future
      if (date > now) {
        const hours = Math.floor((date.getTime() - now.getTime()) / (1000 * 60 * 60));
        if (hours === 0) {
          const minutes = Math.floor((date.getTime() - now.getTime()) / (1000 * 60));
          return `${minutes} minutes left`;
        }
        return `${hours} hours left`;
      }
      return 'Due Today';
    } else if (diffDays === 1) {
      return 'Due Tomorrow';
    } else if (diffDays <= 7) {
      return `${diffDays} days left`;
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
  };

  // Get status badge
  const getStatusBadge = (status: GroupProject['status']) => {
    switch (status) {
      case 'not-started':
        return <Badge variant="outline" className="bg-slate-50 text-slate-800 border-slate-200">Not Started</Badge>;
      case 'in-progress':
        return <Badge variant="outline" className="bg-blue-50 text-blue-800 border-blue-200">In Progress</Badge>;
      case 'review':
        return <Badge variant="outline" className="bg-amber-50 text-amber-800 border-amber-200">Under Review</Badge>;
      case 'completed':
        return <Badge variant="outline" className="bg-green-50 text-green-800 border-green-200">Completed</Badge>;
      default:
        return null;
    }
  };
  
  // Format date for last activity
  const formatActivity = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      const hours = Math.floor(diffTime / (1000 * 60 * 60));
      if (hours === 0) {
        const minutes = Math.floor(diffTime / (1000 * 60));
        return `${minutes}m ago`;
      }
      return `${hours}h ago`;
    } else if (diffDays === 1) {
      return 'Yesterday';
    } else {
      return `${diffDays}d ago`;
    }
  };

  return (
    <Card className="overflow-visible">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5 text-primary" />
          Group Projects
        </CardTitle>
        <Button size="sm" className="gap-1">
          <Plus className="h-4 w-4" />
          Join Project
        </Button>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Filter Controls */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="in-progress">In Progress</TabsTrigger>
              <TabsTrigger value="review">Under Review</TabsTrigger>
              <TabsTrigger value="not-started">Not Started</TabsTrigger>
              <TabsTrigger value="completed">Completed</TabsTrigger>
            </TabsList>
          </Tabs>
          
          <div className="flex gap-2 items-center">
            <span className="text-sm text-muted-foreground whitespace-nowrap">Sort by:</span>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="deadline">Deadline (Soonest)</SelectItem>
                <SelectItem value="progress">Progress (Highest)</SelectItem>
                <SelectItem value="activity">Recent Activity</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        {/* Project List */}
        {sortedProjects.length === 0 ? (
          <div className="text-center p-8">
            <Users className="h-12 w-12 text-muted-foreground/40 mx-auto mb-3" />
            <h3 className="text-lg font-medium">No projects found</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Join a project or create a new one to get started
            </p>
            <Button variant="outline" className="mt-4 gap-2">
              <Plus className="h-4 w-4" />
              Browse Available Projects
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {sortedProjects.map(project => (
              <Card key={project.id} className="overflow-hidden hover:border-primary/20 transition-all">
                <div className="p-5">
                  <div className="flex flex-col gap-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex flex-wrap gap-2 mb-1.5">
                          {getStatusBadge(project.status)}
                          <div className="text-xs text-muted-foreground">
                            {project.course}
                          </div>
                        </div>
                        <h3 className="font-medium text-lg">{project.title}</h3>
                        <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                          {project.description}
                        </p>
                      </div>
                      <div className="flex flex-col items-end ml-2">
                        <div className="flex items-center gap-1 text-sm">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span className={`font-medium ${
                            new Date(project.deadline) < new Date() ? 'text-red-500' : ''
                          }`}>
                            {formatDeadline(project.deadline)}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex gap-1 flex-wrap">
                      {project.tags.map(tag => (
                        <Badge 
                          key={tag} 
                          variant="outline" 
                          className="text-xs px-1.5 py-0 h-5 bg-background"
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    
                    <div className="flex flex-col gap-2">
                      <div className="flex justify-between items-center">
                        <div className="text-sm font-medium">
                          Progress: {project.progress}%
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {project.tasks.completed}/{project.tasks.total} tasks completed
                        </div>
                      </div>
                      <Progress value={project.progress} className="h-2" />
                    </div>
                    
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pt-3 border-t">
                      <div className="flex items-center gap-4 min-w-0">
                        <div className="flex -space-x-2">
                          {project.teamMembers.slice(0, 4).map((member, i) => (
                            <Avatar key={member.id} className="h-8 w-8 border-2 border-background">
                              {member.avatar ? (
                                <AvatarImage src={member.avatar} alt={member.name} />
                              ) : null}
                              <AvatarFallback className="text-xs">
                                {member.name.split(' ').map(n => n[0]).join('')}
                              </AvatarFallback>
                            </Avatar>
                          ))}
                          {project.teamMembers.length > 4 && (
                            <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center text-xs font-medium border-2 border-background">
                              +{project.teamMembers.length - 4}
                            </div>
                          )}
                        </div>
                        
                        <div className="flex gap-3 text-muted-foreground text-sm">
                          <div className="flex items-center gap-1">
                            <FolderKanban className="h-4 w-4" />
                            <span>{project.tasks.total}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <FileText className="h-4 w-4" />
                            <span>{project.files}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <MessageSquare className="h-4 w-4" />
                            <span>{project.discussions}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            <span>{formatActivity(project.lastActivity)}</span>
                          </div>
                        </div>
                      </div>
                      
                      <Button variant="outline" size="sm" className="gap-1 self-end">
                        {project.status === 'not-started' ? (
                          <>
                            <CircleDashed className="h-4 w-4" />
                            Start Work
                          </>
                        ) : (
                          <>
                            <ArrowRight className="h-4 w-4" />
                            Continue
                          </>
                        )}
                      </Button>
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