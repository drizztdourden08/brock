---
'@drizztdourden08/brock-build': patch
---

Generated `.brock` files are written with LF and compared without regard to line endings, and `.brock/tessera-parts.ts` is put back when `tessera guide` changed only its line endings, so a build no longer churns git.
