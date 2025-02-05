// vite.config.js

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0', // to access from an external IP
    port: 3000       // port for dev server (default is 5173)
  },
  // if advanced build or preview config, add here
});
