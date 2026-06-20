// Service worker mínimo: guarda los archivos para que la app funcione sin
// internet una vez abierta la primera vez. Sube la versión al cambiar archivos.
const CACHE = "daniela-hablar-v9";

// Archivos básicos de la app (el "esqueleto"). Si alguno fallara, no rompe la
// instalación: cada uno se cachea por separado.
const NUCLEO = [
  "./",
  "index.html",
  "juego.html",
  "dictapicto.html",
  "manifest.json",
  "css/estilos.css",
  "js/app.js",
  "js/datos.js",
  "js/dictapicto.js",
  "js/reconocimiento.js",
  "img/icono-192.png",
  "img/icono-512.png",
  "fonts/nunito-400.woff2",
  "fonts/nunito-600.woff2",
  "fonts/nunito-700.woff2",
  "fonts/nunito-900.woff2",
];

self.addEventListener("install", (e) => {
  e.waitUntil(
    caches.open(CACHE).then((c) =>
      Promise.allSettled(NUCLEO.map((url) => c.add(url)))
    )
  );
  self.skipWaiting();
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then((claves) =>
      Promise.all(claves.filter((c) => c !== CACHE).map((c) => caches.delete(c)))
    )
  );
  self.clients.claim();
});

// Estrategia "network first, fallback a caché": siempre intenta lo último y,
// si no hay red, usa lo guardado.
self.addEventListener("fetch", (e) => {
  if (e.request.method !== "GET") return;
  e.respondWith(
    fetch(e.request)
      .then((res) => {
        const copia = res.clone();
        caches.open(CACHE).then((c) => c.put(e.request, copia));
        return res;
      })
      .catch(() => caches.match(e.request))
  );
});
