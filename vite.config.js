import path from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
  root: './renderer',
  server: {
    port: 5173
  },
  build: {
    outDir: '../dist/renderer',
    emptyOutDir: true,
    assetsDir: "assets",
  },
  base: "",
  publicDir: path.resolve(__dirname, "assets")
});
