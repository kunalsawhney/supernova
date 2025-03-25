'use client';

import { useState } from 'react';
import { AlertTriangle, Brain, RefreshCcw, ArrowRight, CheckCircle2 } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';

interface KnowledgeGap {
  id: string;
  concept: string;
  course: string;
  proficiency: number;
  priority: 'high' | 'medium' | 'low';
  exercises: {
    id: string;
    title: string;
    type: 'quiz' | 'practice' | 'review';
    completed: boolean;
  }[];
}

// Mock data for knowledge gaps
const mockKnowledgeGaps: KnowledgeGap[] = [
  {
    id: '1',
    concept: 'JavaScript Closures',
    course: 'Advanced JavaScript',
    proficiency: 35,
    priority: 'high',
    exercises: [
      {
        id: 'ex1',
        title: 'Closure Practice Problems',
        type: 'practice',
        completed: false,
      },
      {
        id: 'ex2',
        title: 'Understanding Lexical Environment',
        type: 'review',
        completed: false,
      },
    ],
  },
  {
    id: '2',
    concept: 'React Hooks',
    course: 'React Fundamentals',
    proficiency: 60,
    priority: 'medium',
    exercises: [
      {
        id: 'ex3',
        title: 'useEffect Cleanup Quiz',
        type: 'quiz',
        completed: true,
      },
      {
        id: 'ex4',
        title: 'Custom Hooks Implementation',
        type: 'practice',
        completed: false,
      },
    ],
  },
  {
    id: '3',
    concept: 'CSS Grid Layout',
    course: 'Modern CSS',
    proficiency: 45,
    priority: 'medium',
    exercises: [
      {
        id: 'ex5',
        title: 'Grid vs Flexbox Use Cases',
        type: 'quiz',
        completed: false,
      },
      {
        id: 'ex6',
        title: 'Responsive Grid Layout Practice',
        type: 'practice',
        completed: false,
      },
    ],
  },
];

export function KnowledgeGapIndicators() {
  const [knowledgeGaps, setKnowledgeGaps] = useState<KnowledgeGap[]>(mockKnowledgeGaps);
  const [activeTab, setActiveTab] = useState('all');
  
  // Toggle exercise completion
  const toggleExerciseCompletion = (gapId: string, exerciseId: string) => {
    setKnowledgeGaps(prev => 
      prev.map(gap => 
        gap.id === gapId
          ? {
              ...gap,
              exercises: gap.exercises.map(ex => 
                ex.id === exerciseId
                  ? { ...ex, completed: !ex.completed }
                  : ex
              )
            }
          : gap
      )
    );
  };

  // Filter gaps based on active tab
  const filteredGaps = knowledgeGaps.filter(gap => {
    if (activeTab === 'all') return true;
    return gap.priority === activeTab;
  });

  // Get color for proficiency
  const getProficiencyColor = (proficiency: number) => {
    if (proficiency < 40) return 'text-destructive';
    if (proficiency < 70) return 'text-amber-500';
    return 'text-success';
  };

  // Get the progress indicator style
  const getProgressStyle = (proficiency: number) => {
    if (proficiency < 40) return 'bg-destructive';
    if (proficiency < 70) return 'bg-amber-500';
    return 'bg-success';
  };

  return (
    <Card className="overflow-visible">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="h-5 w-5 text-primary" />
          Knowledge Gap Indicators
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="all">All Gaps</TabsTrigger>
            <TabsTrigger value="high">High Priority</TabsTrigger>
            <TabsTrigger value="medium">Medium Priority</TabsTrigger>
            <TabsTrigger value="low">Low Priority</TabsTrigger>
          </TabsList>
          
          <TabsContent value={activeTab} className="space-y-4">
            {filteredGaps.length === 0 ? (
              <div className="text-center p-6">
                <CheckCircle2 className="h-12 w-12 text-muted-foreground/50 mx-auto mb-2" />
                <h3 className="text-lg font-medium">No knowledge gaps found</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Great job! Keep learning to maintain your progress.
                </p>
              </div>
            ) : (
              filteredGaps.map(gap => (
                <div key={gap.id} className="border rounded-lg">
                  <div className="p-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-medium">{gap.concept}</h3>
                          <Badge 
                            variant={
                              gap.priority === 'high' ? 'destructive' : 
                              gap.priority === 'medium' ? 'default' : 
                              'outline'
                            }
                            className="text-xs"
                          >
                            {gap.priority} priority
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mt-0.5">
                          From course: {gap.course}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium">Proficiency</div>
                        <div className={`text-lg font-bold ${getProficiencyColor(gap.proficiency)}`}>
                          {gap.proficiency}%
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-3">
                      <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                        <div 
                          className={cn(
                            "h-full rounded-full", 
                            getProgressStyle(gap.proficiency)
                          )}
                          style={{ width: `${gap.proficiency}%` }}
                        />
                      </div>
                    </div>
                    
                    <div className="mt-4">
                      <h4 className="text-sm font-medium mb-2">Recommended exercises</h4>
                      <div className="space-y-2">
                        {gap.exercises.map(exercise => (
                          <div 
                            key={exercise.id} 
                            className={`p-3 rounded-md bg-muted/30 flex items-center justify-between ${
                              exercise.completed ? 'bg-muted/50 border-muted' : ''
                            }`}
                          >
                            <div className="flex items-center gap-2">
                              {exercise.type === 'quiz' ? (
                                <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">
                                  <span className="text-xs font-bold">Q</span>
                                </div>
                              ) : exercise.type === 'practice' ? (
                                <div className="w-8 h-8 rounded-full bg-green-100 text-green-600 flex items-center justify-center">
                                  <span className="text-xs font-bold">P</span>
                                </div>
                              ) : (
                                <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center">
                                  <RefreshCcw className="h-4 w-4" />
                                </div>
                              )}
                              <div>
                                <p className={`text-sm font-medium ${exercise.completed ? 'text-muted-foreground line-through' : ''}`}>
                                  {exercise.title}
                                </p>
                                <p className="text-xs text-muted-foreground capitalize">
                                  {exercise.type} Exercise
                                </p>
                              </div>
                            </div>
                            <Button 
                              size="sm" 
                              variant={exercise.completed ? "outline" : "default"}
                              className="h-8"
                              onClick={() => toggleExerciseCompletion(gap.id, exercise.id)}
                            >
                              {exercise.completed ? 'Completed' : 'Start'}
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
} 