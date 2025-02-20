import path from "path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import vercel from 'vite-plugin-vercel';

export default defineConfig({
  server: {
    port: process.env.PORT as unknown as number,
  },
  plugins: [react(), vercel()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
