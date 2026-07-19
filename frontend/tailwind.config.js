/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        fifa: {
          purple: 'rgb(var(--color-accent-primary) / <alpha-value>)',
          magenta: 'rgb(var(--color-fifa-magenta) / <alpha-value>)',
          teal: 'rgb(var(--color-fifa-teal) / <alpha-value>)',
          gold: 'rgb(var(--color-fifa-gold) / <alpha-value>)',
        },
        bg: {
          primary: 'rgb(var(--color-bg-primary) / <alpha-value>)',
          secondary: 'rgb(var(--color-bg-secondary) / <alpha-value>)',
          elevated: 'rgb(var(--color-bg-elevated) / <alpha-value>)',
        },
        border: {
          DEFAULT: 'rgb(var(--color-border-default) / <alpha-value>)',
          subtle: 'rgb(var(--color-border-subtle) / <alpha-value>)',
        },
        text: {
          primary: 'rgb(var(--color-text-primary) / <alpha-value>)',
          secondary: 'rgb(var(--color-text-secondary) / <alpha-value>)',
          tertiary: 'rgb(var(--color-text-tertiary) / <alpha-value>)',
        },
        status: {
          high: 'rgb(var(--color-status-high) / <alpha-value>)',
          moderate: 'rgb(var(--color-status-moderate) / <alpha-value>)',
          low: 'rgb(var(--color-status-low) / <alpha-value>)',
        },
        accent: {
          primary: 'rgb(var(--color-accent-primary) / <alpha-value>)',
        },
      },
      borderRadius: {
        sm: 'var(--radius-sm)',
        md: 'var(--radius-md)',
        lg: 'var(--radius-lg)',
        xl: 'var(--radius-xl)',
        full: 'var(--radius-full)',
      },
      fontFamily: {
        sans: ['Outfit', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'fifa-gradient': 'linear-gradient(135deg, rgb(var(--color-accent-primary)) 0%, rgb(var(--color-fifa-magenta)) 50%, rgb(var(--color-fifa-teal)) 100%)',
        'card-gradient': 'linear-gradient(135deg, rgba(91,45,142,0.1) 0%, rgba(212,20,90,0.05) 100%)',
      },
      boxShadow: {
        'sm': 'var(--shadow-sm)',
        'md': 'var(--shadow-md)',
        'lg': 'var(--shadow-lg)',
        'glow': 'var(--shadow-glow)',
        'glow-magenta': 'var(--shadow-glow-magenta)',
        'glow-teal': 'var(--shadow-glow-teal)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'gradient': 'gradient 6s ease infinite',
        'float': 'float 3s ease-in-out infinite',
      },
      keyframes: {
        gradient: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
    },
  },
  plugins: [],
}
