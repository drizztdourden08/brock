---
'@drizztdourden08/brock-build': patch
---

`brock migrate` runs `brock sync` again when a Brock migration changed the app, so a file it adds, such as `session.base.tsx`, reaches `.brock/screens.ts`.
