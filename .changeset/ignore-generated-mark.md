---
'@drizztdourden08/brock-build': patch
---

`brock adopt` ignores `public/logos/mark.svg`, which `brock icons` writes beside the other logos. The `mark-svg-ignored` migration adds the line next to the other logo lines and leaves a to-do when git already tracks the file.
