// sw.js
const CACHE_NAME = 'dorm-app-cache-v1';
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/styles.css',          // 必要に応じてファイル名を追加
  '/app.js',
  '/icons/icon-192.png',
  '/icons/icon-512.png',
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(ASSETS_TO_CACHE))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.filter(key => key !== CACHE_NAME)
            .map(key => caches.delete(key))
      )
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(cachedResp => {
        if (cachedResp) return cachedResp;
        return fetch(event.request).then(networkResp => {
          return caches.open(CACHE_NAME).then(cache => {
            cache.put(event.request, networkResp.clone());
            return networkResp;
          });
        });
      })
  );
});