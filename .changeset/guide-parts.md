---
'@drizztdourden08/brock-build': patch
'@drizztdourden08/create-brock': patch
---

`brock sync` runs `tessera guide` when `tessera.config.json` sets `guide.parts`, and a new app sets it to `.brock/tessera-parts.ts`. Migration `guide-parts` asks an app to set it and to delete a hand-written parts list (archipelia-36, brock-24).
