# Supernova LMS Design Language

This document outlines the design language used throughout the Supernova LMS, providing guidelines and specifications for consistent design implementation.

## Design Philosophy

The Supernova LMS design language is built on the following core principles:

1. **Educational Focus**: Design decisions support learning objectives and reduce cognitive load
2. **Consistency**: Components, patterns, and interactions are predictable and uniform
3. **Accessibility**: WCAG AA compliant, ensuring the platform is usable by everyone
4. **Responsive**: Seamless experience across all device sizes
5. **Clarity**: Clear visual hierarchy and intuitive navigation

## Component Architecture

The Supernova design system is built on a customized implementation of [shadcn/ui](https://ui.shadcn.com/), which leverages:

- **Radix UI** for accessible primitives
- **Tailwind CSS** for styling
- **Class Variance Authority (CVA)** for component variants
- **TypeScript** for type safety

This architecture allows for component reusability while maintaining consistency across the application.

## Typography

The typography system uses a combination of Inter (primary font) with system fallbacks. It follows a clear hierarchical scale:

### Text Styles

```tsx
/* Typography classes defined in globals.css */
.heading-sm    // text-lg font-semibold (Small headings and card titles)
.heading-md    // text-xl/text-2xl font-semibold (Section headings)
.heading-lg    // text-2xl/text-3xl font-bold (Page headings)
.heading-xl    // text-3xl/text-4xl font-bold (Hero headings)
```

### Font Weights
- Regular (400): Body text
- Medium (500): Emphasis, labels
- Semibold (600): Subheadings
- Bold (700): Main headings

## Spacing System

Spacing follows a consistent scale based on the Tailwind CSS default spacing scale:

- **4px (1)**: Minimal spacing (icon padding)
- **8px (2)**: Tight spacing (between related items)
- **12px (3)**: Default spacing (form elements)
- **16px (4)**: Standard spacing (between components)
- **24px (6)**: Large spacing (section separators)
- **32px (8)**: Extra large spacing (major section blocks)
- **48px (12)**: 2XL spacing (page padding)

## Color System

The color system is based on HSL variables with semantic naming, allowing for theme switching. See the [color-system.md](./color-system.md) document for detailed color specifications.

### Status Colors

Color-coded status indicators are standardized across the application:

```tsx
.badge-active    // Green - active/successful state
.badge-inactive  // Gray - inactive/disabled state
.badge-warning   // Yellow - warning/pending state
.badge-error     // Red - error/failure state
.badge-info      // Blue - informational state
```

## Layout System

The LMS uses several fundamental layout patterns:

### Grid System
Based on Tailwind's grid utilities:
- Content typically follows a 12-column grid
- Responsive breakpoints at SM (640px), MD (768px), LG (1024px), XL (1280px), 2XL (1536px)

### Common Layout Patterns
- **Dashboard Layout**: Sidebar + Main content area with header
- **Card Grid**: Responsive grid of cards for courses/modules
- **Content + Sidebar**: Two-column layout with primary and secondary content
- **Form Layout**: Consistent vertical rhythm for form elements

## Components

The component library includes these core elements:

### Base Components
- **Button**: Multiple variants (default, secondary, destructive, outline, ghost, link, soft)
- **Typography**: Headings, paragraphs, lists
- **Form Elements**: Input, Select, Checkbox, Radio, Textarea, Switch
- **Card**: Base container for content blocks

### Complex Components
- **Data Table**: For tabular data with sorting and filtering
- **Charts**: Visualization components using the chart color system
- **Navigation**: Sidebar, Breadcrumbs, Tabs
- **Dialog**: Modal windows, alerts, and popovers
- **Dropdown**: Selection menus and action lists

### Component Variants

Many components support variants through the Class Variance Authority (CVA) pattern:

```tsx
// Button variants example
default:    // Primary orange buttons for main actions
secondary:  // Blue-green buttons for secondary actions
destructive: // Red buttons for destructive actions
outline:    // Outlined buttons with hover effects
ghost:      // Text-only buttons with hover effects
link:       // Underlined text links
soft:       // Soft primary color background
```

## Animation System

Animations are built using Framer Motion with standardized patterns:

### Transition Presets
- **Default**: `duration: 0.2s, ease: "easeOut"`
- **Entrance**: `duration: 0.3s, ease: [0.22, 1, 0.36, 1]`
- **Exit**: `duration: 0.2s, ease: [0.65, 0, 0.35, 1]`

### Animation Patterns
- **Page Transitions**: Fade and slight movement
- **List Items**: Staggered entrance animations
- **Hover States**: Subtle scale and opacity changes
- **Feedback**: Micro-animations for user actions

### Reduced Motion
All animations respect the user's reduced motion preferences through the `prefers-reduced-motion` media query.

## Iconography

The system uses Lucide icons as the primary icon library, with consistent sizing:

- **Small**: 16px (form elements, tight UI)
- **Default**: 20px (most UI elements)
- **Large**: 24px (feature highlights, empty states)

Icons maintain the current text color by default unless specifically styled.

## Responsive Behavior

The LMS interface adapts across different screen sizes with these key breakpoints:

- **Mobile** (<640px): Single column, stacked layouts
- **Tablet** (640px-1024px): Two column layouts, condensed sidebar
- **Desktop** (>1024px): Full multi-column layouts, expanded sidebar

Key responsive patterns include:
- Sidebar collapses to a menu on mobile
- Cards reflow from multi-column to single column
- Tables adapt to card views on small screens
- Form layouts adjust to full width on mobile

## Dark Mode Support

The entire design system supports both light and dark modes through CSS variables, with automatic switching based on user preference. Dark mode maintains the same information hierarchy while reducing eye strain.

## Best Practices

1. Use semantic component variants based on their purpose (primary actions use primary buttons)
2. Maintain consistent spacing within component groups
3. Follow established patterns for similar functionality
4. Use animations sparingly and purposefully
5. Ensure sufficient color contrast for accessibility
6. Leverage existing components before creating custom ones
7. Follow the established responsive patterns

## Implementation Examples

Example components follow this general pattern:

```tsx
// Button.tsx example (simplified)
const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-md text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:opacity-90",
        // Other variants...
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 px-3 text-xs",
        lg: "h-12 px-6 text-base",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export const Button = ({variant, size, className, ...props}) => {
  return (
    <button 
      className={cn(buttonVariants({variant, size, className}))}
      {...props}
    />
  );
};
``` 