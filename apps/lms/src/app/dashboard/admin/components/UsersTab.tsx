import { useState, useEffect } from 'react';
import { adminService } from '@/services';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { UserViewModel, ApiUser } from '@/types/admin';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

export default function UsersTab() {
  const router = useRouter();
  const [users, setUsers] = useState<UserViewModel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const transformedUsers = await adminService.getUsers();
      setUsers(transformedUsers);
      setError(null);
    } catch (err) {
      setError('Failed to fetch users');
      console.error('Error fetching users:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (user: UserViewModel) => {
    try {
      if (user.isActive) {
        await adminService.suspendUser(user.id);
      } else {
        await adminService.reinstateUser(user.id);
      }
      fetchUsers();
    } catch (err) {
      setError('Failed to update user status');
      console.error('Error updating user status:', err);
    }
  };

  const handleEditUser = (user: UserViewModel) => {
    // Convert the view model back to API format for storage
    const apiUser: ApiUser = {
      id: user.id,
      email: user.email,
      first_name: user.firstName,
      last_name: user.lastName,
      role: user.role,
      school_id: user.schoolId,
      is_active: user.isActive,
      created_at: user.createdAt,
    };
    
    // Store the user data in localStorage for the edit page to use
    localStorage.setItem('editUser', JSON.stringify(apiUser));
    router.push(`/dashboard/admin/users/edit/${user.id}`);
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
        <Link href="/dashboard/admin/users/add">
          <Button
            variant="default"
            size="lg"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-user-plus">
              <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
              <circle cx="8.5" cy="7.5" r="4"/>
              <path d="M20 8v6"/>
              <path d="M23 11h-6"/>
            </svg>
            Add User
          </Button>
        </Link>
      </div>

      {/* Users Table */}
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-lg font-medium">Name</TableHead>
              <TableHead className="text-lg font-medium">Email</TableHead>
              <TableHead className="text-lg font-medium">Role</TableHead>
              {/* <th className="text-left py-3 px-4 text-secondary-md">School</th> */}
              <TableHead className="text-lg font-medium">Status</TableHead>
              <TableHead className="text-lg font-medium">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id} className="border-b border-border">
                <TableCell className="text-md">
                  {user.firstName} {user.lastName}
                </TableCell>
                <TableCell className="text-md">{user.email}</TableCell>
                <TableCell className="text-md">
                  <span
                    className={`px-2 py-1 rounded-full text-sm ${
                      user.role === 'super_admin'
                        ? 'bg-purple-100 text-purple-800'
                        : user.role === 'school_admin'
                        ? 'bg-blue-100 text-blue-800'
                        : user.role === 'teacher'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {user.role}
                  </span>
                </TableCell>
                {/* <td className="py-3 px-4 section-text-small">{user.schoolId || '-'}</td> */}
                <TableCell className="text-md">
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${
                      user.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {user.isActive ? 'Active' : 'Inactive'}
                  </span>
                </TableCell>
                <TableCell className="text-md">
                  <Button
                    variant="link"
                    size="sm"
                    onClick={() => handleEditUser(user)}
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
                      className="lucide lucide-pencil"
                    >
                      <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5 11.5-11.5Z"/>
                    </svg>
                  </Button>
                  <Button
                    variant="link"
                    size="sm"
                    onClick={() => handleToggleStatus(user)}
                  >
                    {user.isActive ? 
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
                        className="lucide lucide-x"
                      >
                        <path d="M18 6 6 18"/>
                        <path d="m6 6 12 12"/>
                      </svg>
                    : <svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        width="24" 
                        height="24" 
                        viewBox="0 0 24 24" 
                        // fill="none" 
                        // stroke="currentColor" 
                        strokeWidth="2" 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        className="lucide lucide-check"
                        style={{ fill: 'red-500' }}
                      >
                        <path d="M20 6 9 17l-5-5"/>
                      </svg>
                    }
                  </Button>
                  <Button 
                    variant="link"
                    size="sm"
                    // onClick={() => handleDeleteUser(user)}
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