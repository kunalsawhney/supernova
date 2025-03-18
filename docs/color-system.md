# Supernova LMS Color System

This document outlines the updated color system for the Supernova LMS project, which combines our custom colors with ShadCN UI's color system for a more consistent design language.

## Color Variables

We now use a unified HSL-based color system with semantic naming. Here's how our colors are organized:

### Primary Colors
- `--primary`: #fb8500 (Orange) - Main brand color used for primary actions
- `--primary-foreground`: White - Text color on primary backgrounds

### Secondary Colors
- `--secondary`: #219ebc (Blue green) - Secondary brand color
- `--secondary-foreground`: White - Text color on secondary backgrounds

### Background Colors
- `--background`: White (light mode) / Black (dark mode)
- `--background-secondary`: Light sky blue at 10% opacity (light mode) / Dark blue at 40% opacity (dark mode)
- `--foreground`: #023047 Prussian blue (light mode) / #f0f0f0 Off-white (dark mode)

### Accent Colors
- `--accent`: #ffb703 Selective yellow (light mode) / #4996E5 Blue (dark mode)
- `--accent-foreground`: Prussian blue (light mode) / White (dark mode)

### UI Elements
- `--card`: Background color for card components
- `--card-foreground`: Text color for card components
- `--popover`: Background color for popover components
- `--popover-foreground`: Text color for popover components
- `--muted`: Background color for muted elements
- `--muted-foreground`: Text color for muted elements

### Feedback Colors
- `--success`: #17C964 - Used for success states
- `--success-foreground`: White
- `--destructive`: Red - Used for error states and destructive actions
- `--destructive-foreground`: White

### Functional Colors
- `--border`: #e0e0e0 (light mode) / #262626 (dark mode)
- `--input`: Used for input backgrounds
- `--ring`: Used for focus rings

### Chart Colors
- `--chart-1`: Orange (primary color)
- `--chart-2`: Blue green (secondary color)
- `--chart-3`: Yellow/Blue (accent color varies by theme)
- `--chart-4`: Green (success color)
- `--chart-5`: Red (destructive color)

### Sidebar-Specific Colors
The sidebar can have its own color theme, separate from the main application:

- `--sidebar`: Background color for sidebar
- `--sidebar-foreground`: Text color for sidebar
- `--sidebar-muted`: Background color for muted elements in sidebar
- `--sidebar-muted-foreground`: Text color for muted elements in sidebar
- `--sidebar-primary`: Primary color for sidebar elements
- `--sidebar-primary-foreground`: Text color on primary sidebar elements
- `--sidebar-secondary`: Secondary color for sidebar elements
- `--sidebar-secondary-foreground`: Text color on secondary sidebar elements
- `--sidebar-accent`: Accent color for sidebar elements
- `--sidebar-accent-foreground`: Text color on accent sidebar elements
- `--sidebar-border`: Border color for sidebar elements
- `--sidebar-ring`: Focus ring color for sidebar elements

## Usage in Tailwind

The color system is integrated with Tailwind CSS using HSL values. Here's how to use these colors in your components:

```jsx
// Background colors
<div className="bg-background">...</div>
<div className="bg-primary">...</div>
<div className="bg-secondary">...</div>

// Text colors
<p className="text-foreground">Regular text</p>
<p className="text-primary">Primary colored text</p>
<p className="text-secondary">Secondary colored text</p>
<p className="text-muted-foreground">Muted text</p>

// Border colors
<div className="border border-border">...</div>

// With opacity
<div className="bg-primary/50">50% opacity</div>
<div className="text-foreground/80">80% opacity text</div>

// Sidebar specific colors
<div className="bg-sidebar">
  <span className="text-sidebar-foreground">Sidebar text</span>
  <button className="bg-sidebar-primary text-sidebar-primary-foreground">Button</button>
</div>

// Chart colors
<div className="bg-chart-1">Orange</div>
<div className="bg-chart-2">Blue</div>
<div className="bg-chart-3">Yellow/Blue</div>
<div className="bg-chart-4">Green</div>
<div className="bg-chart-5">Red</div>
```

## Button Variants

We've updated our button variants to use the new color system:

- `default`: Primary orange buttons for main actions
- `secondary`: Blue-green buttons for secondary actions
- `destructive`: Red buttons for destructive actions
- `outline`: Outlined buttons with background-secondary hover effect
- `ghost`: Text-only buttons with background-secondary hover effect
- `link`: Underlined text links
- `soft`: Soft primary color background with primary text

## Dark Mode

Dark mode automatically uses alternate colors defined in the `.dark` selector. To toggle dark mode:

```jsx
<html className="dark">
  {/* Dark mode enabled */}
</html>
```

## Migration from Old System

If you're updating components from our old color system:

- `--color-background` → `--background`
- `--color-background-secondary` → `--background-secondary`
- `--color-text-primary` → `--foreground`
- `--color-text-secondary` → `--muted-foreground` or `--secondary`
- `--color-button-primary` → `--primary` 
- `--color-button-secondary` → `--secondary`
- `--color-accent` → `--accent`
- `--color-highlight` → `--success`
- `--color-border` → `--border`
- `--color-link` → `--secondary`

## Best Practices

1. Use the semantic colors as intended (primary for main actions, etc.)
2. Maintain sufficient contrast between text and backgrounds for accessibility
3. Use opacity variants when you need to soften colors
4. For custom components, follow the established component styles in globals.css
5. Use sidebar-specific colors for sidebar components to allow for different styling
6. Use chart colors sequentially for data visualizations 