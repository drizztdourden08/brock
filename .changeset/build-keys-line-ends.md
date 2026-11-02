---
'@drizztdourden08/brock-build': patch
---

A fresh worktree reuses the main and preload builds the main checkout put in the build cache, even when the two checkouts write line ends differently. The key read the bytes of `package.json`, `brock.config.ts`, `electron.vite.config.ts`, `tsconfig.json` and the `.env` files. A git checkout with `core.autocrlf` writes them with CRLF, while the scaffolder and the tools write LF, so the key missed in every new worktree of an app with no `.gitattributes`. The key now reads those files with CRLF taken as LF, as git does.
