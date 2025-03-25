import { CalendarClock, Clock, User, School, GraduationCap, FileText, Settings } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export interface Activity {
  id: string;
  event: string;
  time: string;
  user: string;
  type: 'user' | 'school' | 'course' | 'system' | 'content';
}

interface ActivityFeedProps {
  activities: Activity[];
  title?: string;
  limit?: number;
}

export function ActivityFeed({ activities, title = 'Recent Activity', limit = 5 }: ActivityFeedProps) {
  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'user':
        return <User className="h-4 w-4 text-blue-500" />;
      case 'school':
        return <School className="h-4 w-4 text-purple-500" />;
      case 'course':
        return <GraduationCap className="h-4 w-4 text-green-500" />;
      case 'content':
        return <FileText className="h-4 w-4 text-amber-500" />;
      case 'system':
        return <Settings className="h-4 w-4 text-gray-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const displayActivities = activities.slice(0, limit);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        {displayActivities.length === 0 ? (
          <div className="p-6 text-center border border-dashed rounded-md">
            <CalendarClock className="h-10 w-10 mx-auto mb-2 text-muted-foreground/50" />
            <p className="text-muted-foreground">No recent activity</p>
          </div>
        ) : (
          <div className="space-y-4">
            {displayActivities.map((activity) => (
              <div key={activity.id} className="flex items-start gap-3">
                <div className="flex-shrink-0 mt-1">
                  {getActivityIcon(activity.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">{activity.event}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-muted-foreground">{activity.user}</span>
                    <div className="w-1 h-1 rounded-full bg-muted-foreground/30"></div>
                    <span className="text-xs text-muted-foreground">{activity.time}</span>
                  </div>
                </div>
              </div>
            ))}
            
            {activities.length > limit && (
              <div className="text-center pt-3 border-t">
                <button className="text-sm text-primary hover:underline">
                  View all activity
                </button>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
} 