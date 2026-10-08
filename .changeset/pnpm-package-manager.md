---
'@drizztdourden08/brock-build': patch
'@drizztdourden08/create-brock': patch
---

The managed setup steps no longer pin `version: 10` in `pnpm/action-setup`, which failed next to a `packageManager` field: pnpm's version comes from `packageManager` in the root `package.json` alone. `brock adopt` and `create-brock` write it from the pnpm in use, the `pnpm-package-manager` migration (0.37.0) adds it to an existing repo, and `brock check` fails while it is missing.
