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

  build: {
    commonjsOptions: {
      transformMixedEsModules: true,
    },
    // Divide o bundle em chunks separados para carregamento paralelo e melhor cache.
    // three/@react-three/rapier NÃO entram aqui de propósito (nem como objeto, nem
    // como função): qualquer manualChunks nomeado pra eles faz o Vite tratá-los como
    // eager e pré-carregá-los (<link rel="modulepreload">) já no index.html, mesmo
    // só sendo alcançados via import() dinâmico (Game.tsx carrega a Scene sob
    // demanda, após o clique em "Inicializar Sistema"). Deixando o Rollup decidir
    // sozinho, esse chunk pesado só é buscado quando o usuário realmente clica em
    // jogar — é o ganho de performance principal desta mudança.
    rollupOptions: {
      output: {
        manualChunks: {
          'framer':      ['framer-motion'],
          'supabase':    ['@supabase/supabase-js'],
          'vendor':      ['react', 'react-dom', 'react-router-dom', 'zustand'],
        },
      },
    },
  },
}));
