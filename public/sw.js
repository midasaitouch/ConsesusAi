const CACHE = 'cai-v1'
self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(['/', '/manifest.json']).catch(() => {})))
  self.skipWaiting()
})
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))))
  self.clients.claim()
})
self.addEventListener('fetch', e => {
  const url = new URL(e.request.url)
  if (url.pathname.startsWith('/api/')) { e.respondWith(fetch(e.request)); return }
  if (url.hostname.includes('googleapis') || url.hostname.includes('gstatic')) {
    e.respondWith(fetch(e.request).then(r => { caches.open(CACHE).then(c => c.put(e.request, r.clone())); return r }).catch(() => caches.match(e.request)))
    return
  }
  e.respondWith(
    caches.match(e.request).then(cached => cached || fetch(e.request).then(r => {
      if (r.status === 200 && e.request.method === 'GET') caches.open(CACHE).then(c => c.put(e.request, r.clone()))
      return r
    }).catch(() => caches.match('/')))
  )
})
