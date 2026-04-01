import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  base: './', // Ensures relative paths are used in the generated HTML,
   plugins: [
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'Beats',
        short_name: 'Beats',
        description: 'Beats app',
        theme_color: '#000000',
        icons: [
          {
            src: 'data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🥁</text></svg>',
            sizes: '192x192',
            type: 'image/svg+xml',
          },
          {
            src: 'data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🥁</text></svg>',
            sizes: '512x512',
            type: 'image/svg+xml',
          },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,ts,tsx,css,html,ico,png,svg,mp3}'],
      },
    }),
  ]
});