import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { registerSW } from 'virtual:pwa-register'
import './index.css'
import App from './App.jsx'

// Immediately register service worker
console.log('🚀 Initializing service worker...')
try {
  const updateSW = registerSW({
    immediate: true,
    onRegisteredSW(swUrl, r) {
      console.log('✅ Service worker registered:', swUrl)
      r?.addEventListener('statechange', (e) => {
        console.log('Service Worker state changed:', e.target.state)
      })
    },
    onRegisterError(error) {
      console.error('❌ Service worker registration failed:', error)
    },
    onNeedRefresh() {
      if (confirm('New content available. Reload?')) {
        updateSW(true)
      }
    },
    onOfflineReady() {
      console.log('✅ App ready to work offline')
    },
  })
} catch (error) {
  console.error('❌ Service worker registration error:', error)
}

// Initialize React after service worker
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
