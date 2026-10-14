---
'@drizztdourden08/brock-build': minor
---

`brock.site.ts` takes `tsconfig.compilerOptions`, merged over the managed site `tsconfig.json`, and `build.define`. The managed site tsconfig allows `.ts` imports, so `brock.site.ts` can read its port offsets from a constant the repo shares, such as `import { TOOL_PORTS } from '../../ports.constants.ts'`.
