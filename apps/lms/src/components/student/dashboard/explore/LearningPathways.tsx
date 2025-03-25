'use client';

import { useState } from 'react';
import { Map, ChevronRight, ArrowRight, Award, Check, Code, BookOpen, Layers, PenTool, Lightbulb, MoveRight } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface LearningPath {
  id: string;
  title: string;
  description: string;
  courses: number;
  estimatedTime: string;
  level: 'beginner' | 'intermediate' | 'advanced' | 'all-levels';
  category: 'career' | 'skill';
  icon: keyof typeof pathIcons;
  enrolled?: boolean;
  progress?: number;
  popularity: number; // 1-100
  tags: string[];
}

const pathIcons = {
  code: Code,
  book: BookOpen,
  layers: Layers,
  pen: PenTool,
  award: Award,
  lightbulb: Lightbulb,
};

// Mock data for learning paths
const mockLearningPaths: LearningPath[] = [
  {
    id: '1',
    title: 'Full-Stack Web Developer',
    description: 'Master the skills needed to build modern web applications from front to back',
    courses: 12,
    estimatedTime: '6 months',
    level: 'all-levels',
    category: 'career',
    icon: 'code',
    enrolled: true,
    progress: 35,
    popularity: 95,
    tags: ['HTML', 'CSS', 'JavaScript', 'React', 'Node.js', 'MongoDB'],
  },
  {
    id: '2',
    title: 'UX/UI Design Professional',
    description: 'Learn to create beautiful, functional user interfaces and experiences',
    courses: 8,
    estimatedTime: '4 months',
    level: 'beginner',
    category: 'career',
    icon: 'pen',
    popularity: 87,
    tags: ['Design', 'Figma', 'User Research', 'Prototyping'],
  },
  {
    id: '3',
    title: 'Data Science Specialist',
    description: 'Analyze and interpret complex data to drive business decisions',
    courses: 15,
    estimatedTime: '8 months',
    level: 'intermediate',
    category: 'career',
    icon: 'layers',
    popularity: 92,
    tags: ['Python', 'R', 'Statistics', 'Machine Learning', 'Visualization'],
  },
  {
    id: '4',
    title: 'JavaScript Mastery',
    description: 'Deep dive into JavaScript from basics to advanced concepts',
    courses: 6,
    estimatedTime: '3 months',
    level: 'all-levels',
    category: 'skill',
    icon: 'code',
    enrolled: true,
    progress: 65,
    popularity: 90,
    tags: ['ES6+', 'Async', 'DOM', 'Testing', 'Performance'],
  },
  {
    id: '5',
    title: 'Responsive Web Design',
    description: 'Create websites that work beautifully on any device',
    courses: 4,
    estimatedTime: '6 weeks',
    level: 'beginner',
    category: 'skill',
    icon: 'pen',
    popularity: 85,
    tags: ['CSS Grid', 'Flexbox', 'Media Queries', 'Mobile First'],
  },
  {
    id: '6',
    title: 'Cloud Architecture',
    description: 'Design and implement scalable solutions in the cloud',
    courses: 9,
    estimatedTime: '5 months',
    level: 'advanced',
    category: 'career',
    icon: 'layers',
    popularity: 88,
    tags: ['AWS', 'Azure', 'GCP', 'DevOps', 'Security'],
  },
];

