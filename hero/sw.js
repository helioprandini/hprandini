/* HeRo — service worker.
 * Motivo de existir: vocês vão usar isto em Doha e na Índia, provavelmente
 * sem dados. Depois da primeira visita, o app inteiro funciona sem internet.
 */
var CACHE = 'hero-v7';
var ARQUIVOS = [
  './', './index.html', './css/hero.css', './icon.svg', './manifest.webmanifest',
  './js/arte.js', './js/data-destinos.js', './js/data-india.js',
  './js/data-doha.js', './js/data-doha-curadoria.js', './js/data-doha-beber.js',
  './js/hero.js'
];

self.addEventListener('install', function (e) {
  e.waitUntil(
    caches.open(CACHE).then(function (c) { return c.addAll(ARQUIVOS); })
      .then(function () { return self.skipWaiting(); })
  );
});

self.addEventListener('activate', function (e) {
  e.waitUntil(
    caches.keys().then(function (ks) {
      return Promise.all(ks.map(function (k) { return k === CACHE ? null : caches.delete(k); }));
    }).then(function () { return self.clients.claim(); })
  );
});

self.addEventListener('fetch', function (e) {
  var r = e.request;
  if (r.method !== 'GET') return;
  var u = new URL(r.url);
  if (u.origin !== self.location.origin) return;   /* mapas e sites oficiais passam direto */
  e.respondWith(
    caches.match(r).then(function (hit) {
      if (hit) {
        /* revalida em segundo plano, mas entrega o cache na hora */
        fetch(r).then(function (res) {
          if (res && res.ok) caches.open(CACHE).then(function (c) { c.put(r, res.clone()); });
        }).catch(function () {});
        return hit;
      }
      return fetch(r).then(function (res) {
        if (res && res.ok) { var cp = res.clone(); caches.open(CACHE).then(function (c) { c.put(r, cp); }); }
        return res;
      }).catch(function () { return caches.match('./index.html'); });
    })
  );
});
