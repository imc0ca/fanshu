// Migration worker: replace legacy Workbox precache worker, then retire.
self.addEventListener("install", event => {
  event.waitUntil(self.skipWaiting());
});
self.addEventListener("activate", event => {
  event.waitUntil((async () => {
    const names = await caches.keys();
    await Promise.all(names.map(name => caches.delete(name)));
    await self.clients.claim();
    await self.registration.unregister();
    const clients = await self.clients.matchAll({ type: "window", includeUncontrolled: true });
    for (const client of clients) {
      if (new URL(client.url).pathname.startsWith("/fanshu/")) {
        client.postMessage({ type: "FANSHU_CACHE_MIGRATED" });
      }
    }
  })());
});
self.addEventListener("fetch", event => {
  if (event.request.mode === "navigate") {
    event.respondWith(fetch(new Request(event.request, { cache: "reload" })));
  }
});
