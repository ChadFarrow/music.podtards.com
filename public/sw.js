// Service Worker for Podtardstr PWA
// Provides offline support and caching for better mobile experience

const CACHE_NAME = 'podtardstr-v8';
const STATIC_CACHE_NAME = 'podtardstr-static-v8';
const DYNAMIC_CACHE_NAME = 'podtardstr-dynamic-v8';
const API_CACHE_NAME = 'podtardstr-api-v8';

// Files to cache for offline functionality
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.webmanifest',
  '/favicon.ico',
  '/icon-192.png',
  '/icon-512.png',
  '/apple-touch-icon.png'
];

// Cache strategies
const CACHE_STRATEGIES = {
  STATIC: 'cache-first',      // Icons, manifest, static assets
  BUNDLES: 'stale-while-revalidate', // JS/CSS bundles
  API: 'network-first',       // API calls
  IMAGES: 'cache-first',      // Images and media
  HTML: 'network-first'       // HTML pages
};

// Install event - cache static assets
self.addEventListener('install', (event) => {
  console.log('[SW] Installing service worker v8...');
  
  event.waitUntil(
    Promise.all([
      // Cache static assets
      caches.open(STATIC_CACHE_NAME).then((cache) => {
        console.log('[SW] Caching static assets');
        return cache.addAll(STATIC_ASSETS);
      }),
      
      // Pre-cache critical assets
      caches.open(DYNAMIC_CACHE_NAME).then((cache) => {
        console.log('[SW] Pre-caching critical assets');
        return cache.addAll([
          // Add any critical assets that should be cached immediately
        ]);
      })
    ]).catch((error) => {
      console.warn('[SW] Failed to cache some assets:', error);
    })
  );
  
  // Skip waiting to activate immediately
  self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating service worker v8...');
  
  event.waitUntil(
    Promise.all([
      // Clean up old caches
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (![STATIC_CACHE_NAME, DYNAMIC_CACHE_NAME, API_CACHE_NAME].includes(cacheName)) {
              console.log('[SW] Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      }),
      
      // Take control of all clients immediately
      self.clients.claim()
    ])
  );
});

// Fetch event - serve cached content when offline
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);
  
  // Skip non-HTTP requests
  if (!event.request.url.startsWith('http')) {
    return;
  }
  
  // Skip WebSocket connections and EventSource
  if (event.request.headers.get('upgrade') === 'websocket' || 
      event.request.headers.get('accept') === 'text/event-stream') {
    return;
  }
  
  // Handle different types of requests
  if (event.request.method === 'GET') {
    const strategy = getCacheStrategy(event.request, url);
    
    switch (strategy) {
      case CACHE_STRATEGIES.STATIC:
        event.respondWith(cacheFirstStrategy(event.request, STATIC_CACHE_NAME));
        break;
      case CACHE_STRATEGIES.BUNDLES:
        event.respondWith(staleWhileRevalidateStrategy(event.request, DYNAMIC_CACHE_NAME));
        break;
      case CACHE_STRATEGIES.API:
        event.respondWith(networkFirstStrategy(event.request, API_CACHE_NAME));
        break;
      case CACHE_STRATEGIES.IMAGES:
        event.respondWith(cacheFirstStrategy(event.request, DYNAMIC_CACHE_NAME));
        break;
      case CACHE_STRATEGIES.HTML:
      default:
        event.respondWith(networkFirstStrategy(event.request, DYNAMIC_CACHE_NAME));
        break;
    }
  }
});

// Determine cache strategy based on request
function getCacheStrategy(request, url) {
  // Static assets
  if (request.url.includes('/manifest.webmanifest') ||
      request.url.includes('/favicon') ||
      request.url.includes('/icon-') ||
      request.url.includes('/apple-touch-icon')) {
    return CACHE_STRATEGIES.STATIC;
  }
  
  // JavaScript and CSS bundles
  if (request.url.includes('/assets/') && 
      (request.url.includes('.js') || request.url.includes('.css'))) {
    return CACHE_STRATEGIES.BUNDLES;
  }
  
  // API requests
  if (url.pathname.startsWith('/api/') || 
      url.hostname.includes('api.') || 
      url.hostname.includes('stats.') ||
      url.hostname.includes('podcastindex.org')) {
    return CACHE_STRATEGIES.API;
  }
  
  // Images and media
  if (request.destination === 'image' || 
      request.destination === 'audio' ||
      request.url.includes('/image/') ||
      request.url.includes('.jpg') ||
      request.url.includes('.png') ||
      request.url.includes('.mp3') ||
      request.url.includes('.m4a')) {
    return CACHE_STRATEGIES.IMAGES;
  }
  
  // HTML pages
  if (request.destination === 'document' ||
      request.url.endsWith('/') || 
      request.url.endsWith('.html')) {
    return CACHE_STRATEGIES.HTML;
  }
  
  return CACHE_STRATEGIES.HTML;
}

