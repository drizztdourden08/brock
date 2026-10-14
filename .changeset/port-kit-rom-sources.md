---
'@drizztdourden08/brock-port-kit': minor
---

The ROM store takes unknown dumps (`acceptUnknown`: stored under their SHA-1 and flagged `unknown` with their `hash`), zips (the one ROM inside, or the one known dump among several), a `maxBytes` limit and several ROM kinds (`rom.kinds`, each with its own known list, file rules and folder, through `store.of(kind)`); `remove` also deletes what the kind's `derived(file, files)` names and resolves the removed paths.
