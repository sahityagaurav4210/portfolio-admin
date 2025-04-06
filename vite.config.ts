import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0'
  },
  optimizeDeps: {
    include: ['@mui/system', '@mui/material', '@mui/x-date-pickers'],
  },
  // build: {
  //   rollupOptions: {
  //     external: ['@mui/x-date-pickers/AdapterDayjs', '@mui/system', '@mui/system/RtlProvider'],
  //   },
  // }
});
