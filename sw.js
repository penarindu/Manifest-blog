self.addEventListener('install', function(event) {
  console.log('[SW] Installed');
});

self.addEventListener('fetch', function(event) {
  event.respondWith(fetch(event.request));
});

const CACHE_NAME = 'pwa-blog-v2';
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  '/favicon.ico',
  'https://raw.githubusercontent.com/penarindu/Manifest-blog/main/IMG-20250512-WA0002.png', // Icon yang kamu pakai
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png',
];

// Install Service Worker & simpan file dalam cache
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(urlsToCache);
    })
  );
  self.skipWaiting();
});

// Aktifkan SW dan hapus cache lama jika ada
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.filter(name => name !== CACHE_NAME)
                  .map(name => caches.delete(name))
      );
    })
  );
  self.clients.claim();
});

// Intersep permintaan dan respon dari cache bila offline
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    }).catch(() => {
      // Jika fetch gagal (misal offline), bisa ditambahkan fallback di sini
      return caches.match('/index.html');
    })
  );
});

// Tambahkan file offline.html ke cache
const urlsToCache = [
  '/Manifest-blog/',
  '/Manifest-blog/index.html',
  '/Manifest-blog/manifest.json',
  '/Manifest-blog/favicon.ico',
  '/Manifest-blog/icons/icon-192x192.png',
  '/Manifest-blog/icons/icon-512x512.png',
  '/Manifest-blog/offline.html',
  'https://raw.githubusercontent.com/penarindu/Manifest-blog/main/IMG-20250512-WA0002.png'
];

// ...
// Ubah bagian fetch:
self.addEventListener('fetch', event => {
  event.respondWith(
    fetch(event.request).catch(() => {
      return caches.match(event.request).then(response => {
        return response || caches.match('/Manifest-blog/offline.html');
      });
    })
  );
});
