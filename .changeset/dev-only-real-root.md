---
'@drizztdourden08/brock-build': patch
---

A production build strips the dev-only screens and handler groups again when the app folder is reached through a link, a junction or a short Windows name (`C:\Users\RUNNER~1\...`, the temp folder on GitHub's Windows runners). Vite hands `devOnlyPlugin` the real path of each file, which lay outside the app root as given, so `.brock/*.dev.ts` shipped whole and an import of a `.dev` file built instead of stopping. The plugin now matches a file against the app root as given and its real path.
