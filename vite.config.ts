import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'node:path'
import { readFileSync } from 'node:fs';

const pkg = JSON.parse(readFileSync('./package.json', 'utf-8'));


export default defineConfig({
  define: {
    __APP_VERSION__: JSON.stringify(pkg.version),
  },
  plugins: [
    react(),
    tailwindcss(),{
      name: 'vite-plugin-csp-dev',
      apply: 'serve',
      transformIndexHtml: (html) => {
        const devCSP = `
          default-src 'self';
          script-src 'self' 'unsafe-inline' blob:;
          style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
          img-src 'self' data: https:;
          font-src 'self' https://fonts.gstatic.com;
          connect-src 'self' https://firestore.googleapis.com https://www.googleapis.com http://localhost:*;
          base-uri 'self';
          form-action 'self';
          worker-src 'self' blob:;
        `        
        return html.replace(
          /<meta http-equiv="Content-Security-Policy"[^>]*>/,
          `<meta http-equiv="Content-Security-Policy" content="${devCSP.replace(/\n/g, ' ')}">`
        )
      }
    }
  ],
  resolve: {
    alias: {
      '@': path.resolve(import.meta.dirname, './src'),  
      '@/core': path.resolve(import.meta.dirname, './src/core'),
      '@/features': path.resolve(import.meta.dirname, './src/features'),
      '@/shared': path.resolve(import.meta.dirname, './src/shared'),
      '@/ui': path.resolve(import.meta.dirname, './src/ui'),
      '@/di': path.resolve(import.meta.dirname, './src/di'),
    },
  }
})