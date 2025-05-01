import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';


export default defineConfig({
  base: '/akatsuki.github.io/',
  plugins: [
    react(),
  ],
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
      },
    },
  },
  resolve: {
    alias: {
      '@components': '/src/components',
    },
  },
  server: {
    proxy: {
      '/api': 'http://127.0.0.1:5000',
    },
  },
});