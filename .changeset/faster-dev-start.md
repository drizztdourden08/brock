---
'@drizztdourden08/brock-build': patch
'@drizztdourden08/brock-thread': patch
---

A dev start does less work twice. The renderer dependency crawl is kept in `node_modules/.vite/brock-renderer-deps.json` and reused while no file it read changed, which saves about 1 to 2 s on a warm start and more on a cold disk. `brock sync --if-stale` now copies the brand icons that changed, so `launch` runs one Brock process before the dev server instead of two and no longer redraws the Setup splash, which only `brock package` needs.
