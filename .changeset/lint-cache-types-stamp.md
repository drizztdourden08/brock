---
'@drizztdourden08/brock-build': patch
---

Fix `brock lint` reusing a stale result for a file whose imported types changed. A type-aware rule such as `no-unsafe-call` depends on the files a module imports, but the eslint content cache keyed a result on the file alone, so an unchanged file kept an old error after an import gained a function. The cache file now carries a stamp of every TypeScript source, tsconfig, `package.json` and lockfile in the tree. Any change to one of them starts a fresh cache, and the previous cache of the same run is removed.
