const _this = this;
const version = "20260611-101028"; // Increment this on every deploy
const host = _this.location.origin;
const CACHE_NAME = `blogz-v${version}`;
const urlsToCache = ["/", "/settings", "/index.html"];

// Install service worker
const onInstall = (event) => {
  console.log(`ServiceWorker:>>> (v${version}) Installing:>>>`);
  // Force the waiting service worker to become the active service worker
  self.skipWaiting();

  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => cache.addAll(urlsToCache))
      .catch((error) =>
        console.error("ServiceWorker:>>> Install Error:>>>", error),
      ),
  );
};

// Handle messages from clients
self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
});

// Listen for requests
const onFetch = (event) => {
  const { url, method } = event.request;

  // Only handle GET requests for same-origin requests
  if (method !== "GET" || !url.includes(host)) {
    return;
  }

  // Network-first strategy with cache fallback BUT with special handling for navigation
  if (event.request.mode === "navigate") {
    // For navigation requests (page loads), ALWAYS try network first
    // and only fall back to cache if truly offline
    event.respondWith(
      fetch(event.request)
        .then((networkResponse) => {
          // Clone and cache the response
          const cacheCopy = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, cacheCopy);
          });
          return networkResponse;
        })
        .catch(() => {
          // Only use cache if network completely failed (offline)
          return caches.match(event.request).then((cachedResponse) => {
            if (cachedResponse) {
              return cachedResponse;
            }
            // If no cache, return a basic offline page response
            return new Response(
              "<h1>Offline</h1><p>Please check your internet connection.</p>",
              {
                headers: { "Content-Type": "text/html" },
              },
            );
          });
        }),
    );
  } else {
    // For assets (JS, CSS, images), use network-first with cache fallback
    event.respondWith(
      fetch(event.request)
        .then((networkResponse) => {
          const cacheCopy = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, cacheCopy);
          });
          return networkResponse;
        })
        .catch(() => {
          return caches.match(event.request);
        }),
    );
  }
};

// Activate service worker
const onActivate = (event) => {
  console.log(`ServiceWorker:>>> (v${version}) Activating:>>>`);
  event.waitUntil(
    handleActivation().then(() => {
      // Take control of all pages immediately
      return self.clients.claim();
    }),
  );
};

const handleActivation = async () => {
  await clearCaches();
};

const clearCaches = async () => {
  const newCache = [CACHE_NAME];
  const cacheNames = await caches.keys();
  const oldCacheNames = cacheNames.filter((cache) => !newCache.includes(cache));

  console.log(`ServiceWorker:>>> Deleting old caches:`, oldCacheNames);

  // Delete Old Cache (if any)
  await Promise.all(
    oldCacheNames.map((cacheName) => {
      console.log(`ServiceWorker:>>> Deleted cache: ${cacheName}`);
      return caches.delete(cacheName);
    }),
  );
};

_this.addEventListener("install", onInstall);
_this.addEventListener("activate", onActivate);
_this.addEventListener("fetch", onFetch);
