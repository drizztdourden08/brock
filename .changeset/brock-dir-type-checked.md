---
'@drizztdourden08/brock-build': patch
'@drizztdourden08/create-brock': patch
---

The app tsconfig includes `.brock/*.ts` instead of `.brock`. TypeScript skips dot folders when it expands a folder entry in `include`, so `.brock` matched no file, and `.brock/tessera-parts.ts`, the `guide.parts` file a fresh app sets, never reached the program because nothing imports it. `brock sync` writes the new tsconfig, and the `brock-dir-type-checked` migration (0.34.0) rewrites a bare `.brock` include entry in every `tsconfig*.json` at the app root.
