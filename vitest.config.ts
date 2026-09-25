import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'node:path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@/core': path.resolve(import.meta.dirname, './src/core'),
      '@/features': path.resolve(import.meta.dirname, './src/features'),
      '@/shared': path.resolve(import.meta.dirname, './src/shared'),
      '@/ui': path.resolve(import.meta.dirname, './src/ui'),
      '@/di': path.resolve(import.meta.dirname, './src/di'),
    },
  },
  test: {
    environment: 'jsdom',
    globals: true,
  },
})