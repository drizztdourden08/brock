---
'@drizztdourden08/brock-react': minor
'@drizztdourden08/brock-build': patch
---

Screens, hubs, the search index and the palette take `Text`. Bucket, group, hub and tab titles, hub actions, search seeds and settings groups are resolved where they are drawn, and the palette strings live in the English tables. The build keeps `{ key }` for a `msg()` title in the search seeds, and the runtime catalog resolves it in the active language.
