---
'@drizztdourden08/brock-build': patch
---

`brock structure` warns when a renderer file imports a workspace package's barrel that reaches a Node builtin through its re-exports, and names a subpath export to import instead. app-structure.md says a renderer imports such packages through their per-subject subpaths.
