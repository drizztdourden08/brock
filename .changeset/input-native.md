---
"@drizztdourden08/brock-input": patch
"@drizztdourden08/brock-build": patch
"@drizztdourden08/brock-core": patch
---

The input module carries the SDL3 addon source, fetches its prebuild on install and before `brock dev` and `brock build`, and ships it in a packaged app through module manifest fields that the builder config reads.
