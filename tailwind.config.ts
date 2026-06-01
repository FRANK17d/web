import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './lib/**/*.{ts,tsx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Canvas surfaces — DESIGN.md §2
        canvas: {
          DEFAULT: '#F3F0EE', // Canvas Cream (body bg)
          lifted: '#FCFBFA',  // Lifted Cream (nested sections)
        },
        // Ink — primary text & CTAs
        ink: {
          DEFAULT: '#141413', // Ink Black
          soft: '#262627',    // Charcoal
        },
        // Brand — Rojo Perú 🇵🇪 (primary identity)
        brand: {
          50:  '#fef2f3',
          100: '#fee2e5',
          200: '#fecace',
          300: '#fca5ad',
          400: '#f8707e',
          500: '#ee4358',
          600: '#C8102E', // Peru Red — primary
          700: '#a50d25',
          800: '#8b0f22',
          900: '#791222',
          950: '#42050e',
          DEFAULT: '#C8102E',
        },
        // Gold — Oro Inca (accents, highlights)
        gold: {
          50:  '#fefce8',
          100: '#fef9c3',
          200: '#fef08a',
          300: '#fde047',
          400: '#facc15',
          500: '#D4A017', // Inca Gold — primary
          600: '#b58910',
          700: '#8a6914',
          800: '#6f5318',
          900: '#5a431a',
          DEFAULT: '#D4A017',
        },
        // Surface — warm neutral grays (UI surfaces)
        surface: {
          50:  '#FAFAF9',
          100: '#F5F4F2',
          200: '#E8E6E3',
          300: '#D5D2CE',
          400: '#A8A4A0',
          500: '#7A7672',
          600: '#5C5956',
          700: '#454340',
          800: '#302E2C',
          900: '#1C1B1A',
        },
        // Signal Orange — consent/legal only
        signal: {
          DEFAULT: '#CF4500',
          light: '#F37338',
          deep: '#9A3A0A',
        },
        // Marketing dark theme (Pimer-inspired)
        mkt: {
          bg: '#000000',
          surface: '#0A0A0A',
          card: '#111111',
          border: '#1F1F1F',
          text: '#999999',
          accent: '#D94F4F',
          'accent-hover': '#C44545',
          'accent-light': '#EE7070',
          'accent-soft': '#F28B82',
          'accent-gradient-from': '#EE7070',
          'accent-gradient-to': '#D94F4F',
          light: '#F4F4F5',
        },
        // Neutrals
        slate: {
          DEFAULT: '#696969', // Slate Gray (muted text)
          granite: '#555555',
          graphite: '#565656',
          dust: '#D1CDC7',    // Dust Taupe (whisper text)
        },
        // Semantic
        link: '#3860BE',
        success: {
          50: '#f0fdf4',
          500: '#22c55e',
          700: '#15803d',
        },
        warning: {
          50: '#fffbeb',
          500: '#f59e0b',
          700: '#a16207',
        },
        danger: {
          50: '#fef2f2',
          500: '#ef4444',
          700: '#b91c1c',
        },
    },
    fontFamily: {
      sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
      jakarta: ['var(--font-jakarta)', 'system-ui', 'sans-serif'],
      inter: ['var(--font-inter)', 'system-ui', 'sans-serif'],
    },
      borderRadius: {
        // Mastercard radius scale: small (≤6), medium-large (20-40), full-pill (99+)
        'sm-mc': '6px',
        'btn': '20px',      // primary/secondary CTAs
        'consent': '24px',  // orange consent pill
        'hero': '40px',     // hero frames / stadium
        'pill': '999px',    // nav, full-pill shapes
        '4xl': '2rem',
      },
      boxShadow: {
        // DESIGN.md §6 elevation scale
        'nav': '0px 4px 24px 0px rgba(0,0,0,0.04)',
        'card': '0px 24px 48px 0px rgba(0,0,0,0.08)',
        'dramatic': '0px 70px 110px 0px rgba(0,0,0,0.25)',
      },
      letterSpacing: {
        'headline': '-0.02em',  // H1–H3 tight tracking
        'eyebrow': '0.04em',    // Eyebrow uppercase tracking
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
        'scale-in': 'scaleIn 0.2s ease-out',
        'spin-slow': 'spin 3s linear infinite',
        'floating': 'float 6s ease-in-out infinite',
        'carousel-left': 'carouselLeft 30s linear infinite',
        'carousel-right': 'carouselRight 30s linear infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideDown: {
          '0%': { opacity: '0', transform: 'translateY(-10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-15px)' },
        },
        carouselLeft: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        carouselRight: {
          '0%': { transform: 'translateX(-50%)' },
          '100%': { transform: 'translateX(0)' },
        },
      },
    },
  },
  plugins: [],
}

export default config
