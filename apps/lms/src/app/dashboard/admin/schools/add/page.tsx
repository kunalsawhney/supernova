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
        <h2 className="heading-lg">Add New School</h2>
        <button
          onClick={() => router.back()}
          className="px-4 py-2 border rounded border-border bg-background-secondary hover:bg-gray-50 text-md"
        >
          Back to Schools
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      <div className="bg-background rounded-lg p-6 border border-border">
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="heading-md">Basic Information</h3>
              <div>
                <label className="text-secondary-sm mb-1 block font-medium">School Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full p-2 border rounded border-border bg-background-secondary text-text-primary"
                  required
                />
              </div>
              <div>
                <label className="text-secondary-sm mb-1 block font-medium">School Code</label>
                <input
                  type="text"
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                  className="w-full p-2 border rounded border-border bg-background-secondary text-text-primary"
                  required
                />
              </div>
              <div>
                <label className="text-secondary-sm mb-1 block font-medium">Domain</label>
                <input
                  type="text"
                  value={formData.domain}
                  onChange={(e) => setFormData({ ...formData, domain: e.target.value })}
                  className="w-full p-2 border rounded border-border bg-background-secondary text-text-primary"
                  required
                />
              </div>
              <div>
                <label className="text-secondary-sm mb-1 block font-medium">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full p-2 border rounded border-border bg-background-secondary text-text-primary h-20"
                />
              </div>
            </div>

            {/* Contact Information */}
            <div className="space-y-4">
              <h3 className="heading-md">Contact Information</h3>
              <div>
                <label className="text-secondary-sm mb-1 block font-medium">Contact Email</label>
                <input
                  type="email"
                  value={formData.contact_email}
                  onChange={(e) => setFormData({ ...formData, contact_email: e.target.value })}
                  className="w-full p-2 border rounded border-border bg-background-secondary text-text-primary"
                  required
                />
              </div>
              <div>
                <label className="text-secondary-sm mb-1 block font-medium">Contact Phone</label>
                <input
                  type="tel"
                  value={formData.contact_phone}
                  onChange={(e) => setFormData({ ...formData, contact_phone: e.target.value })}
                  className="w-full p-2 border rounded border-border bg-background-secondary text-text-primary"
                />
              </div>
              <div>
                <label className="text-secondary-sm mb-1 block font-medium">Timezone</label>
                <select
                  value={formData.timezone}
                  onChange={(e) => setFormData({ ...formData, timezone: e.target.value })}
                  className="w-full p-2 border rounded border-border bg-background-secondary text-text-primary"
                  required
                >
                  <option value="UTC">UTC</option>
                  <option value="America/New_York">Eastern Time (ET)</option>
                  <option value="America/Chicago">Central Time (CT)</option>
                  <option value="America/Denver">Mountain Time (MT)</option>
                  <option value="America/Los_Angeles">Pacific Time (PT)</option>
                  <option value="Asia/Kolkata">Indian Standard Time (IST)</option>
                </select>
              </div>
              <div>
                <label className="text-secondary-sm mb-1 block font-medium">Address</label>
                <textarea
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full p-2 border rounded border-border bg-background-secondary text-text-primary h-20"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            {/* Subscription Details */}
            <div className="space-y-4">
              <h3 className="heading-md">Subscription Details</h3>
              <div>
                <label className="text-secondary-sm mb-1 block font-medium">Status</label>
                <select
                  value={formData.subscription_status}
                  onChange={(e) => setFormData({ ...formData, subscription_status: e.target.value as SubscriptionStatus })}
                  className="w-full p-2 border rounded border-border bg-background-secondary text-text-primary"
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
                <label className="text-secondary-sm mb-1 block font-medium">Max Students</label>
                <input
                  type="number"
                  value={formData.max_students}
                  onChange={(e) => setFormData({ ...formData, max_students: parseInt(e.target.value) || 0 })}
                  className="w-full p-2 border rounded border-border bg-background-secondary text-text-primary"
                  min="1"
                  required
                />
              </div>
              <div>
                <label className="text-secondary-sm mb-1 block font-medium">Max Teachers</label>
                <input
                  type="number"
                  value={formData.max_teachers}
                  onChange={(e) => setFormData({ ...formData, max_teachers: parseInt(e.target.value) || 0 })}
                  className="w-full p-2 border rounded border-border bg-background-secondary text-text-primary"
                  min="1"
                  required
                />
              </div>
            </div>

            {/* Admin Account */}
            <div className="space-y-4">
              <h3 className="heading-md">Admin Account</h3>
              <div>
                <label className="text-secondary-sm mb-1 block font-medium">Admin Email</label>
                <input
                  type="email"
                  value={formData.admin.email}
                  onChange={(e) => setFormData({ ...formData, admin: { ...formData.admin, email: e.target.value } })}
                  className="w-full p-2 border rounded border-border bg-background-secondary text-text-primary"
                  required
                />
              </div>
              <div>
                <label className="text-secondary-sm mb-1 block font-medium">Admin Password</label>
                <input
                  type="password"
                  value={formData.admin.password}
                  onChange={(e) => setFormData({ ...formData, admin: { ...formData.admin, password: e.target.value } })}
                  className="w-full p-2 border rounded border-border bg-background-secondary text-text-primary"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-secondary-sm mb-1 block font-medium">First Name</label>
                  <input
                    type="text"
                    value={formData.admin.first_name}
                    onChange={(e) => setFormData({ ...formData, admin: { ...formData.admin, first_name: e.target.value } })}
                    className="w-full p-2 border rounded border-border bg-background-secondary text-text-primary"
                    required
                  />
                </div>
                <div>
                  <label className="text-secondary-sm mb-1 block font-medium">Last Name</label>
                  <input
                    type="text"
                    value={formData.admin.last_name}
                    onChange={(e) => setFormData({ ...formData, admin: { ...formData.admin, last_name: e.target.value } })}
                    className="w-full p-2 border rounded border-border bg-background-secondary text-text-primary"
                    required
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-4 mt-8">
            <button
              type="button"
              onClick={() => router.back()}
              className="px-4 py-2 border rounded border-border bg-background-secondary hover:bg-gray-50 text-md"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-button-primary text-white rounded-lg hover:bg-button-primary/90 text-md"
            >
              Create School
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 