import path from "node:path";
import { execSync } from "node:child_process";

import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig(() => {
  // Get the current Git commit hash
  const getGitCommitHash = () => {
    try {
      return execSync('git rev-parse HEAD', { encoding: 'utf8' }).trim();
    } catch {
      return 'unknown';
    }
  };

  return {
    server: {
      host: "::",
      port: 8080,
      proxy: {
        // Proxy for Podcast Index API
        '/api/podcastindex': {
          target: 'https://api.podcastindex.org',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api\/podcastindex/, '/api/1.0'),
          configure: (proxy, _options) => {
            proxy.on('error', (err, _req, _res) => {
              console.log('proxy error', err);
            });
            proxy.on('proxyReq', (_proxyReq, req, _res) => {
              console.log('Sending Request to the Target:', req.method, req.url);
            });
            proxy.on('proxyRes', (proxyRes, req, _res) => {
              console.log('Received Response from the Target:', proxyRes.statusCode, req.url);
            });
          },
        },
        // Proxy for Podcast Index stats
        '/api/podcastindex-stats': {
          target: 'https://stats.podcastindex.org',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api\/podcastindex-stats/, ''),
        },
        // Proxy RSS feed requests to local development server
        '/api/rss-proxy': {
          target: 'http://localhost:3001',
          changeOrigin: true,
          configure: (proxy, _options) => {
            proxy.on('error', (err, _req, res) => {
              console.error('❌ RSS proxy error:', err);
              if (res && !res.headersSent) {
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'RSS proxy server unavailable' }));
              }
            });
          },
        },
        // Proxy audio requests to local development server
        '/api/audio-proxy': {
          target: 'http://localhost:3001',
          changeOrigin: true,
          configure: (proxy, _options) => {
            proxy.on('error', (err, _req, res) => {
              console.error('❌ Audio proxy error:', err);
              if (res && !res.headersSent) {
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Audio proxy server unavailable' }));
              }
            });
          },
        },
      },
    },
    plugins: [
      react(),
    ],
    define: {
      'import.meta.env.VITE_GIT_COMMIT_HASH': JSON.stringify(getGitCommitHash()),
    },
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    build: {
      target: 'es2015',
      minify: 'esbuild',
      // Enable source maps for debugging
      sourcemap: false,
      // Optimize chunk size warnings
      chunkSizeWarningLimit: 1000,
      // Enable CSS code splitting
      cssCodeSplit: true,
      // Optimize assets
      assetsInlineLimit: 4096,
      // Enable rollup tree shaking
      rollupOptions: {
        treeshake: true,
        output: {
          manualChunks: {
            // Core React libraries
            'react-vendor': ['react', 'react-dom'],
            
            // UI components - split by usage frequency
            'ui-core': [
              '@radix-ui/react-dialog', 
              '@radix-ui/react-popover', 
              '@radix-ui/react-tabs',
              '@radix-ui/react-dropdown-menu',
              '@radix-ui/react-avatar',
              '@radix-ui/react-slot'
            ],
            'ui-advanced': [
              '@radix-ui/react-accordion',
              '@radix-ui/react-alert-dialog',
              '@radix-ui/react-aspect-ratio',
              '@radix-ui/react-checkbox',
              '@radix-ui/react-collapsible',
              '@radix-ui/react-context-menu',
              '@radix-ui/react-hover-card',
              '@radix-ui/react-label',
              '@radix-ui/react-menubar',
              '@radix-ui/react-navigation-menu',
              '@radix-ui/react-progress',
              '@radix-ui/react-radio-group',
              '@radix-ui/react-scroll-area',
              '@radix-ui/react-select',
              '@radix-ui/react-separator',
              '@radix-ui/react-slider',
              '@radix-ui/react-switch',
              '@radix-ui/react-toast',
              '@radix-ui/react-toggle',
              '@radix-ui/react-toggle-group',
              '@radix-ui/react-tooltip'
            ],
            
            // Payment libraries - loaded only when needed
            'payments': ['@getalby/bitcoin-connect', '@getalby/sdk'],
            
            // Utility libraries
            'utils': ['date-fns', 'clsx', 'tailwind-merge', 'class-variance-authority'],
            
            // Data management
            'data': ['@tanstack/react-query', 'zustand'],
            
            // Routing
            'routing': ['react-router-dom'],
            
            // Form handling
            'forms': ['react-hook-form', '@hookform/resolvers', 'zod'],
            
            // Charts and visualizations
            'charts': ['recharts', 'canvas-confetti'],
            
            // Image processing
            'images': ['colorthief'],
            
            // Other utilities
            'other': ['lucide-react', 'sonner', 'vaul', 'embla-carousel-react', 'react-day-picker', 'react-resizable-panels', 'input-otp', 'cmdk']
          },
          // Optimize chunk names for better caching
          chunkFileNames: 'assets/[name]-[hash].js',
          entryFileNames: 'assets/[name]-[hash].js',
          assetFileNames: 'assets/[name]-[hash].[ext]'
        }
      }
    },
    // Optimize dependencies
    optimizeDeps: {
      include: [
        'react',
        'react-dom',
        'react-router-dom',
        '@tanstack/react-query',
        'zustand',
        'clsx',
        'tailwind-merge',
        'lucide-react'
      ],
      exclude: [
        '@getalby/bitcoin-connect',
        '@getalby/sdk'
      ]
    }
  };
});