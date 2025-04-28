/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f5f6fa',
          100: '#e6e9f0',
          200: '#cfd8e6',
          300: '#b0b8c9',
          400: '#8a93a8',
          500: '#6c7890',
          600: '#4d566b',
          700: '#232946',
          800: '#181c24',
          900: '#12141a',
        },
        accent: {
          purple: '#a259ff',
          blue: '#38bdf8',
          pink: '#ff4ecd',
          green: '#4ade80',
          yellow: '#facc15',
        },
        card: '#232946',
        surface: '#232946',
        border: '#31344b',
      },
      boxShadow: {
        'card': '0 4px 32px 0 rgba(23, 25, 35, 0.25)',
        'card-hover': '0 8px 40px 0 rgba(23, 25, 35, 0.35)',
        'button': '0 4px 12px 0 rgba(162, 89, 255, 0.25)',
        'button-hover': '0 6px 16px 0 rgba(162, 89, 255, 0.35)',
      },
      backgroundImage: {
        'main-gradient': 'linear-gradient(135deg, #181c24 0%, #232946 100%)',
        'accent-gradient': 'linear-gradient(135deg, #a259ff 0%, #38bdf8 100%)',
        'card-gradient': 'linear-gradient(135deg, #232946 0%, #181c24 100%)',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'slide-down': 'slideDown 0.5s ease-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.5rem',
        '3xl': '2rem',
      },
    },
  },
  plugins: [],
} 