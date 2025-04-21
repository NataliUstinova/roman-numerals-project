import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    host: true,  // Allow external access
    port: 5173,
    proxy: {
      '/roman': 'http://backend:8080',
      '/arabic': 'http://backend:8080',
      '/all': 'http://backend:8080',
      '/remove': 'http://backend:8080',
    },
  },
});
