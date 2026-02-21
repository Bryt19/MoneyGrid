import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],
          'vendor-charts': ['recharts'],
          'vendor-icons': ['lucide-react'],
          'vendor-ui': ['framer-motion'],
        },
      },
    },
    chunkSizeWarningLimit: 1000,
    cssCodeSplit: true,
  },
  esbuild: {
    drop: ['console', 'debugger'],
  },
})
