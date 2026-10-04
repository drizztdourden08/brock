---
'@drizztdourden08/brock-thread': patch
---

`brock upgrade` finds the app in a monorepo: the root when it holds `brock.config.ts`, else every workspace package that does, such as `apps/desktop`. It bumps the Brock ranges of the root, of each app (with its `brock.version`) and of every other workspace package that names Brock, plus the Brock entries of the `pnpm-workspace.yaml` catalog, and runs `pnpm install` when any of them changed. `brock sync` and `brock migrate` run in each app, the gate scripts run at the root and in each app, and each app gets its own `.brock/upgrade-report.md`; every path is printed. Before, the upgrade stopped at "No brock.config.ts" in a repo whose app lives in a subfolder.
