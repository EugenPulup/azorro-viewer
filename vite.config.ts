import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";

// https://vite.dev/config/
export default defineConfig({
  root: resolve(__dirname, "viewer"),
  plugins: [react()],
  build: {
    outDir: resolve(__dirname, "viewer/dist"),
    emptyOutDir: true,
  },
  publicDir: resolve(__dirname, "viewer/public"),
});
