// vite.config.ts
import { defineConfig } from "file:///home/project/node_modules/vite/dist/node/index.js";
import react from "file:///home/project/node_modules/@vitejs/plugin-react/dist/index.mjs";
import { vitePrerender } from "file:///home/project/node_modules/vite-prerender-plugin/src/index.js";
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
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvaG9tZS9wcm9qZWN0XCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCIvaG9tZS9wcm9qZWN0L3ZpdGUuY29uZmlnLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9ob21lL3Byb2plY3Qvdml0ZS5jb25maWcudHNcIjtpbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tICd2aXRlJ1xuaW1wb3J0IHJlYWN0IGZyb20gJ0B2aXRlanMvcGx1Z2luLXJlYWN0J1xuaW1wb3J0IHsgdml0ZVByZXJlbmRlciB9IGZyb20gJ3ZpdGUtcHJlcmVuZGVyLXBsdWdpbicgLy8gXHUyNzA1IG5hbWVkIGltcG9ydFxuaW1wb3J0IHBhdGggZnJvbSAncGF0aCdcblxuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKHtcbiAgcGx1Z2luczogW1xuICAgIHJlYWN0KCksXG4gICAgdml0ZVByZXJlbmRlcih7XG4gICAgICBzdGF0aWNEaXI6IHBhdGgucmVzb2x2ZShfX2Rpcm5hbWUsICdkaXN0JyksXG4gICAgICByb3V0ZXM6IFtcbiAgICAgICAgJy8nLCBcbiAgICAgICAgJy9jb250YWN0JywgXG4gICAgICAgICcvaG93LWl0LXdvcmtzJywgXG4gICAgICAgICcvdGVhbScsIFxuICAgICAgICAnL3NoaXBwaW5nLWRlbGl2ZXJ5JywgXG4gICAgICAgICcvcHJpdmFjeScsIFxuICAgICAgICAnL3Rlcm1zJywgXG4gICAgICAgICcvY2FuY2VsbGF0aW9uLXJlZnVuZCcsIFxuICAgICAgICAnL2xlYXJuaW5nJywgXG4gICAgICAgICcvY3VzdG9tLXByb2plY3RzJ1xuICAgICAgXVxuICAgIH0pXG4gIF0sXG4gIG9wdGltaXplRGVwczoge1xuICAgIGV4Y2x1ZGU6IFsnbHVjaWRlLXJlYWN0J10sXG4gIH0sXG4gIHNlcnZlcjoge1xuICAgIGhlYWRlcnM6IHtcbiAgICAgICdYLUZyYW1lLU9wdGlvbnMnOiAnU0FNRU9SSUdJTicsXG4gICAgICAnQ29udGVudC1TZWN1cml0eS1Qb2xpY3knOiBcImRlZmF1bHQtc3JjICdzZWxmJzsgc2NyaXB0LXNyYyAnc2VsZicgJ3Vuc2FmZS1ldmFsJyBodHRwczovL2FwaS5yYXpvcnBheS5jb20gaHR0cHM6Ly9jaGVja291dC5yYXpvcnBheS5jb207IGZyYW1lLXNyYyBodHRwczovL2FwaS5yYXpvcnBheS5jb20gaHR0cHM6Ly9jaGVja291dC5yYXpvcnBheS5jb20gaHR0cHM6Ly8qLnJhem9ycGF5LmNvbTtcIlxuICAgIH1cbiAgfVxufSlcbiJdLAogICJtYXBwaW5ncyI6ICI7QUFBeU4sU0FBUyxvQkFBb0I7QUFDdFAsT0FBTyxXQUFXO0FBQ2xCLFNBQVMscUJBQXFCO0FBQzlCLE9BQU8sVUFBVTtBQUhqQixJQUFNLG1DQUFtQztBQUt6QyxJQUFPLHNCQUFRLGFBQWE7QUFBQSxFQUMxQixTQUFTO0FBQUEsSUFDUCxNQUFNO0FBQUEsSUFDTixjQUFjO0FBQUEsTUFDWixXQUFXLEtBQUssUUFBUSxrQ0FBVyxNQUFNO0FBQUEsTUFDekMsUUFBUTtBQUFBLFFBQ047QUFBQSxRQUNBO0FBQUEsUUFDQTtBQUFBLFFBQ0E7QUFBQSxRQUNBO0FBQUEsUUFDQTtBQUFBLFFBQ0E7QUFBQSxRQUNBO0FBQUEsUUFDQTtBQUFBLFFBQ0E7QUFBQSxNQUNGO0FBQUEsSUFDRixDQUFDO0FBQUEsRUFDSDtBQUFBLEVBQ0EsY0FBYztBQUFBLElBQ1osU0FBUyxDQUFDLGNBQWM7QUFBQSxFQUMxQjtBQUFBLEVBQ0EsUUFBUTtBQUFBLElBQ04sU0FBUztBQUFBLE1BQ1AsbUJBQW1CO0FBQUEsTUFDbkIsMkJBQTJCO0FBQUEsSUFDN0I7QUFBQSxFQUNGO0FBQ0YsQ0FBQzsiLAogICJuYW1lcyI6IFtdCn0K
