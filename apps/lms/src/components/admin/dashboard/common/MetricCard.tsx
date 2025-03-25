import { ArrowUpIcon, ArrowDownIcon } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface MetricCardProps {
  title: string;
  value: string;
  trend?: number;
  icon: React.ReactNode;
  description: string;
  statusColor?: string;
}

export function MetricCard({ title, value, trend, icon, description, statusColor }: MetricCardProps) {
  return (
    <Card className="overflow-hidden shadow-md bg-gradient-to-br from-card/50 to-card hover:shadow-lg transition-all duration-300">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold">{title}</CardTitle>
          <div className="p-2 rounded-full bg-primary/10 text-primary">
            {icon}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="mt-2">
          <p className="text-3xl font-bold">{value}</p>
          <div className="mt-3 flex items-center justify-between">
            <p className="text-sm text-muted-foreground">{description}</p>
            
            {trend !== undefined && (
              <Badge variant={trend >= 0 ? "outline" : "destructive"} className="flex items-center gap-1">
                {trend >= 0 ? (
                  <ArrowUpIcon className="h-3 w-3 text-emerald-600" />
                ) : (
                  <ArrowDownIcon className="h-3 w-3 text-red-600" />
                )}
                {Math.abs(trend)}%
              </Badge>
            )}
            
            {statusColor && (
              <div className="flex items-center gap-2">
                <div className={`h-2 w-2 rounded-full ${statusColor}`}></div>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 