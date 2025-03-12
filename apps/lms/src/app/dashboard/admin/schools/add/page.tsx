'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { adminService } from '@/services/adminService';

type SubscriptionStatus = 'trial' | 'active' | 'expired' | 'cancelled' | 'past_due';

export default function AddSchoolPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    domain: '',
    description: '',
    contact_email: '',
    contact_phone: '',
    timezone: 'UTC',
    address: '',
    subscription_status: 'trial' as SubscriptionStatus,
    max_students: 100,
    max_teachers: 10,
    settings: {},
    admin: {
      email: '',
      password: '',
      first_name: '',
      last_name: '',
    }
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await adminService.createSchool(formData);
      router.push('/dashboard/admin/schools');
    } catch (err: any) {
      const errorMessage = err.response?.data?.detail || 'Failed to create school';
      setError(errorMessage);
      console.error('Error creating school:', err.response?.data || err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Add New School</h2>
        <button
          onClick={() => router.back()}
          className="px-4 py-2 border rounded border-text-secondary bg-background-secondary hover:bg-gray-50 text-text-primary section-text-small"
        >
          Back to Schools
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      <div className="bg-background rounded-lg p-6 border border-text-secondary">
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <h4 className="font-medium text-lg">Basic Information</h4>
              <div>
                <label className="section-text-small mb-1 block">School Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full p-2 border rounded border-text-secondary bg-background-secondary text-text-primary"
                  required
                />
              </div>
              <div>
                <label className="section-text-small mb-1 block">School Code</label>
                <input
                  type="text"
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                  className="w-full p-2 border rounded border-text-secondary bg-background-secondary text-text-primary"
                  required
                />
              </div>
              <div>
                <label className="section-text-small mb-1 block">Domain</label>
                <input
                  type="text"
                  value={formData.domain}
                  onChange={(e) => setFormData({ ...formData, domain: e.target.value })}
                  className="w-full p-2 border rounded border-text-secondary bg-background-secondary text-text-primary"
                  required
                />
              </div>
              <div>
                <label className="section-text-small mb-1 block">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full p-2 border rounded border-text-secondary bg-background-secondary text-text-primary"
                  rows={3}
                />
              </div>
            </div>

            {/* Contact Information */}
            <div className="space-y-4">
              <h4 className="font-medium text-lg">Contact Information</h4>
              <div>
                <label className="section-text-small mb-1 block">Contact Email</label>
                <input
                  type="email"
                  value={formData.contact_email}
                  onChange={(e) => setFormData({ ...formData, contact_email: e.target.value })}
                  className="w-full p-2 border rounded border-text-secondary bg-background-secondary text-text-primary"
                  required
                />
              </div>
              <div>
                <label className="section-text-small mb-1 block">Contact Phone</label>
                <input
                  type="tel"
                  value={formData.contact_phone}
                  onChange={(e) => setFormData({ ...formData, contact_phone: e.target.value })}
                  className="w-full p-2 border rounded border-text-secondary bg-background-secondary text-text-primary"
                />
              </div>
              <div>
                <label className="section-text-small mb-1 block">Timezone</label>
                <input
                  type="text"
                  value={formData.timezone}
                  onChange={(e) => setFormData({ ...formData, timezone: e.target.value })}
                  className="w-full p-2 border rounded border-text-secondary bg-background-secondary text-text-primary"
                  required
                />
              </div>
              <div>
                <label className="section-text-small mb-1 block">Address</label>
                <textarea
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full p-2 border rounded border-text-secondary bg-background-secondary text-text-primary"
                  rows={3}
                />
              </div>
            </div>

            {/* Subscription Information */}
            <div className="space-y-4">
              <h4 className="font-medium text-lg">Subscription Information</h4>
              <div>
                <label className="section-text-small mb-1 block">Subscription Status</label>
                <select
                  value={formData.subscription_status}
                  onChange={(e) => setFormData({ ...formData, subscription_status: e.target.value as SubscriptionStatus })}
                  className="w-full p-2 border rounded border-text-secondary bg-background-secondary text-text-primary"
                  required
                >
                  <option value="trial">Trial</option>
                  <option value="active">Active</option>
                  <option value="expired">Expired</option>
                  <option value="cancelled">Cancelled</option>
                  <option value="past_due">Past Due</option>
                </select>
              </div>
              <div>
                <label className="section-text-small mb-1 block">Max Students</label>
                <input
                  type="number"
                  value={formData.max_students}
                  onChange={(e) => setFormData({ ...formData, max_students: parseInt(e.target.value) })}
                  className="w-full p-2 border rounded border-text-secondary bg-background-secondary text-text-primary"
                  required
                />
              </div>
              <div>
                <label className="section-text-small mb-1 block">Max Teachers</label>
                <input
                  type="number"
                  value={formData.max_teachers}
                  onChange={(e) => setFormData({ ...formData, max_teachers: parseInt(e.target.value) })}
                  className="w-full p-2 border rounded border-text-secondary bg-background-secondary text-text-primary"
                  required
                />
              </div>
            </div>

            {/* Admin Information */}
            <div className="space-y-4">
              <h4 className="font-medium text-lg">Admin Information</h4>
              <div>
                <label className="section-text-small mb-1 block">Admin Email</label>
                <input
                  type="email"
                  value={formData.admin.email}
                  onChange={(e) => setFormData({ ...formData, admin: { ...formData.admin, email: e.target.value } })}
                  className="w-full p-2 border rounded border-text-secondary bg-background-secondary text-text-primary"
                  required
                />
              </div>
              <div>
                <label className="section-text-small mb-1 block">Admin Password</label>
                <input
                  type="password"
                  value={formData.admin.password}
                  onChange={(e) => setFormData({ ...formData, admin: { ...formData.admin, password: e.target.value } })}
                  className="w-full p-2 border rounded border-text-secondary bg-background-secondary text-text-primary"
                  required
                />
              </div>
              <div>
                <label className="section-text-small mb-1 block">Admin First Name</label>
                <input
                  type="text"
                  value={formData.admin.first_name}
                  onChange={(e) => setFormData({ ...formData, admin: { ...formData.admin, first_name: e.target.value } })}
                  className="w-full p-2 border rounded border-text-secondary bg-background-secondary text-text-primary"
                  required
                />
              </div>
              <div>
                <label className="section-text-small mb-1 block">Admin Last Name</label>
                <input
                  type="text"
                  value={formData.admin.last_name}
                  onChange={(e) => setFormData({ ...formData, admin: { ...formData.admin, last_name: e.target.value } })}
                  className="w-full p-2 border rounded border-text-secondary bg-background-secondary text-text-primary"
                  required
                />
              </div>
            </div>
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
              Add School
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 