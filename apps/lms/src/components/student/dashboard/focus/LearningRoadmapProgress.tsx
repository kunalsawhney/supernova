'use client';

import { useState } from 'react';
import { Map, CheckCircle, Circle, ChevronRight, ArrowRight, Star } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

interface RoadmapItem {
  id: string;
  title: string;
  description: string;
  status: 'completed' | 'in_progress' | 'locked' | 'next';
  type: 'lesson' | 'quiz' | 'assignment' | 'milestone';
  date?: string;
  skills?: string[];
}

// Mock data for roadmap items
const mockRoadmapItems: RoadmapItem[] = [
  {
    id: '1',
    title: 'Introduction to Web Development',
    description: 'Overview of web technologies and basic concepts',
    status: 'completed',
    type: 'lesson',
    date: '2 weeks ago',
    skills: ['HTML', 'CSS', 'JavaScript'],
  },
  {
    id: '2',
    title: 'HTML Fundamentals Quiz',
    description: 'Test your knowledge of HTML basics',
    status: 'completed',
    type: 'quiz',
    date: '10 days ago',
  },
  {
    id: '3',
    title: 'CSS Layout Systems',
    description: 'Learn about different layout techniques in CSS',
    status: 'completed',
    type: 'lesson',
    date: '1 week ago',
    skills: ['CSS Grid', 'Flexbox'],
  },
  {
    id: '4',
    title: 'Responsive Design Project',
    description: 'Build a responsive website from scratch',
    status: 'in_progress',
    type: 'assignment',
    date: 'Started 3 days ago',
    skills: ['Responsive Design', 'Media Queries'],
  },
  {
    id: '5',
    title: 'Frontend Developer: Level 1',
    description: 'Achievement milestone for completing HTML & CSS modules',
    status: 'next',
    type: 'milestone',
    skills: ['HTML', 'CSS', 'Responsive Design'],
  },
  {
    id: '6',
    title: 'JavaScript Basics',
    description: 'Introduction to programming with JavaScript',
    status: 'locked',
    type: 'lesson',
    skills: ['JavaScript', 'Programming Logic'],
  },
  {
    id: '7',
    title: 'DOM Manipulation',
    description: 'Learn to interact with the Document Object Model',
    status: 'locked',
    type: 'lesson',
    skills: ['DOM', 'JavaScript'],
  },
];

export function LearningRoadmapProgress() {
  const [roadmapItems, setRoadmapItems] = useState<RoadmapItem[]>(mockRoadmapItems);
  const [expandedView, setExpandedView] = useState(false);
  
  // Filter items based on expanded view
  const displayedItems = expandedView 
    ? roadmapItems 
    : roadmapItems.filter(item => item.status === 'completed' || item.status === 'in_progress' || item.status === 'next');
  
  // Get status icon
  const getStatusIcon = (status: RoadmapItem['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-success" />;
      case 'in_progress':
        return <Circle className="h-5 w-5 text-primary fill-primary/20" />;
      case 'next':
        return <Circle className="h-5 w-5 text-amber-500 fill-amber-100" />;
      case 'locked':
        return <Circle className="h-5 w-5 text-muted-foreground/40" />;
    }
  };
  
  // Get type icon
  const getTypeIcon = (type: RoadmapItem['type']) => {
    switch (type) {
      case 'lesson':
        return null;
      case 'quiz':
        return <Badge variant="secondary" className="ml-2">Quiz</Badge>;
      case 'assignment':
        return <Badge variant="default" className="ml-2">Assignment</Badge>;
      case 'milestone':
        return <Badge variant="outline" className="ml-2 border-amber-200 bg-amber-50 text-amber-800">Milestone</Badge>;
    }
  };
  
  // Get the roadmap item class
  const getItemClass = (status: RoadmapItem['status']) => {
    switch (status) {
      case 'completed':
        return 'border-success/20 bg-success/5';
      case 'in_progress':
        return 'border-primary/20 bg-primary/5';
      case 'next':
        return 'border-amber-200 bg-amber-50/50';
      default:
        return 'border-muted bg-card opacity-60';
    }
  };

  return (
    <Card className="overflow-visible">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Map className="h-5 w-5 text-primary" />
          Learning Roadmap
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative pl-6 border-l-2 border-dashed border-muted space-y-6">
          {displayedItems.map((item, index) => (
            <div key={item.id} className="relative">
              {/* Status circle */}
              <div className="absolute -left-[30px] top-1">
                {getStatusIcon(item.status)}
              </div>
              
              {/* Content */}
              <div 
                className={cn(
                  "p-4 rounded-lg border transition-all",
                  getItemClass(item.status)
                )}
              >
                <div className="flex justify-between">
                  <div className="flex items-center">
                    <h3 className="font-medium">{item.title}</h3>
                    {getTypeIcon(item.type)}
                  </div>
                  
                  {item.type === 'milestone' && (
                    <Star className="h-5 w-5 text-amber-500 fill-amber-500" />
                  )}
                </div>
                
                <p className="text-sm text-muted-foreground mt-1">
                  {item.description}
                </p>
                
                {item.date && (
                  <div className="text-xs text-muted-foreground mt-2">
                    {item.date}
                  </div>
                )}
                
                {item.skills && (
                  <div className="flex flex-wrap gap-1 mt-3">
                    {item.skills.map(skill => (
                      <Badge 
                        key={skill} 
                        variant="outline" 
                        className="text-xs px-1.5 py-0 h-5 bg-background/80"
                      >
                        {skill}
                      </Badge>
                    ))}
                  </div>
                )}
                
                {(item.status === 'in_progress' || item.status === 'next') && (
                  <Button 
                    className="mt-3 w-full sm:w-auto" 
                    size="sm"
                  >
                    {item.status === 'in_progress' ? 'Continue' : 'Start'} 
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
          ))}
          
          {!expandedView && roadmapItems.length > displayedItems.length && (
            <div className="relative">
              <div className="absolute -left-[30px] top-1">
                <Circle className="h-5 w-5 text-muted-foreground/40" />
              </div>
              <div className="p-4 rounded-lg border border-dashed border-muted">
                <Button 
                  variant="ghost" 
                  className="w-full text-muted-foreground"
                  onClick={() => setExpandedView(true)}
                >
                  Show {roadmapItems.length - displayedItems.length} more items
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
          
          {expandedView && (
            <div className="text-center pt-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setExpandedView(false)}
              >
                Show less
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
} 