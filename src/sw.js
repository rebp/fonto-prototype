// Call Install Event
self.addEventListener('install', e => {
    console.log('Service Worker: Installed');
});

// Call Activate Event
self.addEventListener('activate', e => {
    console.log('Service Worker: Activated');
});

// Call Fetch Event
self.addEventListener('fetch', e => {
    console.log('Service Worker: Fetching');
});