import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// This would come from your authentication system
type UserRole = 'student' | 'instructor' | 'admin' | 'super_admin' | 'school_admin';

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  
  // Allow access to the login page and API routes
  if (path === '/' || path.startsWith('/api/')) {
    return NextResponse.next();
  }

  // Get the token from the request
  const token = request.cookies.get('token')?.value;
  const userRole = token ? getUserRole(request) : null;

  // If accessing dashboard routes without authentication, redirect to login
  if (path.startsWith('/dashboard') && !token) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  // Handle role-based routing for authenticated users
  if (path.startsWith('/dashboard') && userRole) {
    // Get the base dashboard path for the user's role
    const baseDashboardPath = getDashboardPath(userRole);
    
    // Redirect to role-specific dashboard if accessing generic /dashboard
    if (path === '/dashboard') {
      return NextResponse.redirect(new URL(baseDashboardPath, request.url));
    }

    // Check if user has access to the current route
    const allowedPaths = getAllowedPaths(userRole);

    const hasAccess = allowedPaths.some(allowedPath => {
      const matches = path.startsWith(allowedPath);
      return matches;
    });

    if (!hasAccess) {
      return NextResponse.redirect(new URL(baseDashboardPath, request.url));
    }
  }

  return NextResponse.next();
}

function getUserRole(request: NextRequest): UserRole {
  // Get the role from the token cookie
  const token = request.cookies.get('token')?.value;
  if (!token) return 'student';

  try {
    // In a real app, you would decode the JWT token here
    // For now, we'll check for a role cookie as a temporary solution
    // const role = request.cookies.get('role')?.value;
    const role = 'super_admin';
    
    if (role === 'super_admin') return 'super_admin';
    if (role === 'school_admin') return 'school_admin';
    if (role === 'teacher') return 'instructor';
    if (role === 'student') return 'student';
    
    // Default to student if role is not recognized
    return 'student';
  } catch (error) {
    return 'student';
  }
}

function getDashboardPath(role: UserRole): string {
  switch (role) {
    case 'super_admin':
    case 'school_admin':
      return '/dashboard/admin';
    case 'instructor':
      return '/dashboard/instructor';
    case 'student':
      return '/dashboard/student';
    default:
      return '/dashboard';
  }
}

function getAllowedPaths(role: UserRole): string[] {
  const basePaths = [
    '/dashboard',
    '/dashboard/profile',
  ];
  
  switch (role) {
    case 'student':
      return [...basePaths, '/dashboard/student', '/dashboard/courses'];
    case 'instructor':
      return [...basePaths, '/dashboard/instructor', '/dashboard/courses'];
    case 'super_admin':
    case 'school_admin':
      return [
        ...basePaths,
        '/dashboard/admin',
        '/dashboard/admin/schools',
        '/dashboard/admin/users',
        '/dashboard/admin/components'
      ];
    default:
      return basePaths;
  }
}

// Add matcher to specify which paths middleware should run on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}; 