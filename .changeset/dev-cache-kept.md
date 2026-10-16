---
'@drizztdourden08/brock-build': patch
'@drizztdourden08/brock-electron': patch
---

A dev boot no longer clears Chromium's HTTP cache every time, which threw away the pre-bundled dependency chunks. Main keeps the cache while the renderer's dep optimizer hash (in the `_metadata.json` the dev server names in `BROCK_DEV_DEPS_METADATA`) is the one of the last dev boot, and clears it once when the hash changes. `BROCK_DEV_CLEAR_CACHE=1` clears it on every dev boot, as before. Edits still show at once: Vite serves source modules and `public/` files with `no-cache`.