// Cache first strategy - good for static assets
async function cacheFirstStrategy(request, cacheName) {
  try {
    const cache = await caches.open(cacheName);
    const cachedResponse = await cache.match(request);
    
    if (cachedResponse) {
      console.log('[SW] Serving from cache:', request.url);
      return cachedResponse;
    }
    
    // If not in cache, fetch from network and cache
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok && request.method === 'GET') {
      const responseClone = networkResponse.clone();
      cache.put(request, responseClone);
      console.log('[SW] Cached new resource:', request.url);
    }
    
    return networkResponse;
  } catch (error) {
    console.warn('[SW] Cache first strategy failed:', error);
    return getOfflineFallback(request);
  }
}

// Stale while revalidate strategy - good for bundles
async function staleWhileRevalidateStrategy(request, cacheName) {
  try {
    const cache = await caches.open(cacheName);
    const cachedResponse = await cache.match(request);
    
    // Return cached version immediately if available
    if (cachedResponse) {
      console.log('[SW] Serving stale from cache:', request.url);
      
      // Update cache in background
      fetch(request).then((networkResponse) => {
        if (networkResponse.ok) {
          cache.put(request, networkResponse);
          console.log('[SW] Updated cache in background:', request.url);
        }
      }).catch(() => {
        // Ignore background update failures
      });
      
      return cachedResponse;
    }
    
    // If not cached, fetch and cache
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok && request.method === 'GET') {
      const responseClone = networkResponse.clone();
      cache.put(request, responseClone);
      console.log('[SW] Cached new bundle:', request.url);
    }
    
    return networkResponse;
  } catch (error) {
    console.warn('[SW] Stale while revalidate failed:', error);
    return getOfflineFallback(request);
  }
}

// Network first strategy - good for dynamic content
async function networkFirstStrategy(request, cacheName) {
  try {
    // Add timeout to prevent hanging
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
    
    const networkResponse = await fetch(request, {
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);
    
    // Cache successful responses
    if (networkResponse.ok && request.method === 'GET') {
      const cache = await caches.open(cacheName);
      const responseClone = networkResponse.clone();
      
      // Don't cache very large responses
      const contentLength = responseClone.headers.get('content-length');
      if (!contentLength || parseInt(contentLength) < 5000000) { // 5MB limit
        cache.put(request, responseClone);
        console.log('[SW] Cached network response:', request.url);
      }
    }
    
    return networkResponse;
  } catch (error) {
    console.warn('[SW] Network request failed, trying cache:', error);
    
    // If network fails, try to serve from cache
    const cache = await caches.open(cacheName);
    const cachedResponse = await cache.match(request);
    
    if (cachedResponse) {
      console.log('[SW] Serving from cache after network failure:', request.url);
      return cachedResponse;
    }
    
    // Return offline fallback
    return getOfflineFallback(request);
  }
}

// Offline fallback responses
function getOfflineFallback(request) {
  console.log('[SW] Providing offline fallback for:', request.url);
  
  if (request.destination === 'document') {
    // Return cached index.html for navigation requests
    return caches.match('/') || caches.match('/index.html');
  }
  
  if (request.destination === 'image') {
    // Return a simple offline image placeholder
    return new Response(
      '<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200"><rect width="200" height="200" fill="#f0f0f0"/><text x="100" y="100" text-anchor="middle" fill="#666">Offline</text></svg>',
      { headers: { 'Content-Type': 'image/svg+xml' } }
    );
  }
  
  // For other requests, return a basic offline response
  return new Response(
    JSON.stringify({ error: 'Offline', message: 'This feature requires an internet connection' }),
    { 
      status: 503,
      statusText: 'Service Unavailable',
      headers: { 'Content-Type': 'application/json' }
    }
  );
}

// Background sync for when connection is restored
self.addEventListener('sync', (event) => {
  console.log('[SW] Background sync triggered:', event.tag);
  
  if (event.tag === 'background-sync') {
    event.waitUntil(
      // Perform any background tasks when connection is restored
      console.log('[SW] Performing background sync tasks')
    );
  }
});

// Push notifications (for future use)
self.addEventListener('push', (event) => {
  console.log('[SW] Push message received');
  
  if (event.data) {
    const data = event.data.json();
    const options = {
      body: data.body || 'New content available',
      icon: '/icon-192.png',
      badge: '/icon-192.png',
      tag: 'podtardstr-notification',
      renotify: true
    };
    
    event.waitUntil(
      self.registration.showNotification(data.title || 'Podtardstr', options)
    );
  }
});

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
  console.log('[SW] Notification clicked');
  
  event.notification.close();
  
  event.waitUntil(
    clients.openWindow('/')
  );
});

// Handle service worker messages
self.addEventListener('message', (event) => {
  console.log('[SW] Message received:', event.data);
  
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  if (event.data && event.data.type === 'CACHE_CLEAR') {
    event.waitUntil(
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => caches.delete(cacheName))
        );
      })
    );
  }
});