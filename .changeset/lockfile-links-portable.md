---
'@drizztdourden08/build-cache': patch
'@drizztdourden08/brock-build': patch
'@drizztdourden08/brock-thread': patch
---

A fresh worktree of an app linked to Brock with `--local` reuses the shared main and preload builds and the renderer pre-bundle. pnpm writes each `link:` version relative to the checkout, so `node_modules/.pnpm/lock.yaml` differed per worktree and both cache keys missed. The keys now read that lockfile with every `link:` path that leaves the install folder as an absolute path; a lockfile without such a link keys as before. `<repo> worktree launch` now restores the shared main and preload builds before `electron-vite dev`, as `brock dev` does, through the new `@drizztdourden08/brock-build/restore-shared-build` export.
