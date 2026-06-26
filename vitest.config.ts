import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'node:path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@/core': path.resolve(__dirname, './src/core'),
      '@/features': path.resolve(__dirname, './src/features'),
      '@/shared': path.resolve(__dirname, './src/shared'),
      '@/ui': path.resolve(__dirname, './src/ui'),
      '@/di': path.resolve(__dirname, './src/di'),
    },
  },
  test: {
    environment: 'jsdom',
    globals: true,
  },
})