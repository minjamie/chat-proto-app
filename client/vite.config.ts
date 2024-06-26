import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:4000",
        secure: false,
      },
    },
  },

  plugins: [react()],
  resolve: {
    alias: [
      { find: "@", replacement: "/src" },
      { find: "@components", replacement: "/src/components" },
      { find: "@routes", replacement: "/src/routes" },
      { find: "@pages", replacement: "/src/pages" },
      { find: "@common", replacement: "/src/common" },
      { find: "@context", replacement: "/src/context" },
      { find: "@models", replacement: "/src/models" },
    ],
  },
});
