import path from "node:path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  base: process.env.VITE_BASE_PATH
    ? `${process.env.VITE_BASE_PATH.replace(/\/$/, "")}/`
    : "/",
  plugins: [react()],
  resolve: {
    // The UI kit is linked from ../ui-kit; keep one React instance across the
    // symlink so hooks and context work in dev, tests and production bundles.
    dedupe: ["react", "react-dom", "react-router", "styled-components", "lucide-react"],
    alias: {
      "@": path.resolve(import.meta.dirname, "./src"),
    },
  },
});
