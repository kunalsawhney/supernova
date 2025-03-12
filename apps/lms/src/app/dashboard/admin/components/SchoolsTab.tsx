import { useState, useEffect } from 'react';
import { adminService } from '@/services/adminService';

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
  subscription_status: 'trial' | 'active' | 'expired' | 'cancelled' | 'past_due';
  max_students: number;
  max_teachers: number;
  created_at: string;
  updated_at: string;
}

type SubscriptionStatus = 'trial' | 'active' | 'expired' | 'cancelled' | 'past_due';

export default function SchoolsTab() {
  const [schools, setSchools] = useState<School[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState({
    name: 'Test School',
    code: 'test-school-1',
    domain: 'test-school-1.com',
    description: 'A test school for development',
    contact_email: 'admin@test-school-1.com',
    contact_phone: '+1234567890',
    timezone: 'UTC',
    address: '123 Test Street, Test City, 12345',
    subscription_status: 'trial' as SubscriptionStatus,
    max_students: 100,
    max_teachers: 10,
    settings: {},
    admin: {
      email: 'admin@test-school-1.com',
      password: 'Test@12345',
      first_name: 'Test',
      last_name: 'Admin',
    }
  });

  useEffect(() => {
    fetchSchools();
  }, []);

  const fetchSchools = async () => {
    try {
      setLoading(true);
      const data = await adminService.getSchools();
      console.log('Schools data:', data);
      setSchools(data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch schools');
      console.error('Error fetching schools:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      console.log('Submitting school data:', formData);
      await adminService.createSchool(formData);
      setShowAddModal(false);
      setFormData({
        name: 'Test School',
        code: 'test-school-1',
        domain: 'test-school-1.com',
        description: 'A test school for development',
        contact_email: 'admin@test-school-1.com',
        contact_phone: '+1234567890',
        timezone: 'UTC',
        address: '123 Test Street, Test City, 12345',
        subscription_status: 'trial',
        max_students: 100,
        max_teachers: 10,
        settings: {},
        admin: {
          email: 'admin@test-school-1.com',
          password: 'Test@12345',
          first_name: 'Test',
          last_name: 'Admin',
        }
      });
      fetchSchools();
    } catch (err: any) {
      const errorMessage = err.response?.data?.detail || 'Failed to create school';
      setError(errorMessage);
      console.error('Error creating school:', err.response?.data || err);
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
        <h2 className="text-2xl font-bold">Schools</h2>
        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2 bg-button-primary text-white rounded-lg hover:bg-button-primary/90"
        >
          Add School
        </button>
      </div>

      {/* Schools Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left py-3 px-4 text-text-secondary section-text-small">Name</th>
              <th className="text-left py-3 px-4 text-text-secondary section-text-small">Domain</th>
              <th className="text-left py-3 px-4 text-text-secondary section-text-small">Contact</th>
              <th className="text-left py-3 px-4 text-text-secondary section-text-small">Status</th>
              <th className="text-left py-3 px-4 text-text-secondary section-text-small">Capacity</th>
              <th className="text-left py-3 px-4 text-text-secondary section-text-small">Actions</th>
            </tr>
          </thead>
          <tbody>
            {schools.map((school) => (
              <tr key={school.id} className="border-b border-border">
                <td className="py-3 px-4 section-text-small">{school.name}</td>
                <td className="py-3 px-4 section-text-small">{school.domain}</td>
                <td className="py-3 px-4 section-text-small">{school.contact_email}</td>
                <td className="py-3 px-4 section-text-small">
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${
                      school.subscription_status === 'active'
                        ? 'bg-green-100 text-green-800'
                        : school.subscription_status === 'trial'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {school.subscription_status}
                  </span>
                </td>
                <td className="py-3 px-4 section-text-small">
                  {school.max_students} students / {school.max_teachers} teachers
                </td>
                <td className="py-3 px-4 section-text-small">
                  <button className="text-button-primary hover:underline mr-3">Edit</button>
                  <button className="text-red-600 hover:underline">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add School Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-background rounded-lg w-full max-w-4xl border border-text-secondary max-h-[90vh] flex flex-col">
            <div className="p-6 border-b border-text-secondary">
              <h3 className="text-xl font-semibold">Add New School</h3>
            </div>
            
            <div className="p-6 overflow-y-auto">
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
                        pattern="[a-zA-Z0-9-]+"
                        title="Only letters, numbers, and hyphens allowed"
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
                        pattern="[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9]\.[a-zA-Z]{2,}"
                        title="Enter a valid domain (e.g., school-name.com)"
                      />
                    </div>
                    <div>
                      <label className="section-text-small mb-1 block">Description (Optional)</label>
                      <textarea
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        className="w-full p-2 border rounded border-text-secondary bg-background-secondary text-text-primary"
                        rows={2}
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
                      <label className="section-text-small mb-1 block">Contact Phone (Optional)</label>
                      <input
                        type="tel"
                        value={formData.contact_phone}
                        onChange={(e) => setFormData({ ...formData, contact_phone: e.target.value })}
                        className="w-full p-2 border rounded border-text-secondary bg-background-secondary text-text-primary"
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
                        <option value="America/New_York">America/New_York</option>
                        <option value="America/Los_Angeles">America/Los_Angeles</option>
                        <option value="Europe/London">Europe/London</option>
                        <option value="Asia/Tokyo">Asia/Tokyo</option>
                      </select>
                    </div>
                    <div>
                      <label className="section-text-small mb-1 block">Address (Optional)</label>
                      <textarea
                        value={formData.address}
                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                        className="w-full p-2 border rounded border-text-secondary bg-background-secondary text-text-primary"
                        rows={2}
                      />
                    </div>
                  </div>

                  {/* Subscription & Capacity */}
                  <div className="space-y-4">
                    <h4 className="font-medium text-lg">Subscription & Capacity</h4>
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
                        min="1"
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
                        min="1"
                      />
                    </div>
                  </div>

                  {/* Admin Details */}
                  <div className="space-y-4">
                    <h4 className="font-medium text-lg">School Admin Details</h4>
                    <div>
                      <label className="section-text-small mb-1 block">Admin Email</label>
                      <input
                        type="email"
                        value={formData.admin.email}
                        onChange={(e) => setFormData({ 
                          ...formData, 
                          admin: { ...formData.admin, email: e.target.value }
                        })}
                        className="w-full p-2 border rounded border-text-secondary bg-background-secondary text-text-primary"
                        required
                      />
                    </div>
                    <div>
                      <label className="section-text-small mb-1 block">Admin Password</label>
                      <input
                        type="password"
                        value={formData.admin.password}
                        onChange={(e) => setFormData({ 
                          ...formData, 
                          admin: { ...formData.admin, password: e.target.value }
                        })}
                        className="w-full p-2 border rounded border-text-secondary bg-background-secondary text-text-primary"
                        required
                        minLength={8}
                      />
                    </div>
                    <div>
                      <label className="section-text-small mb-1 block">Admin First Name</label>
                      <input
                        type="text"
                        value={formData.admin.first_name}
                        onChange={(e) => setFormData({ 
                          ...formData, 
                          admin: { ...formData.admin, first_name: e.target.value }
                        })}
                        className="w-full p-2 border rounded border-text-secondary bg-background-secondary text-text-primary"
                        required
                      />
                    </div>
                    <div>
                      <label className="section-text-small mb-1 block">Admin Last Name</label>
                      <input
                        type="text"
                        value={formData.admin.last_name}
                        onChange={(e) => setFormData({ 
                          ...formData, 
                          admin: { ...formData.admin, last_name: e.target.value }
                        })}
                        className="w-full p-2 border rounded border-text-secondary bg-background-secondary text-text-primary"
                        required
                      />
                    </div>
                  </div>
                </div>
              </form>
            </div>

            <div className="p-6 border-t border-text-secondary flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 border rounded border-text-secondary bg-background-secondary hover:bg-gray-50 text-text-primary section-text-small"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                className="px-4 py-2 bg-button-primary rounded hover:bg-button-primary/90 section-text-small text-text-primary"
              >
                Add School
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 