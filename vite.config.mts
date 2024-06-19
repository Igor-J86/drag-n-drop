import { defineConfig } from "vite";
import react from '@vitejs/plugin-react';

export default defineConfig({
  build: {
    outDir: "./static",
    assetsDir: ".",
    emptyOutDir: false,
    rollupOptions: {
      input: {
        "ijdnd": "style/ijdnd.css"
      },
      output: {
        assetFileNames: 'ijdnd[extname]'
      }
    }
  },
  plugins: [react()]
})