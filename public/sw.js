/**
 * Service Worker for Vibe Audio PWA
 * Handles caching, background sync, and audio continuity
 */

const CACHE_NAME = "vibe-audio-v1";
const STATIC_CACHE = "vibe-audio-static-v1";
const DYNAMIC_CACHE = "vibe-audio-dynamic-v1";

// Static assets to cache on install
const STATIC_ASSETS = ["/", "/index.html", "/manifest.json", "/vite.svg"];

// Install event - cache static assets
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(STATIC_CACHE)
      .then((cache) => {
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => {
        // Activate immediately
        return self.skipWaiting();
      }),
  );
});

// Activate event - clean up old caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames
            .filter((name) => name !== STATIC_CACHE && name !== DYNAMIC_CACHE)
            .map((name) => caches.delete(name)),
        );
      })
      .then(() => {
        // Take control of all clients immediately
        return self.clients.claim();
      }),
  );
});

// Fetch event - network first, fallback to cache
self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== "GET") return;

  // Handle YouTube/Google Video requests - don't cache, just pass through
  if (
    url.hostname.includes("youtube.com") ||
    url.hostname.includes("googlevideo.com") ||
    url.hostname.includes("ytimg.com")
  ) {
    event.respondWith(
      fetch(request).catch(() => {
        return new Response("Audio temporarily unavailable", {
          status: 503,
          statusText: "Service Unavailable",
        });
      }),
    );
    return;
  }

  // Handle API requests - network only
  if (url.hostname.includes("googleapis.com")) {
    event.respondWith(fetch(request));
    return;
  }

  // Handle static assets - cache first
  if (
    request.destination === "image" ||
    request.destination === "font" ||
    request.destination === "style" ||
    request.destination === "script"
  ) {
    event.respondWith(
      caches.match(request).then((cachedResponse) => {
        if (cachedResponse) {
          return cachedResponse;
        }
        return fetch(request).then((networkResponse) => {
          // Cache the new response (supported schemes only)
          if (
            networkResponse.ok &&
            (url.protocol === "http:" || url.protocol === "https:")
          ) {
            const responseClone = networkResponse.clone();
            caches.open(DYNAMIC_CACHE).then((cache) => {
              cache.put(request, responseClone);
            });
          }
          return networkResponse;
        });
      }),
    );
    return;
  }

  // Handle navigation requests - network first, fallback to cache
  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request).catch(() => {
        return caches.match("/index.html");
      }),
    );
    return;
  }

  // Default - network first with cache fallback
  event.respondWith(
    fetch(request)
      .then((networkResponse) => {
        // Cache successful responses from supported schemes (http/https)
        if (
          networkResponse.ok &&
          (url.protocol === "http:" || url.protocol === "https:")
        ) {
          const responseClone = networkResponse.clone();
          caches.open(DYNAMIC_CACHE).then((cache) => {
            cache.put(request, responseClone);
          });
        }
        return networkResponse;
      })
      .catch(() => {
        return caches.match(request);
      }),
  );
});

// Handle messages from main app
self.addEventListener("message", (event) => {
  if (!event.data) return;

  switch (event.data.type) {
    case "SKIP_WAITING":
      self.skipWaiting();
      break;

    case "CACHE_AUDIO_METADATA":
      // Cache audio metadata for offline access
      handleCacheAudioMetadata(event.data.payload);
      break;

    case "SYNC_PLAYBACK_POSITION":
      // Sync playback position (for future offline support)
      handleSyncPlaybackPosition(event.data.payload);
      break;

    case "CLEAR_CACHE":
      // Clear all caches
      handleClearCache();
      break;
  }
});

// Cache audio metadata
async function handleCacheAudioMetadata(metadata) {
  try {
    const cache = await caches.open(DYNAMIC_CACHE);
    const metadataResponse = new Response(JSON.stringify(metadata), {
      headers: { "Content-Type": "application/json" },
    });
    await cache.put(`/metadata/${metadata.videoId}`, metadataResponse);
  } catch (error) {
    // Cache failed
  }
}

// Sync playback position (for future background sync)
async function handleSyncPlaybackPosition(data) {
  // Store position data for sync when online
  try {
    const cache = await caches.open(DYNAMIC_CACHE);
    const positionResponse = new Response(JSON.stringify(data), {
      headers: { "Content-Type": "application/json" },
    });
    await cache.put("/sync/playback-position", positionResponse);
  } catch (error) {
    // Sync failed
  }
}

// Clear all caches
async function handleClearCache() {
  const cacheNames = await caches.keys();
  await Promise.all(cacheNames.map((name) => caches.delete(name)));
}

// Background sync event (when supported)
self.addEventListener("sync", (event) => {
  if (event.tag === "sync-playback-position") {
    event.waitUntil(syncPlaybackPosition());
  }
});

// Sync playback position when back online
async function syncPlaybackPosition() {
  try {
    const cache = await caches.open(DYNAMIC_CACHE);
    const response = await cache.match("/sync/playback-position");
    if (response) {
      const data = await response.json();
      // Send to server or IndexedDB
      // For now, just clear the sync data
      await cache.delete("/sync/playback-position");
    }
  } catch (error) {
    // Sync failed
  }
}

// Push notification event (for future use)
self.addEventListener("push", (event) => {
  if (!event.data) return;

  const data = event.data.json();

  const options = {
    body: data.body || "Có cập nhật mới",
    icon: "/icons/icon-192x192.png",
    badge: "/icons/badge-72x72.png",
    vibrate: [100, 50, 100],
    data: {
      url: data.url || "/",
    },
    actions: [
      { action: "open", title: "Mở app" },
      { action: "close", title: "Đóng" },
    ],
  };

  event.waitUntil(
    self.registration.showNotification(data.title || "Vibe Audio", options),
  );
});

// Notification click event
self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  if (event.action === "close") return;

  const urlToOpen = event.notification.data?.url || "/";

  event.waitUntil(
    clients
      .matchAll({ type: "window", includeUncontrolled: true })
      .then((clientList) => {
        // Focus existing window if available
        for (const client of clientList) {
          if (client.url === urlToOpen && "focus" in client) {
            return client.focus();
          }
        }
        // Open new window
        if (clients.openWindow) {
          return clients.openWindow(urlToOpen);
        }
      }),
  );
});
