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
        <h2 className="heading-lg">Add New User</h2>
        <button
          onClick={() => router.back()}
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
            <label className="text-secondary-sm mb-1 block font-medium">Password</label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
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
          <div className="flex justify-end mt-6">
            <button
              type="submit"
              className="bg-button-primary text-white px-4 py-2 rounded hover:bg-button-primary/90 text-md"
            >
              Create User
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 