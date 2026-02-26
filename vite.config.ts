import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';
import { VitePWA } from 'vite-plugin-pwa';

// https://vitejs.dev/config/
export default defineConfig({
  base: './', // Ensures assets are loaded correctly on subdomains/subfolders
  plugins: [
    react(),
    tsconfigPaths(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'robots.txt'],
      manifest: {
        name: 'Revalida AI',
        short_name: 'RevalidaAI',
        description: 'A ferramenta definitiva para sua aprovação no Revalida.',
        theme_color: '#003366',
        icons: [
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      }
    })
  ],
  build: {
    target: 'esnext',
    minify: 'terser', // More aggressive minification
    cssCodeSplit: true,
    sourcemap: false, // Smaller build for production
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom', 'zustand'],
          ui: ['lucide-react', 'clsx', 'tailwind-merge'],
          ai: ['openai'],
          utils: ['date-fns', 'axios']
        }
      }
    }
  }
});
