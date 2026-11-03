---
'@drizztdourden08/brock-build': patch
---

`brock lint` no longer fails with "No files matching" when an app starts during a lint. The file list leaves out the config bundle that electron-vite and Vite write for a moment (`electron.vite.config.<stamp>.mjs`), and a listed file that vanishes before ESLint reads it is skipped instead of failing the run.
