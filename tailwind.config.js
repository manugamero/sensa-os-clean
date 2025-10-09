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
        // Unificando a 5 tamaños principales
        'xs': ['12px', { lineHeight: '16px', letterSpacing: '0px' }],   // Metadata, tags
        'sm': ['14px', { lineHeight: '20px', letterSpacing: '0px' }],   // Texto secundario
        'base': ['16px', { lineHeight: '24px', letterSpacing: '0px' }], // Texto por defecto
        'lg': ['18px', { lineHeight: '24px', letterSpacing: '0px' }],   // Headers de paneles
        'xl': ['20px', { lineHeight: '28px', letterSpacing: '0px' }],   // Títulos principales
      },
      fontWeight: {
        // Usando solo 3 grosores de Gelion
        'normal': '400',  // Regular
        'medium': '500',  // Medium
        'semibold': '600', // Semibold
      }
    },
  },
  plugins: [],
}
