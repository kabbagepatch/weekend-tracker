const CACHE_NAME = 'weekend-tasks-v1';
const urlsToCache = ['/', '/index.html', '/icon.png'];

const version = '1.2.4';

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(urlsToCache);
    })
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});

self.addEventListener("push", (event) => {
  const data = event.data.json();
  console.log('Push received:', data);
  if (!data.completed) return;

  event.waitUntil(
    self.registration.showNotification(
      "Task Completed!",
      {
        body: data.title,
        icon: "icon.png",
      }
    )
  );
});
