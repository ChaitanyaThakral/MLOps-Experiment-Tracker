import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
// Proxy /api requests to the Express backend (Node.js on port 65535)
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:65535',
        changeOrigin: true,
      },
    },
  },
})
