import { useState, useEffect } from 'react';
import { adminService } from '@/services';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { UserViewModel, ApiUser } from '@/types/admin';

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
          <button
            className="text-md-medium px-4 py-2 bg-button-primary text-white rounded-lg hover:bg-button-primary/90"
          >
            Add User
          </button>
        </Link>
      </div>

      {/* Users Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left py-3 px-4 text-text-secondary text-lg-medium">Name</th>
              <th className="text-left py-3 px-4 text-text-secondary text-lg-medium">Email</th>
              <th className="text-left py-3 px-4 text-text-secondary text-lg-medium">Role</th>
              {/* <th className="text-left py-3 px-4 text-text-secondary section-text-small">School</th> */}
              <th className="text-left py-3 px-4 text-text-secondary text-lg-medium">Status</th>
              <th className="text-left py-3 px-4 text-text-secondary text-lg-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="border-b border-border">
                <td className="py-3 px-4 text-md">
                  {user.firstName} {user.lastName}
                </td>
                <td className="py-3 px-4 text-md">{user.email}</td>
                <td className="py-3 px-4 text-md">
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${
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
                </td>
                {/* <td className="py-3 px-4 section-text-small">{user.schoolId || '-'}</td> */}
                <td className="py-3 px-4 text-md">
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${
                      user.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {user.isActive ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="py-3 px-4 text-md">
                  <button
                    onClick={() => handleEditUser(user)}
                    className="text-button-primary hover:underline mr-3"
                  >
                    Edit
                  </button>
                  <span className="text-md">|</span>
                  <button
                    onClick={() => handleToggleStatus(user)}
                    className="text-button-primary hover:underline mx-3"
                  >
                    {user.isActive ? 'Deactivate' : 'Activate'}
                  </button>
                  <span className="text-md">|</span>
                  <button 
                    // onClick={() => handleDeleteUser(user)}
                    className="text-red-600 hover:underline ml-3">
                      Delete
                    </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
} 