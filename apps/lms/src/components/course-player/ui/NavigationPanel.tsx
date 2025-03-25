import React from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ChevronDown, ChevronRight, PlayCircle, FileText, HelpCircle, Layers, BookOpen, CheckCircle, Clock } from 'lucide-react';

import { useCoursePlayer } from '@/contexts/CoursePlayerContext';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';

// Module interface
interface Module {
  id: string;
  title: string;
  lessons: Lesson[];
}

// Lesson interface
interface Lesson {
  id: string;
  title: string;
  type: 'video' | 'reading' | 'quiz' | 'project' | 'discussion';
  duration?: string;
}

// Course interface
interface Course {
  id: string;
  title: string;
  modules: Module[];
}

interface NavigationPanelProps {
  course: Course;
  currentLessonId: string;
  onLessonSelect: (lessonId: string) => void;
}

export function NavigationPanel({
  course,
  currentLessonId,
  onLessonSelect
}: NavigationPanelProps) {
  const router = useRouter();
  const { lessonProgress } = useCoursePlayer();
  
  // Find current module
  const currentModule = course.modules.find(module => 
    module.lessons.some(lesson => lesson.id === currentLessonId)
  );
  
  // Calculate course progress
  const calculateCourseProgress = () => {
    let completedLessons = 0;
    let totalLessons = 0;
    
    course.modules.forEach(module => {
      module.lessons.forEach(lesson => {
        totalLessons++;
        if (lessonProgress[lesson.id]?.completed) {
          completedLessons++;
        }
      });
    });
    
    return Math.round((completedLessons / totalLessons) * 100);
  };
  
  // Calculate module progress
  const calculateModuleProgress = (moduleId: string) => {
    const module = course.modules.find(m => m.id === moduleId);
    if (!module) return 0;
    
    let completedLessons = 0;
    module.lessons.forEach(lesson => {
      if (lessonProgress[lesson.id]?.completed) {
        completedLessons++;
      }
    });
    
    return Math.round((completedLessons / module.lessons.length) * 100);
  };
  
  // Get icon based on lesson type
  const getLessonIcon = (type: string) => {
    switch (type) {
      case 'video':
        return <PlayCircle className="h-4 w-4 text-blue-500" />;
      case 'reading':
        return <BookOpen className="h-4 w-4 text-amber-500" />;
      case 'quiz':
        return <FileText className="h-4 w-4 text-purple-500" />;
      case 'project':
        return <Layers className="h-4 w-4 text-green-500" />;
      case 'discussion':
        return <HelpCircle className="h-4 w-4 text-rose-500" />;
      default:
        return <PlayCircle className="h-4 w-4" />;
    }
  };
  
  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b">
        <h2 className="text-lg font-semibold mb-1">{course.title}</h2>
        <div className="mb-2">
          <div className="flex justify-between text-sm mb-1">
            <span className="text-muted-foreground">Course Progress</span>
            <span className="font-medium">{calculateCourseProgress()}%</span>
          </div>
          <Progress value={calculateCourseProgress()} className="h-1.5" />
        </div>
        <div className="flex gap-2 mt-3">
          <Button
            variant="outline"
            size="sm"
            className="flex-1"
            onClick={() => router.push(`/dashboard/student/courses/${course.id}`)}
          >
            Course Overview
          </Button>
        </div>
      </div>
      
      <ScrollArea className="flex-1">
        <div className="p-2">
          {course.modules.map(module => (
            <Collapsible
              key={module.id}
              defaultOpen={module.id === currentModule?.id}
              className="mb-2"
            >
              <CollapsibleTrigger asChild>
                <Button
                  variant="ghost"
                  className="w-full justify-start mb-1 font-medium"
                >
                  <div className="flex items-center w-full">
                    <ChevronRight className="h-4 w-4 mr-1 transition-transform duration-200 group-data-[state=open]:rotate-90" />
                    <span className="flex-1 text-left">{module.title}</span>
                    <Badge
                      variant="outline"
                      className="ml-2 text-xs font-normal"
                    >
                      {calculateModuleProgress(module.id)}%
                    </Badge>
                  </div>
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <div className="pl-6 pr-2 space-y-1">
                  {module.lessons.map(lesson => {
                    const isActive = lesson.id === currentLessonId;
                    const isCompleted = lessonProgress[lesson.id]?.completed;
                    const progress = lessonProgress[lesson.id]?.progress || 0;
                    
                    return (
                      <motion.div
                        key={lesson.id}
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <button
                          onClick={() => onLessonSelect(lesson.id)}
                          className={cn(
                            "w-full flex items-start gap-3 px-3 py-2 text-sm rounded-md transition-colors text-left",
                            isActive 
                              ? "bg-primary/10 text-primary" 
                              : "hover:bg-muted/80"
                          )}
                        >
                          <div className="mt-0.5">
                            {isCompleted ? (
                              <CheckCircle className="h-4 w-4 text-green-500" />
                            ) : (
                              getLessonIcon(lesson.type)
                            )}
                          </div>
                          <div className="flex-1">
                            <div>{lesson.title}</div>
                            <div className="flex items-center mt-1">
                              {!isCompleted && progress > 0 && (
                                <div className="mr-2 flex-1">
                                  <Progress value={progress} className="h-1" />
                                </div>
                              )}
                              {lesson.duration && (
                                <div className="text-xs text-muted-foreground flex items-center">
                                  <Clock className="h-3 w-3 mr-1" />
                                  {lesson.duration}
                                </div>
                              )}
                            </div>
                          </div>
                        </button>
                      </motion.div>
                    );
                  })}
                </div>
              </CollapsibleContent>
            </Collapsible>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
} 