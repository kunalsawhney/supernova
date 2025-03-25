import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Clock, AlertCircle, ChevronRight } from 'lucide-react';

export interface Task {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  priority: 'high' | 'medium' | 'low';
  status?: 'pending' | 'completed';
}

interface TaskListProps {
  tasks: Task[];
  onComplete?: (taskId: string) => void;
}

export function TaskList({ tasks, onComplete }: TaskListProps) {
  const [completedTasks, setCompletedTasks] = useState<Set<string>>(new Set());
  
  const handleComplete = (taskId: string) => {
    const newCompleted = new Set(completedTasks);
    newCompleted.add(taskId);
    setCompletedTasks(newCompleted);
    
    if (onComplete) {
      onComplete(taskId);
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'text-red-600 bg-red-100 dark:bg-red-900/30 dark:text-red-400 border-red-200 dark:border-red-800/30';
      case 'medium':
        return 'text-amber-600 bg-amber-100 dark:bg-amber-900/30 dark:text-amber-400 border-amber-200 dark:border-amber-800/30';
      case 'low':
        return 'text-green-600 bg-green-100 dark:bg-green-900/30 dark:text-green-400 border-green-200 dark:border-green-800/30';
      default:
        return 'text-gray-600 bg-gray-100 dark:bg-gray-900/30 dark:text-gray-400 border-gray-200 dark:border-gray-800/30';
    }
  };

  if (tasks.length === 0) {
    return (
      <div className="p-8 text-center border rounded-lg border-dashed">
        <Clock className="h-10 w-10 mx-auto mb-2 text-muted-foreground/50" />
        <p className="text-muted-foreground">No pending tasks</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {tasks.map((task) => {
        const isCompleted = completedTasks.has(task.id) || task.status === 'completed';
        
        return (
          <div 
            key={task.id} 
            className={`p-4 rounded-lg border transition-all ${
              isCompleted 
                ? 'bg-muted/50 border-dashed' 
                : 'bg-card shadow-sm'
            }`}
          >
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 mt-1">
                {isCompleted ? (
                  <CheckCircle className="h-5 w-5 text-green-500" />
                ) : (
                  task.priority === 'high' ? (
                    <AlertCircle className="h-5 w-5 text-red-500" />
                  ) : (
                    <Clock className="h-5 w-5 text-amber-500" />
                  )
                )}
              </div>
              
              <div className="flex-1 min-w-0">
                <h4 className={`font-medium ${isCompleted ? 'text-muted-foreground line-through' : ''}`}>
                  {task.title}
                </h4>
                <p className={`text-sm ${isCompleted ? 'text-muted-foreground/70' : 'text-muted-foreground'}`}>
                  {task.description}
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <Badge variant="outline" className={getPriorityColor(task.priority)}>
                    {task.priority}
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    Due {task.dueDate}
                  </span>
                </div>
              </div>
              
              <div className="flex-shrink-0">
                {!isCompleted && (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => handleComplete(task.id)}
                    className="h-8 gap-1"
                  >
                    Complete
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
} 