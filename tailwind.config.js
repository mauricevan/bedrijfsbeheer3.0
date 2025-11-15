/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      // Custom Color Palette - Professional but Human
      colors: {
        // Primary (Blue) - Voor primaire acties, links, highlights
        primary: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6', // DEFAULT
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
        },
        // Success (Green) - Voor positieve status, bevestigingen
        success: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e', // DEFAULT
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
        },
        // Warning (Orange) - Voor waarschuwingen, pending states
        warning: {
          50: '#fff7ed',
          100: '#ffedd5',
          200: '#fed7aa',
          300: '#fdba74',
          400: '#fb923c',
          500: '#f97316', // DEFAULT
          600: '#ea580c',
          700: '#c2410c',
          800: '#9a3412',
          900: '#7c2d12',
        },
        // Error (Red) - Voor errors, destructieve acties
        error: {
          50: '#fef2f2',
          100: '#fee2e2',
          200: '#fecaca',
          300: '#fca5a5',
          400: '#f87171',
          500: '#ef4444', // DEFAULT
          600: '#dc2626',
          700: '#b91c1c',
          800: '#991b1b',
          900: '#7f1d1d',
        },
        // Accent colors voor badges en highlights
        accent: {
          teal: {
            50: '#f0fdfa',
            100: '#ccfbf1',
            200: '#99f6e4',
            300: '#5eead4',
            400: '#2dd4bf',
            500: '#14b8a6',
            600: '#0d9488',
            700: '#0f766e',
            800: '#115e59',
            900: '#134e4a',
          },
          purple: {
            50: '#faf5ff',
            100: '#f3e8ff',
            200: '#e9d5ff',
            300: '#d8b4fe',
            400: '#c084fc',
            500: '#a855f7',
            600: '#9333ea',
            700: '#7e22ce',
            800: '#6b21a8',
            900: '#581c87',
          },
        },
      },
      // Custom animations voor micro-interactions
      animation: {
        // Fade in
        fadeIn: 'fadeIn 0.3s ease-in forwards',
        // Slide in from right (sidebar)
        slideInRight: 'slideInRight 0.3s ease-out forwards',
        // Slide in from bottom
        slideInBottom: 'slideInBottom 0.3s ease-out forwards',
        // Scale in (modals, tooltips)
        scaleIn: 'scaleIn 0.2s ease-out forwards',
        // Bounce in (success feedback)
        bounceIn: 'bounceIn 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55) forwards',
        // Shake (error feedback)
        shake: 'shake 0.4s ease-in-out',
        // Shimmer effect voor loading skeletons
        shimmer: 'shimmer 2s infinite linear',
        // Pulse glow (voor belangrijke acties)
        pulseGlow: 'pulseGlow 2s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideInRight: {
          '0%': {
            transform: 'translateX(100%)',
            opacity: '0',
          },
          '100%': {
            transform: 'translateX(0)',
            opacity: '1',
          },
        },
        slideInBottom: {
          '0%': {
            transform: 'translateY(20px)',
            opacity: '0',
          },
          '100%': {
            transform: 'translateY(0)',
            opacity: '1',
          },
        },
        scaleIn: {
          '0%': {
            transform: 'scale(0.9)',
            opacity: '0',
          },
          '100%': {
            transform: 'scale(1)',
            opacity: '1',
          },
        },
        bounceIn: {
          '0%': {
            transform: 'scale(0.3)',
            opacity: '0',
          },
          '50%': {
            transform: 'scale(1.05)',
          },
          '70%': {
            transform: 'scale(0.9)',
          },
          '100%': {
            transform: 'scale(1)',
            opacity: '1',
          },
        },
        shake: {
          '0%, 100%': { transform: 'translateX(0)' },
          '10%, 30%, 50%, 70%, 90%': { transform: 'translateX(-4px)' },
          '20%, 40%, 60%, 80%': { transform: 'translateX(4px)' },
        },
        shimmer: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
        pulseGlow: {
          '0%, 100%': {
            boxShadow: '0 0 5px rgba(59, 130, 246, 0.5), 0 0 10px rgba(59, 130, 246, 0.3)',
          },
          '50%': {
            boxShadow: '0 0 20px rgba(59, 130, 246, 0.8), 0 0 30px rgba(59, 130, 246, 0.6)',
          },
        },
      },
      // Custom box shadows voor depth
      boxShadow: {
        'soft': '0 2px 8px rgba(0, 0, 0, 0.08)',
        'soft-lg': '0 4px 16px rgba(0, 0, 0, 0.1)',
        'soft-xl': '0 8px 24px rgba(0, 0, 0, 0.12)',
        'primary': '0 4px 14px rgba(59, 130, 246, 0.3)',
        'primary-lg': '0 8px 20px rgba(59, 130, 246, 0.4)',
        'success': '0 4px 14px rgba(34, 197, 94, 0.3)',
        'warning': '0 4px 14px rgba(249, 115, 22, 0.3)',
        'error': '0 4px 14px rgba(239, 68, 68, 0.3)',
      },
      // Custom border radius voor consistency
      borderRadius: {
        'card': '12px',
        'button': '8px',
        'input': '8px',
      },
      // Custom spacing scale
      spacing: {
        '18': '4.5rem',  // 72px
        '22': '5.5rem',  // 88px
      },
    },
  },
  plugins: [],
}
