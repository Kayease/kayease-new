import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";
import tagger from "@dhiwise/component-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  base: mode === 'production' ? '/' : '/',
  build: {
    outDir: "dist",
    chunkSizeWarningLimit: 2000,
    rollupOptions: {
      input: {
        main: './index.html'
      },
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          ui: ['framer-motion', 'lucide-react', 'react-icons', 'react-toastify', 'recharts'],
          state: ['@reduxjs/toolkit', 'redux']
        }
      }
    },
    sourcemap: mode === 'development',
    minify: mode === 'production' ? 'esbuild' : false,
    target: 'esnext'
  },
  plugins: [tsconfigPaths(), react(), tagger()],
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      'axios',
      'framer-motion',
      'lucide-react',
      'react-icons',
      'react-toastify',
      'recharts',
      '@reduxjs/toolkit',
      'redux'
    ],
    esbuildOptions: {
      target: 'esnext'
    }
  },
  server: {
    port: 3000,
    host: mode === 'production' ? '0.0.0.0' : 'localhost',
    strictPort: true,
    proxy: mode === 'development' ? {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        secure: false
      }
    } : {}
  },
  preview: {
    port: 4173,
    host: '0.0.0.0',
    strictPort: true
  },
  define: {
    'process.env': {}
  },
  envPrefix: ['VITE_']
}));