import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // Preserve process.env compatibility
  define: {
    "process.env": process.env,
  },
  // Base path for GitHub Pages deployment
  base: "./",
  // Output build directory
  build: {
    outDir: "dist",
  },
  // Configure the server
  server: {
    port: 5173,
    open: true,
  },
});
