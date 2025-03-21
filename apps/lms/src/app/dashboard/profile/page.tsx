'use client';

import { useState, useEffect } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
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
  AlertCircle
} from 'lucide-react';

// Mock student profile data - would be fetched from API in a real app
const studentProfile = {
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

export default function StudentProfile() {
  const [activeTab, setActiveTab] = useState('personal');
  const [isEditing, setIsEditing] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [formattedDate, setFormattedDate] = useState<string>('');
  const [formData, setFormData] = useState({
    firstName: studentProfile.firstName,
    lastName: studentProfile.lastName,
    email: studentProfile.email,
    phone: studentProfile.contactInfo.phone,
    address: studentProfile.contactInfo.address
  });
  const { toast } = useToast();

  // Format date on client-side only to avoid hydration mismatch
  useEffect(() => {
    setFormattedDate(new Date(studentProfile.admissionDate).toLocaleDateString());
  }, []);
  

  const getInitials = () => {
    return `${studentProfile.firstName.charAt(0)}${studentProfile.lastName.charAt(0)}`;
  };

  useEffect(() => {
    if (saveSuccess) {
      toast({
        title: 'Profile updated successfully',
        description: 'Your profile has been updated successfully',
        variant: 'default'
      });
    }
  }, [saveSuccess]);

  const handleSave = () => {
    // This would actually save to the API in a real app
    console.log('Saving profile data:', formData);
    setSaveSuccess(true);
    setIsEditing(false);
    
    // Hide success message after 3 seconds
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const getStatusBadgeStyles = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'inactive':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
      case 'suspended':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      case 'graduated':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="heading-lg">My Profile</h1>
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
            Edit Profile
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Profile Overview Card */}
        <Card className="md:col-span-1">
          <CardHeader className="pb-2">
            <CardTitle>Student Info</CardTitle>
            <CardDescription>Your basic information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex flex-col items-center text-center">
              <Avatar className="h-24 w-24 mb-4">
                <AvatarImage src={studentProfile.profileImage} alt={`${studentProfile.firstName} ${studentProfile.lastName}`} />
                <AvatarFallback className="text-2xl">{getInitials()}</AvatarFallback>
              </Avatar>
              <h2 className="text-xl font-bold">{studentProfile.firstName} {studentProfile.lastName}</h2>
              <Badge className={`mt-2 ${getStatusBadgeStyles(studentProfile.academicStatus)}`}>
                {studentProfile.academicStatus.charAt(0).toUpperCase() + studentProfile.academicStatus.slice(1)}
              </Badge>
            </div>

            <Separator />

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <GraduationCap className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Student ID</span>
                </div>
                <span className="text-sm font-medium">{studentProfile.enrollmentNumber}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <BookOpen className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Grade</span>
                </div>
                <span className="text-sm font-medium">{studentProfile.gradeLevel}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <User className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Section</span>
                </div>
                <span className="text-sm font-medium">{studentProfile.section}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Admission Date</span>
                </div>
                <span className="text-sm font-medium">{formattedDate || '-'}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Email</span>
                </div>
                <span className="text-sm font-medium">{studentProfile.email}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Content Area */}
        <div className="md:col-span-2 space-y-6">
          <Tabs defaultValue={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-3 mb-4">
              <TabsTrigger value="personal">Personal</TabsTrigger>
              <TabsTrigger value="academic">Academic</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>

            <TabsContent value="personal" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Contact Information</CardTitle>
                  <CardDescription>Your personal contact details</CardDescription>
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
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName">Last Name</Label>
                        <Input 
                          id="lastName" 
                          value={formData.lastName} 
                          onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input 
                          id="email" 
                          value={formData.email} 
                          onChange={(e) => setFormData({...formData, email: e.target.value})}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone</Label>
                        <Input 
                          id="phone" 
                          value={formData.phone} 
                          onChange={(e) => setFormData({...formData, phone: e.target.value})}
                        />
                      </div>
                      <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="address">Address</Label>
                        <Textarea 
                          id="address" 
                          value={formData.address} 
                          onChange={(e) => setFormData({...formData, address: e.target.value})}
                          rows={3}
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="text-sm text-muted-foreground">Phone</p>
                          <p>{studentProfile.contactInfo.phone}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Home className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="text-sm text-muted-foreground">Address</p>
                          <p>{studentProfile.contactInfo.address}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Parent/Guardian Information</CardTitle>
                  <CardDescription>Details of your parents or guardians</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Father's Name</p>
                        <p className="font-medium">{studentProfile.parentDetails.fatherName}</p>
                        <p className="text-sm text-muted-foreground mt-1">{studentProfile.parentDetails.fatherContact}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Mother's Name</p>
                        <p className="font-medium">{studentProfile.parentDetails.motherName}</p>
                        <p className="text-sm text-muted-foreground mt-1">{studentProfile.parentDetails.motherContact}</p>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Email</p>
                      <p className="font-medium">{studentProfile.parentDetails.email}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="academic" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Academic History</CardTitle>
                  <CardDescription>Your past academic performance</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="border-b border-border">
                          <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">Academic Year</th>
                          <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">Grade Level</th>
                          <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">GPA</th>
                          <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">Class Rank</th>
                        </tr>
                      </thead>
                      <tbody>
                        {studentProfile.academicHistory.map((history, index) => (
                          <tr key={index} className="border-b border-border">
                            <td className="py-3 px-2">{history.year}</td>
                            <td className="py-3 px-2">{history.gradeLevel}</td>
                            <td className="py-3 px-2">{history.gpa}</td>
                            <td className="py-3 px-2">{history.rank}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>School Information</CardTitle>
                  <CardDescription>Details about your current school</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <GraduationCap className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium">{studentProfile.school.name}</h3>
                      <p className="text-sm text-muted-foreground">School ID: {studentProfile.school.id}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="settings" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Notification Settings</CardTitle>
                  <CardDescription>Manage how you receive notifications</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="emailNotifications">Email Notifications</Label>
                      <p className="text-sm text-muted-foreground">
                        Receive notifications via email
                      </p>
                    </div>
                    <Switch
                      id="emailNotifications"
                      checked={studentProfile.preferences.notifications.email}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="appNotifications">App Notifications</Label>
                      <p className="text-sm text-muted-foreground">
                        Receive notifications in the app
                      </p>
                    </div>
                    <Switch
                      id="appNotifications"
                      checked={studentProfile.preferences.notifications.app}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="smsNotifications">SMS Notifications</Label>
                      <p className="text-sm text-muted-foreground">
                        Receive notifications via text message
                      </p>
                    </div>
                    <Switch
                      id="smsNotifications"
                      checked={studentProfile.preferences.notifications.sms}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Appearance</CardTitle>
                  <CardDescription>Customize how the app looks and feels</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="theme">Theme</Label>
                    <Select defaultValue={studentProfile.preferences.theme}>
                      <SelectTrigger id="theme">
                        <SelectValue placeholder="Select theme" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="light">Light</SelectItem>
                        <SelectItem value="dark">Dark</SelectItem>
                        <SelectItem value="system">System</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="highContrast">High Contrast</Label>
                      <p className="text-sm text-muted-foreground">
                        Increase contrast for better visibility
                      </p>
                    </div>
                    <Switch
                      id="highContrast"
                      checked={studentProfile.preferences.accessibility.highContrast}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="largeText">Large Text</Label>
                      <p className="text-sm text-muted-foreground">
                        Increase text size for better readability
                      </p>
                    </div>
                    <Switch
                      id="largeText"
                      checked={studentProfile.preferences.accessibility.largeText}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Account Security</CardTitle>
                  <CardDescription>Manage your account security settings</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <p className="font-medium">Change Password</p>
                      <p className="text-sm text-muted-foreground">
                        Update your password regularly for better security
                      </p>
                    </div>
                    <Button variant="outline" size="sm">
                      <Key className="h-4 w-4 mr-2" />
                      Change Password
                    </Button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <p className="font-medium">Two-Factor Authentication</p>
                      <p className="text-sm text-muted-foreground">
                        Add an extra layer of security to your account
                      </p>
                    </div>
                    <Button variant="outline" size="sm">
                      <Shield className="h-4 w-4 mr-2" />
                      Enable
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