---
'@drizztdourden08/brock-build': patch
---

The knip config that `brock adopt` writes, and the app template, now list `src/views/*/*.usage.ts` as entries. Tessera usage files are read by tooling and never imported, so knip no longer reports them as unused. A lazy title bar button also keeps a literal `disabled` from its spec.
