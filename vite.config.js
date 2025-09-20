import { defineConfig } from "vite"
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: { port: 5173 },
  build: {
    sourcemap: false, // Disable source maps to reduce file size
  },
  cacheDir: '.vite-cache',
  base: '/emoji-images/',
})
