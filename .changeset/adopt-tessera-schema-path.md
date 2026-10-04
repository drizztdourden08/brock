---
'@drizztdourden08/brock-build': patch
---

`brock adopt` points the `$schema` of a new `tessera.config.json` at Tessera's schema wherever Tessera is installed: the root `node_modules`, else `packages/design`, else any workspace package, written relative to the repo root. With no install yet it keeps the root path.
