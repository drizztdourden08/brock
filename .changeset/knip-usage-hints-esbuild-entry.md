---
'@drizztdourden08/brock-build': patch
'@drizztdourden08/brock-lint-config': patch
---

Quiet two knip reports that were not the app's fault. The empty entry hint for a usage glob that Tessera adds for a folder the app does not have (`src/primitives/**/*.usage.ts`, `src/composites/**/*.usage.ts`) is dropped. A bare esbuild script entry such as `esbuild src/index.ts` is no longer reported as an unresolved or unlisted package when the file exists in that workspace. The fix lives in the brock knip preprocessor that both `brock knip` and the lint-config extension load.
