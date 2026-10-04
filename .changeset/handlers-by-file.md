---
'@drizztdourden08/brock-build': minor
'@drizztdourden08/create-brock': minor
---

Handler groups are picked up by file name: `brock sync` writes `.brock/handlers.main.ts` (`mainHandlers`) from `electron/handlers/<subject>-handlers.ts`, each exporting `<subject>Handlers`, and a change in that folder makes `.brock` stale. The new app passes `handlers: mainHandlers`. The `handlers-by-file` migration rewrites `electron/main.ts` the same way when its hand list (in `electron/handlers/index.ts` or inline) names exactly those groups, removing an index that held only the list, and leaves a to-do with both lists otherwise.
