'use client';

import { Card, CardContent } from "@/components/ui/card";
import { BookOpen, CheckCircle, Clock, BarChart } from 'lucide-react';

// Mock data
const learningStats = {
    coursesEnrolled: 3,
    completedCourses: 1,
    averageScore: '92%',
    totalHours: 45,
};

export function LearningStats() {
  return (
    <div>
        {/* Learning Stats - Simple stats for focus mode */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <BookOpen className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Enrolled Courses</p>
                    <h3 className="text-2xl font-bold mt-1">{learningStats.coursesEnrolled}</h3>
                    <p className="text-sm text-primary">Active courses</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-full bg-success/10 flex items-center justify-center">
                    <CheckCircle className="h-6 w-6 text-success" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Completed</p>
                    <h3 className="text-2xl font-bold mt-1">{learningStats.completedCourses}</h3>
                    <p className="text-sm text-success">Finished courses</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-full bg-secondary/10 flex items-center justify-center">
                    <BarChart className="h-6 w-6 text-secondary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Average Score</p>
                    <h3 className="text-2xl font-bold mt-1">{learningStats.averageScore}</h3>
                    <p className="text-sm text-secondary">Keep it up!</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-full bg-accent/10 flex items-center justify-center">
                    <Clock className="h-6 w-6 text-accent" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Learning Hours</p>
                    <h3 className="text-2xl font-bold mt-1">{learningStats.totalHours}h</h3>
                    <p className="text-sm text-accent">Total time spent</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
    </div>
  );
}