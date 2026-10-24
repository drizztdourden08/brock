---
'@drizztdourden08/brock-electron': minor
---

Data domains under plain Node. `createDataDomains(dataDir, defs)` from `@drizztdourden08/brock-electron/node` returns the same `DataDomains` as `ctx.storage` (with a `DomainFiles` per domain): the same atomic writes, path guards and `usage()` size, for a process with no Electron, such as a headless server. `dataDir` is the folder the domains sit in (the `Data/` folder of an Electron app). The entry still reaches no module of Electron, and a keep test checks the new import graph.
