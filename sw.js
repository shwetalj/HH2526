const CACHE_NAME = 'hh-offline-v1';
const ASSETS = [
  '/',
  '/index.html',
  '/missions.html',
  '/shared-styles.css',
  '/missions-styles.css',
  '/shared-scripts.js',
  '/missions.js',
  '/mission_data.js'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS)).then(self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.map((k) => (k !== CACHE_NAME ? caches.delete(k) : null)))).then(
      () => self.clients.claim()
    )
  );
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  // Cache-first for static assets and PDFs/images
  if (request.method === 'GET' && (request.url.includes('/pdf/') || request.url.includes('/images/') || request.url.includes('/mission_cards/') || request.destination === 'style' || request.destination === 'script' || request.destination === 'document')) {
    event.respondWith(
      caches.match(request).then((cached) => {
        if (cached) return cached;
        return fetch(request)
          .then((resp) => {
            const copy = resp.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
            return resp;
          })
          .catch(() => cached);
      })
    );
  }
});

