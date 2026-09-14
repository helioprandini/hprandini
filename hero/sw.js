/* HeRo — service worker.
 *
 * ESTRATEGIA: rede primeiro, cache como rede de segurança.
 *
 * A versão anterior era "cache primeiro" e causou um problema real: quem
 * tinha o app instalado continuava vendo a versão antiga mesmo online, e
 * abas novas simplesmente não apareciam. Agora, com internet, você sempre
 * recebe a versão mais recente; sem internet, recebe a última que funcionou.
 * O custo é alguns kilobytes por abertura — barato perto de ver conteúdo velho.
 */
var CACHE = 'hero-v16';
var ARQUIVOS = [
  './', './index.html', './css/hero.css', './icon.svg', './manifest.webmanifest',
  './js/arte.js', './js/data-destinos.js', './js/data-india.js', './js/data-ny.js',
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

self.addEventListener('message', function (e) {
  if (e.data === 'limpar') {
    caches.keys().then(function (ks) { return Promise.all(ks.map(function (k) { return caches.delete(k); })); });
  }
});

self.addEventListener('fetch', function (e) {
  var r = e.request;
  if (r.method !== 'GET') return;
  var u = new URL(r.url);
  /* as fontes do Google entram no cache: sem isso, offline a tipografia cai
     para a fonte do sistema e o app muda de cara justamente na viagem */
  var fonte = (u.host === 'fonts.googleapis.com' || u.host === 'fonts.gstatic.com');
  if (u.origin !== self.location.origin && !fonte) return;   /* mapas e sites oficiais passam direto */
  if (fonte) {
    e.respondWith(caches.match(r).then(function (hit) {
      return hit || fetch(r).then(function (res) {
        if (res && (res.ok || res.type === 'opaque')) {
          var c2 = res.clone(); caches.open(CACHE).then(function (c) { c.put(r, c2); });
        }
        return res;
      }).catch(function () { return hit; });
    }));
    return;
  }

  /* cache: 'no-store' é o detalhe que faz a diferença: sem ele, o fetch do
     service worker ainda é atendido pelo cache HTTP do navegador, e conteúdo
     novo demora a aparecer mesmo com a estratégia de rede primeiro. */
  var pedido = new Request(r.url, {
    cache: 'no-store',
    credentials: 'same-origin',
    headers: r.headers,
    mode: r.mode === 'navigate' ? 'same-origin' : r.mode,
    redirect: 'follow'
  });

  e.respondWith(
    fetch(pedido).then(function (res) {
      if (res && res.ok) {
        var cp = res.clone();
        caches.open(CACHE).then(function (c) { c.put(r, cp); });
      }
      return res;
    }).catch(function () {
      return caches.match(r).then(function (hit) {
        return hit || caches.match('./index.html');
      });
    })
  );
});
