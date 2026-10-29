// Refugio — Service Worker v2
const CACHE = 'refugio-v2';
const ASSETS = [
  '/refugio/',
  '/refugio/index.html',
  '/refugio/manifest.json',
  '/refugio/icons/icon-192.png',
  '/refugio/icons/icon-512.png'
];

// Instalar: cachear assets esenciales
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE)
      .then(c => c.addAll(ASSETS))
      .then(() => self.skipWaiting())
  );
});

// Activar: limpiar caches anteriores
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

// Fetch: network-first, fallback a cache
self.addEventListener('fetch', e => {
  e.respondWith(
    fetch(e.request)
      .then(res => {
        const clone = res.clone();
        caches.open(CACHE).then(c => c.put(e.request, clone));
        return res;
      })
      .catch(() => caches.match(e.request))
  );
});
