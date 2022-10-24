import { defineConfig } from "vite";
import { createRequire } from "module";
import react from "@vitejs/plugin-react";
import path from "path-browserify";

const _require = createRequire(import.meta.url);

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      path: "path-browserify",
    },
  },
});
