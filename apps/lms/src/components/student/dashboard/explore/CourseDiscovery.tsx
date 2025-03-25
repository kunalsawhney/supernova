'use client';

import { useState } from 'react';
import { Search, BookOpen, Star, Filter, ChevronDown, Bookmark, PlayCircle } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
  DropdownMenuSeparator,
  DropdownMenuLabel
} from '@/components/ui/dropdown-menu';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

interface Course {
  id: string;
  title: string;
  instructor: string;
  rating: number;
  students: number;
  thumbnail?: string;
  tags: string[];
  duration: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  isFeatured?: boolean;
  isNew?: boolean;
}

// Mock data for courses
const mockCourses: Course[] = [
  {
    id: '1',
    title: 'Complete Web Development Bootcamp',
    instructor: 'Sarah Johnson',
    rating: 4.8,
    students: 15420,
    thumbnail: '/images/courses/web-dev.jpg',
    tags: ['Web Development', 'HTML', 'CSS', 'JavaScript'],
    duration: '42 hours',
    level: 'beginner',
    isFeatured: true,
  },
  {
    id: '2',
    title: 'Advanced React Patterns and Performance',
    instructor: 'Michael Chen',
    rating: 4.9,
    students: 8754,
    thumbnail: '/images/courses/react.jpg',
    tags: ['React', 'JavaScript', 'Frontend'],
    duration: '28 hours',
    level: 'advanced',
  },
  {
    id: '3',
    title: 'Data Structures & Algorithms in Python',
    instructor: 'Alex Rodriguez',
    rating: 4.7,
    students: 12089,
    thumbnail: '/images/courses/python.jpg',
    tags: ['Python', 'Algorithms', 'Computer Science'],
    duration: '36 hours',
    level: 'intermediate',
  },
  {
    id: '4',
    title: 'UI/UX Design Fundamentals',
    instructor: 'Emily Wong',
    rating: 4.6,
    students: 9632,
    thumbnail: '/images/courses/ui-ux.jpg',
    tags: ['Design', 'UI', 'UX', 'Figma'],
    duration: '24 hours',
    level: 'beginner',
    isNew: true,
  },
  {
    id: '5',
    title: 'Machine Learning from Zero to Hero',
    instructor: 'David Miller',
    rating: 4.9,
    students: 7421,
    thumbnail: '/images/courses/ml.jpg',
    tags: ['Machine Learning', 'Python', 'Data Science'],
    duration: '45 hours',
    level: 'advanced',
    isFeatured: true,
  },
  {
    id: '6',
    title: 'Full-Stack Mobile Development with React Native',
    instructor: 'Jessica White',
    rating: 4.7,
    students: 5632,
    thumbnail: '/images/courses/react-native.jpg',
    tags: ['React Native', 'Mobile', 'JavaScript'],
    duration: '32 hours',
    level: 'intermediate',
    isNew: true,
  },
];

