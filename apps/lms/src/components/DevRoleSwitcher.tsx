'use client';

import { useRole } from '@/contexts/RoleContext';

const roleLabels = {
  student: '👨‍🎓 Student (Course Learner)',
  instructor: '👨‍🏫 Instructor (School Teacher)',
  admin: '👨‍💼 Admin (Platform Manager)',
};

export default function DevRoleSwitcher() {
  const { role, setRole } = useRole();

  // Only show in development
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  return (
    <div className="flex items-center space-x-2 px-4 py-2 bg-yellow-100 rounded-lg border border-yellow-300">
      <span className="text-yellow-800 text-sm font-medium">Development Mode:</span>
      <select
        value={role}
        onChange={(e) => setRole(e.target.value as any)}
        className="text-sm bg-transparent border-none text-yellow-800 focus:ring-0 cursor-pointer font-medium"
      >
        {Object.entries(roleLabels).map(([value, label]) => (
          <option key={value} value={value}>{label}</option>
        ))}
      </select>
    </div>
  );
} 