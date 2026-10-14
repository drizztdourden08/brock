---
'@drizztdourden08/brock-catalog': minor
---

App code can tell an item is installing without its own copy of the job id: `CATALOG_JOB_PREFIX`, `catalogJobId(itemId)` and `isCatalogInstalling(itemId, jobs)` come from every entry of the catalog module. `jobs` is a job list (the renderer's job store, `ctx.jobs.list()`) or anything with a `list()`, such as `ctx.jobs`.
