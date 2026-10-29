---
'@drizztdourden08/build-cache': minor
'@drizztdourden08/brock-build': minor
---

Share the dev main and preload bundles across worktrees through the build cache. A new `app-build` entry kind holds one bundle with the keys of every source file it read (Git blob ids, or content hashes for a changed file), named by the app, the lockfile, the config, the Brock, Vite and electron-vite versions, the platform and the mode. Before Vite or electron-vite load, `brock prewarm` and `brock dev` compare the current Git state with the entry, and on a hit write the bundle and the in-worktree reuse record, so a fresh worktree skips the build. A miss logs why (no entry, or the first changed file), builds as before, and the build reuse plugin stores the result. A bundle that names the worktree is stored with its root as a token and restored with the new root. `build-cache/store` also exports `entryPaths`, `hashTree` and `hashValue`.
