---
'@drizztdourden08/brock-catalog': minor
---

`readInstalledRecords(source)` from `@drizztdourden08/brock-catalog/main` reads `catalog/installed.json` with no main context, for a boot task, a test or another process. `source` is a `FileStore` rooted at `Data/`, the `Data/` folder itself, or the path of the JSON file; a missing or damaged file reads as no records.
