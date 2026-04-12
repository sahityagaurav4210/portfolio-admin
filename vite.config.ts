import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: "0.0.0.0",
    proxy: {
      "/api/v1": {
        target: "http://localhost:12318",
        changeOrigin: true,
        secure: true,
      },
    },
  },
  optimizeDeps: {
    include: ["@mui/system", "@mui/material", "@mui/x-date-pickers"],
  },
  esbuild: {
    drop: ["console", "debugger"],
  },
  build: {
    target: "esnext",
    minify: "esbuild",
    cssCodeSplit: true,
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules")) {
            if (id.includes("@mui/material")) return "mui-material";
            if (id.includes("@mui/x-date-pickers")) return "mui-date-pickers";
            if (id.includes("@mui/system")) return "mui-system";
            if (id.includes("@mui")) return "mui-other";
            if (id.includes("react")) return "vendor-react";
            return "vendor";
          }
        },
      },
    },
    sourcemap: false
  }
});
