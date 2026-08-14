const CACHE_VERSION = "v2";
const CACHE_NAME = `sismos-colombia-${CACHE_VERSION}`;

// Rutas que deben funcionar sin conexión: guía de qué hacer, números de
// emergencia y la página de respaldo. Estas NO dependen del SGC.
const PRECACHE_URLS = ["/guia", "/emergencia", "/offline"];

self.addEventListener("install", (event) => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(CACHE_NAME);
      await Promise.all(
        PRECACHE_URLS.map((url) =>
          cache.add(url).catch(() => {
            // Si una ruta falla al precachear no debe romper la instalación.
          }),
        ),
      );
      await self.skipWaiting();
    })(),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME)
          .map((key) => caches.delete(key)),
      );
      await self.clients.claim();
    })(),
  );
});

function isStaticAsset(url) {
  return url.pathname.startsWith("/_next/static/");
}

self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  if (request.method !== "GET" || url.origin !== self.location.origin) {
    return;
  }

  // Assets estáticos con nombre de archivo hasheado: cache-first, ya que
  // el contenido nunca cambia para una misma URL.
  if (isStaticAsset(url)) {
    event.respondWith(
      (async () => {
        const cached = await caches.match(request);
        if (cached) return cached;
        const response = await fetch(request);
        const cache = await caches.open(CACHE_NAME);
        cache.put(request, response.clone());
        return response;
      })(),
    );
    return;
  }

  // Navegación y datos dinámicos: red primero (los sismos deben estar
  // frescos), con caché como respaldo cuando no hay conexión.
  event.respondWith(
    (async () => {
      const cache = await caches.open(CACHE_NAME);
      try {
        const response = await fetch(request);
        if (response.ok) cache.put(request, response.clone());
        return response;
      } catch {
        const cached = await cache.match(request);
        if (cached) return cached;
        if (request.mode === "navigate") {
          const offline = await cache.match("/offline");
          if (offline) return offline;
        }
        throw new Error("offline-sin-cache");
      }
    })(),
  );
});
