/* MH Academy service worker
   - app shell is cached so the page opens offline
   - HTML: network first (so updates show up), falls back to cache
   - everything else (CDN css/js/fonts/images): stale-while-revalidate
   Bump CACHE when you change index.html to force old caches out. */
var CACHE = 'mh-academy-v4';
var SHELL = ['./', './index.html', './manifest.json', './icons/icon-192.png', './icons/icon-512.png'];

self.addEventListener('install', function (e) {
  e.waitUntil(caches.open(CACHE).then(function (c) { return c.addAll(SHELL); }).then(function () { return self.skipWaiting(); }));
});

self.addEventListener('activate', function (e) {
  e.waitUntil(
    caches.keys().then(function (keys) {
      return Promise.all(keys.filter(function (k) { return k !== CACHE; }).map(function (k) { return caches.delete(k); }));
    }).then(function () { return self.clients.claim(); })
  );
});

self.addEventListener('fetch', function (e) {
  var req = e.request;
  if (req.method !== 'GET') return;
  var url = new URL(req.url);
  if (url.protocol !== 'http:' && url.protocol !== 'https:') return;
  // exam data: always network first so new results show immediately
  if (url.pathname.slice(-8) === '/data.js') {
    e.respondWith(fetch(req).catch(function () { return caches.match(req, { ignoreSearch: true }); }));
    return;
  }
  // never cache WhatsApp / calendar / payment style external navigations
  if (req.mode === 'navigate' || (req.headers.get('accept') || '').indexOf('text/html') > -1) {
    e.respondWith(
      fetch(req).then(function (res) {
        var copy = res.clone();
        caches.open(CACHE).then(function (c) { c.put(req, copy); });
        return res;
      }).catch(function () { return caches.match(req).then(function (r) { return r || caches.match('./index.html'); }); })
    );
    return;
  }
  e.respondWith(
    caches.match(req).then(function (cached) {
      var net = fetch(req).then(function (res) {
        if (res && (res.status === 200 || res.type === 'opaque')) {
          var copy = res.clone();
          caches.open(CACHE).then(function (c) { c.put(req, copy); });
        }
        return res;
      }).catch(function () { return cached; });
      return cached || net;
    })
  );
});
