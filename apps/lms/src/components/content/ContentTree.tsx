'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FiChevronRight, FiChevronDown, FiSearch, FiX, FiBook, FiLayers } from 'react-icons/fi';
import { ModuleData } from './ModuleCard';
import { LessonData } from './LessonCard';

interface CourseStructure {
  id: string;
  title: string;
  code: string;
  status: string;
  modules: ModuleData[];
}

interface ContentTreeProps {
  courseStructure: CourseStructure;
  selectedModuleId?: string;
  selectedLessonId?: string;
  onSelectModule: (moduleId: string) => void;
  onSelectLesson: (moduleId: string, lessonId: string) => void;
  className?: string;
}

export function ContentTree({
  courseStructure,
  selectedModuleId,
  selectedLessonId,
  onSelectModule,
  onSelectLesson,
  className = '',
}: ContentTreeProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedModules, setExpandedModules] = useState<string[]>([]);

  // Handle toggle module expand/collapse
  const toggleModule = (moduleId: string) => {
    setExpandedModules(prev => 
      prev.includes(moduleId)
        ? prev.filter(id => id !== moduleId)
        : [...prev, moduleId]
    );
  };

  // Filter modules and lessons based on search query
  const filteredModules = courseStructure.modules.filter(module => {
    const moduleMatches = module.title.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Also check if any lessons match
    const lessonMatches = module.lessons?.some(lesson => 
      lesson.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
    
    return moduleMatches || lessonMatches;
  });

  return (
    <Card className={`p-4 ${className}`}>
      <div className="mb-4">
        <div className="flex items-center gap-2 mb-4">
          <FiBook className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-medium">
            {courseStructure.title}
          </h3>
          <Badge variant={courseStructure.status === 'published' ? 'default' : 'outline'} className="capitalize">
            {courseStructure.status}
          </Badge>
        </div>
        
        {/* Search filter */}
        <div className="relative">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search modules and lessons..."
            className="pl-9 pr-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-1 top-1/2 -translate-y-1/2 h-6 w-6"
              onClick={() => setSearchQuery('')}
            >
              <FiX className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
      
      <div className="h-[400px] pr-4 overflow-y-auto">
        <div className="space-y-2">
          {filteredModules.length === 0 ? (
            <div className="text-center py-4 text-muted-foreground">
              No modules found matching "{searchQuery}"
            </div>
          ) : (
            filteredModules.map(module => {
              // Filter lessons within module based on search
              const filteredLessons = searchQuery 
                ? module.lessons?.filter(lesson => 
                    lesson.title.toLowerCase().includes(searchQuery.toLowerCase())
                  )
                : module.lessons;
              
              // Skip if no matching lessons and module doesn't match
              if (searchQuery && !module.title.toLowerCase().includes(searchQuery.toLowerCase()) && !filteredLessons?.length) {
                return null;
              }

              const isModuleExpanded = expandedModules.includes(module.id || '') || 
                                       selectedModuleId === module.id || 
                                       (searchQuery && filteredLessons?.length);

              return (
                <div key={module.id} className="rounded-md overflow-hidden">
                  {/* Module item */}
                  <div 
                    className={`flex items-center justify-between px-3 py-2 cursor-pointer hover:bg-muted ${
                      selectedModuleId === module.id ? 'bg-primary/10 text-primary font-medium' : ''
                    }`}
                    onClick={() => {
                      if (module.id) {
                        onSelectModule(module.id);
                        if (!expandedModules.includes(module.id)) {
                          toggleModule(module.id);
                        }
                      }
                    }}
                  >
                    <div className="flex items-center gap-2 flex-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (module.id) toggleModule(module.id);
                        }}
                      >
                        {isModuleExpanded ? (
                          <FiChevronDown className="h-4 w-4" />
                        ) : (
                          <FiChevronRight className="h-4 w-4" />
                        )}
                      </Button>
                      <div className="flex items-center gap-2 truncate">
                        <FiLayers className="h-4 w-4 flex-shrink-0" />
                        <span className="truncate">{module.title}</span>
                      </div>
                    </div>
                    <Badge variant="outline" className="ml-2 text-xs">
                      {filteredLessons?.length || 0}
                    </Badge>
                  </div>
                  
                  {/* Expanded lessons */}
                  {isModuleExpanded && filteredLessons && filteredLessons.length > 0 && (
                    <div className="ml-8 pl-2 border-l space-y-1 py-1">
                      {filteredLessons.map(lesson => (
                        <div 
                          key={lesson.id} 
                          className={`px-3 py-1.5 rounded-sm cursor-pointer flex items-center ${
                            selectedLessonId === lesson.id 
                              ? 'bg-primary/10 text-primary font-medium' 
                              : 'hover:bg-muted'
                          }`}
                          onClick={() => lesson.id && module.id && onSelectLesson(module.id, lesson.id)}
                        >
                          {getContentTypeIcon(lesson.content_type)}
                          <span className="ml-2 truncate">{lesson.title}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </Card>
  );
}

function getContentTypeIcon(contentType: string) {
  switch (contentType) {
    case 'video':
      return <FiBook className="h-3.5 w-3.5 text-blue-500" />;
    case 'text':
      return <FiBook className="h-3.5 w-3.5 text-green-500" />;
    case 'quiz':
      return <FiBook className="h-3.5 w-3.5 text-amber-500" />;
    case 'assignment':
      return <FiBook className="h-3.5 w-3.5 text-purple-500" />;
    default:
      return <FiBook className="h-3.5 w-3.5 text-gray-500" />;
  }
} 