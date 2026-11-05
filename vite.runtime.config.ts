import { localIconPlugin } from "./scripts/local-icon-plugin";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// The public story player must always show the newest notes and photos.
// Do not generate a service worker: previously cached releases were
// preventing GitHub Pages visitors from seeing published changes.
export default defineConfig(({ command }) => ({
  base: "./",
  optimizeDeps: { entries: ["index.html"] },
  plugins: [localIconPlugin(command), react()],
}));
