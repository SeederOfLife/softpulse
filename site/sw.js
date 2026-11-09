// Soft Pulse offline copy. Built by tools/build_site.sh: the version changes whenever the app changes.
const CACHE = "softpulse-4447119a5ae6";
const FILES = ["./", "manifest.webmanifest", "icon-192.png", "icon-512.png", "apple-touch-icon.png", "fonts/big-shoulders-display-latin-600-normal.woff2", "fonts/big-shoulders-display-latin-800-normal.woff2", "fonts/figtree-latin-400-normal.woff2", "fonts/figtree-latin-500-normal.woff2", "fonts/figtree-latin-600-normal.woff2", "fonts/figtree-latin-700-normal.woff2", "fonts/jetbrains-mono-latin-500-normal.woff2"];
self.addEventListener("install", e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES.map(f => new Request(f, { cache: "reload" })))).then(() => self.skipWaiting()));
});
self.addEventListener("activate", e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k.startsWith("softpulse-") && k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
// wait at most `ms` for the network, then fall back to the saved copy
function timeout(p, ms) { return new Promise((ok, no) => { const t = setTimeout(() => no(new Error("slow")), ms); p.then(r => { clearTimeout(t); ok(r); }, x => { clearTimeout(t); no(x); }); }); }
self.addEventListener("fetch", e => {
  const req = e.request, url = new URL(req.url);
  if (req.method !== "GET" || url.origin !== location.origin || url.pathname.endsWith(".apk")) return; // log sync, downloads: untouched
  if (req.mode === "navigate" || url.pathname === "/" || url.pathname.endsWith("/index.html") || url.pathname === "/index") {
    // the app page: newest from the internet when there is one, otherwise the saved copy
    e.respondWith(timeout(fetch(req), 4000).then(r => {
      const isApp = url.pathname === "/" || url.pathname.endsWith("/index.html") || url.pathname === "/index";
      if (isApp && r && r.ok && !r.redirected) { const cp = r.clone(); caches.open(CACHE).then(c => c.put("./", cp)); }
      return r;
    }).catch(() => caches.match("./", { cacheName: CACHE }).then(r => r || caches.match("./"))));
    return;
  }
  // fonts, icons: saved copy first, refreshed in the background
  e.respondWith(caches.match(req, { ignoreSearch: true }).then(hit => {
    const net = fetch(req).then(r => { if (r && r.ok) { const cp = r.clone(); caches.open(CACHE).then(c => c.put(req, cp)); } return r; });
    return hit || net;
  }));
});
