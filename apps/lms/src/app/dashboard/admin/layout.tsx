'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import Breadcrumbs from '@/components/Breadcrumbs';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="space-y-6 pb-8 h-full">
      <Breadcrumbs />
      
      {/* Header */}
      {/* <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Platform Overview</h1>
          <p className="text-text-secondary mt-1">Monitor and manage your learning platform</p>
        </div>
        <div className="flex space-x-3">
          <Link 
            href="/dashboard/admin/schools"
            className="px-4 py-2 bg-button-primary text-white rounded-lg hover:bg-button-primary/90 flex items-center space-x-2"
          >
            <span>🏫</span>
            <span>Add School</span>
          </Link>
          <Link 
            href="/dashboard/admin/analytics"
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center space-x-2"
          >
            <span>📊</span>
            <span>Analytics</span>
          </Link>
        </div>
      </div> */}

      {/* Page Content */}
      {children}
    </div>
  );
} 