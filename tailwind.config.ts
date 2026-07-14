import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: 'class',
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './**/*.{ts,tsx}',
  ],
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: { '2xl': '1440px' },
    },
    extend: {
      colors: {
        brand: {
          DEFAULT: '#2563EB',
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#2563EB',
          600: '#1d4ed8',
          700: '#1e40af',
          800: '#1e3a8a',
          900: '#1e3a8a',
          950: '#172554',
        },
        sidebar: {
          DEFAULT: '#1E293B',
          hover: '#334155',
          active: '#2563EB',
        },
        surface: {
          DEFAULT: '#F8FAFC',
          card: '#FFFFFF',
          elevated: '#F1F5F9',
          border: '#E2E8F0',
          hover: '#F8FAFC',
        },
        status: {
          success: '#16A34A',
          warning: '#F59E0B',
          danger: '#DC2626',
          neutral: '#64748B',
        },
        foreground: {
          DEFAULT: '#0F172A',
          muted: '#64748B',
          subtle: '#94A3B8',
        },
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'Inter', 'system-ui', 'sans-serif'],
        mono: ['var(--font-geist-mono)', 'JetBrains Mono', 'monospace'],
      },
      borderRadius: {
        lg: '12px',
        xl: '16px',
        '2xl': '20px',
        '3xl': '24px',
      },
      spacing: {
        '18': '4.5rem',
        'sidebar': '260px',
      },
      width: {
        sidebar: '260px',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out',
        'slide-up': 'slideUp 0.4s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
        'scale-in': 'scaleIn 0.2s ease-out',
        'pulse-dot': 'pulse-dot 2s ease-in-out infinite',
        shimmer: 'shimmer 2s linear infinite',
      },
      keyframes: {
        fadeIn: {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        slideUp: {
          from: { opacity: '0', transform: 'translateY(12px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        slideDown: {
          from: { opacity: '0', transform: 'translateY(-12px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          from: { opacity: '0', transform: 'scale(0.97)' },
          to: { opacity: '1', transform: 'scale(1)' },
        },
        'pulse-dot': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.5' },
        },
        shimmer: {
          from: { backgroundPosition: '200% 0' },
          to: { backgroundPosition: '-200% 0' },
        },
      },
      boxShadow: {
        subtle: '0 1px 2px rgba(15, 23, 42, 0.05)',
        card: '0 1px 3px rgba(15, 23, 42, 0.04), 0 4px 16px rgba(15, 23, 42, 0.04)',
        'card-hover': '0 4px 24px rgba(15, 23, 42, 0.08)',
      },
    },
  },
  plugins: [],
}

export default config
