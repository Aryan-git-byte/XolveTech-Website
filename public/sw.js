const CACHE_NAME = 'xolvetech-v2';
const urlsToCache = [
  '/',
  '/products',
  '/components',
  '/how-it-works',
  '/learning',
  '/team',
  '/contact',
  '/manifest.json',
  '/assets/xolvetech-logo.png' // add other important assets if needed
];

// Install - cache resources
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache))
  );
});

// Fetch - serve assets correctly
self.addEventListener('fetch', (event) => {
  const requestURL = new URL(event.request.url);

  // Always fetch /index.html fresh for SPA routes
  if (requestURL.origin === location.origin && requestURL.pathname !== '/' && !requestURL.pathname.startsWith('/assets/')) {
    event.respondWith(fetch(event.request).catch(() => caches.match('/')));
    return;
  }

  // Serve cached assets if available
  event.respondWith(
    caches.match(event.request).then(response => response || fetch(event.request))
  );
});

// Activate - clean old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(
      keys.map(key => key !== CACHE_NAME ? caches.delete(key) : null)
    ))
  );
});
