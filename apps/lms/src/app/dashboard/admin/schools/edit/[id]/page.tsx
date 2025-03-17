'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { adminService } from '@/services/adminService';
import { SchoolViewModel } from '@/types/school';

type SubscriptionStatus = 'trial' | 'active' | 'expired' | 'cancelled' | 'past_due';

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
  subscriptionStatus: SubscriptionStatus;
  maxStudents: number;
  maxTeachers: number;
  createdAt: string;
  updatedAt: string;
}

export default function EditSchoolPage() {
  const router = useRouter();
  const params = useParams();
  const schoolId = params.id as string;
  
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showSuspendModal, setShowSuspendModal] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [toggleStatusLoading, setToggleStatusLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    domain: '',
    description: '',
    contactEmail: '',
    contactPhone: '',
    timezone: 'UTC',
    address: '',
    subscriptionStatus: 'trial' as SubscriptionStatus,
    maxStudents: 100,
    maxTeachers: 10,
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
            contactEmail: school.contactEmail || '',
            contactPhone: school.contactPhone || '',
            timezone: school.timezone || 'UTC',
            address: school.address || '',
            subscriptionStatus: school.subscriptionStatus || 'trial',
            maxStudents: school.maxStudents || 100,
            maxTeachers: school.maxTeachers || 10,
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
        contactEmail: school.contactEmail || '',
        contactPhone: school.contactPhone || '',
        timezone: school.timezone || 'UTC',
        address: school.address || '',
        subscriptionStatus: school.subscriptionStatus || 'trial',
        maxStudents: school.maxStudents || 100,
        maxTeachers: school.maxTeachers || 10,
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

  const handleDeleteSchool = async () => {
    try {
      setDeleteLoading(true);
      await adminService.deleteSchool(schoolId);
      router.push('/dashboard/admin/schools');
    } catch (err) {
      console.error('Error deleting school:', err);
      setError('Failed to delete school');
      setShowDeleteModal(false);
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleToggleStatus = async () => {
    try {
      setToggleStatusLoading(true);
      if (formData.subscriptionStatus === 'cancelled') {
        await adminService.updateSchool(schoolId, {
          subscription_status: 'active'
        });
        setFormData({ ...formData, subscriptionStatus: 'active' });
      } else {
        await adminService.updateSchool(schoolId, {
          subscription_status: 'cancelled'
        });
        setFormData({ ...formData, subscriptionStatus: 'cancelled' });
      }
      setShowSuspendModal(false);
    } catch (err) {
      console.error('Error toggling school status:', err);
      setError('Failed to update school status');
    } finally {
      setToggleStatusLoading(false);
    }
  };

  if (loading && !formData.name) {
    return <div className="flex justify-center items-center h-64">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="heading-lg">Edit School</h2>
        <button
          onClick={() => router.push('/dashboard/admin/schools')}
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
                  value={formData.contactEmail}
                  onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                  className="w-full p-2 border rounded border-border bg-background-secondary text-text-primary"
                  required
                />
              </div>
              <div>
                <label className="text-secondary-sm mb-1 block font-medium">Contact Phone</label>
                <input
                  type="tel"
                  value={formData.contactPhone}
                  onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
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
                  value={formData.subscriptionStatus}
                  onChange={(e) => setFormData({ ...formData, subscriptionStatus: e.target.value as SubscriptionStatus })}
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
                  value={formData.maxStudents}
                  onChange={(e) => setFormData({ ...formData, maxStudents: parseInt(e.target.value) || 0 })}
                  className="w-full p-2 border rounded border-border bg-background-secondary text-text-primary"
                  min="1"
                  required
                />
              </div>
              <div>
                <label className="text-secondary-sm mb-1 block font-medium">Max Teachers</label>
                <input
                  type="number"
                  value={formData.maxTeachers}
                  onChange={(e) => setFormData({ ...formData, maxTeachers: parseInt(e.target.value) || 0 })}
                  className="w-full p-2 border rounded border-border bg-background-secondary text-text-primary"
                  min="1"
                  required
                />
              </div>
            </div>

            {/* Management Options */}
            <div className="space-y-4">
              <h3 className="heading-md">Management Options</h3>
              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <h4 className="text-md font-medium text-yellow-800 mb-2">Danger Zone</h4>
                <p className="text-secondary-sm mb-4">These actions may have significant consequences.</p>
                <div className="space-y-3">
                  <button
                    type="button"
                    onClick={() => setShowSuspendModal(true)}
                    className="w-full px-4 py-2 border border-yellow-300 rounded bg-yellow-50 hover:bg-yellow-100 text-sm text-yellow-800"
                  >
                    {formData.subscriptionStatus === 'cancelled' ? 'Restore School Access' : 'Suspend School Access'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowDeleteModal(true)}
                    className="w-full px-4 py-2 border border-red-300 rounded bg-red-50 hover:bg-red-100 text-sm text-red-800"
                  >
                    Delete School
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-4 mt-8">
            <button
              type="button"
              onClick={() => router.push('/dashboard/admin/schools')}
              className="px-4 py-2 border rounded border-border bg-background-secondary hover:bg-gray-50 text-md"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-button-primary text-white rounded-lg hover:bg-button-primary/90 text-md"
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
              Are you sure you want to delete this school? This action cannot be undone and will remove all associated data.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 border rounded border-border bg-background-secondary hover:bg-gray-100 text-md"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteSchool}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 text-md"
                disabled={deleteLoading}
              >
                {deleteLoading ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Suspend Confirmation Modal */}
      {showSuspendModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-background p-6 rounded-lg shadow-lg max-w-md w-full">
            <h3 className="heading-md mb-4">
              {formData.subscriptionStatus === 'cancelled' ? 'Restore School Access' : 'Suspend School Access'}
            </h3>
            <p className="text-md mb-6">
              {formData.subscriptionStatus === 'cancelled'
                ? 'Are you sure you want to restore access for this school? This will reactivate all accounts associated with this school.'
                : 'Are you sure you want to suspend access for this school? This will prevent all users from accessing their accounts.'}
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowSuspendModal(false)}
                className="px-4 py-2 border rounded border-border bg-background-secondary hover:bg-gray-100 text-md"
              >
                Cancel
              </button>
              <button
                onClick={handleToggleStatus}
                className={`${
                  formData.subscriptionStatus === 'cancelled' ? 'bg-green-500 hover:bg-green-600' : 'bg-yellow-500 hover:bg-yellow-600'
                } text-white px-4 py-2 rounded text-md`}
                disabled={toggleStatusLoading}
              >
                {toggleStatusLoading
                  ? 'Processing...'
                  : formData.subscriptionStatus === 'cancelled'
                  ? 'Restore'
                  : 'Suspend'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 