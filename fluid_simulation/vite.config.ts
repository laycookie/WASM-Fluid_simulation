import { createRequire } from "module";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

const _require = createRequire(import.meta.url);

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      path: _require.resolve("path-browserify"),
    },
  },
});
