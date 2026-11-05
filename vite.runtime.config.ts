import { localIconPlugin } from "./scripts/local-icon-plugin";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";
export default defineConfig(({ command }) => ({
  base: "./",
  optimizeDeps: { entries: ["index.html"] },
  plugins: [
    localIconPlugin(command),
    react(),
    VitePWA({
      registerType: "autoUpdate",
      manifest: {
        name: "捡手机",
        short_name: "捡手机",
        display: "standalone",
        background_color: "#000000",
        theme_color: "#000000",
        icons: [{ src: "icon.svg", sizes: "any", type: "image/svg+xml" }],
      },
      workbox: {
        clientsClaim: true,
        skipWaiting: true,
        cleanupOutdatedCaches: true,
        runtimeCaching: [{ urlPattern: ({ request }) => request.mode === "navigate", handler: "NetworkFirst", options: { cacheName: "pages-navigation", networkTimeoutSeconds: 3 } }],
        globPatterns: ["**/*.{js,css,html,svg,json,txt,png,jpg}"],
        globIgnores: ["**/work.json"],
        maximumFileSizeToCacheInBytes: 8000000,
      },
    }),
  ],
}));
