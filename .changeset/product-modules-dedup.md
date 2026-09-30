---
'@drizztdourden08/brock-core': patch
---

`ProductConfig` drops its `modules` field. Nothing read it: the module list is the top-level `modules` of `brock.config.ts`, which `brock add` writes and `brock sync` reads.
