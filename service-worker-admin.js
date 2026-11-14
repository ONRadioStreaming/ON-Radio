const CACHE_NAME = "on-radio-admin-v3";
const ADMIN_SHELL = ["./admin.html", "./manifest-admin.json", "./icono-admin-192.png", "./icono-admin-512.png"];
self.addEventListener("install", event => {
  self.skipWaiting();
  event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(ADMIN_SHELL)).catch(() => {}));
});
self.addEventListener("activate", event => {
  event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k.startsWith("on-radio-admin-") && k !== CACHE_NAME).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener("fetch", event => {
  if (event.request.method !== "GET") return;
  const url = new URL(event.request.url);
  if (url.origin !== self.location.origin) return;
  if (event.request.mode === "navigate") {
    event.respondWith(fetch(event.request, {cache:"no-store"}).then(response => {
      if (response.ok) caches.open(CACHE_NAME).then(cache => cache.put("./admin.html",response.clone())).catch(()=>{});
      return response;
    }).catch(() => caches.match("./admin.html")));
    return;
  }
  event.respondWith(fetch(event.request).then(response => {
    if (response && response.ok) caches.open(CACHE_NAME).then(cache => cache.put(event.request,response.clone())).catch(()=>{});
    return response;
  }).catch(() => caches.match(event.request)));
});
