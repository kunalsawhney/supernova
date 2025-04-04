'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { 
  BookText, 
  FileEdit, 
  ListChecks, 
  Clock, 
  AlertCircle, 
  Plus, 
  BookOpen,
  RefreshCcw
} from 'lucide-react';
import { adminService } from '@/services/adminService';
import { ContentStatsViewModel } from '@/types/content';
import { useRouter } from 'next/navigation';
interface RecentContentItem {
  id: number;
  action: string;
  item: string;
  time: string;
}

export default function ContentManagementPage() {
  const router = useRouter();

  const [contentStats, setContentStats] = useState<ContentStatsViewModel>({
    totalCourses: 0,
    publishedCourses: 0,
    draftCourses: 0,
    averageRating: 0,
  });
  
  const [recentContent, setRecentContent] = useState<RecentContentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchContentStats();
  }, []);

  const fetchContentStats = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch real stats from the API
      const stats = await adminService.getContentStats();
      
      // Update state with the returned data
      setContentStats(stats);
      
      // Mock recent content activity for now
      // In a real app, this would come from an API endpoint
      setRecentContent([
        { id: 1, action: 'Course updated', item: 'Mathematics 101', time: '2 hours ago' },
        { id: 2, action: 'Module added', item: 'Introduction to Biology', time: '5 hours ago' },
        { id: 3, action: 'Lesson published', item: 'Chemical Equations', time: '1 day ago' },
        { id: 4, action: 'Content review', item: 'Physics Fundamentals', time: '2 days ago' },
      ]);
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch content stats';
      setError(errorMessage);
      console.error('Error fetching content stats:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-80 space-y-4">
        <RefreshCcw className="h-8 w-8 animate-spin text-primary" />
        <p className="text-muted-foreground">Loading content dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 dark:bg-red-900/20 dark:border-red-800/30 p-4 flex items-center gap-3 text-red-800 dark:text-red-300">
        <AlertCircle className="h-5 w-5" />
        <div>{error}</div>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={fetchContentStats}
          className="ml-auto border-red-300 dark:border-red-800/30 text-red-800 dark:text-red-300 hover:bg-red-100 dark:hover:bg-red-900/30"
        >
          <RefreshCcw className="h-4 w-4 mr-2" />
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="heading-lg mb-1">Content Management</h2>
          <p className="text-muted-foreground">
            Create, manage, and organize educational content
          </p>
        </div>
      </div>
      
      {/* Content Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-md font-medium">Courses</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center">
              <div className="text-3xl font-bold">{contentStats.totalCourses}</div>
              <BookText className="h-8 w-8 text-primary opacity-80" />
            </div>
            <div className="mt-2 text-sm text-muted-foreground">
              <span className="text-green-600 font-medium">{contentStats.publishedCourses} published</span>
              {' • '}
              <span className="text-yellow-600 font-medium">{contentStats.draftCourses} draft</span>
            </div>
          </CardContent>
          <CardFooter className="pt-0">
            <Link href="/dashboard/admin/content/courses">
              <Button variant="ghost" size="sm">View All Courses</Button>
            </Link>
          </CardFooter>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-md font-medium">Average Rating</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center">
              <div className="text-3xl font-bold">{contentStats.averageRating}</div>
              <FileEdit className="h-8 w-8 text-primary opacity-80" />
            </div>
            <div className="mt-2 text-sm text-muted-foreground">
              <span>Across {contentStats.totalCourses} courses</span>
            </div>
          </CardContent>
          <CardFooter className="pt-0">
            <Link href="/dashboard/admin/content/courses">
              <Button variant="ghost" size="sm">View All Courses</Button>
            </Link>
          </CardFooter>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common content management tasks</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link href="/dashboard/admin/content/courses/create" className="w-full">
              <Button variant="outline" className="w-full justify-start gap-2">
                <Plus className="h-4 w-4" />
                Create New Course
              </Button>
            </Link>
            <Link href="/dashboard/admin/content/courses" className="w-full">
              <Button variant="outline" className="w-full justify-start gap-2">
                <BookOpen className="h-4 w-4" />
                View Courses
              </Button>
            </Link>
            <Link href="/dashboard/admin/content/modules" className="w-full">
              <Button variant="outline" className="w-full justify-start gap-2">
                <FileEdit className="h-4 w-4" />
                Manage Modules
              </Button>
            </Link>
            <Link href="/dashboard/admin/content/lessons" className="w-full">
              <Button variant="outline" className="w-full justify-start gap-2">
                <BookOpen className="h-4 w-4" />
                Browse Lessons
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
      
      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>Latest content changes and updates</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentContent.map((item) => (
              <div key={item.id} className="flex items-start gap-3 border-b pb-3 last:border-none">
                <div className="bg-primary/10 p-2 rounded-full">
                  <Clock className="h-4 w-4 text-primary" />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between">
                    <span className="font-medium">{item.action}</span>
                    <span className="text-sm text-muted-foreground">{item.time}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">{item.item}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      
    </div>
  );
} 