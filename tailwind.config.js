/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Gelion', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
      },
      fontSize: {
        // Todo unificado a 16px
        'xs': ['16px', { lineHeight: '24px', letterSpacing: '0px' }],
        'sm': ['16px', { lineHeight: '24px', letterSpacing: '0px' }],
        'base': ['16px', { lineHeight: '24px', letterSpacing: '0px' }],
        'lg': ['16px', { lineHeight: '24px', letterSpacing: '0px' }],
        'xl': ['16px', { lineHeight: '24px', letterSpacing: '0px' }],
        '2xl': ['16px', { lineHeight: '24px', letterSpacing: '0px' }],
      },
      fontWeight: {
        // Solo light y semibold
        'light': '300',      // Por defecto
        'normal': '300',     // Por defecto
        'medium': '300',     // Por defecto
        'semibold': '600',   // Solo títulos
        'bold': '600',       // Solo títulos
      }
    },
  },
  plugins: [],
}
