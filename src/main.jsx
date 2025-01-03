import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// Register service worker for PWA
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/copy-trading/sw.js', { scope: '/copy-trading/' })
      .then(registration => {
        console.log('ServiceWorker registration successful:', registration.scope);
        
        // Check for updates on page load
        registration.update();

        // Check for updates every hour
        setInterval(() => {
          registration.update();
        }, 1000 * 60 * 60);

        // Handle updates
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              // New service worker is installed and ready to take over
              const notification = document.createElement('div');
              notification.style.position = 'fixed';
              notification.style.bottom = '20px';
              notification.style.left = '50%';
              notification.style.transform = 'translateX(-50%)';
              notification.style.backgroundColor = '#4CAF50';
              notification.style.color = 'white';
              notification.style.padding = '12px 24px';
              notification.style.borderRadius = '4px';
              notification.style.boxShadow = '0 2px 5px rgba(0,0,0,0.2)';
              notification.style.zIndex = '9999';
              notification.style.cursor = 'pointer';
              notification.textContent = 'New version available! Click to update.';
              
              notification.addEventListener('click', () => {
                notification.remove();
                window.location.reload();
              });
              
              document.body.appendChild(notification);
            }
          });
        });
      })
      .catch(error => {
        console.error('ServiceWorker registration failed:', error);
      });
  });
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
