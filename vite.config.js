import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'
import { PROD_CONFIG } from './src/config'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  console.log('Loaded environment variables:', {
    APP_ID: env.VITE_APP_ID || PROD_CONFIG.APP_ID,
    WS_URL: env.VITE_WS_URL || PROD_CONFIG.WS_URL,
    OAUTH_URL: env.VITE_OAUTH_URL || PROD_CONFIG.OAUTH_URL
  })

  return {
    plugins: [
      react(),
      VitePWA({
        registerType: 'autoUpdate',
        includeAssets: ['favicon.ico', 'robots.txt', 'icons/*.png'],
        manifest: {
          name: 'Copy Trading App',
          short_name: 'CopyTrade',
          description: 'A React-based copy trading application',
          theme_color: '#000000',
          background_color: '#ffffff',
          display: 'standalone',
          start_url: '/copy-trading/',
          scope: '/copy-trading/',
          icons: [
            {
              src: 'icons/icon-72x72.png',
              sizes: '72x72',
              type: 'image/png'
            },
            {
              src: 'icons/icon-96x96.png',
              sizes: '96x96',
              type: 'image/png'
            },
            {
              src: 'icons/icon-128x128.png',
              sizes: '128x128',
              type: 'image/png'
            },
            {
              src: 'icons/icon-144x144.png',
              sizes: '144x144',
              type: 'image/png'
            },
            {
              src: 'icons/icon-152x152.png',
              sizes: '152x152',
              type: 'image/png'
            },
            {
              src: 'icons/icon-192x192.png',
              sizes: '192x192',
              type: 'image/png'
            },
            {
              src: 'icons/icon-384x384.png',
              sizes: '384x384',
              type: 'image/png'
            },
            {
              src: 'icons/icon-512x512.png',
              sizes: '512x512',
              type: 'image/png'
            }
          ]
        }
      })
    ],
    server: {
      port: 8443,
    },
    base: '/copy-trading/',
    define: {
      'import.meta.env.VITE_APP_ID': JSON.stringify(env.VITE_APP_ID || PROD_CONFIG.APP_ID),
      'import.meta.env.VITE_WS_URL': JSON.stringify(env.VITE_WS_URL || PROD_CONFIG.WS_URL),
      'import.meta.env.VITE_OAUTH_URL': JSON.stringify(env.VITE_OAUTH_URL || PROD_CONFIG.OAUTH_URL),
      __APP_ENV__: env.APP_ENV
    }
  }
})
