---
'@drizztdourden08/brock-build': patch
---

`brock sync` in a workspace app runs `tessera guide` where Tessera is installed. It still reads the workspace's `tessera.config.json`, but runs Tessera in that folder only when it has Tessera, else in the first workspace package outside the `apps` entries that has it (such as `packages/design`), else in each `apps` entry with Tessera. Before, it ran at the repo root, where Tessera reported itself not installed, so the part names were never written by a sync from `apps/desktop`.
