
const cacheName = 'version-1:cache';
const cacheAssets = [ 
      'index.html',
      'about.html',
      'service.html',
      '404.html',
      'offline.html',
      'assets/style.css',
      'script.js',
  ];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(cacheName).then((cache) => {
      return cache.addAll(cacheAssets);
    })
  );  
});


self.addEventListener('activate', function(event) {
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.filter(function(cacheName) {
          // Return true if you want to remove this cache,
          // but remember that caches are shared across
          // the whole origin
        }).map(function(cacheName) {
          return caches.delete(cacheName);
        })
      );
    })
  );
});


self.addEventListener('fetch', function(event) {
  event.respondWith(
    // Try the cache
    caches.match(event.request).then(function(response) {
      if (response) {
        return response;
      }
      return fetch(event.request).then(function(response) {
        if (response.status === 404) {
          console.log('Page Not found');
          return caches.match('404.html');
        }
        return response
      });
    }).catch(function() {
      // If both fail, show a generic fallback:
      console.log('You are offline');
      return caches.match('offline.html');
    })
  );
});