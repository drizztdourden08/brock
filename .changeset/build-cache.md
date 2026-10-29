---
'@drizztdourden08/build-cache': minor
---

New package `@drizztdourden08/build-cache`: a per-user cache of compiled `@drizztdourden08` package versions and Electron binaries, shared by every project and worktree on the machine. It imports no Brock or Tessera package, so Tessera and a Tessera-only site can use it too.

The cache lives in `~/.brock/cache/build-cache`, or in `BROCK_BUILD_CACHE_DIR`. Each entry is one folder keyed by kind, name, exact version and build settings, with a `manifest.json` and a content hash. Entries are built in a temp folder and renamed into place. A missing or mismatched entry reads as a miss and is built again. The package never deletes an entry; Argus prunes the cache. The layout and the pruning rule are in `docs/build-cache.md`.
