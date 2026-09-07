/* GOT app — service worker
 *
 * The version comes from the ?v= this file is registered with, which index.html
 * copies off the bundle's script tag. It names the cache, so a release drops the
 * old cache wholesale and nothing stale can survive it. Nothing to edit here.
 *
 * Design rule: this worker only ever touches same-origin GET requests. Supabase
 * calls, Google auth, everything cross-origin passes straight through and is
 * never cached — a cached API response would be worse than no cache at all.
 */
/* Registered as sw.js?v=<version> by index.html, which reads that version off
   the bundle's own script tag. So there is one version string in the whole
   project and this file never needs editing at release time. */
var VERSION = (function () {
  try { return new URL(self.location.href).searchParams.get("v") || "0"; }
  catch (e) { return "0"; }
})();

/* CacheStorage is shared across the whole origin, not per service-worker scope.
   So the beta copy at /beta/ and the live one at / would otherwise fight over
   the same cache name, and each would delete the other's on activate. The
   channel comes from this file's own path, so nothing needs configuring. */
var CHANNEL = self.location.pathname.indexOf("/beta/") === 0 ? "beta" : "live";
var PREFIX  = "got-" + CHANNEL + "-";
var CACHE   = PREFIX + "v" + VERSION;

/* The shell, cached on install so the very first offline open already works. */
var SHELL = [
  "./",
  "./index.html",
  "./manifest.webmanifest",
  "./icons/icon-192.png",
  "./icons/apple-touch-icon.png"
];

self.addEventListener("install", function (e) {
  e.waitUntil(
    caches.open(CACHE).then(function (c) {
      // addAll fails the whole install if any one file 404s; add them
      // individually so a missing icon can never block the worker.
      return Promise.all(SHELL.map(function (u) {
        return c.add(new Request(u, { cache: "reload" })).catch(function () {});
      }));
    })
  );
});

self.addEventListener("activate", function (e) {
  e.waitUntil(
    caches.keys().then(function (keys) {
      return Promise.all(keys.map(function (k) {
        // only ever tidy up our own channel's old caches
        if (k.indexOf(PREFIX) === 0 && k !== CACHE) return caches.delete(k);
      }));
    }).then(function () { return self.clients.claim(); })
  );
});

self.addEventListener("message", function (e) {
  if (e.data && e.data.type === "SKIP_WAITING") self.skipWaiting();
});

function fromNetwork(req, cache) {
  return fetch(req).then(function (res) {
    if (res && res.ok && res.type === "basic") cache.put(req, res.clone());
    return res;
  });
}

self.addEventListener("fetch", function (e) {
  var req = e.request;
  if (req.method !== "GET") return;

  var url;
  try { url = new URL(req.url); } catch (err) { return; }
  if (url.origin !== self.location.origin) return;   // Supabase, auth, CDNs: untouched

  /* Page loads: network first, so a new release is picked up the moment the
     phone is online. The cached shell is the offline fallback. */
  if (req.mode === "navigate") {
    e.respondWith(
      caches.open(CACHE).then(function (c) {
        return fromNetwork(req, c).catch(function () {
          return c.match("./index.html").then(function (r) { return r || c.match("./"); });
        });
      })
    );
    return;
  }

  /* version.json is how the app decides whether it is stale — always ask the
     network, and never let a cached copy answer that question. */
  if (url.pathname.indexOf("version.json") !== -1) {
    e.respondWith(fetch(req, { cache: "no-store" }).catch(function () {
      return caches.open(CACHE).then(function (c) { return c.match(req); });
    }));
    return;
  }

  /* The bundle carries ?v=<version>, so a given URL's contents never change.
     Cache first: instant on every open after the first. */
  if (url.pathname.indexOf("got-app.js") !== -1) {
    e.respondWith(
      caches.open(CACHE).then(function (c) {
        return c.match(req).then(function (hit) { return hit || fromNetwork(req, c); });
      })
    );
    return;
  }

  /* Icons, manifest, anything else of ours: serve what we have, refresh behind. */
  e.respondWith(
    caches.open(CACHE).then(function (c) {
      return c.match(req).then(function (hit) {
        var net = fromNetwork(req, c).catch(function () { return hit; });
        return hit || net;
      });
    })
  );
});
