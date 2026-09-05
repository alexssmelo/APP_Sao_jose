importScripts('https://www.gstatic.com/firebasejs/10.13.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.13.0/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyCbXMS0IP10YQ1wEfwQZAqiZXzks4qSjOw",
  authDomain: "guarda-sao-jose.firebaseapp.com",
  databaseURL: "https://guarda-sao-jose-default-rtdb.firebaseio.com",
  projectId: "guarda-sao-jose",
  storageBucket: "guarda-sao-jose.firebasestorage.app",
  messagingSenderId: "630417916017",
  appId: "1:630417916017:web:723ec1de0fed709a9b1bd0"
});
const messaging = firebase.messaging();
messaging.onBackgroundMessage((payload) => {
  const n = payload.notification || {};
  self.registration.showNotification(n.title || 'Guarda de São José', {
    body: n.body || '',
    icon: 'icon-192.png'
  });
});

const CACHE_NAME = 'guarda-sj-v1';
const SHELL = ['./index.html', './manifest.json', './icon-192.png', './icon-512.png', './logo.png'];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(SHELL))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  // Não intercepta chamadas de rede em tempo real (fontes, storage, etc.)
  if (req.method !== 'GET') return;
  event.respondWith(
    caches.match(req).then((cached) => cached || fetch(req).catch(() => cached))
  );
});
