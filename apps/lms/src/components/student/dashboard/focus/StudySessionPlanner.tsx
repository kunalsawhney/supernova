'use client';

import { useState } from 'react';
import { Clock, Plus, Calendar, Play, Pause, RotateCcw } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';

interface StudySession {
  id: string;
  title: string;
  startTime: string;
  duration: number; // in minutes
  course: string;
  completed: boolean;
}

// Mock data for study sessions
const mockStudySessions: StudySession[] = [
  {
    id: '1',
    title: 'Advanced JavaScript Concepts',
    startTime: '09:30',
    duration: 45,
    course: 'Full-Stack Web Development',
    completed: true,
  },
  {
    id: '2',
    title: 'React Component Lifecycle',
    startTime: '11:00',
    duration: 60,
    course: 'React Fundamentals',
    completed: false,
  },
  {
    id: '3',
    title: 'Data Structures: Trees',
    startTime: '14:30',
    duration: 75,
    course: 'Computer Science Fundamentals',
    completed: false,
  },
];

export function StudySessionPlanner() {
  const [sessions, setSessions] = useState<StudySession[]>(mockStudySessions);
  const [pomodoroActive, setPomodoroActive] = useState(false);
  const [pomodoroMinutes, setPomodoroMinutes] = useState(25);
  const [pomodoroSeconds, setPomodoroSeconds] = useState(0);
  const [pomodoroIntervalId, setPomodoroIntervalId] = useState<NodeJS.Timeout | null>(null);
  const { toast } = useToast();

  // Format time for display
  const formatTime = (mins: number, secs: number) => {
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Start pomodoro timer
  const startPomodoroTimer = () => {
    // Clear any existing interval
    if (pomodoroIntervalId) {
      clearInterval(pomodoroIntervalId);
    }
    
    setPomodoroActive(true);
    const id = setInterval(() => {
      setPomodoroSeconds(prev => {
        if (prev === 0) {
          setPomodoroMinutes(prevMin => {
            if (prevMin === 0) {
              // Timer completed
              clearInterval(id);
              setPomodoroActive(false);
              toast({
                title: "Pomodoro timer completed!",
                description: "Take a short break before your next session",
                variant: "default",
              });
              setPomodoroMinutes(25); // Reset for next pomodoro
              return 25;
            }
            return prevMin - 1;
          });
          return 59;
        }
        return prev - 1;
      });
    }, 1000);
    
    setPomodoroIntervalId(id);
  };

  // Pause pomodoro timer
  const pausePomodoroTimer = () => {
    if (pomodoroIntervalId) {
      clearInterval(pomodoroIntervalId);
      setPomodoroIntervalId(null);
    }
    setPomodoroActive(false);
  };

  // Reset pomodoro timer
  const resetPomodoroTimer = () => {
    if (pomodoroIntervalId) {
      clearInterval(pomodoroIntervalId);
      setPomodoroIntervalId(null);
    }
    setPomodoroActive(false);
    setPomodoroMinutes(25);
    setPomodoroSeconds(0);
  };

  // Toggle session completion
  const toggleSessionCompletion = (id: string) => {
    setSessions(prev => 
      prev.map(session => 
        session.id === id 
          ? {...session, completed: !session.completed} 
          : session
      )
    );
  };

  // Calculate percentage of time elapsed in the pomodoro timer
  const pomodoroProgress = 100 - (((pomodoroMinutes * 60) + pomodoroSeconds) / (25 * 60) * 100);

  return (
    <Card className="overflow-visible">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5 text-primary" />
          Study Session Planner
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Pomodoro Timer */}
        <div className="bg-muted/30 rounded-lg p-4">
          <h3 className="text-lg font-medium mb-3">Focus Timer</h3>
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-center md:text-left">
              <div className="text-3xl font-bold">
                {formatTime(pomodoroMinutes, pomodoroSeconds)}
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                Pomodoro Technique: 25 min focus, 5 min break
              </p>
            </div>
            
            <Progress 
              value={pomodoroProgress} 
              className="h-2 w-full md:w-1/3" 
            />
            
            <div className="flex gap-2 mt-2 md:mt-0">
              {!pomodoroActive ? (
                <Button size="sm" onClick={startPomodoroTimer}>
                  <Play className="mr-1 h-4 w-4" /> Start
                </Button>
              ) : (
                <Button size="sm" variant="secondary" onClick={pausePomodoroTimer}>
                  <Pause className="mr-1 h-4 w-4" /> Pause
                </Button>
              )}
              <Button size="sm" variant="outline" onClick={resetPomodoroTimer}>
                <RotateCcw className="mr-1 h-4 w-4" /> Reset
              </Button>
            </div>
          </div>
        </div>
        
        {/* Today's Study Schedule */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium">Today's Schedule</h3>
            <Button size="sm" variant="outline" className="h-8 gap-1">
              <Plus className="h-4 w-4" /> Add Session
            </Button>
          </div>
          
          <div className="space-y-3">
            {sessions.map(session => (
              <div 
                key={session.id} 
                className={`p-3 rounded-lg border ${
                  session.completed ? 'bg-muted/30 border-muted' : 'bg-card'
                }`}
              >
                <div className="flex justify-between items-start">
                  <div className="flex gap-3">
                    <div className="text-center">
                      <div className="text-sm font-medium">{session.startTime}</div>
                      <div className="text-xs text-muted-foreground">{session.duration} min</div>
                    </div>
                    <div>
                      <h4 className={`font-medium ${session.completed ? 'line-through text-muted-foreground' : ''}`}>
                        {session.title}
                      </h4>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {session.course}
                      </p>
                    </div>
                  </div>
                  <Button 
                    size="sm" 
                    variant={session.completed ? "outline" : "default"}
                    className="h-8"
                    onClick={() => toggleSessionCompletion(session.id)}
                  >
                    {session.completed ? 'Completed' : 'Start'}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Week View Button */}
        <Button variant="outline" className="w-full gap-1">
          <Calendar className="h-4 w-4" /> View Weekly Schedule
        </Button>
      </CardContent>
    </Card>
  );
} 