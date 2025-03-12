import { useState, useEffect } from 'react';
import { adminService } from '@/services/adminService';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

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
          <button
            className="text-md-medium px-4 py-2 bg-button-primary text-white rounded-lg hover:bg-button-primary/90"
          >
            Add School
          </button>
        </Link>
      </div>

      {/* Schools Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left py-3 px-4 text-text-secondary text-lg-medium">Name</th>
              <th className="text-left py-3 px-4 text-text-secondary text-lg-medium">Domain</th>
              <th className="text-left py-3 px-4 text-text-secondary text-lg-medium">Contact</th>
              <th className="text-left py-3 px-4 text-text-secondary text-lg-medium">Status</th>
              <th className="text-left py-3 px-4 text-text-secondary text-lg-medium">Capacity</th>
              <th className="text-left py-3 px-4 text-text-secondary text-lg-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {schools.map((school) => (
              <tr key={school.id} className="border-b border-border">
                <td className="py-3 px-4 text-md">{school.name}</td>
                <td className="py-3 px-4 text-md">{school.domain}</td>
                <td className="py-3 px-4 text-md">{school.contactEmail}</td>
                <td className="py-3 px-4 text-md">
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${
                      school.subscriptionStatus === 'active'
                        ? 'bg-green-100 text-green-800'
                        : school.subscriptionStatus === 'trial'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {school.subscriptionStatus}
                  </span>
                </td>
                <td className="py-3 px-4 text-md">
                  {school.maxStudents} students / {school.maxTeachers} teachers
                </td>
                <td className="py-3 px-4 text-md">
                  <button 
                    onClick={() => handleEditSchool(school)}
                    className="text-button-primary hover:underline mr-3"
                  >
                    Edit
                  </button>
                  <span className="text-md">|</span>
                  <button className="text-red-600 hover:underline mx-3">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
} 