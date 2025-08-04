import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import prerender from 'vite-plugin-prerender'

// [https://vitejs.dev/config/](https://vitejs.dev/config/)
export default defineConfig({
plugins: \[
react(),
prerender({
staticDir: path.resolve(\_\_dirname, 'dist'),
routes: \[
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
// Optional: delay prerendering until your app is fully hydrated
// renderAfterDocumentEvent: 'app-mounted',
}),
],
optimizeDeps: {
exclude: \['lucide-react'],
},
server: {
headers: {
'X-Frame-Options': 'SAMEORIGIN',
'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-eval' [https://api.razorpay.com](https://api.razorpay.com) [https://checkout.razorpay.com](https://checkout.razorpay.com); frame-src [https://api.razorpay.com](https://api.razorpay.com) [https://checkout.razorpay.com](https://checkout.razorpay.com) https\://\*.razorpay.com;"
}
}
})
