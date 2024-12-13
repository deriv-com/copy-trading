import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  console.log('Loaded environment variables:', {
    APP_ID: env.VITE_APP_ID,
    WS_URL: env.VITE_WS_URL
  })

  return {
    plugins: [react()],
    server: {
      port: 8443,
    },
    base: '/copy-trading/',
    define: {
      'import.meta.env.VITE_APP_ID': JSON.stringify(env.VITE_APP_ID),
      'import.meta.env.VITE_WS_URL': JSON.stringify(env.VITE_WS_URL),
      'import.meta.env.VITE_OAUTH_URL': JSON.stringify(env.VITE_OAUTH_URL),
      'import.meta.env.VITE_REDIRECT_URL': JSON.stringify(env.VITE_REDIRECT_URL),
      'import.meta.env.VITE_BASE_URL': JSON.stringify(env.VITE_BASE_URL),
      __APP_ENV__: env.APP_ENV
    }
  }
})
