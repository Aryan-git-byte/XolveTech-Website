import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import prerenderSpa from 'vite-plugin-prerender-spa'

// https://vitejs.dev/config/
export default defineConfig({
plugins: [
react(),
prerenderSpa({
staticDir: path.resolve(__dirname, 'dist'),
routes: [
'/',
'/contact',
'/privacy',
'/custom-projects',
'/how-it-works',
'/learning',
'/cancellation-refund',
'/shipping-delivery',
'/team',
'/terms'
],
// Optional: if your app dispatches a custom event when fully loaded
// renderAfterDocumentEvent: 'app-mounted',
}),
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

