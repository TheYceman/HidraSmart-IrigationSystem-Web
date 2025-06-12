import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config({ path: path.resolve(__dirname, '../.env') });

export default defineConfig({
  plugins: [react()],
  root: path.resolve(__dirname),
  build: {
    outDir: path.resolve(__dirname, 'public/dist'),
    emptyOutDir: true,
  },
  publicDir: path.resolve(__dirname, 'public'),
  server: {
    port: 5173,
    proxy: {
      "/api": "http://localhost:3002"
    }
  }
});
