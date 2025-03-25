import Link from 'next/link';
import { cn } from '@/lib/utils';
import { ChevronRight } from 'lucide-react';

interface ActionCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  action: string;
  href: string;
  priority?: 'high' | 'medium' | 'low';
  className?: string;
}

export function ActionCard({
  title,
  description,
  icon,
  action,
  href,
  priority = 'medium',
  className,
}: ActionCardProps) {
  const priorityColors = {
    high: 'border-red-200 bg-red-50 dark:border-red-900 dark:bg-red-950/20',
    medium: 'border-blue-200 bg-blue-50 dark:border-blue-900 dark:bg-blue-950/20',
    low: 'border-green-200 bg-green-50 dark:border-green-900 dark:bg-green-950/20',
  };

  return (
    <Link href={href}>
      <div
        className={cn(
          'group rounded-lg border p-4 transition-all hover:shadow-md',
          priorityColors[priority],
          className
        )}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-start gap-3">
            <div className="mt-0.5">{icon}</div>
            <div className="flex-1 min-w-0">
              <h3 className="font-medium truncate">{title}</h3>
              <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                {description}
              </p>
            </div>
          </div>
          
          <div className="flex items-center justify-end mt-4 pt-2 border-t border-border/40">
            <span className="text-sm font-medium group-hover:text-primary transition-colors flex items-center gap-1">
              {action}
              <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
} 