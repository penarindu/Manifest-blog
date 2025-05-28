self.addEventListener('install', function(event) {
  console.log('[SW] Installed');
});

self.addEventListener('fetch', function(event) {
  event.respondWith(fetch(event.request));
});
