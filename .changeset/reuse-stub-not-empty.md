---
'@drizztdourden08/brock-build': patch
---

A reused main or preload bundle no longer prints "Generated an empty chunk". The stub entry now exports one value, so Rollup sees no empty chunk. A real empty chunk still warns.
