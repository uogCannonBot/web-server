import * as path from "path";

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import rollupReplace from "@rollup/plugin-replace";

export default defineConfig({
  server: {
    port: 3000,
  },
  plugins: [
    react(),
  ],
});
