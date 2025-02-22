import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@mui/material': '@mui/material/index',
      '@mui/icons-material': '@mui/icons-material/index',
      '@mui/x-date-pickers': '@mui/x-date-pickers/index'
    }
  }
});