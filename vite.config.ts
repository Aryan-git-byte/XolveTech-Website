import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  server: {
    headers: {
      'X-Frame-Options': 'SAMEORIGIN',
      'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-eval' https://checkout.razorpay.com; frame-src 'self' https://api.razorpay.com https://checkout.razorpay.com https://*.razorpay.com;"
    }
  }
});