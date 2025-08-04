// vite.config.ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import vitePrerender from 'vite-prerender-plugin'
import path from 'path'

export default defineConfig({
  plugins: [
    react(),
    vitePrerender({
      staticDir: path.resolve(__dirname, 'dist'),
      routes: [
        '/', 
        '/contact', 
        '/how-it-works', 
        '/team', 
        '/shipping-delivery', 
        '/privacy', 
        '/terms', 
        '/cancellation-refund', 
        '/learning', 
        '/custom-projects'
      ]
    })
  ],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  server: {
    headers: {
      'X-Frame-Options': 'SAMEORIGIN',
      'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-eval' https://api.razorpay.com https://checkout.razorpay.com; frame-src https://api.razorpay.com https://checkout.razorpay.com https://*.razorpay.com;"
    }
  }
})
