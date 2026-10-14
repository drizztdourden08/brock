---
'@drizztdourden08/brock-port-kit': minor
---

`RomStore.listNames()` (and the same call on each kind's store) lists the stored ROM files by name only, with no read and no hash: `{ file, label, hasAssets }`, for a listing that has to show at once.
