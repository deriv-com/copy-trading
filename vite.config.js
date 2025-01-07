import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import { PROD_CONFIG } from './src/config'

export default defineConfig(({ mode }) => {
  const isProd = mode === 'production'
  const env = loadEnv(mode, process.cwd(), '')

  console.log('Loaded environment variables:', {
    APP_ID: env.VITE_APP_ID || PROD_CONFIG.APP_ID,
    WS_URL: env.VITE_WS_URL || PROD_CONFIG.WS_URL,
    OAUTH_URL: env.VITE_OAUTH_URL || PROD_CONFIG.OAUTH_URL
  })

  return {
    plugins: [react()],
    server: {
      port: 8443,
    },
    base: '/copy-trading/',
    build: {
      // Enable asset hashing for better cache control
      assetsDir: 'assets',
      rollupOptions: {
        output: {
          // Ensure chunk filenames include content hash
          chunkFileNames: isProd ? 'js/[name]-[hash].js' : 'js/[name].js',
          entryFileNames: isProd ? 'js/[name]-[hash].js' : 'js/[name].js',
          assetFileNames: isProd ? 'assets/[name]-[hash][extname]' : 'assets/[name][extname]',
          // Implement manual chunks for better code splitting
          manualChunks: {
            vendor: [
              'react',
              'react-dom',
              'react-router-dom',
              '@deriv-com/quill-ui',
              '@deriv/quill-icons'
            ],
            // Separate chunk for components
            components: [
              './src/components/Dashboard.jsx',
              './src/components/TraderDashboard.jsx',
              './src/components/CopierDashboard.jsx'
            ]
          }
        },
      },
      // Increase chunk size warning limit
      chunkSizeWarningLimit: 1000,
      // Generate source maps for production debugging
      sourcemap: true,

    },
    define: {
      'import.meta.env.VITE_APP_ID': JSON.stringify(env.VITE_APP_ID || PROD_CONFIG.APP_ID),
      'import.meta.env.VITE_WS_URL': JSON.stringify(env.VITE_WS_URL || PROD_CONFIG.WS_URL),
      'import.meta.env.VITE_OAUTH_URL': JSON.stringify(env.VITE_OAUTH_URL || PROD_CONFIG.OAUTH_URL),
      __APP_ENV__: env.APP_ENV
    }
  }
})
