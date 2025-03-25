'use client';

import { useState, useEffect } from 'react';
import { useRole } from '@/contexts/RoleContext';
import { useAuth } from '@/contexts/AuthContext';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import {
  User,
  Settings,
  BookOpen,
  GraduationCap,
  Calendar,
  Mail,
  Phone,
  Home,
  Clock,
  Shield,
  Bell,
  Key,
  CheckCircle,
  Save,
  AlertCircle,
  UserCog,
  BookMarked,
  School,
  Award,
  Briefcase,
  Users,
  MapPin,
  FileText,
  Clipboard,
  SquarePen,
  Lock,
  Eye,
  EyeOff,
  User2
} from 'lucide-react';

// Mock data for student profile
const studentProfileData = {
  id: '3',
  firstName: 'John',
  lastName: 'Doe',
  email: 'student@westlake.edu',
  profileImage: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36',
  enrollmentNumber: 'STU2022045',
  gradeLevel: '11th Grade',
  section: 'A',
  admissionDate: '2022-08-15',
  academicStatus: 'active',
  school: {
    name: 'Westlake High School',
    id: 'school-123'
  },
  contactInfo: {
    phone: '+1 (555) 123-4567',
    address: '123 Student Lane, Westlake City, CA 94123'
  },
  parentDetails: {
    fatherName: 'Robert Doe',
    fatherContact: '+1 (555) 987-6543',
    motherName: 'Emily Doe',
    motherContact: '+1 (555) 876-5432',
    email: 'parents@example.com'
  },
  academicHistory: [
    { year: '2022-2023', gradeLevel: '11th Grade', gpa: '3.8', rank: '15/120' },
    { year: '2021-2022', gradeLevel: '10th Grade', gpa: '3.7', rank: '18/124' },
    { year: '2020-2021', gradeLevel: '9th Grade', gpa: '3.5', rank: '25/130' }
  ],
  preferences: {
    notifications: {
      email: true,
      app: true,
      sms: false
    },
    theme: 'system',
    accessibility: {
      highContrast: false,
      largeText: false
    }
  }
};

// Mock data for admin profile
const adminProfileData = {
  id: '1',
  firstName: 'Sarah',
  lastName: 'Johnson',
  email: 'admin@school-system.com',
  profileImage: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2',
  adminId: 'ADM2021001',
  department: 'School Administration',
  title: 'System Administrator',
  joinDate: '2021-06-10',
  status: 'active',
  organization: {
    name: 'Central Education District',
    id: 'org-456'
  },
  contactInfo: {
    phone: '+1 (555) 234-5678',
    address: '456 Admin Avenue, Central District, CA 94567'
  },
  managedSchools: [
    { name: 'Westlake High School', id: 'school-123', students: 850, staff: 75 },
    { name: 'Eastside Elementary', id: 'school-456', students: 520, staff: 45 },
    { name: 'Northern Middle School', id: 'school-789', students: 640, staff: 58 }
  ],
  accessRights: [
    'User Management',
    'System Configuration',
    'Report Generation',
    'Data Analytics',
    'School Administration'
  ],
  activityLog: [
    { action: 'User Account Update', date: '2023-04-18', details: 'Updated teacher accounts' },
    { action: 'System Backup', date: '2023-04-15', details: 'Scheduled system backup' },
    { action: 'Report Generated', date: '2023-04-10', details: 'Q1 performance analytics' }
  ],
  preferences: {
    notifications: {
      email: true,
      app: true,
      sms: true
    },
    theme: 'dark',
    accessibility: {
      highContrast: false,
      largeText: false
    }
  }
};

