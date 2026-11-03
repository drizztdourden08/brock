---
'@drizztdourden08/brock-lint-config': patch
---

The Brock extension gives standards knip the brock-build dependency preprocessor, so `standards knip` accepts the Electron externals that `brock knip` accepts. It needs standards 0.14 and adds nothing when brock-build does not resolve from the consumer root.
