/* Professor Dev Hub - Service Worker */
const CACHE_VERSION = 'dev-hub-v1.5.0';
const CACHE_NAME = `professor-dev-hub-${CACHE_VERSION}`;

const PRECACHE_URLS = [
  './', './index.html', './manifest.webmanifest', './sw.js',
  './db.js', './srs.js', './app.js', './styles.css',
  './data/paths.js', './data/flashcards.json', './data/quizzes.json',
  './data/labs.json', './data/challenges.json', './data/games.json',
  './icon-192.svg', './icon-512.svg'
];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE_NAME).then(c => c.addAll(PRECACHE_URLS)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then(names =>
      Promise.all(names.filter(n => n.startsWith('professor-dev-hub-') && n !== CACHE_NAME).map(n => caches.delete(n)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (e) => {
  if (e.request.method !== 'GET' || !e.request.url.startsWith(self.location.origin)) return;
  e.respondWith(
    caches.match(e.request).then(cached => {
      if (cached) {
        if (e.request.url.includes('/data/')) {
          fetch(e.request).then(r => {
            if (r && r.status === 200) caches.open(CACHE_NAME).then(c => c.put(e.request, r.clone()));
          }).catch(() => {});
        }
        return cached;
      }
      return fetch(e.request).then(r => {
        if (!r || r.status !== 200 || r.type !== 'basic') return r;
        const clone = r.clone();
        caches.open(CACHE_NAME).then(c => c.put(e.request, clone));
        return r;
      }).catch(() => e.request.mode === 'navigate' ? caches.match('./index.html') : new Response('Offline', { status: 503 }));
    })
  );
});

self.addEventListener('message', (e) => {
  if (e.data?.type === 'SKIP_WAITING') self.skipWaiting();
});
