'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { adminService } from '@/services';
import { CreateUserData } from '@/types/admin';

export default function AddUserPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<CreateUserData>({
    email: '',
    password: '',
    first_name: '',
    last_name: '',
    role: 'student',
    school_id: '',
    settings: null,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await adminService.createUser({
        ...formData,
        school_id: formData.school_id || undefined,
      });
      router.push('/dashboard/admin/users');
    } catch (err) {
      setError('Failed to create user');
      console.error('Error creating user:', err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Add New User</h2>
        <button
          onClick={() => router.back()}
          className="px-4 py-2 border rounded border-text-secondary bg-background-secondary hover:bg-gray-50 text-text-primary section-text-small"
        >
          Back to Users
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      <div className="bg-background rounded-lg p-6 border border-text-secondary">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="section-text-small mb-1 block">First Name</label>
              <input
                type="text"
                value={formData.first_name}
                onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                className="w-full p-2 border rounded border-text-secondary bg-background-secondary text-text-primary"
                required
              />
            </div>
            <div>
              <label className="section-text-small mb-1 block">Last Name</label>
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
            <label className="section-text-small mb-1 block">Email</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full p-2 border rounded border-text-secondary bg-background-secondary text-text-primary"
              required
            />
          </div>
          <div>
            <label className="section-text-small mb-1 block">Password</label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="w-full p-2 border rounded border-text-secondary bg-background-secondary text-text-primary"
              required
            />
          </div>
          <div>
            <label className="section-text-small mb-1 block">Role</label>
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
            <label className="section-text-small mb-1 block">School ID (Optional)</label>
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
              onClick={() => router.back()}
              className="px-4 py-2 border rounded border-text-secondary bg-background-secondary hover:bg-gray-50 text-text-primary section-text-small"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-button-primary rounded hover:bg-button-primary/90 section-text-small text-white"
            >
              Add User
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 