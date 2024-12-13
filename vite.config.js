import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  // Production fallback values
  const PROD_APP_ID = '66435'
  const PROD_WS_URL = 'wss://green.derivws.com/websockets/v3'
  const PROD_OAUTH_URL = 'https://oauth.deriv.com'

  console.log('Loaded environment variables:', {
    APP_ID: env.VITE_APP_ID || PROD_APP_ID,
    WS_URL: env.VITE_WS_URL || PROD_WS_URL,
    OAUTH_URL: env.VITE_OAUTH_URL || PROD_OAUTH_URL
  })

  return {
    plugins: [react()],
    server: {
      port: 8443,
    },
    base: '/copy-trading/',
    define: {
      'import.meta.env.VITE_APP_ID': JSON.stringify(env.VITE_APP_ID || PROD_APP_ID),
      'import.meta.env.VITE_WS_URL': JSON.stringify(env.VITE_WS_URL || PROD_WS_URL),
      'import.meta.env.VITE_OAUTH_URL': JSON.stringify(env.VITE_OAUTH_URL || PROD_OAUTH_URL),
      __APP_ENV__: env.APP_ENV
    }
  }
})
