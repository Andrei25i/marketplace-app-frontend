import react from "@vitejs/plugin-react";
import { defineConfig, type Plugin } from "vite";
import path from "path";

const versionFile = (): Plugin => ({
  name: "version-file",
  generateBundle() {
    this.emitFile({
      type: "asset",
      fileName: "version.json",
      source: JSON.stringify({
        version:
          process.env.RENDER_GIT_COMMIT ?? process.env.GITHUB_SHA ?? "dev",
      }),
    });
  },
});

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), versionFile()],

  server: {
    port: 3000,
    host: true,
  },

  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "./src"),
    },
  },
});
