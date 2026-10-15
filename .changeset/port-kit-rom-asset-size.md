---
'@drizztdourden08/brock-port-kit': minor
---

`listNames()` entries carry `assetBytes`, the size of the ROM's asset blob read from the file store's `stat` (`null` when there is none or the stat fails), still with no read and no hash, so a Data Manager can show "Extracted (12 MB)". `hasAssets` now comes from the same stat.
