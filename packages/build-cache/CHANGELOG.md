# @drizztdourden08/build-cache

## 0.118.1

## 0.118.0

## 0.117.1

## 0.117.0

## 0.116.1

### Patch Changes

- 642161a: Keep the installed SDL3 addon in the build cache too, so a fresh worktree in local mode gets its controller addon without any download. A new `addon-installed` entry kind holds the extracted files with a SHA-256 for each. It is stored after an install, or when the addon on disk is current, and restored when the archive is not cached. `addon:seed` stores an installed copy by hand.
- 1a4dd9c: Cache the verified SDL3 addon prebuilt per machine and never download it in local mode. The postinstall and the prepare step first look in the build cache (a new `addon-prebuilt` entry kind, keyed by the release tag, the asset name and the platform), check the archive SHA-256 and unpack it with no network. In local mode a cache miss logs one line and falls back to a source build or the addon already on disk; in remote mode it downloads as before and stores the verified archive. `@drizztdourden08/build-cache` gains a `./store` export that loads no compiler.
- bd6aab3: Share the dev main and preload bundles across worktrees through the build cache. A new `app-build` entry kind holds one bundle with the keys of every source file it read (Git blob ids, or content hashes for a changed file), named by the app, the lockfile, the config, the Brock, Vite and electron-vite versions, the platform and the mode. Before Vite or electron-vite load, `brock prewarm` and `brock dev` compare the current Git state with the entry, and on a hit write the bundle and the in-worktree reuse record, so a fresh worktree skips the build. A miss logs why (no entry, or the first changed file), builds as before, and the build reuse plugin stores the result. A bundle that names the worktree is stored with its root as a token and restored with the new root. `build-cache/store` also exports `entryPaths`, `hashTree` and `hashValue`.
- 372a5d1: A fresh worktree of an app linked to Brock with `--local` reuses the shared main and preload builds and the renderer pre-bundle. pnpm writes each `link:` version relative to the checkout, so `node_modules/.pnpm/lock.yaml` differed per worktree and both cache keys missed. The keys now read that lockfile with every `link:` path that leaves the install folder as an absolute path; a lockfile without such a link keys as before. `<repo> worktree launch` now restores the shared main and preload builds before `electron-vite dev`, as `brock dev` does, through the new `@drizztdourden08/brock-build/restore-shared-build` export.
- 638384e: Reuse the renderer dependency pre-bundle of Vite across worktrees through the build cache. A new `vite-deps` entry kind holds a copy of `node_modules/.vite/deps`, named by the Vite version, the platform, the lockfile content and Vite's own config hash with the worktree root left out. Before Vite starts, `brock dev`, `brock prewarm` and `worktree launch` copy a matching entry in with this worktree's hashes written into `_metadata.json`, so Vite skips the pre-bundle. A miss lets Vite build as before, and a process of its own then stores the result. A damaged entry reads as a miss. The old `BROCK_DEPS_CACHE_DIR` folder under `~/.brock/cache/vite-deps` is no longer written.
- 6c18c29: The renderer pre-bundle cache key no longer depends on where the package store lives. Vite's own `@vite/env` and `@vite/client` aliases point into the store, so the key changed with every shared store build and a fresh worktree missed an entry that was there. Aliases inside the store now hash as `@store/<path below the store>`, the key layout version is 3, and stored sources are portable whether the install names the store by its link or by the folder it points to. `brock prewarm` now skips the renderer step on a build reuse hit only when an entry exists for this Vite version and this lockfile (the manifest records the lockfile hash), without loading Vite. When none does, it loads Vite and bundles unless the entry for this worktree's exact key was restored.
- 505d97a: A renderer pre-bundle restored from the build cache no longer imports files from the checkout that built it. Vite writes each CSS import of a package as an absolute path into that checkout's package store. A fresh worktree loaded those files from the main checkout, and Vite could refuse them as outside its allow list, so the window never showed. The stored bundle files now keep paths into the package store and the install folder as tokens, and a restore points them at the worktree's own store. Entries of the old layout are no longer restored, and the pre-bundle key moves to a new version.

## 0.116.0

### Minor Changes

- 0092808: New package `@drizztdourden08/build-cache`: a per-user cache of compiled `@drizztdourden08` package versions and Electron binaries, shared by every project and worktree on the machine. It imports no Brock or Tessera package, so Tessera and a Tessera-only site can use it too.

  The cache lives in `~/.brock/cache/build-cache`, or in `BROCK_BUILD_CACHE_DIR`. Each entry is one folder keyed by kind, name, exact version and build settings, with a `manifest.json` and a content hash. Entries are built in a temp folder and renamed into place. A missing or mismatched entry reads as a miss and is built again. The package never deletes an entry; Argus prunes the cache. The layout and the pruning rule are in `docs/build-cache.md`.
