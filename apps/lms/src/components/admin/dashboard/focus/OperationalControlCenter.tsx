import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MetricCard } from '../common/MetricCard';
import { TaskList, Task } from '../common/TaskList';
import { ActivityFeed, Activity } from '../common/ActivityFeed';
import { RefreshCcw, Users, School, DollarSign, Activity as ActivityIcon } from 'lucide-react';

// Mock data
const mockTasks: Task[] = [
  { 
    id: '1', 
    title: 'Review new course submissions', 
    description: '5 courses pending review from instructors', 
    dueDate: 'Today', 
    priority: 'high' 
  },
  { 
    id: '2', 
    title: 'Approve teacher accounts', 
    description: '12 new teacher registrations awaiting approval', 
    dueDate: 'Tomorrow', 
    priority: 'medium' 
  },
  { 
    id: '3', 
    title: 'School license renewals', 
    description: '3 schools have licenses expiring this week', 
    dueDate: 'In 3 days', 
    priority: 'medium' 
  },
  { 
    id: '4', 
    title: 'System maintenance', 
    description: 'Scheduled database optimization', 
    dueDate: 'Next week', 
    priority: 'low' 
  },
];

const mockActivities: Activity[] = [
  { id: '1', event: 'New school registered', time: '2 hours ago', user: 'Westside Academy', type: 'school' },
  { id: '2', event: 'New course published', time: '5 hours ago', user: 'Advanced Chemistry', type: 'course' },
  { id: '3', event: 'User profile updated', time: '1 day ago', user: 'James Wilson', type: 'user' },
  { id: '4', event: 'School subscription renewed', time: '2 days ago', user: 'Lincoln High', type: 'school' },
  { id: '5', event: 'System backup completed', time: '3 days ago', user: 'Automated Task', type: 'system' },
];

export function OperationalControlCenter() {
  const [isLoading, setIsLoading] = useState(false);
  const [tasks, setTasks] = useState<Task[]>(mockTasks);
  const [activities, setActivities] = useState<Activity[]>(mockActivities);
  
  const handleRefresh = () => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  };
  
  const handleTaskComplete = (taskId: string) => {
    // In a real app, this would call an API to update the task status
    console.log(`Task ${taskId} marked as completed`);
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Operational Overview</h2>
        <Button 
          onClick={handleRefresh} 
          variant="outline" 
          size="sm"
          className="flex items-center gap-2"
          disabled={isLoading}
        >
          <RefreshCcw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          {isLoading ? 'Refreshing...' : 'Refresh'}
        </Button>
      </div>
      
      
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Tasks requiring attention */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Action Required</CardTitle>
          </CardHeader>
          <CardContent>
            <TaskList tasks={tasks} onComplete={handleTaskComplete} />
          </CardContent>
        </Card>
        
        {/* Recent Activity */}
        <ActivityFeed activities={activities} />
      </div>
    </div>
  );
} 