---
'@drizztdourden08/brock-port-kit': minor
---

The ROM store takes unknown dumps (`acceptUnknown`: stored under their SHA-1 and flagged `unknown` with their `hash`), zips (the single known dump inside, or with `acceptUnknown` a lone ROM file; any other zip is refused with a `message` listing what it held), a `maxBytes` limit and several ROM kinds (`rom.kinds`, each with its own known list, file rules and folder, through `store.of(kind)`); `remove` also deletes what the kind's `derived(file, files)` names and resolves the removed paths.
