---
'@drizztdourden08/brock-build': patch
---

`.brock/*.ts` stays committed, as the template and `brock adopt` already wrote it, and app-structure.md now says why: a fresh checkout type-checks without a sync and `brock check` catches a stale registry. The `brock-dir-tracked` migration adds `!.brock/` and `.brock/profile-config.json` to a `.gitignore` whose `.*/` rule hid the folder, up to the workspace root.
