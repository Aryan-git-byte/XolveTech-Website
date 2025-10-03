import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Different configurations for development vs production
  const isDevelopment = mode === 'development'
  
  return {
    base: '/',
    plugins: [react()],
    
    server: {
      headers: isDevelopment 
        ? {
            // Minimal security headers for development
            'X-Frame-Options': 'SAMEORIGIN'
          }
        : {
            // Full security headers for production preview
            'X-Frame-Options': 'SAMEORIGIN',
            'Content-Security-Policy': [
              "default-src 'self'",
              // Allow Vite dev scripts and eval for development tools
              "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://api.razorpay.com https://checkout.razorpay.com",
              // Allow inline styles (common in dev)
              "style-src 'self' 'unsafe-inline'",
              // Allow Razorpay frames
              "frame-src https://api.razorpay.com https://checkout.razorpay.com https://*.razorpay.com",
              // Allow images from anywhere (adjust as needed)
              "img-src 'self' data: https:",
              // Allow fonts
              "font-src 'self' https:",
              // Allow websockets for Vite HMR
              "connect-src 'self' ws: wss: https://api.razorpay.com"
            ].join('; ')
          }
    },

    // Build-specific configurations
    build: {
      // Production build optimizations
      rollupOptions: {
        output: {
          // Add integrity hashes in production
          entryFileNames: '[name]-[hash].js',
          chunkFileNames: '[name]-[hash].js',
          assetFileNames: '[name]-[hash].[ext]'
        }
      }
    },

    // Conditional optimization exclusions
    ...(isDevelopment && {
      // Only exclude in development if needed
      // optimizeDeps: {
      //   exclude: ['some-problematic-package']
      // }
    })
  }
})