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
  			background: 'var(--color-background)',
  			'background-secondary': 'var(--color-background-secondary)',
  			'text-primary': 'var(--color-text-primary)',
  			'text-secondary': 'var(--color-text-secondary)',
  			'button-primary': 'var(--color-button-primary)',
  			'button-secondary': 'var(--color-button-secondary)',
  			accent: 'var(--color-accent)',
  			highlight: 'var(--color-highlight)',
  			border: 'var(--color-border)',
  			link: 'var(--color-link)',
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
  			muted: {
  				DEFAULT: 'hsl(var(--muted))',
  				foreground: 'hsl(var(--muted-foreground))'
  			},
  			destructive: {
  				DEFAULT: 'hsl(var(--destructive))',
  				foreground: 'hsl(var(--destructive-foreground))'
  			},
  			input: 'hsl(var(--input))',
  			ring: 'hsl(var(--ring))',
  			chart: {
  				'1': 'hsl(var(--chart-1))',
  				'2': 'hsl(var(--chart-2))',
  				'3': 'hsl(var(--chart-3))',
  				'4': 'hsl(var(--chart-4))',
  				'5': 'hsl(var(--chart-5))'
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
        'button-primary',
        'button-secondary',
        'background-secondary',
        'text-primary',
        'text-secondary',
        'accent',
        'border'
      ];
      
      // Generate opacity variants for custom colors
      // Properly type opacityUtilities object to fix TypeScript errors
      const opacityUtilities: Record<string, Record<string, string>> = {};
      
      customColors.forEach(colorName => {
        // Extract the color name without the prefix for CSS variable names
        const cssVarName = colorName
          .replace('button-', '')
          .replace('text-', '')
          .replace('background-', '');
        
        // Background color with opacity
        [10, 20, 30, 40, 50, 60, 70, 80, 90].forEach(opacity => {
          // Background colors
          const bgClassName = `.bg-${colorName}\\/${opacity}`;
          opacityUtilities[bgClassName] = {
            'background-color': `color-mix(in srgb, var(--color-${cssVarName}) ${opacity}%, transparent)`,
          };
          
          // Hover background colors
          const bgHoverClassName = `.hover\\:bg-${colorName}\\/${opacity}:hover`;
          opacityUtilities[bgHoverClassName] = {
            'background-color': `color-mix(in srgb, var(--color-${cssVarName}) ${opacity}%, transparent)`,
          };
          
          // Text colors
          const textClassName = `.text-${colorName}\\/${opacity}`;
          opacityUtilities[textClassName] = {
            'color': `color-mix(in srgb, var(--color-${cssVarName}) ${opacity}%, transparent)`,
          };
          
          // Hover text colors
          const textHoverClassName = `.hover\\:text-${colorName}\\/${opacity}:hover`;
          opacityUtilities[textHoverClassName] = {
            'color': `color-mix(in srgb, var(--color-${cssVarName}) ${opacity}%, transparent)`,
          };
          
          // Border colors
          const borderClassName = `.border-${colorName}\\/${opacity}`;
          opacityUtilities[borderClassName] = {
            'border-color': `color-mix(in srgb, var(--color-${cssVarName}) ${opacity}%, transparent)`,
          };
          
          // Hover border colors
          const borderHoverClassName = `.hover\\:border-${colorName}\\/${opacity}:hover`;
          opacityUtilities[borderHoverClassName] = {
            'border-color': `color-mix(in srgb, var(--color-${cssVarName}) ${opacity}%, transparent)`,
          };
        });
      });
      
      addUtilities(opacityUtilities);
    }),
  ],
};

export default config;
