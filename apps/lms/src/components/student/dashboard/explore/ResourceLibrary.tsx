'use client';

import { useState } from 'react';
import { Library, FileText, Video, Download, ExternalLink, BookOpen, File, Search, Filter, ChevronDown } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
  DropdownMenuSeparator,
  DropdownMenuLabel
} from '@/components/ui/dropdown-menu';

interface Resource {
  id: string;
  title: string;
  description: string;
  type: 'pdf' | 'video' | 'article' | 'code' | 'template';
  source: string;
  url: string;
  tags: string[];
  dateAdded: string;
  isDownloadable: boolean;
  isFeatured?: boolean;
  viewCount: number;
  size?: string;
  relatedCourseId?: string;
  relatedCourseName?: string;
}

// Mock data for resources
const mockResources: Resource[] = [
  {
    id: '1',
    title: 'Complete Guide to CSS Grid Systems',
    description: 'Comprehensive PDF guide to mastering CSS Grid layouts for modern web design',
    type: 'pdf',
    source: 'Internal',
    url: '/resources/css-grid-guide.pdf',
    tags: ['CSS', 'Web Design', 'Layout'],
    dateAdded: '2023-11-15',
    isDownloadable: true,
    isFeatured: true,
    viewCount: 1245,
    size: '3.2 MB',
    relatedCourseId: 'course-3',
    relatedCourseName: 'Modern CSS Techniques',
  },
  {
    id: '2',
    title: 'TypeScript Best Practices in 2023',
    description: 'Video walkthrough on effective TypeScript patterns and practices for complex applications',
    type: 'video',
    source: 'YouTube',
    url: 'https://youtube.com/watch?v=ts-best-practices',
    tags: ['TypeScript', 'JavaScript', 'Best Practices'],
    dateAdded: '2023-12-02',
    isDownloadable: false,
    viewCount: 3478,
    relatedCourseId: 'course-5',
    relatedCourseName: 'Advanced TypeScript',
  },
  {
    id: '3',
    title: 'React Performance Optimization Cheatsheet',
    description: 'A downloadable cheatsheet with techniques for improving React application performance',
    type: 'pdf',
    source: 'Internal',
    url: '/resources/react-perf-cheatsheet.pdf',
    tags: ['React', 'Performance', 'JavaScript'],
    dateAdded: '2023-10-25',
    isDownloadable: true,
    isFeatured: true,
    viewCount: 2967,
    size: '1.5 MB',
    relatedCourseId: 'course-2',
    relatedCourseName: 'React Fundamentals',
  },
  {
    id: '4',
    title: 'Responsive Website Starter Template',
    description: 'Starter template with responsive layouts, optimized for modern web projects',
    type: 'template',
    source: 'Internal',
    url: '/resources/responsive-template.zip',
    tags: ['HTML', 'CSS', 'Responsive', 'Template'],
    dateAdded: '2023-09-18',
    isDownloadable: true,
    viewCount: 1876,
    size: '4.7 MB',
  },
  {
    id: '5',
    title: 'Understanding the JavaScript Event Loop',
    description: 'In-depth article explaining JavaScript\'s event loop and asynchronous behavior',
    type: 'article',
    source: 'MDN Web Docs',
    url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/EventLoop',
    tags: ['JavaScript', 'Event Loop', 'Asynchronous'],
    dateAdded: '2023-08-10',
    isDownloadable: false,
    viewCount: 4532,
    relatedCourseId: 'course-4',
    relatedCourseName: 'Advanced JavaScript',
  },
  {
    id: '6',
    title: 'Python Data Science Toolkit',
    description: 'Code repository with essential Python tools and notebooks for data science projects',
    type: 'code',
    source: 'GitHub',
    url: 'https://github.com/examples/python-data-science',
    tags: ['Python', 'Data Science', 'Jupyter', 'Code'],
    dateAdded: '2023-11-05',
    isDownloadable: true,
    viewCount: 2101,
    relatedCourseId: 'course-8',
    relatedCourseName: 'Data Science with Python',
  },
];

