const CACHE_VERSION = 'v2';
const STATIC_CACHE = `rotaract-static-${CACHE_VERSION}`;
const IMAGE_CACHE = `rotaract-images-${CACHE_VERSION}`;
const NEWS_CACHE = `rotaract-news-${CACHE_VERSION}`;

// Core static assets to precache
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json'
];

// Install Event - Pre-cache core shell
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) => {
      console.log('[Service Worker] Pre-caching app shell');
      return cache.addAll(STATIC_ASSETS).catch((err) => {
        console.warn('[Service Worker] Static precache partial warning:', err);
      });
    }).then(() => self.skipWaiting())
  );
});

// Activate Event - Clean up obsolete caches
self.addEventListener('activate', (event) => {
  const allowedCaches = [STATIC_CACHE, IMAGE_CACHE, NEWS_CACHE];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (!allowedCaches.includes(cacheName)) {
            console.log('[Service Worker] Removing outdated cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Helper function to check if request is for an image
function isImageRequest(request) {
  const url = request.url.toLowerCase();
  return (
    request.destination === 'image' ||
    url.match(/\.(png|jpg|jpeg|svg|webp|gif|ico)(\?.*)?$/) ||
    url.includes('images.unsplash.com') ||
    url.includes('/uploads/')
  );
}

// Helper function to check if request is for News / Articles API
function isNewsRequest(request) {
  const url = request.url.toLowerCase();
  return url.includes('/api/get_news.php') || url.includes('/news');
}

// Fetch Event Handler with dedicated strategies for images & news
self.addEventListener('fetch', (event) => {
  // Only intercept GET requests
  if (event.request.method !== 'GET') return;

  const url = new URL(event.request.url);

  // Strategy 1: News & Articles API -> Network First, Fallback to Cache
  if (isNewsRequest(event.request)) {
    event.respondWith(
      fetch(event.request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const responseToCache = networkResponse.clone();
            caches.open(NEWS_CACHE).then((cache) => {
              cache.put(event.request, responseToCache);
            });
          }
          return networkResponse;
        })
        .catch(() => {
          console.log('[Service Worker] Network offline - Serving cached news articles');
          return caches.match(event.request);
        })
    );
    return;
  }

  // Strategy 2: Gallery & News Images -> Cache First with Network Revalidation (Stale-While-Revalidate)
  if (isImageRequest(event.request)) {
    event.respondWith(
      caches.open(IMAGE_CACHE).then(async (cache) => {
        const cachedResponse = await cache.match(event.request);
        
        const fetchPromise = fetch(event.request, { mode: 'cors' })
          .then((networkResponse) => {
            if (networkResponse && (networkResponse.status === 200 || networkResponse.type === 'opaque')) {
              cache.put(event.request, networkResponse.clone());
            }
            return networkResponse;
          })
          .catch((err) => {
            // Retry with default mode if CORS mode fails for cross-origin images (e.g., opaque responses)
            return fetch(event.request)
              .then((opaqueResponse) => {
                if (opaqueResponse) {
                  cache.put(event.request, opaqueResponse.clone());
                }
                return opaqueResponse;
              })
              .catch(() => {
                console.log('[Service Worker] Image fetch failed offline:', event.request.url);
                return cachedResponse;
              });
          });

        // Return cached image immediately if present, otherwise wait for network
        return cachedResponse || fetchPromise;
      })
    );
    return;
  }

  // Strategy 3: Standard Static Assets & Pages -> Stale While Revalidate
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      const fetchPromise = fetch(event.request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200 && event.request.url.startsWith('http')) {
            const responseToCache = networkResponse.clone();
            caches.open(STATIC_CACHE).then((cache) => {
              cache.put(event.request, responseToCache);
            });
          }
          return networkResponse;
        })
        .catch(() => cachedResponse);

      return cachedResponse || fetchPromise;
    })
  );
});

// ==========================================================================
// PUSH NOTIFICATIONS & SERVICE WORKER MESSAGING SYSTEM
// ==========================================================================

self.addEventListener('push', (event) => {
  let notificationData = {
    title: 'Rotaract Club Ngozi Kugasaka 📢',
    body: 'Une nouvelle actualité ou un événement vient d\'être publié !',
    url: '/#actualites',
    icon: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&q=80&w=200'
  };

  try {
    if (event.data) {
      notificationData = { ...notificationData, ...event.data.json() };
    }
  } catch (e) {
    if (event.data) {
      notificationData.body = event.data.text();
    }
  }

  const options = {
    body: notificationData.body,
    icon: notificationData.icon,
    badge: notificationData.icon,
    vibrate: [200, 100, 200],
    data: { url: notificationData.url || '/' },
    tag: 'rotaract-news-alert',
    renotify: true,
    actions: [
      { action: 'open', title: '📖 Consulter' },
      { action: 'close', title: 'Ignorer' }
    ]
  };

  event.waitUntil(
    self.registration.showNotification(notificationData.title, options)
  );
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  if (event.action === 'close') return;

  const targetUrl = event.notification.data?.url || '/';

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((windowClients) => {
      for (const client of windowClients) {
        if (client.url.includes(targetUrl) && 'focus' in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow(targetUrl);
      }
    })
  );
});

// Listener for client postMessages to trigger test push notifications locally
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SHOW_NOTIFICATION') {
    const { title, body, url } = event.data;
    self.registration.showNotification(title || 'Rotaract Club Ngozi', {
      body: body || 'Nouvelle notification du club !',
      icon: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&q=80&w=200',
      vibrate: [100, 50, 100],
      data: { url: url || '/' },
      actions: [
        { action: 'open', title: '📖 Ouvrir' }
      ]
    });
  }
});

