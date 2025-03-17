'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { adminService } from '@/services';
import { ApiUser, UserViewModel } from '@/types/admin';

export default function EditUserPage() {
  const router = useRouter();
  const params = useParams();
  const userId = params.id as string;
  
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    first_name: '',
    last_name: '',
    role: 'student',
    school_id: '',
  });

  useEffect(() => {
    // Load user data from localStorage
    const storedUser = localStorage.getItem('editUser');
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser) as ApiUser;
        if (user.id === userId) {
          setFormData({
            email: user.email || '',
            first_name: user.first_name || '',
            last_name: user.last_name || '',
            role: user.role || 'student',
            school_id: user.school_id || '',
          });
        }
      } catch (err) {
        console.error('Error parsing stored user:', err);
        setError('Failed to load user data');
      }
    } else {
      // If no stored user, fetch from API
      fetchUser();
    }
  }, [userId]);

  const fetchUser = async () => {
    try {
      setLoading(true);
      const user = await adminService.getUser(userId);
      // Convert from UserViewModel to form data format
      setFormData({
        email: user.email || '',
        first_name: user.firstName || '',
        last_name: user.lastName || '',
        role: user.role || 'student',
        school_id: user.schoolId || '',
      });
    } catch (err) {
      console.error('Error fetching user:', err);
      setError('Failed to fetch user data');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await adminService.updateUser(userId, {
        first_name: formData.first_name,
        last_name: formData.last_name,
        role: formData.role,
        school_id: formData.school_id || undefined,
      });
      router.push('/dashboard/admin/users');
    } catch (err: any) {
      setError(err.message || 'Failed to update user');
      console.error('Error updating user:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async () => {
    try {
      setDeleteLoading(true);
      await adminService.deleteUser(userId);
      router.push('/dashboard/admin/users');
    } catch (err) {
      console.error('Error deleting user:', err);
      setError('Failed to delete user');
      setShowDeleteModal(false);
    } finally {
      setDeleteLoading(false);
    }
  };

  if (loading && !formData.first_name) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-md">Loading user data...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="heading-lg">Edit User</h2>
        <button
          onClick={() => router.push('/dashboard/admin/users')}
          className="px-4 py-2 border rounded border-border bg-background-secondary hover:bg-gray-50 text-md"
        >
          Back to Users
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      <div className="bg-background rounded-lg p-6 border border-border">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-secondary-sm mb-1 block font-medium">First Name</label>
              <input
                type="text"
                value={formData.first_name}
                onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                className="w-full p-2 border rounded border-border bg-background-secondary text-text-primary"
                required
              />
            </div>
            <div>
              <label className="text-secondary-sm mb-1 block font-medium">Last Name</label>
              <input
                type="text"
                value={formData.last_name}
                onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                className="w-full p-2 border rounded border-border bg-background-secondary text-text-primary"
                required
              />
            </div>
          </div>

          <div>
            <label className="text-secondary-sm mb-1 block font-medium">Email</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full p-2 border rounded border-border bg-background-secondary text-text-primary"
              required
            />
          </div>

          <div>
            <label className="text-secondary-sm mb-1 block font-medium">Role</label>
            <select
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              className="w-full p-2 border rounded border-border bg-background-secondary text-text-primary"
              required
            >
              <option value="student">Student</option>
              <option value="teacher">Teacher</option>
              <option value="school_admin">School Admin</option>
              <option value="super_admin">Super Admin</option>
            </select>
          </div>

          <div>
            <label className="text-secondary-sm mb-1 block font-medium">School ID (Optional)</label>
            <input
              type="text"
              value={formData.school_id}
              onChange={(e) => setFormData({ ...formData, school_id: e.target.value })}
              className="w-full p-2 border rounded border-border bg-background-secondary text-text-primary"
            />
          </div>

          <div className="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              onClick={() => setShowDeleteModal(true)}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 text-md"
            >
              Delete User
            </button>
            <button
              type="submit"
              className="bg-button-primary text-white px-4 py-2 rounded hover:bg-button-primary/90 text-md"
              disabled={loading}
            >
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-background p-6 rounded-lg shadow-lg max-w-md w-full">
            <h3 className="heading-md mb-4">Confirm Deletion</h3>
            <p className="text-md mb-6">
              Are you sure you want to delete this user? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 border rounded border-border bg-background-secondary hover:bg-gray-100 text-md"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteUser}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 text-md"
                disabled={deleteLoading}
              >
                {deleteLoading ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 