---
'@drizztdourden08/brock-build': patch
'@drizztdourden08/brock-thread': patch
---

A dev start skips work it did before. Main and preload are not bundled again while no module file they read, the config or the install changed (`node_modules/.vite/brock-build-reuse`), which saves 2 to 4 s on a warm start. A new worktree with the same lockfile copies the Vite dependency cache that another worktree made, from `~/.brock/cache/vite-deps`, so its first start skips the dependency optimizer. `launch` now runs the sync in its own process instead of a child, and the cold-start Tessera guide runs after the app is spawned instead of before. `brock sync --if-stale` on an app that is already in sync no longer loads the whole CLI or the app config: it checks a few file stamps and a record of the last brand icon copy, which takes well under a second. `brock sync`, `brock sync --check` and `brock build` behave as before.
