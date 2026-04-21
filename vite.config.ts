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
    cssCodeSplit: true,
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks: {
          "@mui/material": ["@mui/material"],
          "@mui/x-date-pickers": ["@mui/x-date-pickers"],
          "@mui/system": ["@mui/system"],
        },
      },
    },
    sourcemap: false
  }
});