export function ResourceLibrary() {
  const [resources, setResources] = useState<Resource[]>(mockResources);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [selectedType, setSelectedType] = useState<string | null>(null);
  
  // Filter resources based on search, tab, and type
  const filterResources = () => {
    let filtered = mockResources;
    
    // Filter by search
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(resource => 
        resource.title.toLowerCase().includes(query) || 
        resource.description.toLowerCase().includes(query) ||
        resource.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }
    
    // Filter by tab
    if (activeTab === 'featured') {
      filtered = filtered.filter(resource => resource.isFeatured);
    } else if (activeTab === 'downloadable') {
      filtered = filtered.filter(resource => resource.isDownloadable);
    } else if (activeTab !== 'all') {
      filtered = filtered.filter(resource => resource.type === activeTab);
    }
    
    // Filter by selected type
    if (selectedType) {
      filtered = filtered.filter(resource => resource.type === selectedType);
    }
    
    return filtered;
  };
  
  // Apply filters
  const applyFilters = () => {
    setResources(filterResources());
  };
  
  // Handle search
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    applyFilters();
  };
  
  // Handle tab change
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    setSelectedType(null); // Reset type filter when changing tabs
    applyFilters();
  };
  
  // Handle type filter
  const handleTypeChange = (type: string | null) => {
    setSelectedType(type);
    applyFilters();
  };
  
  // Get icon for resource type
  const getResourceIcon = (type: Resource['type']) => {
    switch (type) {
      case 'pdf':
        return <FileText className="h-6 w-6 text-red-500" />;
      case 'video':
        return <Video className="h-6 w-6 text-purple-500" />;
      case 'article':
        return <BookOpen className="h-6 w-6 text-blue-500" />;
      case 'code':
        return <File className="h-6 w-6 text-green-500" />;
      case 'template':
        return <FileText className="h-6 w-6 text-amber-500" />;
      default:
        return <FileText className="h-6 w-6 text-gray-500" />;
    }
  };
  
  // Format resource type for display
  const formatResourceType = (type: Resource['type']) => {
    return type.charAt(0).toUpperCase() + type.slice(1);
  };

  return (
    <Card className="overflow-visible">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Library className="h-5 w-5 text-primary" />
          Resource Library
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Search and Filters */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search resources, topics, or tags..."
              className="pl-9"
              value={searchQuery}
              onChange={handleSearch}
            />
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex gap-1">
                <Filter className="h-4 w-4" />
                Filter
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>Resource Type</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuCheckboxItem
                checked={selectedType === 'pdf'}
                onCheckedChange={() => handleTypeChange(selectedType === 'pdf' ? null : 'pdf')}
              >
                PDF
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={selectedType === 'video'}
                onCheckedChange={() => handleTypeChange(selectedType === 'video' ? null : 'video')}
              >
                Video
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={selectedType === 'article'}
                onCheckedChange={() => handleTypeChange(selectedType === 'article' ? null : 'article')}
              >
                Article
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={selectedType === 'code'}
                onCheckedChange={() => handleTypeChange(selectedType === 'code' ? null : 'code')}
              >
                Code
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={selectedType === 'template'}
                onCheckedChange={() => handleTypeChange(selectedType === 'template' ? null : 'template')}
              >
                Template
              </DropdownMenuCheckboxItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => handleTypeChange(null)}>
                Clear Filters
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        
        {/* Resource Tabs */}
        <Tabs defaultValue="all" value={activeTab} onValueChange={handleTabChange}>
          <TabsList className="mb-4 w-full md:w-auto">
            <TabsTrigger value="all">All Resources</TabsTrigger>
            <TabsTrigger value="featured">Featured</TabsTrigger>
            <TabsTrigger value="downloadable">Downloadable</TabsTrigger>
            <TabsTrigger value="pdf">PDFs</TabsTrigger>
            <TabsTrigger value="video">Videos</TabsTrigger>
          </TabsList>
          
          <TabsContent value={activeTab} className="space-y-4">
            {resources.length === 0 ? (
              <div className="text-center p-8">
                <Library className="h-12 w-12 text-muted-foreground/40 mx-auto mb-3" />
                <h3 className="text-lg font-medium">No resources found</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Try adjusting your search or filters
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {resources.map(resource => (
                  <Card key={resource.id} className="overflow-hidden hover:border-primary/20 transition-all">
                    <div className="p-4">
                      <div className="flex gap-4">
                        {/* Resource Icon */}
                        <div className="hidden sm:flex h-12 w-12 shrink-0 items-center justify-center rounded-md border bg-muted/30">
                          {getResourceIcon(resource.type)}
                        </div>
                        
                        <div className="flex-1 space-y-1">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <h3 className="font-medium">{resource.title}</h3>
                              {resource.isFeatured && (
                                <Badge variant="outline" className="text-xs border-amber-200 bg-amber-50 text-amber-800">
                                  Featured
                                </Badge>
                              )}
                            </div>
                            
                            <div className="flex items-center gap-2">
                              <Badge variant="secondary" className="text-xs">
                                {formatResourceType(resource.type)}
                              </Badge>
                              <div className="text-xs text-muted-foreground">
                                {resource.viewCount.toLocaleString()} views
                              </div>
                            </div>
                          </div>
                          
                          <p className="text-sm text-muted-foreground">
                            {resource.description}
                          </p>
                          
                          <div className="pt-2 flex flex-wrap gap-1">
                            {resource.tags.map(tag => (
                              <Badge 
                                key={tag} 
                                variant="outline" 
                                className="text-xs px-1.5 py-0 h-5 bg-background"
                              >
                                {tag}
                              </Badge>
                            ))}
                          </div>
                          
                          <div className="pt-2 flex flex-wrap justify-between items-center">
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                              {resource.relatedCourseName && (
                                <div className="flex items-center gap-1">
                                  <BookOpen className="h-3.5 w-3.5" />
                                  <span>From: {resource.relatedCourseName}</span>
                                </div>
                              )}
                              
                              {resource.size && (
                                <div className="flex items-center gap-1">
                                  <FileText className="h-3.5 w-3.5" />
                                  <span>{resource.size}</span>
                                </div>
                              )}
                              
                              <div>Added: {resource.dateAdded}</div>
                            </div>
                            
                            <div className="flex gap-2 mt-2 sm:mt-0">
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="h-8"
                                asChild
                              >
                                <a href={resource.url} target="_blank" rel="noopener noreferrer">
                                  <ExternalLink className="mr-2 h-3.5 w-3.5" />
                                  View
                                </a>
                              </Button>
                              
                              {resource.isDownloadable && (
                                <Button 
                                  size="sm" 
                                  className="h-8"
                                  asChild
                                >
                                  <a href={resource.url} download>
                                    <Download className="mr-2 h-3.5 w-3.5" />
                                    Download
                                  </a>
                                </Button>
                              )}
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