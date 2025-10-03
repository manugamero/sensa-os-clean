import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    strictPort: true, // Falla si el puerto está ocupado
    host: true, // Permite acceso desde la red
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true
      }
    }
  },
  build: {
    outDir: 'dist',
    sourcemap: false, // Deshabilitar sourcemaps en producción
  },
  cacheDir: 'node_modules/.vite',
  clearScreen: false, // No limpiar pantalla para ver logs
})
