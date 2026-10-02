---
'@drizztdourden08/brock-build': minor
---

`brock tessera <args...>` runs Tessera's own command line (`runTessera` from `@drizztdourden08/tessera/cli`) in the current folder, so `tessera.config.json` is found from there; every word after `tessera` reaches it, `--help` too, and the repo command (`bin/<repo>.mjs tessera new compound SaveSlot`) reaches it the same way. Tessera comes from the folder's own `node_modules`, else from an app of its workspace; without it the command says how to add it and exits 1.
