import { useState, useEffect } from 'react';
import { adminService } from '@/services/adminService';

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  schoolId: string | null;
  isActive: boolean;
  createdAt: string;
}

interface ApiUser {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  role: string;
  school_id: string | null;
  is_active: boolean;
  created_at: string;
}

const transformUser = (user: ApiUser): User => ({
  id: user.id,
  email: user.email,
  firstName: user.first_name,
  lastName: user.last_name,
  role: user.role,
  schoolId: user.school_id,
  isActive: user.is_active,
  createdAt: user.created_at,
});

export default function UsersTab() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    first_name: '',
    last_name: '',
    role: 'student',
    school_id: '',
    settings: null as Record<string, any> | null,
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await adminService.getUsers();
      setUsers((data as unknown as ApiUser[]).map(transformUser));
      setError(null);
    } catch (err) {
      setError('Failed to fetch users');
      console.error('Error fetching users:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await adminService.createUser({
        ...formData,
        school_id: formData.school_id || undefined,
      });
      setShowAddModal(false);
      setFormData({
        email: '',
        password: '',
        first_name: '',
        last_name: '',
        role: 'student',
        school_id: '',
        settings: null,
      });
      fetchUsers();
    } catch (err) {
      setError('Failed to create user');
      console.error('Error creating user:', err);
    }
  };

  const handleToggleStatus = async (user: User) => {
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
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Users</h2>
        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2 bg-button-primary text-white rounded-lg hover:bg-button-primary/90"
        >
          Add User
        </button>
      </div>

      {/* Users Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left py-3 px-4 text-text-secondary section-text-small">Name</th>
              <th className="text-left py-3 px-4 text-text-secondary section-text-small">Email</th>
              <th className="text-left py-3 px-4 text-text-secondary section-text-small">Role</th>
              {/* <th className="text-left py-3 px-4 text-text-secondary section-text-small">School</th> */}
              <th className="text-left py-3 px-4 text-text-secondary section-text-small">Status</th>
              <th className="text-left py-3 px-4 text-text-secondary section-text-small">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="border-b border-border">
                <td className="py-3 px-4 section-text-small">
                  {user.firstName} {user.lastName}
                </td>
                <td className="py-3 px-4 section-text-small">{user.email}</td>
                <td className="py-3 px-4 section-text-small">
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
                <td className="py-3 px-4 section-text-small">
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${
                      user.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {user.isActive ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="py-3 px-4 pointer-events-none section-text-small">
                  <button
                    onClick={() => handleToggleStatus(user)}
                    className="text-button-primary hover:underline mr-3"
                  >
                    {user.isActive ? 'Deactivate' : 'Activate'}
                  </button>
                  <button className="text-red-600 hover:underline section-text-small">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add User Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-background rounded-lg p-6 w-full max-w-lg border border-text-secondary">
            <h3 className="mb-4 section-text">Add New User</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="section-text-small mb-1">First Name</label>
                  <input
                    type="text"
                    value={formData.first_name}
                    onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                    className="w-full p-2 border rounded border-text-secondary bg-background-secondary text-text-primary"
                    required
                  />
                </div>
                <div>
                  <label className="section-text-small mb-1">Last Name</label>
                  <input
                    type="text"
                    value={formData.last_name}
                    onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                    className="w-full p-2 border rounded border-text-secondary bg-background-secondary text-text-primary"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="section-text-small mb-1">Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full p-2 border rounded border-text-secondary bg-background-secondary text-text-primary"
                  required
                />
              </div>
              <div>
                <label className="section-text-small mb-1">Password</label>
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full p-2 border rounded border-text-secondary bg-background-secondary text-text-primary"
                  required
                />
              </div>
              <div>
                <label className="section-text-small mb-1">Role</label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  className="w-full p-2 border rounded border-text-secondary bg-background-secondary text-text-primary"
                  required
                >
                  <option value="student">Student</option>
                  <option value="teacher">Teacher</option>
                  <option value="school_admin">School Admin</option>
                  <option value="super_admin">Super Admin</option>
                </select>
              </div>
              <div>
                <label className="section-text-small mb-1">School ID (Optional)</label>
                <input
                  type="text"
                  value={formData.school_id}
                  onChange={(e) => setFormData({ ...formData, school_id: e.target.value })}
                  className="w-full p-2 border rounded border-text-secondary bg-background-secondary text-text-primary"
                  placeholder="Leave empty for platform-wide users"
                />
              </div>
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 border rounded border-text-secondary bg-background-secondary hover:bg-gray-50 text-text-primary section-text-small"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-button-primary rounded hover:bg-button-primary/90 section-text-small text-text-primary"
                >
                  Add User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
} 