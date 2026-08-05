import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig} from 'vite';

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    build: {
      rollupOptions: {
        input: {
          main: path.resolve(__dirname, 'index.html'),
          about: path.resolve(__dirname, 'about.html'),
          services: path.resolve(__dirname, 'services.html'),
          portfolio: path.resolve(__dirname, 'portfolio.html'),
          contact: path.resolve(__dirname, 'contact.html'),
          bakery: path.resolve(__dirname, 'projects/bakery-website.html'),
          restaurant: path.resolve(__dirname, 'projects/restaurant-website.html'),
          cafe: path.resolve(__dirname, 'projects/cafe-website.html'),
          ecommerce: path.resolve(__dirname, 'projects/ecommerce-website.html'),
          android: path.resolve(__dirname, 'projects/android-app.html'),
        },
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modifyâfile watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
