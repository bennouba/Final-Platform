import path from "path";
import fs from "fs";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig, type Plugin } from "vite";

function copyDirSync(src: string, dest: string) {
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }
  
  const files = fs.readdirSync(src);
  
  files.forEach(file => {
    const srcPath = path.join(src, file);
    const destPath = path.join(dest, file);
    
    if (fs.statSync(srcPath).isDirectory()) {
      copyDirSync(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  });
}

const syncAssetsPlugin: Plugin = {
  name: "sync-assets",
  apply: "serve",
  async config() {
    const backendAssets = path.resolve(__dirname, "./backend/public/assets");
    const publicAssets = path.resolve(__dirname, "./public/assets");
    
    if (fs.existsSync(backendAssets)) {
      try {
        copyDirSync(backendAssets, publicAssets);
      } catch (error) {
        // Asset sync failed
      }
    } else {
      // Backend assets not found
    }
  },
  transformIndexHtml(html) {
    return html;
  }
};

export default defineConfig({
  plugins: [syncAssetsPlugin, react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    middlewareMode: false,
    port: 5174,
    strictPort: true,
    hmr: {
      protocol: "ws",
      host: "localhost",
      port: 5174,
    },
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        secure: false,
      },
      '/health': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        secure: false,
      },
    },
  },
  build: {
    chunkSizeWarningLimit: 2048,
  },
});
