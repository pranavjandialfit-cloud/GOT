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
  "./icons/apple-touch-icon.png",
  /* The bundle is ~1 MB. Without this it is only cached on the first request,
     which is the first launch from the home screen - 2 s on fast 4G, 5 s on
     slow 4G, with nothing but the OS launch screen on top of it. Caching it
     during the browser visit means the first launch is already warm. */
  "./got-app.js?v=" + VERSION,
  /* The logo lives on our own origin now, not a CDN. Root-relative so the same
     one file serves both / and /beta/. Cached here so offline keeps it. */
  "/img/smf-logo-dark.png"
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

/* How long a page load waits for the network before the cached shell is used
   instead. GitHub Pages answers in roughly 200 ms on wifi, so the network still
   wins the race on any healthy connection and a new release lands at once. On
   mobile data it loses, and the app paints out of the cache rather than showing
   the OS's empty white web view. */
var NET_WAIT = 600;

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

  /* Page loads. 8 Sep: this was network-FIRST with no time limit, so on mobile
     data nothing at all was painted until index.html came back over the network -
     2-3 s of WHITE on the installed app, on iPhone Air AND on 17 Pro, which has a
     matching launch image. iOS drops its launch image as soon as the web view
     exists, and an empty web view is white. The launch-image list was a real gap
     but it was never the thing PJ was looking at for those seconds.

     Now: the network still gets first refusal, but only NET_WAIT ms of it. Miss
     that and the cached shell is handed over and paints immediately - it carries
     its own dark #boot screen inline, so there is nothing white left to see. The
     network request is NOT cancelled; it keeps running and refreshes the cache,
     so the next launch has the new shell.

     Why not plain cache-first: index.html registers sw.js?v=<its own version>.
     Serve a stale shell and it registers the version already running, no update
     is ever found, and the app can never move forward. The deadline keeps the
     normal path (fast network, ~200 ms from Pages) exactly as it was. */
  if (req.mode === "navigate") {
    e.respondWith(
      caches.open(CACHE).then(function (c) {
        var net = fromNetwork(req, c);
        return c.match("./index.html").then(function (hit) {
          return hit || c.match("./");
        }).then(function (hit) {
          if (hit) return new Promise(function (resolve) {
            var settled = false;
            var give = function (r) { if (!settled) { settled = true; resolve(r); } };
            var timer = setTimeout(function () { give(hit); }, NET_WAIT);
            net.then(function (res) { clearTimeout(timer); give(res); },
                     function ()    { clearTimeout(timer); give(hit); });
          });
          return net.catch(function () {
            /* respondWith(undefined) renders a blank page. If the shell was
               never cached, hand back a real page rather than nothing. */
            return new Response(
              "<!doctype html><meta charset=utf-8><meta name=viewport content=\"width=device-width,initial-scale=1\">" +
              "<body style=\"margin:0;background:#0a0807;color:#A5978A;font:500 14px/1.6 -apple-system,system-ui,sans-serif;" +
              "display:flex;align-items:center;justify-content:center;height:100vh;text-align:center;padding:24px\">" +
              "<div>You're offline.<br>Open this again once you have a connection.</div>",
              { headers: { "content-type": "text/html; charset=utf-8" } });
          });
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
        if (hit) return hit;
        return fromNetwork(req, c).catch(function () { return hit; });
      });
    })
  );
});
