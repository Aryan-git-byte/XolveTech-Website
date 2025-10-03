const CACHE_NAME = 'xolvetech-v3'; // Updated version to force cache refresh
const urlsToCache = [
  '/',
  '/products',
  '/components',
  '/how-it-works',
  '/learning',
  '/team',
  '/contact',
  '/manifest.json',
  '/assets/xolvetech-logo.png'
];

// Install - cache resources with error handling
self.addEventListener('install', (event) => {
  // Skip waiting to activate immediately
  self.skipWaiting();
  
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      // Cache URLs individually to handle failures gracefully
      return Promise.allSettled(
        urlsToCache.map(url => {
          return cache.add(url).catch(error => {
            console.warn(`Failed to cache ${url}:`, error);
            return null; // Continue with other URLs even if one fails
          });
        })
      );
    })
  );
});

// Activate - clean old caches and take control immediately
self.addEventListener('activate', (event) => {
  event.waitUntil(
    Promise.all([
      // Clean up old caches
      caches.keys().then(keys => 
        Promise.all(
          keys.map(key => key !== CACHE_NAME ? caches.delete(key) : null)
        )
      ),
      // Take control of all pages immediately
      self.clients.claim()
    ])
  );
});

// Fetch - network first with proper asset handling
self.addEventListener('fetch', (event) => {
  const requestURL = new URL(event.request.url);
  const isAsset = requestURL.pathname.startsWith('/assets/');
  const isStaticFile = /\.(js|css|png|jpg|jpeg|gif|svg|ico|woff|woff2|ttf|eot)$/.test(requestURL.pathname);
  
  // For static assets (JS, CSS, images, fonts), always go network first
  if (isAsset || isStaticFile) {
    event.respondWith(
      fetch(event.request, {
        cache: 'no-cache', // Bypass browser cache
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache'
        }
      })
      .then(response => {
        // Only cache if it's a successful response with correct MIME type
        if (response.ok && response.status === 200) {
          const contentType = response.headers.get('content-type') || '';
          
          // Verify MIME type matches the file extension
          const isValidAsset = (
            (isAsset && (contentType.includes('image/') || contentType.includes('font/'))) ||
            (requestURL.pathname.endsWith('.js') && contentType.includes('javascript')) ||
            (requestURL.pathname.endsWith('.css') && contentType.includes('css')) ||
            (requestURL.pathname.match(/\.(png|jpg|jpeg|gif|svg)$/) && contentType.includes('image/'))
          );
          
          if (isValidAsset) {
            // Cache the valid asset
            const responseClone = response.clone();
            caches.open(CACHE_NAME).then(cache => {
              cache.put(event.request, responseClone);
            });
          }
        }
        return response;
      })
      .catch(() => {
        // Fallback to cache only for assets
        return caches.match(event.request);
      })
    );
    return;
  }
  
  // For SPA routes (non-asset requests), network first with HTML fallback
  if (requestURL.origin === location.origin && !isAsset && !isStaticFile) {
    event.respondWith(
      fetch(event.request, {
        cache: 'no-cache',
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache'
        }
      })
      .then(response => {
        // If it's a successful HTML response, cache it
        if (response.ok && response.headers.get('content-type')?.includes('text/html')) {
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then(cache => {
            cache.put(event.request, responseClone);
          });
        }
        return response;
      })
      .catch(() => {
        // For SPA routes, fallback to cached index.html
        return caches.match('/').then(cachedResponse => {
          return cachedResponse || new Response('Offline', { status: 503 });
        });
      })
    );
    return;
  }
  
  // For external requests, just pass through
  event.respondWith(fetch(event.request));
});
