---
'@drizztdourden08/brock-thread': patch
---

`<repo> upgrade` runs the documented gate in full, as CI does: `pnpm install --frozen-lockfile` and `brock check` in each app after the sync and the migrations, then `lint`, `typecheck`, `lint:md`, `structure` and `test` at the root and in each app, then `brock gate` in each app.
