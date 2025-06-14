/**
 * Vite configuration for React application
 * Optimized for Vercel deployment with Bun runtime
 */
import { defineConfig, type UserConfig } from "vite";
import react from '@vitejs/plugin-react'
import tsconfigPaths from "vite-tsconfig-paths";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig(({ command, mode }): UserConfig => {
  const isDev = mode === 'development';
  const isProd = mode === 'production';

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
      port: 5178,
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

    // Build configuration optimized for production
    build: {
      target: 'esnext',
      outDir: 'dist',
      sourcemap: isProd ? false : true, // Disable sourcemaps in production for smaller builds
      minify: isProd ? 'esbuild' : false, // Use esbuild for faster minification
      cssMinify: isProd,
      rollupOptions: {
        output: {
          manualChunks: {
            vendor: ['react', 'react-dom'],
            router: ['react-router-dom'],
            query: ['@tanstack/react-query'],
            graphql: ['graphql', 'graphql-request'],
            ui: ['zustand', 'daisyui']
          },
          // Optimize chunk names for better caching
          chunkFileNames: 'assets/js/[name]-[hash].js',
          entryFileNames: 'assets/js/[name]-[hash].js',
          assetFileNames: 'assets/[ext]/[name]-[hash].[ext]'
        }
      },
      // Increase chunk size warning limit
      chunkSizeWarningLimit: 1000
    },

    // Environment variables
    define: {
      __DEV__: isDev,
      __PROD__: isProd,
    },

    // Resolve configuration
    resolve: {
      alias: {
        // Add any path aliases if needed
      }
    },

    // Production optimizations
    ...(isProd && {
      esbuild: {
        drop: ['console', 'debugger'], // Remove console logs in production
      },
    }),
  };
});
