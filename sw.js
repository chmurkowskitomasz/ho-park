/* Ho-Park app — offline cache (app shell) */
var CACHE = 'hp-app-1.1.0';
var SHELL = ['./', 'index.html', 'app.css?v=1.1.0', 'app.js?v=1.1.0', 'qr.js?v=1.1.0', 'cities.js?v=1.1.0', 'manifest.webmanifest',
  'icons/apple-touch-icon.png', 'icons/icon-192.png', 'icons/icon-512.png'];
self.addEventListener('install', function (e) {
  e.waitUntil(caches.open(CACHE).then(function (c) { return c.addAll(SHELL); }).then(function () { return self.skipWaiting(); }));
});
self.addEventListener('activate', function (e) {
  e.waitUntil(caches.keys().then(function (ks) {
    return Promise.all(ks.filter(function (k) { return k !== CACHE; }).map(function (k) { return caches.delete(k); }));
  }).then(function () { return self.clients.claim(); }));
});
self.addEventListener('fetch', function (e) {
  var req = e.request;
  if (req.method !== 'GET' || new URL(req.url).origin !== location.origin) return;
  if (req.mode === 'navigate') {
    e.respondWith(fetch(req).then(function (r) { var c = r.clone(); caches.open(CACHE).then(function (k) { k.put('index.html', c); }); return r; })
      .catch(function () { return caches.match('index.html'); }));
    return;
  }
  e.respondWith(caches.match(req).then(function (hit) {
    return hit || fetch(req).then(function (r) { if (r.ok) { var c = r.clone(); caches.open(CACHE).then(function (k) { k.put(req, c); }); } return r; });
  }));
});
