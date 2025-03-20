import type { Config } from "tailwindcss";
import plugin from "tailwindcss/plugin";

const config: Config = {
    darkMode: ["class"],
    content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/contexts/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
  	extend: {
  		colors: {
  			background: 'hsl(var(--background))',
  			'background-secondary': 'hsl(var(--background-secondary))',
  			foreground: 'hsl(var(--foreground))',
  			card: {
  				DEFAULT: 'hsl(var(--card))',
  				foreground: 'hsl(var(--card-foreground))'
  			},
  			popover: {
  				DEFAULT: 'hsl(var(--popover))',
  				foreground: 'hsl(var(--popover-foreground))'
  			},
  			primary: {
  				DEFAULT: 'hsl(var(--primary))',
  				foreground: 'hsl(var(--primary-foreground))'
  			},
  			secondary: {
  				DEFAULT: 'hsl(var(--secondary))',
  				foreground: 'hsl(var(--secondary-foreground))'
  			},
  			accent: {
  				DEFAULT: 'hsl(var(--accent))',
  				foreground: 'hsl(var(--accent-foreground))'
  			},
  			muted: {
  				DEFAULT: 'hsl(var(--muted))',
  				foreground: 'hsl(var(--muted-foreground))'
  			},
  			destructive: {
  				DEFAULT: 'hsl(var(--destructive))',
  				foreground: 'hsl(var(--destructive-foreground))'
  			},
  			success: {
  				DEFAULT: 'hsl(var(--success))',
  				foreground: 'hsl(var(--success-foreground))'
  			},
  			input: 'hsl(var(--input))',
  			ring: 'hsl(var(--ring))',
  			border: 'hsl(var(--border))',
  			chart: {
  				'1': 'hsl(var(--chart-1))',
  				'2': 'hsl(var(--chart-2))',
  				'3': 'hsl(var(--chart-3))',
  				'4': 'hsl(var(--chart-4))',
  				'5': 'hsl(var(--chart-5))'
  			},
  			sidebar: {
  				DEFAULT: 'hsl(var(--sidebar-background))',
  				foreground: 'hsl(var(--sidebar-foreground))',
  				muted: 'hsl(var(--sidebar-muted))',
  				'muted-foreground': 'hsl(var(--sidebar-muted-foreground))',
  				primary: 'hsl(var(--sidebar-primary))',
  				'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
  				secondary: 'hsl(var(--sidebar-secondary))',
  				'secondary-foreground': 'hsl(var(--sidebar-secondary-foreground))',
  				accent: 'hsl(var(--sidebar-accent))',
  				'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
  				border: 'hsl(var(--sidebar-border))',
  				ring: 'hsl(var(--sidebar-ring))'
  			}
  		},
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		}
  	}
  },
  plugins: [
    require("tailwindcss-animate"),
    plugin(function({ addUtilities }) {
      const customColors = [
        'primary',
        'secondary',
        'accent',
        'background-secondary',
        'foreground',
        'border',
        'success',
        'sidebar-primary',
        'sidebar-secondary',
        'sidebar-accent',
        'sidebar-border'
      ];
      
      // Generate opacity variants for custom colors
      // Properly type opacityUtilities object to fix TypeScript errors
      const opacityUtilities: Record<string, Record<string, string>> = {};
      
      customColors.forEach(colorName => {
        // Extract the color name for CSS variable names
        const cssVarName = colorName;
        
        // Background color with opacity
        [10, 20, 30, 40, 50, 60, 70, 80, 90].forEach(opacity => {
          // Background colors
          const bgClassName = `.bg-${colorName}\\/${opacity}`;
          opacityUtilities[bgClassName] = {
            'background-color': `hsl(var(--${cssVarName}) / 0.${opacity})`,
          };
          
          // Hover background colors
          const bgHoverClassName = `.hover\\:bg-${colorName}\\/${opacity}:hover`;
          opacityUtilities[bgHoverClassName] = {
            'background-color': `hsl(var(--${cssVarName}) / 0.${opacity})`,
          };
          
          // Text colors
          const textClassName = `.text-${colorName}\\/${opacity}`;
          opacityUtilities[textClassName] = {
            'color': `hsl(var(--${cssVarName}) / 0.${opacity})`,
          };
          
          // Hover text colors
          const textHoverClassName = `.hover\\:text-${colorName}\\/${opacity}:hover`;
          opacityUtilities[textHoverClassName] = {
            'color': `hsl(var(--${cssVarName}) / 0.${opacity})`,
          };
          
          // Border colors
          const borderClassName = `.border-${colorName}\\/${opacity}`;
          opacityUtilities[borderClassName] = {
            'border-color': `hsl(var(--${cssVarName}) / 0.${opacity})`,
          };
          
          // Hover border colors
          const borderHoverClassName = `.hover\\:border-${colorName}\\/${opacity}:hover`;
          opacityUtilities[borderHoverClassName] = {
            'border-color': `hsl(var(--${cssVarName}) / 0.${opacity})`,
          };
        });
      });
      
      addUtilities(opacityUtilities);
    }),
  ],
};

export default config;
