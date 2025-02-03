// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0', // so you can access from an external IP if your cloud server allows it
    port: 3000       // port for dev server (default is 5173, but let's do 3000)
  },
  // if you need advanced build or preview config, you can add it here
});
