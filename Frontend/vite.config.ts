import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    strictPort: true,
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:8080',
        changeOrigin: false, // Keep Host as localhost:5173 so session cookie is set for dev server origin
        rewrite: (path) => path.replace(/^\/api/, '/api'),
      },
    },
  },
})
