---
'@drizztdourden08/brock-thread': patch
---

`upgrade` installs without a frozen lockfile after the migrations run. A migration that adds a dependency (such as `koffi-dependency` in 0.117.0) changes `package.json`, so the old frozen install failed with `ERR_PNPM_OUTDATED_LOCKFILE`. The new lockfile is part of the upgrade commit.
