/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        renext: {
          header: '#1a3a6b',
          card: '#c8b39b',
          bg: '#f8efe5',
          'header-dark': '#0f2648',
          'header-light': '#2a4f80',
          'card-dark': '#b09a80',
          'card-light': '#ddd0bf',
          accent: '#3b82f6',
          navy: '#1a3a6b',
        },
        admin: {
          DEFAULT: '#f97316',
          light: '#fed7aa',
          dark: '#ea580c',
        },
        citizen: {
          DEFAULT: '#22c55e',
          light: '#bbf7d0',
          dark: '#16a34a',
        },
        commercial: {
          DEFAULT: '#3b82f6',
          light: '#bfdbfe',
          dark: '#2563eb',
        },
      },
      fontFamily: {
        sans: [
          'Inter',
          '-apple-system',
          'BlinkMacSystemFont',
          '"Segoe UI"',
          'Roboto',
          '"Helvetica Neue"',
          'Arial',
          'sans-serif',
        ],
      },
      backdropBlur: {
        xs: '2px',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'shimmer': 'shimmer 2s linear infinite',
        'pulse-soft': 'pulseSoft 2s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.7' },
        },
      },
      boxShadow: {
        'glass': '0 8px 32px rgba(0, 0, 0, 0.12), inset 0 1px 0 rgba(255, 255, 255, 0.4), inset 0 -1px 0 rgba(0, 0, 0, 0.05)',
        'glass-hover': '0 16px 48px rgba(0, 0, 0, 0.18), inset 0 1px 0 rgba(255, 255, 255, 0.5), inset 0 -1px 0 rgba(0, 0, 0, 0.05)',
        'card': '0 4px 20px rgba(26, 58, 107, 0.10)',
        'card-hover': '0 8px 40px rgba(26, 58, 107, 0.18)',
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
        '4xl': '2rem',
      },
    },
  },
  plugins: [],
}
