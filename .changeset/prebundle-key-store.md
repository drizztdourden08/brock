---
'@drizztdourden08/build-cache': patch
'@drizztdourden08/brock-build': patch
---

The renderer pre-bundle cache key no longer depends on where the package store lives. Vite's own `@vite/env` and `@vite/client` aliases point into the store, so the key changed with every shared store build and a fresh worktree missed an entry that was there. Aliases inside the store now hash as `@store/<path below the store>`, the key layout version is 3, and stored sources are portable whether the install names the store by its link or by the folder it points to. `brock prewarm` now skips the pre-bundle only when the entry for this worktree's key was restored, not when any entry exists for the Vite version; on a build reuse hit it therefore loads electron-vite and Vite to resolve the renderer config.
