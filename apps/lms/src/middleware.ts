import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// This would come from your authentication system
type UserRole = 'student' | 'instructor' | 'admin' | 'super_admin' | 'school_admin';

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  console.log('Middleware - Current path:', path);
  
  // Allow access to the login page and API routes
  if (path === '/' || path.startsWith('/api/')) {
    return NextResponse.next();
  }

  // Get the token from the request
  const token = request.cookies.get('token')?.value;
  const userRole = token ? getUserRole(request) : null;
  console.log('Middleware - User role:', userRole);

  // If accessing dashboard routes without authentication, redirect to login
  if (path.startsWith('/dashboard') && !token) {
    console.log('Middleware - No token, redirecting to login');
    return NextResponse.redirect(new URL('/', request.url));
  }

  // Handle role-based routing for authenticated users
  if (path.startsWith('/dashboard') && userRole) {
    // Get the base dashboard path for the user's role
    const baseDashboardPath = getDashboardPath(userRole);
    console.log('Middleware - Base dashboard path:', baseDashboardPath);

    // Redirect to role-specific dashboard if accessing generic /dashboard
    if (path === '/dashboard') {
      console.log('Middleware - Redirecting to role dashboard:', baseDashboardPath);
      return NextResponse.redirect(new URL(baseDashboardPath, request.url));
    }

    // Check if user has access to the current route
    const allowedPaths = getAllowedPaths(userRole);
    console.log('Middleware - Allowed paths:', allowedPaths);
    console.log('Middleware - Checking access for path:', path);
    
    const hasAccess = allowedPaths.some(allowedPath => {
      const matches = path.startsWith(allowedPath);
      console.log(`Middleware - Checking ${path} against ${allowedPath}:`, matches);
      return matches;
    });

    if (!hasAccess) {
      console.log('Middleware - Access denied, redirecting to:', baseDashboardPath);
      return NextResponse.redirect(new URL(baseDashboardPath, request.url));
    }
  }

  console.log('Middleware - Allowing access to:', path);
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
    console.log('Middleware - Role from cookie:', role);
    
    if (role === 'super_admin') return 'super_admin';
    if (role === 'school_admin') return 'school_admin';
    if (role === 'teacher') return 'instructor';
    if (role === 'student') return 'student';
    
    // Default to student if role is not recognized
    return 'student';
  } catch (error) {
    console.error('Middleware - Error getting user role:', error);
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