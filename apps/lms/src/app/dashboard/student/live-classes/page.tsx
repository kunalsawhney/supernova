'use client';

import { useState } from 'react';
import Breadcrumbs from '@/components/Breadcrumbs';
import {
  Calendar,
  Clock,
  User,
  Video,
  BookOpen,
  Filter,
  Plus,
  CheckCircle,
  MessageCircle,
  Search,
  ChevronRight,
  Star,
  MoreHorizontal,
  ArrowRight
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { 
  Sheet, 
  SheetClose, 
  SheetContent, 
  SheetDescription, 
  SheetFooter, 
  SheetHeader, 
  SheetTitle, 
  SheetTrigger 
} from '@/components/ui/sheet';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

// Mock data for upcoming live classes
const upcomingLiveClasses = [
  {
    id: 1,
    title: 'JavaScript Advanced Concepts',
    instructor: 'John Smith',
    subject: 'Programming',
    time: '10:00 AM',
    date: 'Tomorrow',
    duration: '1 hour',
    status: 'confirmed',
    meetingLink: 'https://meet.zoom.us/j/123456789',
  },
  {
    id: 2,
    title: 'React Hooks Deep Dive',
    instructor: 'Sarah Johnson',
    subject: 'Web Development',
    time: '2:00 PM',
    date: '24 Apr, 2023',
    duration: '1.5 hours',
    status: 'confirmed',
    meetingLink: 'https://meet.zoom.us/j/987654321',
  },
];

// Mock data for past live classes
const pastLiveClasses = [
  {
    id: 1,
    title: 'CSS Grid and Flexbox',
    instructor: 'Mike Chen',
    subject: 'Web Design',
    date: '20 Apr, 2023',
    duration: '1 hour',
    recording: 'https://recordings.zoom.us/123456',
    status: 'completed',
    rating: 4.8,
  },
  {
    id: 2,
    title: 'Data Structures Fundamentals',
    instructor: 'Emma Wilson',
    subject: 'Computer Science',
    date: '15 Apr, 2023',
    duration: '2 hours',
    recording: 'https://recordings.zoom.us/654321',
    status: 'completed',
    rating: 4.5,
  },
  {
    id: 3,
    title: 'Backend Development with Node.js',
    instructor: 'Alex Brown',
    subject: 'Backend Development',
    date: '10 Apr, 2023',
    duration: '1.5 hours',
    recording: 'https://recordings.zoom.us/987654',
    status: 'completed',
    rating: 4.7,
  },
];

// Mock data for available instructors
const availableInstructors = [
  {
    id: 1,
    name: 'John Smith',
    specialization: 'Web Development, JavaScript',
    availability: ['Mon', 'Tue', 'Thu', 'Fri'],
    rating: 4.9,
    image: '',
  },
  {
    id: 2,
    name: 'Sarah Johnson',
    specialization: 'React, Frontend Development',
    availability: ['Tue', 'Wed', 'Fri', 'Sat'],
    rating: 4.8,
    image: '',
  },
  {
    id: 3,
    name: 'Mike Chen',
    specialization: 'UI/UX, CSS, HTML',
    availability: ['Mon', 'Wed', 'Thu', 'Sun'],
    rating: 4.7,
    image: '',
  },
  {
    id: 4,
    name: 'Emma Wilson',
    specialization: 'Data Structures, Algorithms',
    availability: ['Tue', 'Thu', 'Fri', 'Sat'],
    rating: 4.9,
    image: '',
  },
  {
    id: 5,
    name: 'Alex Brown',
    specialization: 'Backend, Node.js, Express',
    availability: ['Mon', 'Wed', 'Fri', 'Sun'],
    rating: 4.8,
    image: '',
  },
];

export default function LiveClassPage() {
  const [activeFilter, setActiveFilter] = useState('all');

  return (
    <div className="space-y-10 pb-8 container mx-auto px-4 max-w-7xl">
      <Breadcrumbs />
      
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-primary/10 via-primary/5 to-background p-8 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
          <div className="space-y-4">
            <h1 className="text-3xl font-bold tracking-tight">Live Classes</h1>
            <p className="text-muted-foreground max-w-md">
              Get personalized support from expert instructors through live video sessions.
              Book a session to clarify your doubts or deepen your understanding.
            </p>
            <div className="flex flex-wrap gap-3 pt-2">
              <Sheet>
                <SheetTrigger asChild>
                  <Button className="gap-2" size="lg">
                    <Plus className="h-4 w-4" />
                    Book New Session
                  </Button>
                </SheetTrigger>
                <SheetContent className="sm:max-w-md">
                  <SheetHeader>
                    <SheetTitle>Book a Live Class</SheetTitle>
                    <SheetDescription>
                      Schedule a one-on-one session with an instructor to clarify your doubts.
                    </SheetDescription>
                  </SheetHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <label htmlFor="subject" className="text-sm font-medium">
                        Subject
                      </label>
                      <Select>
                        <SelectTrigger id="subject">
                          <SelectValue placeholder="Select a subject" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="web-development">Web Development</SelectItem>
                          <SelectItem value="javascript">JavaScript</SelectItem>
                          <SelectItem value="python">Python</SelectItem>
                          <SelectItem value="react">React</SelectItem>
                          <SelectItem value="data-structures">Data Structures</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <label htmlFor="instructor" className="text-sm font-medium">
                        Instructor
                      </label>
                      <Select>
                        <SelectTrigger id="instructor">
                          <SelectValue placeholder="Select an instructor" />
                        </SelectTrigger>
                        <SelectContent>
                          {availableInstructors.map((instructor) => (
                            <SelectItem key={instructor.id} value={instructor.id.toString()}>
                              {instructor.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <label htmlFor="date" className="text-sm font-medium">
                        Date
                      </label>
                      <Input id="date" type="date" />
                    </div>
                    
                    <div className="space-y-2">
                      <label htmlFor="time" className="text-sm font-medium">
                        Time
                      </label>
                      <Input id="time" type="time" />
                    </div>
                    
                    <div className="space-y-2">
                      <label htmlFor="topic" className="text-sm font-medium">
                        Topic
                      </label>
                      <Input id="topic" placeholder="Enter the topic you need help with" />
                    </div>
                    
                    <div className="space-y-2">
                      <label htmlFor="description" className="text-sm font-medium">
                        Description
                      </label>
                      <textarea 
                        id="description" 
                        className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        placeholder="Describe your doubt or what you need help with"
                        rows={3}
                      />
                    </div>
                  </div>
                  <SheetFooter>
                    <SheetClose asChild>
                      <Button type="submit">Request Session</Button>
                    </SheetClose>
                  </SheetFooter>
                </SheetContent>
              </Sheet>
              <Button variant="outline" className="gap-2" size="lg">
                <Search className="h-4 w-4" />
                Explore Instructors
              </Button>
            </div>
          </div>
          <div className="hidden md:flex justify-end">
            <div className="relative w-64 h-64">
              <div className="absolute right-0 top-4 w-32 h-32 bg-primary/10 rounded-lg flex items-center justify-center">
                <Video className="h-12 w-12 text-primary" />
              </div>
              <div className="absolute left-0 bottom-4 w-32 h-32 bg-secondary/10 rounded-lg flex items-center justify-center">
                <MessageCircle className="h-12 w-12 text-secondary" />
              </div>
              <div className="absolute left-16 top-16 w-40 h-40 bg-accent/10 rounded-lg flex items-center justify-center z-10">
                <Calendar className="h-16 w-16 text-accent" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Upcoming Sessions */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h2 className="text-2xl font-bold tracking-tight">Upcoming Sessions</h2>
          <div className="flex gap-3">
            <div className="relative">
              <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="Search sessions..." className="pl-10 w-full sm:w-[200px]" />
            </div>
            <Select>
              <SelectTrigger className="w-full sm:w-[150px]">
                <SelectValue placeholder="All subjects" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All subjects</SelectItem>
                <SelectItem value="programming">Programming</SelectItem>
                <SelectItem value="web-development">Web Development</SelectItem>
                <SelectItem value="design">Design</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        {upcomingLiveClasses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {upcomingLiveClasses.map((liveClass) => (
              <Card key={liveClass.id} className="overflow-hidden hover:shadow-md transition-shadow border-l-4 border-l-primary">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Video className="h-5 w-5 text-primary" />
                    {liveClass.title}
                  </CardTitle>
                  <CardDescription className="flex items-center gap-1">
                    <User className="h-3 w-3" />
                    with {liveClass.instructor}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pb-2">
                  <div className="grid grid-cols-2 gap-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span>{liveClass.date}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span>{liveClass.time}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <BookOpen className="h-4 w-4 text-muted-foreground" />
                      <span>{liveClass.subject}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="bg-green-50 text-green-700 border-green-300">
                        {liveClass.status}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between pt-2 bg-muted/10">
                  <Button variant="ghost" size="sm">
                    Reschedule
                  </Button>
                  <Button size="sm">
                    Join Meeting
                  </Button>
                </CardFooter>
              </Card>
            ))}
            <Card className="flex flex-col justify-center items-center p-6 bg-muted/5 border-dashed border-2 hover:bg-muted/10 transition-colors cursor-pointer h-[200px]">
              <Sheet>
                <SheetTrigger className="flex flex-col items-center justify-center h-full w-full">
                  <Plus className="h-10 w-10 mb-3 text-muted-foreground" />
                  <p className="font-medium text-muted-foreground">Book Another Session</p>
                </SheetTrigger>
                <SheetContent className="sm:max-w-md">
                  {/* Booking form - same as above */}
                  <SheetHeader>
                    <SheetTitle>Book a Live Class</SheetTitle>
                    <SheetDescription>
                      Schedule a one-on-one session with an instructor to clarify your doubts.
                    </SheetDescription>
                  </SheetHeader>
                  {/* Same form as above */}
                </SheetContent>
              </Sheet>
            </Card>
          </div>
        ) : (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-10">
              <Calendar className="h-12 w-12 text-muted-foreground mb-3" />
              <h3 className="text-lg font-medium mb-1">No upcoming sessions</h3>
              <p className="text-muted-foreground text-sm text-center max-w-md mb-4">
                You don't have any live classes scheduled yet. Book a session with an instructor to get started.
              </p>
              <Sheet>
                <SheetTrigger asChild>
                  <Button>Book Your First Session</Button>
                </SheetTrigger>
                <SheetContent className="sm:max-w-md">
                  {/* Session booking form - same as above */}
                </SheetContent>
              </Sheet>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Featured Instructors Horizontal Scroll */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold tracking-tight">Featured Instructors</h2>
          <Button variant="ghost" className="gap-1 text-sm">
            View all
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide snap-x">
          {availableInstructors.slice(0, 4).map((instructor) => (
            <Card key={instructor.id} className="min-w-[280px] snap-start hover:shadow-md transition-shadow flex flex-col">
              <CardHeader className="pb-2">
                <div className="flex items-center gap-3">
                  <Avatar className="h-12 w-12">
                    <AvatarFallback className="bg-primary/10 text-primary">
                      {instructor.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-lg">{instructor.name}</CardTitle>
                    <div className="flex items-center mt-1">
                      {Array(5).fill(0).map((_, i) => (
                        <span key={i}>
                          {i < Math.floor(instructor.rating) ? 
                            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" /> : 
                            <Star className="h-3 w-3 text-muted-foreground" />
                          }
                        </span>
                      ))}
                      <span className="text-xs text-muted-foreground ml-1">{instructor.rating}</span>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pb-2 flex-grow">
                <p className="text-sm text-muted-foreground mb-3">{instructor.specialization}</p>
                <div className="flex flex-wrap gap-1">
                  {instructor.availability.map((day) => (
                    <Badge key={day} variant="outline" className="bg-green-50 text-green-700 border-green-300">
                      {day}
                    </Badge>
                  ))}
                </div>
              </CardContent>
              <CardFooter className="pt-2 bg-muted/10">
                <Sheet>
                  <SheetTrigger asChild>
                    <Button className="w-full" variant="outline">Book Session</Button>
                  </SheetTrigger>
                  <SheetContent className="sm:max-w-md">
                    <SheetHeader>
                      <SheetTitle>Book a Session with {instructor.name}</SheetTitle>
                      <SheetDescription>
                        Schedule a one-on-one session to clarify your doubts.
                      </SheetDescription>
                    </SheetHeader>
                    {/* Same booking form */}
                  </SheetContent>
                </Sheet>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>

      {/* Past Session Recordings */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold tracking-tight">Past Session Recordings</h2>
          <Button variant="ghost" className="gap-1 text-sm">
            View all
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {pastLiveClasses.slice(0, 3).map((liveClass) => (
            <Card key={liveClass.id} className="hover:shadow-md transition-shadow overflow-hidden group">
              <div className="aspect-video bg-muted relative flex items-center justify-center group-hover:bg-muted/80 transition-colors">
                <Video className="h-12 w-12 text-muted-foreground group-hover:text-primary transition-colors" />
                <Button className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-primary/20 hover:bg-primary/30 transition-opacity flex items-center justify-center gap-2">
                  Watch Recording <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">{liveClass.title}</CardTitle>
                <CardDescription>with {liveClass.instructor}</CardDescription>
              </CardHeader>
              <CardContent className="pb-2">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>{liveClass.date}</span>
                  </div>
                  <div className="flex items-center">
                    {Array(5).fill(0).map((_, i) => (
                      <span key={i}>
                        {i < Math.floor(liveClass.rating) ? 
                          <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" /> : 
                          <Star className="h-3 w-3 text-muted-foreground" />
                        }
                      </span>
                    ))}
                    <span className="text-xs text-muted-foreground ml-1">{liveClass.rating}</span>
                  </div>
                </div>
                <Badge variant="outline" className="bg-secondary/10 text-secondary">
                  {liveClass.subject}
                </Badge>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
      
      {/* CTA Section */}
      <Card className="bg-primary/5 border-none shadow-sm overflow-hidden">
        <CardContent className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            <div className="space-y-4">
              <h2 className="text-2xl font-bold">Need Immediate Help?</h2>
              <p className="text-muted-foreground">
                Our instructors are available for emergency doubt-solving sessions.
                Book a quick session and get your doubts cleared within hours.
              </p>
              <Sheet>
                <SheetTrigger asChild>
                  <Button className="gap-2" size="lg">
                    <Plus className="h-4 w-4" />
                    Book Urgent Session
                  </Button>
                </SheetTrigger>
                <SheetContent className="sm:max-w-md">
                  <SheetHeader>
                    <SheetTitle>Book an Urgent Session</SheetTitle>
                    <SheetDescription>
                      Get help as soon as possible from our available instructors.
                    </SheetDescription>
                  </SheetHeader>
                  {/* Same booking form */}
                </SheetContent>
              </Sheet>
            </div>
            <div className="hidden md:flex justify-center">
              <div className="relative">
                <div className="w-32 h-32 rounded-full bg-primary/20 flex items-center justify-center">
                  <Clock className="h-12 w-12 text-primary" />
                </div>
                <div className="absolute -bottom-4 -right-4 w-24 h-24 rounded-full bg-secondary/20 flex items-center justify-center">
                  <MessageCircle className="h-10 w-10 text-secondary" />
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 