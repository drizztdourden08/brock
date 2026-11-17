---
'@drizztdourden08/brock-build': patch
---

With `build.nodePolyfills` on, the dev server now pre-bundles the polyfill shims the app resolves, so the page no longer reloads mid-boot.
