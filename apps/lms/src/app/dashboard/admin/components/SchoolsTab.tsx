import { useState, useEffect } from 'react';
import { adminService } from '@/services/adminService';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface School {
  id: string;
  name: string;
  code: string;
  domain: string;
  description?: string;
  contactEmail: string;
  contactPhone?: string;
  timezone: string;
  address?: string;
  subscriptionStatus: 'trial' | 'active' | 'expired' | 'cancelled' | 'past_due';
  maxStudents: number;
  maxTeachers: number;
  createdAt: string;
  updatedAt: string;
}

type SubscriptionStatus = 'trial' | 'active' | 'expired' | 'cancelled' | 'past_due';

export default function SchoolsTab() {
  const router = useRouter();
  const [schools, setSchools] = useState<School[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchSchools();
  }, []);

  const fetchSchools = async () => {
    try {
      setLoading(true);
      const data = await adminService.getSchools();
      setSchools(data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch schools');
      console.error('Error fetching schools:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleEditSchool = (school: School) => {
    // Store the school data in localStorage for the edit page to use
    localStorage.setItem('editSchool', JSON.stringify(school));
    router.push(`/dashboard/admin/schools/edit/${school.id}`);
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading...</div>;
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <Link href="/dashboard/admin/schools/add">
          <Button
            variant="default"
            size="lg"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-school">
              <path d="M12 2 2 22h20L12 2Z"/>
              <polyline points="12 2 22 22 12 22 2 22"/>
            </svg>
            Add School
          </Button>
        </Link>
      </div>

      {/* Schools Table */}
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-lg font-medium">Name</TableHead>
              <TableHead className="text-lg font-medium">Domain</TableHead>
              <TableHead className="text-lg font-medium">Contact</TableHead>
              <TableHead className="text-lg font-medium">Subscription</TableHead>
              <TableHead className="text-lg font-medium">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {schools.map((school) => (
              <TableRow key={school.id} className="border-b border-border">
                <TableCell className="text-md">
                  <div>
                    <p className="text-md">{school.name}</p>
                    {/* <p className="text-secondary-sm">{school.code}</p> */}
                  </div>
                </TableCell>
                <TableCell className="text-md">{school.domain}</TableCell>
                <TableCell className="text-md">
                  <div>
                    <p className="text-md">{school.contactEmail}</p>
                    <p className="text-secondary-sm">{school.contactPhone || 'No phone'}</p>
                  </div>
                </TableCell>
                <TableCell className="text-md">
                  <span
                    className={`px-2 py-1 text-sm rounded-full ${
                      school.subscriptionStatus === 'active'
                        ? 'bg-green-100 text-green-800'
                        : school.subscriptionStatus === 'trial'
                        ? 'bg-blue-100 text-blue-800'
                        : school.subscriptionStatus === 'past_due'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {school.subscriptionStatus}
                  </span>
                </TableCell>
                <TableCell className="text-md">
                  <Button
                    variant="link"
                    size="sm"
                    onClick={() => handleEditSchool(school)}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-pencil">
                      <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5 11.5-11.5Z"/>
                    </svg>
                  </Button>
                  <Button 
                    variant="link"
                    size="sm"
                    // onClick={() => handleDeleteSchool(school)}
                    className="text-red-600"
                  >
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      width="24" 
                      height="24" 
                      viewBox="0 0 24 24" 
                      fill="none" 
                      stroke="currentColor" 
                      strokeWidth="2" 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      className="lucide lucide-trash-2"
                    >
                      <path d="M3 6h18"/>
                      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/>
                      <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                    </svg>
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
} 