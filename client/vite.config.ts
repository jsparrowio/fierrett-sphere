import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import dynamicImport from 'vite-plugin-dynamic-import'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), dynamicImport({})],
  build: {
    reportCompressedSize: false,
    chunkSizeWarningLimit: 1000
  }
})
