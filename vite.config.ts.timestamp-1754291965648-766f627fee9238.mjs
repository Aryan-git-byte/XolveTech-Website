// vite.config.ts
import { defineConfig } from "file:///home/project/node_modules/vite/dist/node/index.js";
import react from "file:///home/project/node_modules/@vitejs/plugin-react/dist/index.mjs";
import vitePrerender from "file:///home/project/node_modules/vite-prerender-plugin/src/index.js";
import path from "path";
var __vite_injected_original_dirname = "/home/project";
var vite_config_default = defineConfig({
  plugins: [
    react(),
    vitePrerender({
      staticDir: path.resolve(__vite_injected_original_dirname, "dist"),
      routes: [
        "/",
        "/contact",
        "/how-it-works",
        "/team",
        "/shipping-delivery",
        "/privacy",
        "/terms",
        "/cancellation-refund",
        "/learning",
        "/custom-projects"
      ]
    })
  ],
  optimizeDeps: {
    exclude: ["lucide-react"]
  },
  server: {
    headers: {
      "X-Frame-Options": "SAMEORIGIN",
      "Content-Security-Policy": "default-src 'self'; script-src 'self' 'unsafe-eval' https://api.razorpay.com https://checkout.razorpay.com; frame-src https://api.razorpay.com https://checkout.razorpay.com https://*.razorpay.com;"
    }
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvaG9tZS9wcm9qZWN0XCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCIvaG9tZS9wcm9qZWN0L3ZpdGUuY29uZmlnLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9ob21lL3Byb2plY3Qvdml0ZS5jb25maWcudHNcIjsvLyB2aXRlLmNvbmZpZy50c1xuaW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSAndml0ZSdcbmltcG9ydCByZWFjdCBmcm9tICdAdml0ZWpzL3BsdWdpbi1yZWFjdCdcbmltcG9ydCB2aXRlUHJlcmVuZGVyIGZyb20gJ3ZpdGUtcHJlcmVuZGVyLXBsdWdpbidcbmltcG9ydCBwYXRoIGZyb20gJ3BhdGgnXG5cbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZyh7XG4gIHBsdWdpbnM6IFtcbiAgICByZWFjdCgpLFxuICAgIHZpdGVQcmVyZW5kZXIoe1xuICAgICAgc3RhdGljRGlyOiBwYXRoLnJlc29sdmUoX19kaXJuYW1lLCAnZGlzdCcpLFxuICAgICAgcm91dGVzOiBbXG4gICAgICAgICcvJywgXG4gICAgICAgICcvY29udGFjdCcsIFxuICAgICAgICAnL2hvdy1pdC13b3JrcycsIFxuICAgICAgICAnL3RlYW0nLCBcbiAgICAgICAgJy9zaGlwcGluZy1kZWxpdmVyeScsIFxuICAgICAgICAnL3ByaXZhY3knLCBcbiAgICAgICAgJy90ZXJtcycsIFxuICAgICAgICAnL2NhbmNlbGxhdGlvbi1yZWZ1bmQnLCBcbiAgICAgICAgJy9sZWFybmluZycsIFxuICAgICAgICAnL2N1c3RvbS1wcm9qZWN0cydcbiAgICAgIF1cbiAgICB9KVxuICBdLFxuICBvcHRpbWl6ZURlcHM6IHtcbiAgICBleGNsdWRlOiBbJ2x1Y2lkZS1yZWFjdCddLFxuICB9LFxuICBzZXJ2ZXI6IHtcbiAgICBoZWFkZXJzOiB7XG4gICAgICAnWC1GcmFtZS1PcHRpb25zJzogJ1NBTUVPUklHSU4nLFxuICAgICAgJ0NvbnRlbnQtU2VjdXJpdHktUG9saWN5JzogXCJkZWZhdWx0LXNyYyAnc2VsZic7IHNjcmlwdC1zcmMgJ3NlbGYnICd1bnNhZmUtZXZhbCcgaHR0cHM6Ly9hcGkucmF6b3JwYXkuY29tIGh0dHBzOi8vY2hlY2tvdXQucmF6b3JwYXkuY29tOyBmcmFtZS1zcmMgaHR0cHM6Ly9hcGkucmF6b3JwYXkuY29tIGh0dHBzOi8vY2hlY2tvdXQucmF6b3JwYXkuY29tIGh0dHBzOi8vKi5yYXpvcnBheS5jb207XCJcbiAgICB9XG4gIH1cbn0pXG4iXSwKICAibWFwcGluZ3MiOiAiO0FBQ0EsU0FBUyxvQkFBb0I7QUFDN0IsT0FBTyxXQUFXO0FBQ2xCLE9BQU8sbUJBQW1CO0FBQzFCLE9BQU8sVUFBVTtBQUpqQixJQUFNLG1DQUFtQztBQU16QyxJQUFPLHNCQUFRLGFBQWE7QUFBQSxFQUMxQixTQUFTO0FBQUEsSUFDUCxNQUFNO0FBQUEsSUFDTixjQUFjO0FBQUEsTUFDWixXQUFXLEtBQUssUUFBUSxrQ0FBVyxNQUFNO0FBQUEsTUFDekMsUUFBUTtBQUFBLFFBQ047QUFBQSxRQUNBO0FBQUEsUUFDQTtBQUFBLFFBQ0E7QUFBQSxRQUNBO0FBQUEsUUFDQTtBQUFBLFFBQ0E7QUFBQSxRQUNBO0FBQUEsUUFDQTtBQUFBLFFBQ0E7QUFBQSxNQUNGO0FBQUEsSUFDRixDQUFDO0FBQUEsRUFDSDtBQUFBLEVBQ0EsY0FBYztBQUFBLElBQ1osU0FBUyxDQUFDLGNBQWM7QUFBQSxFQUMxQjtBQUFBLEVBQ0EsUUFBUTtBQUFBLElBQ04sU0FBUztBQUFBLE1BQ1AsbUJBQW1CO0FBQUEsTUFDbkIsMkJBQTJCO0FBQUEsSUFDN0I7QUFBQSxFQUNGO0FBQ0YsQ0FBQzsiLAogICJuYW1lcyI6IFtdCn0K
