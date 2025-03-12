'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { adminService } from '@/services/adminService';

type SubscriptionStatus = 'trial' | 'active' | 'expired' | 'cancelled' | 'past_due';

interface School {
  id: string;
  name: string;
  code: string;
  domain: string;
  description?: string;
  contact_email: string;
  contact_phone?: string;
  timezone: string;
  address?: string;
  subscription_status: SubscriptionStatus;
  max_students: number;
  max_teachers: number;
  created_at: string;
  updated_at: string;
}

export default function EditSchoolPage() {
  const router = useRouter();
  const params = useParams();
  const schoolId = params.id as string;
  
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
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
  });

  useEffect(() => {
    // Load school data from localStorage
    const storedSchool = localStorage.getItem('editSchool');
    if (storedSchool) {
      try {
        const school = JSON.parse(storedSchool) as School;
        if (school.id === schoolId) {
          setFormData({
            name: school.name || '',
            code: school.code || '',
            domain: school.domain || '',
            description: school.description || '',
            contact_email: school.contact_email || '',
            contact_phone: school.contact_phone || '',
            timezone: school.timezone || 'UTC',
            address: school.address || '',
            subscription_status: school.subscription_status || 'trial',
            max_students: school.max_students || 100,
            max_teachers: school.max_teachers || 10,
            settings: {},
          });
        }
      } catch (err) {
        console.error('Error parsing stored school:', err);
        setError('Failed to load school data');
      }
    } else {
      // If no stored school, fetch from API
      fetchSchool();
    }
  }, [schoolId]);

  const fetchSchool = async () => {
    try {
      setLoading(true);
      const school = await adminService.getSchool(schoolId);
      setFormData({
        name: school.name || '',
        code: school.code || '',
        domain: school.domain || '',
        description: school.description || '',
        contact_email: school.contact_email || '',
        contact_phone: school.contact_phone || '',
        timezone: school.timezone || 'UTC',
        address: school.address || '',
        subscription_status: school.subscription_status || 'trial',
        max_students: school.max_students || 100,
        max_teachers: school.max_teachers || 10,
        settings: school.settings || {},
      });
    } catch (err) {
      console.error('Error fetching school:', err);
      setError('Failed to fetch school data');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await adminService.updateSchool(schoolId, formData);
      router.push('/dashboard/admin/schools');
    } catch (err: any) {
      const errorMessage = err.response?.data?.detail || 'Failed to update school';
      setError(errorMessage);
      console.error('Error updating school:', err.response?.data || err);
    } finally {
      setLoading(false);
    }
  };

  if (loading && !formData.name) {
    return <div className="flex justify-center items-center h-64">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Edit School: {formData.name}</h2>
        <button
          onClick={() => router.push('/dashboard/admin/schools')}
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
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div>
            <h3 className="text-lg font-medium mb-4">Basic Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                  placeholder="example.edu"
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
          </div>

          {/* Contact Information */}
          <div>
            <h3 className="text-lg font-medium mb-4">Contact Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                  placeholder="+1 (123) 456-7890"
                />
              </div>
              <div>
                <label className="section-text-small mb-1 block">Timezone</label>
                <select
                  value={formData.timezone}
                  onChange={(e) => setFormData({ ...formData, timezone: e.target.value })}
                  className="w-full p-2 border rounded border-text-secondary bg-background-secondary text-text-primary"
                  required
                >
                  <option value="UTC">UTC</option>
                  <option value="America/New_York">Eastern Time (ET)</option>
                  <option value="America/Chicago">Central Time (CT)</option>
                  <option value="America/Denver">Mountain Time (MT)</option>
                  <option value="America/Los_Angeles">Pacific Time (PT)</option>
                  <option value="Europe/London">London</option>
                  <option value="Europe/Paris">Paris</option>
                  <option value="Asia/Tokyo">Tokyo</option>
                  <option value="Asia/Shanghai">Shanghai</option>
                  <option value="Australia/Sydney">Sydney</option>
                </select>
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
          </div>

          {/* Subscription Details */}
          <div>
            <h3 className="text-lg font-medium mb-4">Subscription Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                  onChange={(e) => setFormData({ ...formData, max_students: parseInt(e.target.value) || 0 })}
                  className="w-full p-2 border rounded border-text-secondary bg-background-secondary text-text-primary"
                  min="0"
                  required
                />
              </div>
              <div>
                <label className="section-text-small mb-1 block">Max Teachers</label>
                <input
                  type="number"
                  value={formData.max_teachers}
                  onChange={(e) => setFormData({ ...formData, max_teachers: parseInt(e.target.value) || 0 })}
                  className="w-full p-2 border rounded border-text-secondary bg-background-secondary text-text-primary"
                  min="0"
                  required
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-3 mt-6 pt-4 border-t border-text-secondary">
            <button
              type="button"
              onClick={() => router.push('/dashboard/admin/schools')}
              className="px-4 py-2 border rounded border-text-secondary bg-background-secondary hover:bg-gray-50 text-text-primary section-text-small"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-button-primary rounded hover:bg-button-primary/90 section-text-small text-white"
              disabled={loading}
            >
              {loading ? 'Saving...' : 'Update School'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 