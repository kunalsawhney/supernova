'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';
import { 
  Breadcrumb, 
  BreadcrumbItem, 
  BreadcrumbLink, 
  BreadcrumbList, 
  BreadcrumbPage, 
  BreadcrumbSeparator 
} from '@/components/ui/breadcrumb';

// Path segment to display name mapping
const pathMappings: Record<string, string> = {
  dashboard: 'Dashboard',
  student: 'Student',
  instructor: 'Instructor',
  admin: 'Admin',
  courses: 'Courses',
  profile: 'Profile',
  settings: 'Settings',
  assignments: 'Assignments',
  calendar: 'Calendar',
  progress: 'Progress',
  users: 'Users',
  analytics: 'Analytics',
  explore: 'Explore',
  forums: 'Forums',
  groups: 'Groups',
};

export function Breadcrumbs() {
  const pathname = usePathname();
  
  // Skip for home page
  if (pathname === '/') {
    return null;
  }
  
  // Generate breadcrumb items from pathname
  const breadcrumbItems = () => {
    // Remove leading slash and split by segments
    const pathSegments = pathname.split('/').filter(Boolean);
    
    // Return an array of path segments with their accumulated paths
    return pathSegments.map((segment, index) => {
      // Build the path up to this segment
      const path = '/' + pathSegments.slice(0, index + 1).join('/');
      
      // Try to get a more readable name from our mapping, or capitalize first letter
      const displayName = pathMappings[segment] || segment.charAt(0).toUpperCase() + segment.slice(1);
      
      // Is this the last segment (current page)?
      const isLastItem = index === pathSegments.length - 1;
      
      return { segment, path, displayName, isLastItem };
    });
  };
  
  const items = breadcrumbItems();
  
  // If there are no path segments, don't render anything
  if (items.length === 0) {
    return null;
  }
  
  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link href="/" className="flex items-center">
              <Home className="h-4 w-4" />
              <span className="sr-only">Home</span>
            </Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        
        {items.map((item, index) => (
          <BreadcrumbItem key={item.path}>
            {item.isLastItem ? (
              <BreadcrumbPage>{item.displayName}</BreadcrumbPage>
            ) : (
              <>
                <BreadcrumbLink asChild>
                  <Link href={item.path}>{item.displayName}</Link>
                </BreadcrumbLink>
                {index < items.length - 1 && <BreadcrumbSeparator />}
              </>
            )}
          </BreadcrumbItem>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
} 