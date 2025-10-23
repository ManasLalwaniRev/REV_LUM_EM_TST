import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path' // Make sure to import the 'path' module

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      // This alias allows you to import modules from 'src' using '@/'
      // For example: import Component from '@/components/Component.jsx'
      '@': path.resolve(__dirname, './src'),
    },
  },
})
