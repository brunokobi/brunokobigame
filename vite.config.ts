import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    hmr: {
      overlay: false,
    },
  },

  plugins: [
    react(),
    mode === "development" && componentTagger(),
  ].filter(Boolean),

  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },

  optimizeDeps: {
    exclude: ["@arcgis/core"], // 🔥 IMPORTANTE
  },

  build: {
    commonjsOptions: {
      transformMixedEsModules: true,
    },
    // Divide o bundle em chunks separados para carregamento paralelo e melhor cache
    rollupOptions: {
      output: {
        manualChunks: {
          'three-core':  ['three'],
          'three-fiber': ['@react-three/fiber', '@react-three/drei'],
          'rapier':      ['@react-three/rapier'],
          'framer':      ['framer-motion'],
          'supabase':    ['@supabase/supabase-js'],
          'vendor':      ['react', 'react-dom', 'react-router-dom', 'zustand'],
        },
      },
    },
  },
}));