export function CourseDiscovery() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('recommended');
  const [selectedLevel, setSelectedLevel] = useState<string | null>(null);
  const [filteredCourses, setFilteredCourses] = useState<Course[]>(mockCourses);
  
  // Filter courses based on search, tab, and level
  const filterCourses = () => {
    let filtered = mockCourses;
    
    // Filter by search
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(course => 
        course.title.toLowerCase().includes(query) || 
        course.instructor.toLowerCase().includes(query) ||
        course.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }
    
    // Filter by tab
    if (activeTab === 'recommended') {
      filtered = filtered.filter(course => course.isFeatured);
    } else if (activeTab === 'new') {
      filtered = filtered.filter(course => course.isNew);
    }
    
    // Filter by level
    if (selectedLevel) {
      filtered = filtered.filter(course => course.level === selectedLevel);
    }
    
    return filtered;
  };
  
  // Apply filters
  const applyFilters = () => {
    setFilteredCourses(filterCourses());
  };
  
  // Handle search
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    applyFilters();
  };
  
  // Handle tab change
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    applyFilters();
  };
  
  // Handle level filter
  const handleLevelChange = (level: string | null) => {
    setSelectedLevel(level);
    applyFilters();
  };
  
  // Get level badge color
  const getLevelBadgeColor = (level: Course['level']) => {
    switch (level) {
      case 'beginner':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'intermediate':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'advanced':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      default:
        return '';
    }
  };

  return (
    <Card className="overflow-visible">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BookOpen className="h-5 w-5 text-primary" />
          Course Discovery
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Search and Filters */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search courses, instructors, or topics..."
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
              <DropdownMenuLabel>Level</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuCheckboxItem
                checked={selectedLevel === 'beginner'}
                onCheckedChange={() => handleLevelChange(selectedLevel === 'beginner' ? null : 'beginner')}
              >
                Beginner
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={selectedLevel === 'intermediate'}
                onCheckedChange={() => handleLevelChange(selectedLevel === 'intermediate' ? null : 'intermediate')}
              >
                Intermediate
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={selectedLevel === 'advanced'}
                onCheckedChange={() => handleLevelChange(selectedLevel === 'advanced' ? null : 'advanced')}
              >
                Advanced
              </DropdownMenuCheckboxItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => handleLevelChange(null)}>
                Clear Filters
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        
        {/* Course Tabs */}
        <Tabs defaultValue="recommended" value={activeTab} onValueChange={handleTabChange}>
          <TabsList className="mb-4 w-full md:w-auto">
            <TabsTrigger value="recommended">Recommended</TabsTrigger>
            <TabsTrigger value="popular">Popular</TabsTrigger>
            <TabsTrigger value="new">New Courses</TabsTrigger>
            <TabsTrigger value="all">All Courses</TabsTrigger>
          </TabsList>
          
          <TabsContent value={activeTab} className="space-y-4">
            {filteredCourses.length === 0 ? (
              <div className="text-center p-8">
                <BookOpen className="h-12 w-12 text-muted-foreground/40 mx-auto mb-3" />
                <h3 className="text-lg font-medium">No courses found</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Try adjusting your search or filters
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredCourses.map(course => (
                  <Card key={course.id} className="overflow-hidden">
                    <div className="aspect-video relative bg-muted">
                      {/* Course thumbnail */}
                      {course.thumbnail ? (
                        <div className="w-full h-full">
                          <BookOpen className="h-12 w-12 text-muted-foreground/40 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
                        </div>
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <BookOpen className="h-12 w-12 text-muted-foreground/40" />
                        </div>
                      )}
                      
                      {/* Feature/New badge */}
                      {course.isFeatured && (
                        <Badge variant="secondary" className="absolute top-2 left-2">
                          Featured
                        </Badge>
                      )}
                      {course.isNew && (
                        <Badge className="absolute top-2 left-2 bg-green-600">
                          New
                        </Badge>
                      )}
                      
                      {/* Bookmark button */}
                      <Button 
                        size="icon" 
                        variant="ghost" 
                        className="absolute top-2 right-2 h-8 w-8 bg-background/80 backdrop-blur-sm hover:bg-background/90"
                      >
                        <Bookmark className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    <div className="p-4">
                      {/* Level badge */}
                      <Badge 
                        variant="outline" 
                        className={`mb-2 text-xs ${getLevelBadgeColor(course.level)}`}
                      >
                        {course.level.charAt(0).toUpperCase() + course.level.slice(1)}
                      </Badge>
                      
                      {/* Title and details */}
                      <h3 className="font-medium text-base leading-tight line-clamp-2 h-12">
                        {course.title}
                      </h3>
                      
                      <div className="flex items-center mt-2">
                        <Avatar className="h-5 w-5 mr-1">
                          <AvatarFallback className="text-[10px]">
                            {course.instructor.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <p className="text-xs text-muted-foreground">
                          {course.instructor}
                        </p>
                      </div>
                      
                      <div className="flex items-center justify-between mt-3">
                        <div className="flex items-center">
                          <div className="flex">
                            {[...Array(5)].map((_, i) => (
                              <Star 
                                key={i} 
                                className={`h-3.5 w-3.5 ${i < Math.floor(course.rating) ? 'text-amber-500 fill-amber-500' : 'text-muted stroke-muted'}`}
                              />
                            ))}
                          </div>
                          <span className="text-xs font-medium ml-1.5">{course.rating}</span>
                          <span className="text-xs text-muted-foreground ml-1">
                            ({course.students.toLocaleString()})
                          </span>
                        </div>
                        
                        <div className="text-xs text-muted-foreground">
                          {course.duration}
                        </div>
                      </div>
                      
                      <Button className="w-full mt-3 gap-1">
                        <PlayCircle className="h-4 w-4" />
                        Preview Course
                      </Button>
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