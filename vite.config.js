import { defineConfig } from "vite"
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: { port: 5173 },
  build: {
    sourcemap: true, // Enable source maps for debugging and analysis
  },
  cacheDir: '.vite-cache',
})
