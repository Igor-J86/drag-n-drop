import { defineConfig } from "vite";
import react from '@vitejs/plugin-react';

export default defineConfig({
  build: {
    outDir: "./static",
    assetsDir: ".",
    emptyOutDir: false,
    rollupOptions: {
      input: {
        "ijrc-dnd": "style/ijrc-dnd.css"
      },
      output: {
        assetFileNames: 'ijrc-dnd[extname]'
      }
    }
  },
  plugins: [react()]
})