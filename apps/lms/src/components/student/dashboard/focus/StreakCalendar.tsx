import { cn } from '@/lib/utils';
import { ActivityData } from '@/hooks/useLearningActivities';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface StreakCalendarProps {
  days: ActivityData[];
}

export function StreakCalendar({ days }: StreakCalendarProps) {
  const maxDaysToShow = 14; // Show only the last 14 days for compact view
  const daysToShow = days.slice(-maxDaysToShow);
  
  // Get day name
  const getDayName = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { weekday: 'short' });
  };
  
  // Format minutes as hours and minutes
  const formatMinutes = (minutes: number) => {
    if (minutes < 60) {
      return `${minutes} min`;
    }
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return remainingMinutes > 0 
      ? `${hours}h ${remainingMinutes}m` 
      : `${hours}h`;
  };

  return (
    <div className="flex gap-1 items-center">
      {daysToShow.map((day, index) => (
        <TooltipProvider key={day.date}>
          <Tooltip>
            <TooltipTrigger asChild>
              <div 
                className={cn(
                  "w-3 h-10 rounded-sm cursor-pointer transition-colors",
                  day.status === 'active' 
                    ? day.minutes > 60 
                      ? "bg-primary" 
                      : "bg-primary/70"
                    : "bg-muted",
                  index === daysToShow.length - 1 && "relative after:absolute after:w-full after:h-0.5 after:bg-primary after:-bottom-1 after:left-0"
                )}
              />
            </TooltipTrigger>
            <TooltipContent className="text-xs z-10">
              <div className="font-medium">{getDayName(day.date)}</div>
              <div>{day.date}</div>
              {day.status === 'active' ? (
                <div className="text-primary">{formatMinutes(day.minutes)} of learning</div>
              ) : (
                <div className="text-muted-foreground">No activity</div>
              )}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      ))}
    </div>
  );
} 