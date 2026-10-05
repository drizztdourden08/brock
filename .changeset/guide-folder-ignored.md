---
'@drizztdourden08/brock-build': patch
'@drizztdourden08/create-brock': patch
---

The `guide/` folder `tessera guide` writes is generated output: a fresh app ignores it in git, `brock dev`, `brock build` and `brock start` write it again when it is missing, and the `guide-folder-ignored` migration (0.22.0) adds `/guide/` (or the `guide.out` folders) to the `.gitignore` beside `tessera.config.json` and makes a tracked copy a to-do.
