import path from 'node:path';
import { fileURLToPath } from 'node:url';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vite';
const __dirname = path.dirname(fileURLToPath(import.meta.url));
export default defineConfig({
  base: '/',
  plugins: [react(), tailwindcss()],
  resolve: { alias: { '@': path.resolve(__dirname, 'src') }, dedupe: ['react', 'react-dom'] },
  server: { port: Number(process.env.CLIENT_PORT || 5173), host: '0.0.0.0', proxy: { '/api': { target: `http://localhost:${process.env.PORT || 5000}`, changeOrigin: true } } },
  preview: { port: Number(process.env.CLIENT_PORT || 4173), host: '0.0.0.0' },
  build: { outDir: path.resolve(__dirname, 'dist'), emptyOutDir: true },
});