export default function ProfilePage() {
  const { role } = useRole();
  // const { user } = useAuth(); // Would use this in production
  const [activeTab, setActiveTab] = useState('personal');
  const [isEditing, setIsEditing] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [formattedDate, setFormattedDate] = useState<string>('');
  const { toast } = useToast();
  
  // Use mocked data based on role for demo
  const profileData = role === 'admin' || role === 'super_admin' || role === 'school_admin' 
    ? adminProfileData 
    : studentProfileData;
    
  const [formData, setFormData] = useState({
    firstName: profileData.firstName,
    lastName: profileData.lastName,
    email: profileData.email,
    phone: profileData.contactInfo.phone,
    address: profileData.contactInfo.address
  });

  // Format date on client-side only to avoid hydration mismatch
  useEffect(() => {
    const dateToFormat = role === 'student' 
      ? studentProfileData.admissionDate 
      : adminProfileData.joinDate;
    setFormattedDate(new Date(dateToFormat).toLocaleDateString());
  }, [role]);

  const getInitials = () => {
    return `${profileData.firstName.charAt(0)}${profileData.lastName.charAt(0)}`;
  };

  const getStatusBadgeStyles = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-800/20 dark:text-emerald-400';
      case 'inactive':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800/20 dark:text-gray-400';
      case 'suspended':
        return 'bg-red-100 text-red-800 dark:bg-red-800/20 dark:text-red-400';
      case 'graduated':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-800/20 dark:text-blue-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800/20 dark:text-gray-400';
    }
  };

  const handleSave = () => {
    // This would actually save to the API in a real app
    console.log('Saving profile data:', formData);
    setSaveSuccess(true);
    setIsEditing(false);
    
    toast({
      title: 'Profile updated successfully',
      description: 'Your profile has been updated successfully',
      variant: 'default'
    });
    
    // Hide success message after 3 seconds
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  return (
    <div className="container mx-auto p-6 space-y-6 max-w-7xl">
      <div className="flex justify-between items-center">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight">My Profile</h1>
          <p className="text-muted-foreground">
            Manage your personal information and preferences
          </p>
        </div>
        {isEditing ? (
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={() => setIsEditing(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave}>
              <Save className="h-4 w-4 mr-2" />
              Save Changes
            </Button>
          </div>
        ) : (
          <Button onClick={() => setIsEditing(true)}>
            <SquarePen className="h-4 w-4 mr-2" />
            Edit Profile
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Profile Card */}
        <Card className="md:col-span-4 lg:col-span-3">
          <CardHeader className="pb-0">
            <div className="flex flex-col items-center text-center">
              <div className="relative group">
                <Avatar className="h-24 w-24 border-4 border-background">
                  <AvatarImage 
                    src={profileData.profileImage} 
                    alt={`${profileData.firstName} ${profileData.lastName}`} 
                  />
                  <AvatarFallback className="text-2xl bg-primary/10 text-primary">
                    {getInitials()}
                  </AvatarFallback>
                </Avatar>
                {isEditing && (
                  <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="text-white text-xs font-medium bg-primary/90 px-2 py-1 rounded-md">
                      Change
                    </button>
                  </div>
                )}
              </div>
              <h2 className="text-xl font-bold mt-4">{profileData.firstName} {profileData.lastName}</h2>
              <Badge className={`mt-2 ${role === 'student' ? 'badge-active' : 'badge-active'}`}>
                {(role === 'student' ? studentProfileData.academicStatus : adminProfileData.status)
                  .charAt(0).toUpperCase() + 
                  (role === 'student' ? studentProfileData.academicStatus : adminProfileData.status).slice(1)
                }
              </Badge>
              
              <div className="mt-4 text-sm text-muted-foreground">
                {role === 'student' ? (
                  <div className="flex items-center justify-center">
                    <GraduationCap className="h-4 w-4 mr-1" />
                    <span>{studentProfileData.gradeLevel}</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center">
                    <Briefcase className="h-4 w-4 mr-1" />
                    <span>{adminProfileData.title}</span>
                  </div>
                )}
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="mt-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between px-1">
                <div className="flex items-center">
                  {role === 'student' ? (
                    <BookOpen className="h-4 w-4 mr-2 text-muted-foreground" />
                  ) : (
                    <UserCog className="h-4 w-4 mr-2 text-muted-foreground" />
                  )}
                  <span className="text-sm text-muted-foreground">
                    {role === 'student' ? 'Student ID' : 'Admin ID'}
                  </span>
                </div>
                <span className="text-sm font-medium">
                  {role === 'student' ? studentProfileData.enrollmentNumber : adminProfileData.adminId}
                </span>
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between px-1">
                <div className="flex items-center">
                  <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Email</span>
                </div>
                <span className="text-sm font-medium break-all">{profileData.email}</span>
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between px-1">
                <div className="flex items-center">
                  <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Phone</span>
                </div>
                <span className="text-sm font-medium">{profileData.contactInfo.phone}</span>
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between px-1">
                <div className="flex items-center">
                  {role === 'student' ? (
                    <School className="h-4 w-4 mr-2 text-muted-foreground" />
                  ) : (
                    <Briefcase className="h-4 w-4 mr-2 text-muted-foreground" />
                  )}
                  <span className="text-sm text-muted-foreground">
                    {role === 'student' ? 'School' : 'Department'}
                  </span>
                </div>
                <span className="text-sm font-medium">
                  {role === 'student' ? studentProfileData.school.name : adminProfileData.department}
                </span>
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between px-1">
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">
                    {role === 'student' ? 'Admission Date' : 'Join Date'}
                  </span>
                </div>
                <span className="text-sm font-medium">{formattedDate}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Content Area */}
        <div className="md:col-span-8 lg:col-span-9 space-y-6">
          <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="w-full grid grid-cols-3">
              <TabsTrigger value="personal" className="flex gap-1.5 items-center">
                <User2 className="h-4 w-4" />
                <span>Personal</span>
              </TabsTrigger>
              {role === 'student' ? (
                <TabsTrigger value="academic" className="flex gap-1.5 items-center">
                  <BookMarked className="h-4 w-4" />
                  <span>Academic</span>
                </TabsTrigger>
              ) : (
                <TabsTrigger value="professional" className="flex gap-1.5 items-center">
                  <Briefcase className="h-4 w-4" />
                  <span>Professional</span>
                </TabsTrigger>
              )}
              <TabsTrigger value="settings" className="flex gap-1.5 items-center">
                <Settings className="h-4 w-4" />
                <span>Settings</span>
              </TabsTrigger>
            </TabsList>

            {/* Personal Information Tab */}
            <TabsContent value="personal" className="space-y-6 mt-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5 text-primary" />
                    Contact Information
                  </CardTitle>
                  <CardDescription>
                    Manage your personal contact details
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {isEditing ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="firstName">First Name</Label>
                        <Input 
                          id="firstName" 
                          value={formData.firstName} 
                          onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                          className="border-border focus-visible:ring-primary/20"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName">Last Name</Label>
                        <Input 
                          id="lastName" 
                          value={formData.lastName} 
                          onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                          className="border-border focus-visible:ring-primary/20"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input 
                          id="email" 
                          value={formData.email} 
                          onChange={(e) => setFormData({...formData, email: e.target.value})}
                          className="border-border focus-visible:ring-primary/20"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone</Label>
                        <Input 
                          id="phone" 
                          value={formData.phone} 
                          onChange={(e) => setFormData({...formData, phone: e.target.value})}
                          className="border-border focus-visible:ring-primary/20"
                        />
                      </div>
                      <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="address">Address</Label>
                        <Textarea 
                          id="address" 
                          value={formData.address} 
                          onChange={(e) => setFormData({...formData, address: e.target.value})}
                          rows={3}
                          className="border-border focus-visible:ring-primary/20"
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-1">
                        <p className="text-sm font-medium text-muted-foreground">First Name</p>
                        <p className="font-medium">{profileData.firstName}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-medium text-muted-foreground">Last Name</p>
                        <p className="font-medium">{profileData.lastName}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-medium text-muted-foreground">Email</p>
                        <p className="font-medium">{profileData.email}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-medium text-muted-foreground">Phone</p>
                        <p className="font-medium">{profileData.contactInfo.phone}</p>
                      </div>
                      <div className="space-y-1 md:col-span-2">
                        <p className="text-sm font-medium text-muted-foreground">Address</p>
                        <p className="font-medium">{profileData.contactInfo.address}</p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {role === 'student' && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Users className="h-5 w-5 text-primary" />
                      Parent/Guardian Information
                    </CardTitle>
                    <CardDescription>
                      Details of your parents or guardians
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                          <div className="space-y-1">
                            <p className="text-sm font-medium text-muted-foreground">Father's Name</p>
                            <p className="font-medium">{studentProfileData.parentDetails.fatherName}</p>
                          </div>
                          <div className="space-y-1">
                            <p className="text-sm font-medium text-muted-foreground">Contact Number</p>
                            <p className="font-medium">{studentProfileData.parentDetails.fatherContact}</p>
                          </div>
                        </div>
                        <div className="space-y-4">
                          <div className="space-y-1">
                            <p className="text-sm font-medium text-muted-foreground">Mother's Name</p>
                            <p className="font-medium">{studentProfileData.parentDetails.motherName}</p>
                          </div>
                          <div className="space-y-1">
                            <p className="text-sm font-medium text-muted-foreground">Contact Number</p>
                            <p className="font-medium">{studentProfileData.parentDetails.motherContact}</p>
                          </div>
                        </div>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-medium text-muted-foreground">Email</p>
                        <p className="font-medium">{studentProfileData.parentDetails.email}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            {/* Academic Information Tab (Students) */}
            <TabsContent value="academic" className="space-y-6 mt-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Award className="h-5 w-5 text-primary" />
                    Academic History
                  </CardTitle>
                  <CardDescription>
                    Your past academic performance and records
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="rounded-md border">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b bg-muted/30">
                          <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Academic Year</th>
                          <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Grade Level</th>
                          <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">GPA</th>
                          <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Class Rank</th>
                        </tr>
                      </thead>
                      <tbody>
                        {studentProfileData.academicHistory.map((history, index) => (
                          <tr key={index} className={`border-b ${index % 2 === 0 ? 'bg-card' : 'bg-muted/20'}`}>
                            <td className="py-3 px-4">{history.year}</td>
                            <td className="py-3 px-4">{history.gradeLevel}</td>
                            <td className="py-3 px-4 font-medium">{history.gpa}</td>
                            <td className="py-3 px-4">{history.rank}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <School className="h-5 w-5 text-primary" />
                    School Information
                  </CardTitle>
                  <CardDescription>
                    Details about your current school
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-4 p-4 bg-muted/20 rounded-lg">
                    <div className="h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center">
                      <School className="h-8 w-8 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-lg font-medium">{studentProfileData.school.name}</h3>
                      <p className="text-sm text-muted-foreground mt-1">School ID: {studentProfileData.school.id}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge variant="outline" className="text-xs px-2 py-0 h-5">
                          {studentProfileData.gradeLevel}
                        </Badge>
                        <Badge variant="outline" className="text-xs px-2 py-0 h-5">
                          Section {studentProfileData.section}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Professional Information Tab (Admin) */}
            <TabsContent value="professional" className="space-y-6 mt-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Briefcase className="h-5 w-5 text-primary" />
                    Managed Schools
                  </CardTitle>
                  <CardDescription>
                    Schools under your administration
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {adminProfileData.managedSchools.map((school, index) => (
                      <Card key={index} className="border border-border bg-card">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-base">{school.name}</CardTitle>
                          <CardDescription className="text-xs">ID: {school.id}</CardDescription>
                        </CardHeader>
                        <CardContent className="pb-4">
                          <div className="flex justify-between text-sm">
                            <div className="flex flex-col">
                              <span className="text-muted-foreground">Students</span>
                              <span className="font-medium">{school.students}</span>
                            </div>
                            <div className="flex flex-col">
                              <span className="text-muted-foreground">Staff</span>
                              <span className="font-medium">{school.staff}</span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5 text-primary" />
                    System Access Rights
                  </CardTitle>
                  <CardDescription>
                    Your permissions and access levels
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {adminProfileData.accessRights.map((right, index) => (
                      <Badge key={index} variant="secondary" className="px-2.5 py-0.5">
                        {right}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-primary" />
                    Recent Activity
                  </CardTitle>
                  <CardDescription>
                    Your recent system activities
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {adminProfileData.activityLog.map((activity, index) => (
                      <div key={index} className="flex items-start gap-4 p-3 rounded-lg border bg-card">
                        <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                          <FileText className="h-4 w-4 text-primary" />
                        </div>
                        <div className="space-y-1">
                          <p className="font-medium">{activity.action}</p>
                          <p className="text-sm text-muted-foreground">{activity.details}</p>
                          <p className="text-xs text-muted-foreground">{activity.date}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Settings Tab (Both roles) */}
            <TabsContent value="settings" className="space-y-6 mt-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Bell className="h-5 w-5 text-primary" />
                    Notification Settings
                  </CardTitle>
                  <CardDescription>
                    Manage how you receive notifications
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between py-2">
                    <div className="space-y-0.5">
                      <Label htmlFor="emailNotifications" className="text-base">Email Notifications</Label>
                      <p className="text-sm text-muted-foreground">
                        Receive notifications via email
                      </p>
                    </div>
                    <Switch
                      id="emailNotifications"
                      checked={profileData.preferences.notifications.email}
                    />
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between py-2">
                    <div className="space-y-0.5">
                      <Label htmlFor="appNotifications" className="text-base">App Notifications</Label>
                      <p className="text-sm text-muted-foreground">
                        Receive notifications in the app
                      </p>
                    </div>
                    <Switch
                      id="appNotifications"
                      checked={profileData.preferences.notifications.app}
                    />
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between py-2">
                    <div className="space-y-0.5">
                      <Label htmlFor="smsNotifications" className="text-base">SMS Notifications</Label>
                      <p className="text-sm text-muted-foreground">
                        Receive notifications via text message
                      </p>
                    </div>
                    <Switch
                      id="smsNotifications"
                      checked={profileData.preferences.notifications.sms}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="h-5 w-5 text-primary" />
                    Appearance
                  </CardTitle>
                  <CardDescription>
                    Customize how the app looks and feels
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="theme">Theme</Label>
                    <Select defaultValue={profileData.preferences.theme}>
                      <SelectTrigger id="theme" className="border-border">
                        <SelectValue placeholder="Select theme" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="light">Light</SelectItem>
                        <SelectItem value="dark">Dark</SelectItem>
                        <SelectItem value="system">System</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between py-2">
                    <div className="space-y-0.5">
                      <Label htmlFor="highContrast" className="text-base">High Contrast</Label>
                      <p className="text-sm text-muted-foreground">
                        Increase contrast for better visibility
                      </p>
                    </div>
                    <Switch
                      id="highContrast"
                      checked={profileData.preferences.accessibility.highContrast}
                    />
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between py-2">
                    <div className="space-y-0.5">
                      <Label htmlFor="largeText" className="text-base">Large Text</Label>
                      <p className="text-sm text-muted-foreground">
                        Increase text size for better readability
                      </p>
                    </div>
                    <Switch
                      id="largeText"
                      checked={profileData.preferences.accessibility.largeText}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Lock className="h-5 w-5 text-primary" />
                    Account Security
                  </CardTitle>
                  <CardDescription>
                    Manage your account security settings
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <h3 className="text-base font-medium">Change Password</h3>
                      <p className="text-sm text-muted-foreground">
                        Update your password regularly for better security
                      </p>
                    </div>
                    <Button variant="outline" size="sm" className="flex items-center gap-1.5">
                      <Key className="h-4 w-4" />
                      <span>Change</span>
                    </Button>
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <h3 className="text-base font-medium">Two-Factor Authentication</h3>
                      <p className="text-sm text-muted-foreground">
                        Add an extra layer of security to your account
                      </p>
                    </div>
                    <Button variant="outline" size="sm" className="flex items-center gap-1.5">
                      <Shield className="h-4 w-4" />
                      <span>Enable</span>
                    </Button>
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <h3 className="text-base font-medium">Login Sessions</h3>
                      <p className="text-sm text-muted-foreground">
                        Manage your active sessions and devices
                      </p>
                    </div>
                    <Button variant="outline" size="sm" className="flex items-center gap-1.5">
                      <Eye className="h-4 w-4" />
                      <span>View</span>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
} 