const CACHE = "mw-v2";

// Cache video files (and slide pages) on first install
const PRECACHE = [
  "Ad.mp4",
  "pony.mp4",
  "11.html",
  "36.html",
];

self.addEventListener("install", (e) => {
  e.waitUntil(
    caches.open(CACHE).then((cache) => cache.addAll(PRECACHE))
  );
  self.skipWaiting();
});

self.addEventListener("activate", (e) => {
  // Remove old caches
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// Cache-first for video files, network-first for everything else
self.addEventListener("fetch", (e) => {
  const url = new URL(e.request.url);
  const isVideo = /\.(mov|mp4|webm|MOV|MP4)$/i.test(url.pathname);

  if (isVideo) {
    e.respondWith(
      caches.open(CACHE).then((cache) =>
        cache.match(e.request).then((hit) => {
          if (hit) return hit;
          return fetch(e.request).then((res) => {
            cache.put(e.request, res.clone());
            return res;
          });
        })
      )
    );
  }
});
