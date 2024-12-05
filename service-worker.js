const CACHE_NAME = "passpixx-cache-v1";
const urlsToCache = [
  "/",
  "/index.html",
  "/manifest.json",
  "./images/logo192.png",
  "./images/logo512.png",
  "./images/passpix.png",
];

self.addEventListener("install", (event) => {
  console.log("Service Worker: Installing...");
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("Service Worker: Caching files...");
      return cache.addAll(urlsToCache).catch((error) => {
        console.error("Service Worker: Failed to cache some files", error);
      });
    })
  );
});

self.addEventListener("fetch", (event) => {
  console.log("Service Worker: Fetching", event.request.url);
  if (event.request.url.includes("/api/")) {
    event.respondWith(
      fetch(event.request)
        .then((response) => response)
        .catch(() => caches.match(event.request))
    );
  } else {
    event.respondWith(
      caches
        .match(event.request)
        .then((response) => response || fetch(event.request))
        .catch((error) => {
          console.error("Service Worker: Fetch error", error);
        })
    );
  }
});

self.addEventListener("activate", (event) => {
  console.log("Service Worker: Activating...");
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) =>
      Promise.all(
        cacheNames.map((cacheName) => {
          if (!cacheWhitelist.includes(cacheName)) {
            console.log("Service Worker: Deleting old cache:", cacheName);
            return caches.delete(cacheName);
          }
        })
      )
    )
  );
});
