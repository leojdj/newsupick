
/*
    Course:     INFO6134 (Capstone Project)
    Term:       F23
    Professor:  Murilo Trigo
    Author:     Leonardo Antezana
    Notes:      This application uses some of the code and patterns learned in different classes.
 */

const cacheName = 'cacheAssets-v1';

/**
 * On Install event
 * Triggered when the service worker is installed
 */
self.addEventListener('install', (event) => {

    // Speed up Activation of the Service Worker.
    self.skipWaiting();

    // Create the Cache.
    event.waitUntil(
        caches.open(cacheName)
            .then( (cache) => {                                
                cache.addAll([
                    '/',
                    '/index.html',
                    '/offline.html',
                    '/manifest.json',                        
                    '/js/scripts.js',                        
                ]);
            })
            .catch( (error) => {
                console.log('[CACHE]: Failed to open:', error);
            } )
    );
});  
    
/**
 * On Activate event
 * Triggered when the service worker is activated
 */
self.addEventListener('activate', (event) => {

    // Immediately get control over the open pages.
    event.waitUntil(clients.claim());

    // Remove the caches that are no longer necessary.
    event.waitUntil(
        caches.keys()
            .then( (cacheNames) => {
                cacheNames.forEach( (item) => {
                    if (item !== cacheName) {
                        caches.delete(item);
                    }
                });
            })
    );
});  
    
/**
 * On Fetch event
 * Triggered when the service worker retrieves an asset
 */
self.addEventListener('fetch', (event) => {

    // Cache Strategy: Stale While Revalidate. First ensuring it's a GET verb.
    if (event.request.method === 'GET') {
        event.respondWith(
            caches.open(cacheName)
                .then( (cache) => {
                    return cache.match(event.request)
                        .then( (cachedResponse) => {
                            const fetchedResponse = fetch(event.request)
                                .then( (networkResponse) => {
                                    cache.put(event.request, networkResponse.clone());
                                    return networkResponse;
                                })
                                .catch( () => {
                                    return cache.match('/offline.html');
                                });
                            return cachedResponse || fetchedResponse;
                        })
                })
        );
    }
});