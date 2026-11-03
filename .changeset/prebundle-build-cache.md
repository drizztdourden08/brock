---
'@drizztdourden08/build-cache': patch
'@drizztdourden08/brock-build': patch
---

Reuse the renderer dependency pre-bundle of Vite across worktrees through the build cache. A new `vite-deps` entry kind holds a copy of `node_modules/.vite/deps`, named by the Vite version, the platform, the lockfile content and Vite's own config hash with the worktree root left out. Before Vite starts, `brock dev`, `brock prewarm` and `worktree launch` copy a matching entry in with this worktree's hashes written into `_metadata.json`, so Vite skips the pre-bundle. A miss lets Vite build as before, and a process of its own then stores the result. A damaged entry reads as a miss. The old `BROCK_DEPS_CACHE_DIR` folder under `~/.brock/cache/vite-deps` is no longer written.
