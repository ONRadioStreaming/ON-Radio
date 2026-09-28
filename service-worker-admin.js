const CACHE_NAME = "on-radio-admin-v1";
const ADMIN_SHELL = [
  "./administrador.html",
  "./manifest-admin.json",
  "./icono-admin-192.png",
  "./icono-admin-512.png"
];

self.addEventListener("install", event => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ADMIN_SHELL)).catch(() => {})
  );
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(
        keys.filter(k => k.startsWith("on-radio-admin-") && k !== CACHE_NAME)
            .map(k => caches.delete(k))
      ))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", event => {
  if (event.request.method !== "GET") return;

  const url = new URL(event.request.url);

  // Nunca interceptar Worker/API: el administrador debe leer y guardar datos actuales.
  if (url.origin !== self.location.origin) return;

  // HTML: red primero, caché solo como respaldo.
  if (event.request.mode === "navigate") {
    event.respondWith(
      fetch(event.request, { cache: "no-store" })
        .then(response => {
          const copy = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put("./administrador.html", copy)).catch(() => {});
          return response;
        })
        .catch(() => caches.match("./administrador.html"))
    );
    return;
  }

  // Recursos locales: red primero.
  event.respondWith(
    fetch(event.request)
      .then(response => {
        if (response && response.ok) {
          const copy = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, copy)).catch(() => {});
        }
        return response;
      })
      .catch(() => caches.match(event.request))
  );
});