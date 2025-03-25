'use client';

import { useState } from 'react';
import { 
  TrendingUp, 
  Star, 
  Calendar, 
  Users, 
  ExternalLink, 
  BarChart,
  Flame,
  Lightbulb
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';

interface TrendingTopic {
  id: string;
  title: string;
  description: string;
  category: 'technology' | 'design' | 'career' | 'development' | 'data';
  image?: string;
  tags: string[];
  source: string;
  publishedAt: string;
  author: {
    name: string;
    avatar?: string;
  };
  popularity: number; // 1-100
  url: string;
  isFeatured?: boolean;
  eventDate?: string; // For upcoming events
}

// Mock data for trending topics
const mockTrendingTopics: TrendingTopic[] = [
  {
    id: '1',
    title: 'The Rise of AI-Powered Development Tools',
    description: 'How artificial intelligence is transforming software development workflows and boosting productivity',
    category: 'technology',
    image: '/images/topics/ai-dev-tools.jpg',
    tags: ['AI', 'Software Development', 'Productivity'],
    source: 'Tech Insights',
    publishedAt: '2023-12-05',
    author: {
      name: 'Alex Rivera',
      avatar: '/images/avatars/alex.jpg',
    },
    popularity: 98,
    url: 'https://example.com/ai-dev-tools',
    isFeatured: true,
  },
  {
    id: '2',
    title: 'Web Development Trends to Watch in 2024',
    description: 'Upcoming technologies, frameworks, and practices that will dominate web development in the coming year',
    category: 'development',
    tags: ['Web Development', 'Trends', 'JavaScript'],
    source: 'Frontend Weekly',
    publishedAt: '2023-11-28',
    author: {
      name: 'Jessica Chen',
    },
    popularity: 92,
    url: 'https://example.com/web-dev-trends-2024',
  },
  {
    id: '3',
    title: 'Global Developer Conference 2024',
    description: 'Join thousands of developers for the biggest tech conference of the year with workshops, keynotes, and networking',
    category: 'career',
    image: '/images/topics/dev-conference.jpg',
    tags: ['Event', 'Conference', 'Networking'],
    source: 'Tech Events Global',
    publishedAt: '2023-12-01',
    author: {
      name: 'Event Team',
      avatar: '/images/avatars/event-team.jpg',
    },
    popularity: 95,
    url: 'https://example.com/dev-conference-2024',
    eventDate: '2024-03-15',
  },
  {
    id: '4',
    title: 'Mastering Design Systems for Scale',
    description: 'How leading companies are building and maintaining design systems that scale across products and teams',
    category: 'design',
    tags: ['Design Systems', 'UI/UX', 'Collaboration'],
    source: 'Design Matters',
    publishedAt: '2023-11-15',
    author: {
      name: 'Sofia Martinez',
    },
    popularity: 87,
    url: 'https://example.com/design-systems-scale',
  },
  {
    id: '5',
    title: 'The State of Data Science in 2023',
    description: 'A comprehensive review of the tools, methodologies, and career opportunities in data science',
    category: 'data',
    image: '/images/topics/data-science.jpg',
    tags: ['Data Science', 'Machine Learning', 'Analytics'],
    source: 'Data Insights',
    publishedAt: '2023-10-30',
    author: {
      name: 'Dr. Michael Lee',
      avatar: '/images/avatars/michael.jpg',
    },
    popularity: 90,
    url: 'https://example.com/state-of-data-science',
    isFeatured: true,
  },
  {
    id: '6',
    title: 'Cybersecurity Skills for Modern Developers',
    description: 'Essential security practices every developer should know to build safer applications',
    category: 'development',
    tags: ['Cybersecurity', 'Best Practices', 'DevSecOps'],
    source: 'Security First',
    publishedAt: '2023-11-20',
    author: {
      name: 'Jamie Williams',
    },
    popularity: 89,
    url: 'https://example.com/cybersecurity-dev-skills',
  },
];

export function TrendingTopics() {
  const [activeTab, setActiveTab] = useState('all');
  
  // Filter topics based on active tab
  const getFilteredTopics = () => {
    if (activeTab === 'all') return mockTrendingTopics;
    if (activeTab === 'featured') return mockTrendingTopics.filter(topic => topic.isFeatured);
    if (activeTab === 'events') return mockTrendingTopics.filter(topic => topic.eventDate);
    return mockTrendingTopics.filter(topic => topic.category === activeTab);
  };
  
  const filteredTopics = getFilteredTopics();
  
  // Get category badge color
  const getCategoryColor = (category: TrendingTopic['category']) => {
    switch (category) {
      case 'technology':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'design':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'career':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'development':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'data':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return '';
    }
  };
  
  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
  };
  
  // Get relative time (e.g., "2 weeks ago")
  const getRelativeTime = (dateString: string) => {
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
    } else if (diffDays < 30) {
      const weeks = Math.floor(diffDays / 7);
      return `${weeks} ${weeks === 1 ? 'week' : 'weeks'} ago`;
    } else {
      return formatDate(dateString);
    }
  };
  
  // Get popularity label
  const getPopularityLabel = (popularity: number) => {
    if (popularity >= 95) return 'Trending 🔥';
    if (popularity >= 90) return 'Very Popular';
    if (popularity >= 80) return 'Popular';
    return 'Rising';
  };

  return (
    <Card className="overflow-visible">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-primary" />
          Trending Topics
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4 w-full md:w-auto">
            <TabsTrigger value="all">All Topics</TabsTrigger>
            <TabsTrigger value="featured">Featured</TabsTrigger>
            <TabsTrigger value="technology">Technology</TabsTrigger>
            <TabsTrigger value="development">Development</TabsTrigger>
            <TabsTrigger value="design">Design</TabsTrigger>
            <TabsTrigger value="events">Events</TabsTrigger>
          </TabsList>
          
          <TabsContent value={activeTab} className="space-y-4">
            {filteredTopics.length === 0 ? (
              <div className="text-center p-8">
                <TrendingUp className="h-12 w-12 text-muted-foreground/40 mx-auto mb-3" />
                <h3 className="text-lg font-medium">No trending topics found</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Try selecting a different category
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {filteredTopics.map((topic, index) => (
                  <Card 
                    key={topic.id} 
                    className={cn(
                      "overflow-hidden hover:border-primary/20 transition-all",
                      topic.isFeatured && "border-amber-200"
                    )}
                  >
                    <div className="p-5">
                      <div className="flex flex-col md:flex-row gap-4">
                        {/* Image (optional) */}
                        {topic.image && (
                          <div className="md:w-48 h-32 relative bg-muted rounded-md overflow-hidden hidden md:block">
                            <div className="w-full h-full flex items-center justify-center">
                              <Lightbulb className="h-12 w-12 text-muted-foreground/40" />
                            </div>
                          </div>
                        )}
                        
                        <div className="flex-1 space-y-3">
                          <div className="flex items-start justify-between">
                            <div>
                              <div className="flex flex-wrap items-center gap-2 mb-2">
                                <Badge 
                                  variant="outline" 
                                  className={`text-xs ${getCategoryColor(topic.category)}`}
                                >
                                  {topic.category.charAt(0).toUpperCase() + topic.category.slice(1)}
                                </Badge>
                                
                                {topic.isFeatured && (
                                  <Badge variant="outline" className="text-xs border-amber-200 bg-amber-50 text-amber-800">
                                    Featured
                                  </Badge>
                                )}
                                
                                {topic.eventDate && (
                                  <Badge variant="secondary" className="text-xs">
                                    <Calendar className="h-3 w-3 mr-1" />
                                    {formatDate(topic.eventDate)}
                                  </Badge>
                                )}
                                
                                <div className="text-xs font-medium text-muted-foreground">
                                  {getRelativeTime(topic.publishedAt)}
                                </div>
                              </div>
                              
                              <h3 className="text-lg font-medium">{topic.title}</h3>
                              
                              <p className="text-sm text-muted-foreground mt-1">
                                {topic.description}
                              </p>
                            </div>
                            
                            <div className="hidden sm:flex items-center gap-1 text-sm font-medium text-amber-600">
                              <Flame className="h-4 w-4" />
                              <span>{getPopularityLabel(topic.popularity)}</span>
                            </div>
                          </div>
                          
                          <div className="flex flex-wrap gap-1 mt-3">
                            {topic.tags.map(tag => (
                              <Badge 
                                key={tag} 
                                variant="outline" 
                                className="text-xs px-1.5 py-0 h-5 bg-background"
                              >
                                {tag}
                              </Badge>
                            ))}
                          </div>
                          
                          <div className="flex flex-wrap justify-between items-center pt-3">
                            <div className="flex items-center gap-2">
                              <Avatar className="h-6 w-6">
                                {topic.author.avatar ? (
                                  <AvatarImage src={topic.author.avatar} alt={topic.author.name} />
                                ) : null}
                                <AvatarFallback className="text-[10px]">
                                  {topic.author.name.split(' ').map(n => n[0]).join('')}
                                </AvatarFallback>
                              </Avatar>
                              <div className="text-sm">{topic.author.name}</div>
                              <div className="text-xs text-muted-foreground">
                                via {topic.source}
                              </div>
                            </div>
                            
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="h-8 mt-2 sm:mt-0"
                              asChild
                            >
                              <a href={topic.url} target="_blank" rel="noopener noreferrer">
                                <ExternalLink className="mr-2 h-3.5 w-3.5" />
                                Read More
                              </a>
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