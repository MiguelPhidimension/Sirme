/**
 * Vite configuration for React application
 */
import { defineConfig, type UserConfig } from "vite";
import react from '@vitejs/plugin-react'
import tsconfigPaths from "vite-tsconfig-paths";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig(({ command, mode }): UserConfig => {
  return {
    plugins: [
      react(), // React plugin for JSX and Fast Refresh
      tsconfigPaths(), // Support for TypeScript path mapping
      tailwindcss() // Tailwind CSS support
    ],
    
    // Optimize dependencies for faster dev server startup
    optimizeDeps: {
      include: [
        'react',
        'react-dom',
        'react-router-dom',
        '@tanstack/react-query',
        'graphql-request'
      ],
      exclude: [],
    },

    // Development server configuration
    server: {
      port: 5173,
      open: true,
      headers: {
        "Cache-Control": "public, max-age=0",
      },
    },

    // Preview server configuration
    preview: {
      port: 4173,
      headers: {
        "Cache-Control": "public, max-age=600",
      },
    },

    // Build configuration
    build: {
      target: 'esnext',
      outDir: 'dist',
      sourcemap: true,
      rollupOptions: {
        output: {
          manualChunks: {
            vendor: ['react', 'react-dom'],
            router: ['react-router-dom'],
            query: ['@tanstack/react-query'],
            graphql: ['graphql', 'graphql-request']
          }
        }
      }
    },

    // Environment variables
    define: {
      __DEV__: mode === 'development',
    },
  };
});
