/* Professor Dev Hub - Service Worker
   Versioned caching + update detection + offline support
*/

const CACHE_VERSION = 'dev-hub-v1.0.0';
const CACHE_NAME = `professor-dev-hub-${CACHE_VERSION}`;

const PRECACHE_URLS = [
  './',
  './index.html',
  './manifest.webmanifest',
  './sw.js',
  './db.js',
  './app.js',
  './styles.css',
  './icon-192.svg',
  './icon-512.svg'
];

// Install - precache core assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(PRECACHE_URLS))
      .then(() => self.skipWaiting())
  );
});

// Activate - clean old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name.startsWith('professor-dev-hub-') && name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch - Cache-first with network fallback
self.addEventListener('fetch', (event) => {
  // Only handle same-origin GET requests
  if (event.request.method !== 'GET' || !event.request.url.startsWith(self.location.origin)) {
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) {
        // Return cached version immediately, update in background (stale-while-revalidate for data)
        if (event.request.url.includes('/data/')) {
          fetch(event.request).then((response) => {
            if (response && response.status === 200) {
              caches.open(CACHE_NAME).then((cache) => cache.put(event.request, response.clone()));
            }
          }).catch(() => {});
        }
        return cached;
      }

      // Not in cache → try network
      return fetch(event.request).then((response) => {
        if (!response || response.status !== 200 || response.type !== 'basic') {
          return response;
        }
        const responseToCache = response.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(event.request, responseToCache));
        return response;
      }).catch(() => {
        // Offline fallback
        if (event.request.mode === 'navigate') {
          return caches.match('./index.html');
        }
        return new Response('Offline', { status: 503, statusText: 'Service Unavailable' });
      });
    })
  );
});

// Listen for SKIP_WAITING message from the page
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

// Background Sync (one-off) - ready for progress/notes sync
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-progress' || event.tag === 'sync-notes') {
    event.waitUntil(handleBackgroundSync(event.tag));
  }
});

async function handleBackgroundSync(tag) {
  // Placeholder: later we will read from IndexedDB and push to a backend
  console.log('[SW] Background sync triggered:', tag);
  // Example future implementation:
  // const data = await getFromIndexedDB(tag);
  // await fetch('/api/sync', { method: 'POST', body: JSON.stringify(data) });
}
