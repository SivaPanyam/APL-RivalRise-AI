// This file needs to be served from the root of the domain (e.g. public folder)
// It is required to receive background push notifications in the browser.

importScripts('https://www.gstatic.com/firebasejs/10.8.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.8.1/firebase-messaging-compat.js');

// This would typically be initialized with actual config in a production app.
// Since we are mocking the dispatch for this prototype, we just need the file to exist 
// to satisfy browser service worker registration if tested.

console.log('[Firebase Messaging SW] Loaded');

// self.addEventListener('push', function(event) {
//   const payload = event.data.json();
//   const notificationTitle = payload.notification.title;
//   const notificationOptions = {
//     body: payload.notification.body,
//     icon: '/favicon.ico'
//   };
//   event.waitUntil(self.registration.showNotification(notificationTitle, notificationOptions));
// });
