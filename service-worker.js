const CACHE_NAME = 'weekend-tasks-v1';
const urlsToCache = ['/', '/index.html', '/icon.png'];

const version = '1.2.11';

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

self.addEventListener('push', (event) => {
  const data = event.data.json();
  if (data.status !== 'complete' && !data.reset) return;

  event.waitUntil(
    self.registration.showNotification(
      data.reset ? 'Tasks Reset!' : 'Task Completed!',
      {
        body: data.reset ? 'Time to get to work' : data.title,
        icon: 'icon.png',
        vibrate: [200, 100, 200],
      }
    )
  );
});

self.addEventListener('pushsubscriptionchange ', (event) => {
  console.log('Push Subscription change event detected:', event);
  event.waitUntil(
    fetch('https://tracker-services-472591136365.us-central1.run.app/weekend-tasks/subscribe', {
      method: 'POST',
      body: JSON.stringify(event.newSubscription),
      headers: {
        'Content-Type': 'application/json'
      }
    })
  );
});

self.addEventListener('notificationclick', event => {
  const rootUrl = new URL('/', location).href;
  event.notification.close();
  event.waitUntil(
    clients.matchAll().then(matchedClients => {
      for (let client of matchedClients) {
        if (client.url === rootUrl) {
          return client.focus();
        }
      }
      return clients.openWindow('/');
    })
  );
});
