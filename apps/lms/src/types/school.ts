export type SubscriptionStatus = 'trial' | 'active' | 'expired' | 'cancelled' | 'past_due';

export interface School {
  id: string;
  name: string;
  code: string;
  domain: string;
  description?: string;
  contact_email: string;
  contact_phone?: string;
  timezone: string;
  address?: string;
  settings?: Record<string, any>;
  logo_url?: string;
  subscription_status: SubscriptionStatus;
  trial_ends_at?: string;
  max_students: number;
  max_teachers: number;
  features_enabled?: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface CreateSchoolData {
  name: string;
  code: string;
  domain: string;
  description?: string;
  contact_email: string;
  contact_phone?: string;
  timezone: string;
  address?: string;
  settings?: Record<string, any>;
  logo_url?: string;
  subscription_status: SubscriptionStatus;
  max_students: number;
  max_teachers: number;
  features_enabled?: Record<string, any>;
  admin: {
    email: string;
    password: string;
    first_name: string;
    last_name: string;
  };
}

export interface UpdateSchoolData extends Partial<Omit<School, 'id' | 'created_at' | 'updated_at'>> {
  // Add any specific update fields here if needed
}

// View Models for UI
export interface SchoolViewModel {
  id: string;
  name: string;
  code: string;
  domain: string;
  description?: string;
  contactEmail: string;
  contactPhone?: string;
  timezone: string;
  address?: string;
  settings?: Record<string, any>;
  logoUrl?: string;
  subscriptionStatus: SubscriptionStatus;
  trialEndsAt?: string;
  maxStudents: number;
  maxTeachers: number;
  featuresEnabled?: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

export interface SchoolAdminViewModel {
  email: string;
  firstName: string;
  lastName: string;
  fullName: string;
}

// Transformation functions
export const transformSchool = (school: School): SchoolViewModel => ({
  id: school.id,
  name: school.name,
  code: school.code,
  domain: school.domain,
  description: school.description,
  contactEmail: school.contact_email,
  contactPhone: school.contact_phone,
  timezone: school.timezone,
  address: school.address,
  settings: school.settings,
  logoUrl: school.logo_url,
  subscriptionStatus: school.subscription_status,
  trialEndsAt: school.trial_ends_at,
  maxStudents: school.max_students,
  maxTeachers: school.max_teachers,
  featuresEnabled: school.features_enabled,
  createdAt: school.created_at,
  updatedAt: school.updated_at,
});

export const transformSchoolAdmin = (admin: { email: string; first_name: string; last_name: string }): SchoolAdminViewModel => ({
  email: admin.email,
  firstName: admin.first_name,
  lastName: admin.last_name,
  fullName: `${admin.first_name} ${admin.last_name}`,
}); 