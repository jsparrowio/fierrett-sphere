import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import dynamicImport from 'vite-plugin-dynamic-import'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), dynamicImport({})],
  build: {
    reportCompressedSize: false,
    chunkSizeWarningLimit: 1000
  },
  server: {
    port: 3000,
    open: true,
    proxy: {
      '/graphql': {
        target: 'http://localhost:3001',
        changeOrigin: true,
        secure: false,
        ws: true
      }, 
      '/api': { 
        target: 'http://localhost:3001'
      }
    }
  }
})
