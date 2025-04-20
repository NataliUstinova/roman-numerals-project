import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/roman': 'http://localhost:8080',
      '/arabic': 'http://localhost:8080',
      '/all': 'http://localhost:8080',
      '/remove': 'http://localhost:8080',
    },
  },
});
