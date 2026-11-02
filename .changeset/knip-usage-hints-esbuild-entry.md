---
'@drizztdourden08/brock-build': patch
'@drizztdourden08/brock-lint-config': patch
---

A bare esbuild script entry such as `esbuild src/index.ts` is no longer reported by knip as an unresolved or unlisted package when the file exists in that workspace. The fix lives in the brock knip preprocessor that both `brock knip` and the lint-config extension load. Empty usage entry hints stay, since Tessera adds those globs and fixes them at the source.
