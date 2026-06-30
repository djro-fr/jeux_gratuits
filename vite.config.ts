import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'node:path'


export default defineConfig({
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
      '@/core': path.resolve(__dirname, './src/core'),
      '@/features': path.resolve(__dirname, './src/features'),
      '@/shared': path.resolve(__dirname, './src/shared'),
      '@/ui': path.resolve(__dirname, './src/ui'),
      '@/di': path.resolve(__dirname, './src/di'),
    },
  }
})