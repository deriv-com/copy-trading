// Service Worker for Deriv Copy Trading PWA

const CACHE_NAME = 'deriv-copy-trading-v1';
const urlsToCache = [
  '/copy-trading/',
  '/copy-trading/index.html',
  '/copy-trading/manifest.json',
  '/copy-trading/icons/icon-72x72.png',
  '/copy-trading/icons/icon-96x96.png',
  '/copy-trading/icons/icon-128x128.png',
  '/copy-trading/icons/icon-144x144.png',
  '/copy-trading/icons/icon-152x152.png',
  '/copy-trading/icons/icon-192x192.png',
  '/copy-trading/icons/icon-384x384.png',
  '/copy-trading/icons/icon-512x512.png'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          return response;
        }
        return fetch(event.request)
          .then(response => {
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }
            const responseToCache = response.clone();
            caches.open(CACHE_NAME)
              .then(cache => {
                cache.put(event.request, responseToCache);
              });
            return response;
          });
      })
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
