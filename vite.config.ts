import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import removeConsole from 'vite-plugin-remove-console'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(),removeConsole()],
  define: {
    global: 'globalThis',
  },
  resolve: {
    alias: {
      events: 'events'
    }
  },
  optimizeDeps: {
    include: ['events']
  },
  // Add this to prevent externalization
  build: {
    rollupOptions: {
      external: [],
    }
  }
})