export function LearningPathways() {
  const [activePaths, setActivePaths] = useState<LearningPath[]>(mockLearningPaths);
  const [activeTab, setActiveTab] = useState('all');
  
  // Filter paths based on active tab
  const filterPaths = (tab: string) => {
    if (tab === 'all') return mockLearningPaths;
    if (tab === 'enrolled') return mockLearningPaths.filter(path => path.enrolled);
    if (tab === 'career') return mockLearningPaths.filter(path => path.category === 'career');
    if (tab === 'skill') return mockLearningPaths.filter(path => path.category === 'skill');
    return mockLearningPaths;
  };
  
  // Handle tab change
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    setActivePaths(filterPaths(value));
  };
  
  // Get level badge colors
  const getLevelBadgeColor = (level: LearningPath['level']) => {
    switch (level) {
      case 'beginner':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'intermediate':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'advanced':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'all-levels':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      default:
        return '';
    }
  };
  
  // Format level for display
  const formatLevel = (level: string) => {
    if (level === 'all-levels') return 'All Levels';
    return level.charAt(0).toUpperCase() + level.slice(1);
  };
  
  // Get icon component for path
  const getPathIcon = (iconName: keyof typeof pathIcons) => {
    const IconComponent = pathIcons[iconName];
    return <IconComponent className="h-5 w-5" />;
  };

  return (
    <Card className="overflow-visible">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Map className="h-5 w-5 text-primary" />
          Learning Pathways
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <Tabs defaultValue="all" value={activeTab} onValueChange={handleTabChange}>
          <TabsList className="mb-4">
            <TabsTrigger value="all">All Pathways</TabsTrigger>
            <TabsTrigger value="enrolled">My Pathways</TabsTrigger>
            <TabsTrigger value="career">Career Paths</TabsTrigger>
            <TabsTrigger value="skill">Skill Paths</TabsTrigger>
          </TabsList>
          
          <TabsContent value={activeTab} className="space-y-4">
            {activePaths.length === 0 ? (
              <div className="text-center p-8">
                <Map className="h-12 w-12 text-muted-foreground/40 mx-auto mb-3" />
                <h3 className="text-lg font-medium">No pathways found</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  {activeTab === 'enrolled' ? 'Join a learning path to see it here' : 'Try a different category'}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {activePaths.map(path => (
                  <Card key={path.id} className="overflow-hidden border-2 hover:border-primary/20 transition-all">
                    <div className="p-5">
                      <div className="flex items-start gap-4">
                        {/* Icon */}
                        <div className={`h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0`}>
                          {getPathIcon(path.icon)}
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          {/* Header Info */}
                          <div className="flex flex-wrap items-center gap-2">
                            <Badge 
                              variant="outline" 
                              className={`text-xs ${getLevelBadgeColor(path.level)}`}
                            >
                              {formatLevel(path.level)}
                            </Badge>
                            
                            <Badge 
                              variant="outline" 
                              className="text-xs bg-background border-muted-foreground/30"
                            >
                              {path.category === 'career' ? 'Career Path' : 'Skill Path'}
                            </Badge>
                            
                            {path.enrolled && (
                              <Badge className="text-xs bg-primary">
                                Enrolled
                              </Badge>
                            )}
                          </div>
                          
                          {/* Title */}
                          <h3 className="text-lg font-medium mt-1.5">{path.title}</h3>
                          
                          {/* Description */}
                          <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                            {path.description}
                          </p>
                          
                          {/* Path Stats */}
                          <div className="flex items-center gap-x-4 gap-y-1 flex-wrap mt-3 text-sm">
                            <div className="flex items-center gap-1.5">
                              <BookOpen className="h-4 w-4 text-muted-foreground" />
                              <span>{path.courses} courses</span>
                            </div>
                            
                            <div className="flex items-center gap-1.5">
                              <Layers className="h-4 w-4 text-muted-foreground" />
                              <span>{path.estimatedTime}</span>
                            </div>
                            
                            <div className="flex items-center gap-1.5">
                              <Award className="h-4 w-4 text-amber-500" />
                              <span>Certificate</span>
                            </div>
                          </div>
                          
                          {/* Progress Bar - show only for enrolled paths */}
                          {path.enrolled && path.progress !== undefined && (
                            <div className="mt-3">
                              <div className="flex justify-between text-xs mb-1">
                                <span className="text-muted-foreground">Progress</span>
                                <span className="font-medium">{path.progress}%</span>
                              </div>
                              <Progress value={path.progress} className="h-1.5" />
                            </div>
                          )}
                          
                          {/* Skills Tags */}
                          <div className="flex flex-wrap gap-1.5 mt-3">
                            {path.tags.slice(0, 3).map(tag => (
                              <Badge 
                                key={tag} 
                                variant="outline" 
                                className="text-xs px-1.5 py-0 h-5 bg-background"
                              >
                                {tag}
                              </Badge>
                            ))}
                            {path.tags.length > 3 && (
                              <Badge 
                                variant="outline" 
                                className="text-xs px-1.5 py-0 h-5 bg-background"
                              >
                                +{path.tags.length - 3} more
                              </Badge>
                            )}
                          </div>
                          
                          {/* Action Button */}
                          <div className="mt-4">
                            {path.enrolled ? (
                              <Button className="w-full">
                                Continue Path
                                <MoveRight className="ml-2 h-4 w-4" />
                              </Button>
                            ) : (
                              <Button variant="outline" className="w-full">
                                View Path Details
                                <ChevronRight className="ml-2 h-4 w-4" />
                              </Button>
                            )}
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