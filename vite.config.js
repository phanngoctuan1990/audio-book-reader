import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["icons/*.png"],
      manifest: {
        name: "Vibe Audio - Sách Nói",
        short_name: "Vibe Audio",
        description: "Nghe sách nói miễn phí, không quảng cáo",
        theme_color: "#1a1a2e",
        background_color: "#0f0f1a",
        display: "standalone",
        orientation: "portrait",
        scope: "/",
        start_url: "/",
        icons: [
          {
            src: "/icons/icon-192x192.png",
            sizes: "192x192",
            type: "image/png",
            purpose: "any maskable",
          },
          {
            src: "/icons/icon-512x512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "any maskable",
          },
        ],
      },
      workbox: {
        globPatterns: ["**/*.{js,css,html,ico,png,svg,woff2}"],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/www\.googleapis\.com\/youtube\/v3\/.*/i,
            handler: "NetworkFirst",
            options: {
              cacheName: "youtube-api-cache",
              expiration: {
                maxEntries: 100,
                maxAgeSeconds: 60 * 30, // 30 minutes
              },
            },
          },
          {
            urlPattern: /^https:\/\/i\.ytimg\.com\/.*/i,
            handler: "CacheFirst",
            options: {
              cacheName: "youtube-thumbnails",
              expiration: {
                maxEntries: 200,
                maxAgeSeconds: 60 * 60 * 24 * 7, // 7 days
              },
            },
          },
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com/,
            handler: "StaleWhileRevalidate",
            options: {
              cacheName: "google-fonts-stylesheets",
            },
          },
        ],
      },
    }),
  ],
  server: {
    host: true,
    port: 5173,
  },
});
