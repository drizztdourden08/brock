---
'@drizztdourden08/brock-port-kit': minor
---

Named saves rename, overwrite, prune and size: `rename` and `overwrite` keep the id, `prune` removes past the newest `keep` or older than `maxAgeMs`, `details` and `size` count each save's bytes, an entry carries an optional `meta`, and `createSaveStore(files, { companions })` removes a slot's companion files whenever it is written or removed.
