# SuperNova - Modern Learning Management System

SuperNova is a comprehensive, modern Learning Management System (LMS) designed to provide an exceptional educational experience for students, instructors, and administrators. Built with Next.js, TypeScript, and a modern component-based architecture, SuperNova delivers a responsive, accessible, and feature-rich platform for online learning.

![SuperNova LMS](/apps/lms/public/images/readme-hero.png)

## Table of Contents
- [SuperNova - Modern Learning Management System](#supernova---modern-learning-management-system)
  - [Table of Contents](#table-of-contents)
  - [Architecture Overview](#architecture-overview)
  - [Project Structure](#project-structure)
  - [Key Features](#key-features)
    - [For Students](#for-students)
    - [For Instructors](#for-instructors)
    - [For Administrators](#for-administrators)
  - [Design System](#design-system)
    - [Core UI Components](#core-ui-components)
    - [Design Tokens](#design-tokens)
    - [Animation System](#animation-system)
    - [Best Practices](#best-practices)
  - [Role-Based Access](#role-based-access)
  - [Development Setup](#development-setup)
    - [Prerequisites](#prerequisites)
    - [Installation](#installation)
    - [Environment Setup](#environment-setup)
  - [Component Guidelines](#component-guidelines)
  - [Authentication](#authentication)
  - [State Management](#state-management)
  - [Contribution Guidelines](#contribution-guidelines)
    - [Performance Considerations](#performance-considerations)
  - [License](#license)
  - [Contact](#contact)

## Architecture Overview

SuperNova is built as a monorepo with multiple applications and shared libraries:

- **LMS Application**: The core learning platform with dashboards for different user roles
- **Website**: Marketing website and landing pages
- **Shared Libraries**: Reusable components, utilities, and types

The architecture follows these key principles:

- **Component-Based**: UI is composed of reusable, modular components
- **Server-Side Rendering**: Next.js for improved performance and SEO
- **Type Safety**: TypeScript throughout the codebase
- **Context-Based State**: React Context API for state management
- **Role-Based Access Control**: Different dashboards and capabilities per user role

## Project Structure

```
supernova/
├── apps/
│   ├── lms/                # Main LMS application
│   │   ├── public/         # Static assets
│   │   ├── src/
│   │   │   ├── app/        # Next.js app router pages
│   │   │   ├── components/ # UI components
│   │   │   ├── contexts/   # React contexts
│   │   │   ├── lib/        # Utility functions
│   │   │   ├── services/   # API services
│   │   │   └── types/      # TypeScript type definitions
│   │   └── ...
│   └── website/            # Marketing website
├── packages/               # Shared libraries
└── ...
```

## Key Features

### For Students
- Personalized dashboard
- Course enrollment and progress tracking
- Assignment submission and grading
- Interactive learning materials
- Progress analytics and performance metrics

### For Instructors
- Course creation and management
- Student enrollment management
- Assignment creation and grading
- Analytics on student performance
- Content authoring tools

### For Administrators
- User management
- School and organization administration
- System-wide analytics
- Course catalog management
- Platform settings and configuration

## Design System

SuperNova uses a customized version of the ShadCN UI framework, which is built on top of Tailwind CSS. The design system provides:

### Core UI Components
- Button, Input, Card, Table, Avatar, Badge
- Dropdown, Modal, Tabs, Form elements
- Charts and data visualization tools

### Design Tokens
- Color palette with primary, secondary, and accent colors
- Spacing and sizing scales
- Typography system with responsive text sizes
- Light and dark theme support

### Animation System
- Framer Motion for page transitions and micro-interactions
- Consistent animation curves and durations
- Motion-reduced options for accessibility

### Best Practices
- Mobile-first responsive design
- Accessibility (WCAG AA compliant)
- Consistent component API patterns

## Role-Based Access

SuperNova has a sophisticated role-based access control system with these primary roles:

- **Student**: Access to enrolled courses, assignments, and personal progress
- **Instructor**: Manage courses, assignments, and student progress
- **Admin**: School-level administration and user management
- **Super Admin**: System-wide configuration and multi-school management
- **School Admin**: Management of specific school or organization

The `RoleContext` provides role information throughout the application, and role-specific navigation is handled by the `DashboardNavigation` component.

## Development Setup

### Prerequisites
- Node.js 18+
- pnpm (package manager)

### Installation
```bash
# Clone the repository
git clone https://github.com/your-organization/supernova.git
cd supernova

# Install dependencies
pnpm install

# Start development server
pnpm dev
```

### Environment Setup
Create a `.env.local` file in the appropriate app directory with necessary environment variables:

```
NEXT_PUBLIC_API_URL=https://api.example.com
# Other environment variables
```

## Component Guidelines

When developing new components:

1. **Atomic Design**: Follow atomic design principles (atoms, molecules, organisms)
2. **Client/Server Components**: Clearly mark components as 'use client' when they use client-side hooks or interactivity
3. **Hydration Safety**: Handle client-side APIs safely to prevent hydration mismatches
4. **Prop Types**: Always define TypeScript interfaces for component props
5. **Accessibility**: Include proper ARIA attributes and keyboard navigation
6. **Animation**: Use the `framer-motion` library and follow animation standards
7. **Dark Mode**: Ensure components work in both light and dark themes

Example component structure:
```tsx
'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface ExampleComponentProps {
  title: string;
  children: React.ReactNode;
  variant?: 'default' | 'outline';
}

export function ExampleComponent({
  title,
  children,
  variant = 'default',
}: ExampleComponentProps) {
  const [mounted, setMounted] = useState(false);
  
  // Component logic...
  
  return (
    <motion.div 
      className={cn(
        "component-base-class",
        variant === 'outline' && "component-outline-class"
      )}
    >
      {/* Component content */}
    </motion.div>
  );
}
```

## Authentication

SuperNova uses a token-based authentication system:

- JWT tokens stored in localStorage and HTTP-only cookies
- Refresh token mechanism for extended sessions
- Context-based auth state with the `AuthContext`
- Protected routes via middleware

Usage example:
```tsx
import { useAuth } from '@/contexts/AuthContext';

function ProfileComponent() {
  const { user, signOut } = useAuth();
  
  return (
    <div>
      <h1>Welcome, {user?.name}</h1>
      <button onClick={signOut}>Sign Out</button>
    </div>
  );
}
```

## State Management

The application uses several React contexts for state management:

- **AuthContext**: User authentication state
- **RoleContext**: Current user role and role-switching
- **SidebarContext**: Dashboard sidebar state (collapsed, mobile open)
- **ThemeContext**: Theme preferences (light/dark)

For complex state, we implement:

- Local component state with `useState`
- Reducers with `useReducer` where appropriate
- React Query for server state management

## Contribution Guidelines

1. **Branching Strategy**: Create feature branches from `dev` branch
2. **Pull Requests**: Submit PRs with detailed descriptions
3. **Code Style**: Follow the project's ESLint and Prettier configuration
4. **Testing**: Include unit tests for new functionality
5. **Documentation**: Update README or component documentation as needed
6. **Commits**: Use conventional commit format (`feat:`, `fix:`, etc.)

### Performance Considerations

- Use dynamic imports for code splitting
- Implement proper memoization with `useMemo` and `useCallback`
- Optimize images and assets
- Use server components where possible to reduce client JS

---

## License

[MIT License](/LICENSE)

## Contact

For questions or support, please contact [support@example.com](mailto:support@example.com)
