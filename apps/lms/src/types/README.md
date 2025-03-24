# Dashboard Architecture

## Overview
This document outlines the architecture of the dashboard in the LMS application, focusing on the routing structure and component organization.

## Routing Structure

### Unified Dashboard Approach
We've implemented a unified dashboard approach where:
- All users access the same `/dashboard` route
- Content is dynamically rendered based on user roles
- Access control is handled through permissions (RBAC)

This approach simplifies the routing structure and makes the application more maintainable.

## Component Organization

### Views Pattern
Dashboard components are organized using a "views" pattern:
- `components/dashboard/views/` contains role-specific view components
- Each role has its own view component (e.g., `AdminDashboard.tsx`, `StudentDashboard.tsx`)
- The main dashboard page conditionally renders the appropriate view based on user role

### Benefits
- Cleaner, more maintainable code
- Better component reusability
- Simpler routing structure
- More robust permission-based access control

## Authentication & Authorization

### RoleContext
- Provides the user's role throughout the application
- Contains permission lists for each role
- Provides a `canAccess` helper to check if a user has specific permissions

### Middleware
- Handles authentication validation
- Redirects unauthenticated users to the login page
- Checks if the user has permission to access specific routes

## Navigation

The sidebar navigation adapts based on the user's role, showing relevant menu items for each role type.

## Core Components

1. **Dashboard Page**
   - Main entry point for all authenticated users
   - Renders the appropriate view based on user role

2. **Role-Specific Views**
   - `AdminDashboard`: For admin and super_admin roles
   - `SchoolAdminDashboard`: For school_admin role
   - `InstructorDashboard`: For instructor role
   - `StudentDashboard`: For student role

3. **DashboardNavigation**
   - Provides role-specific navigation items
   - Links to appropriate sections based on permissions

## How to Add New Features

To add new features to the dashboard:

1. Determine which roles should have access to the feature
2. Add appropriate permissions to the RoleContext
3. Create reusable components in the components directory
4. Update the role-specific dashboard view to include the new feature
5. Update the navigation if needed
6. Update the middleware to include new route permissions if needed 