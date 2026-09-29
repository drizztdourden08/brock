---
"@drizztdourden08/brock-build": patch
"@drizztdourden08/brock-react": patch
"@drizztdourden08/brock-electron": patch
---

One copy of React, zustand and Tessera per app build, so component overrides apply the same way in dev and production. The profile card no longer nests buttons, and the review tool checks fonts, the design system loading once and every settings row, and ignores a request that failed once but loaded.
