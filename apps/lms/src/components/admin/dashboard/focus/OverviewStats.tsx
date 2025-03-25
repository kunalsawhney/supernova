import { DollarSign, School, Users, BookOpen } from "lucide-react";
import { useState } from "react";
import { MetricCard } from "@/components/admin/dashboard/common/MetricCard";

const mockPlatformStats = {
    totalUsers: 2450,
    activeUsers: '1683',
    inactiveUsers: '767',
    userTrend: 12,
    totalSchools: 32,
    schoolTrend: 5,
    totalCourses: 5,
    courseTrend: 10,
    completionRate: 75,
    totalRevenue: '$125,400',
    revenueTrend: 8,
  };

export function OverviewStats() {
    const [stats, setStats] = useState(mockPlatformStats);

  return (
    <>
        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <MetricCard
            title="Active Users"
            value={stats.activeUsers}
            trend={stats.userTrend}     
            icon={<Users className="h-5 w-5" />}
            description="Last 7 days"
            />
            
            <MetricCard
            title="Schools"
            value={stats.totalSchools.toString()}
            trend={stats.schoolTrend}
            icon={<School className="h-5 w-5" />}
            description="Total active"
            />
                        
            <MetricCard
            title="Courses"
            value={stats.totalCourses.toString()}
            trend={stats.courseTrend}
            icon={<BookOpen className="h-5 w-5" />}
            description="Total active"
            />
            
            <MetricCard
            title="Revenue"
            value={stats.totalRevenue}
            trend={stats.revenueTrend}
            icon={<DollarSign className="h-5 w-5" />}
            description="Month to date"
            />
        </div>
    </>

  );
}