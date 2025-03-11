import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// This would come from your authentication system
type UserRole = 'student' | 'instructor' | 'admin';

export function middleware(request: NextRequest) {
  // Get the user role from the session/token
  // This is a placeholder - implement actual auth logic
  const userRole: UserRole = getUserRole(request);
  const path = request.nextUrl.pathname;

  // Handle role-based routing
  if (path.startsWith('/dashboard')) {
    // Redirect to role-specific dashboard if accessing generic /dashboard
    if (path === '/dashboard') {
      return NextResponse.redirect(new URL(`/dashboard/${userRole}`, request.url));
    }

    // Check if user has access to the current route
    const allowedPaths = getAllowedPaths(userRole);
    if (!allowedPaths.some(allowedPath => path.startsWith(allowedPath))) {
      return NextResponse.redirect(new URL(`/dashboard/${userRole}`, request.url));
    }
  }

  return NextResponse.next();
}

function getUserRole(request: NextRequest): UserRole {
  // Implement your actual role detection logic here
  // This could involve checking JWT tokens, session data, etc.
  return 'student';
}

function getAllowedPaths(role: UserRole): string[] {
  const basePaths = ['/dashboard'];
  
  switch (role) {
    case 'student':
      return [...basePaths, '/dashboard/student'];
    case 'instructor':
      return [...basePaths, '/dashboard/instructor'];
    case 'admin':
      return [...basePaths, '/dashboard/admin'];
    default:
      return basePaths;
  }
} 