import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  root: path.resolve(__dirname),
  build: {
    outDir: path.resolve(__dirname, 'public/dist'), // 🔧 cambiar esto si está en 'public/dist'
    emptyOutDir: true,
  },
  publicDir: path.resolve(__dirname, 'public'), // ✅ opcional pero recomendable
  server: {
    port: 5173, // Puerto del servidor de desarrollo de Vite
    proxy: {
      "/api": "http://localhost:3002"
    }
  }
});