/**
 * Welcome to your Workbox-powered service worker!
 *
 * You'll need to register this file in your web app and you should
 * disable HTTP caching for this file too.
 * See https://goo.gl/nhQhGp
 *
 * The rest of the code is auto-generated. Please don't update this file
 * directly; instead, make changes to your Workbox build configuration
 * and re-run your build process.
 * See https://goo.gl/2aRDsh
 */

importScripts("https://storage.googleapis.com/workbox-cdn/releases/3.6.3/workbox-sw.js");

workbox.skipWaiting();
workbox.clientsClaim();

/**
 * The workboxSW.precacheAndRoute() method efficiently caches and responds to
 * requests for URLs in the manifest.
 * See https://goo.gl/S9QRab
 */
self.__precacheManifest = [
  {
    "url": "apple-touch-icon.6d55c191.png",
    "revision": "c0533cfeb78081e10f3bdc9f0355559d"
  },
  {
    "url": "favicon-16x16.96afa5a2.png",
    "revision": "c1af262f31a83138f28e1dc25a8edd55"
  },
  {
    "url": "favicon-32x32.5162115c.png",
    "revision": "545e503dd5cbfe3c69e49530645ee3b5"
  },
  {
    "url": "index.html",
    "revision": "fe31fbf1bb87533f2e2964c352fa17ec"
  },
  {
    "url": "main.50279e2e.css",
    "revision": "6685234714fcd913a5510545f01840dd"
  },
  {
    "url": "/",
    "revision": "4647b54fb9469f984ddee25899db80d8"
  }
].concat(self.__precacheManifest || []);
workbox.precaching.suppressWarnings();
workbox.precaching.precacheAndRoute(self.__precacheManifest, {});

workbox.routing.registerNavigationRoute("/index.html");
