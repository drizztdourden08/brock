<!-- @layer docs @kind doc -->
# The build cache

One folder per user holds what a fresh worktree would otherwise build or download again: each `@drizztdourden08` package version compiled for a target, each Electron binary, and each renderer dependency pre-bundle of Vite. Every project and every worktree on the machine reads the same folder. The code is `@drizztdourden08/build-cache` (`packages/build-cache`), a package that imports no Brock or Tessera package, so Brock, Tessera and a Tessera-only site can all use it.

Brock and Tessera tooling only add entries, replace broken ones and record when an entry was used. They never prune and keep no usage registry. Argus owns usage tracking and pruning, with the rule below.

## Where it lives

The root is `BROCK_BUILD_CACHE_DIR` when that variable is set, else `~/.brock/cache/build-cache` (on Windows `%USERPROFILE%\.brock\cache\build-cache`).

```text
<root>/
  package/<name>/<version>/<buildKey>/
    manifest.json
    files/                  the compiled package: package.json, one .js per export, chunks/, assets/
  electron/electron/<version>/<buildKey>/
    manifest.json
    files/
      dist/                 the extracted Electron binary
      path.txt              the executable inside dist
  vite-deps/renderer/<viteVersion>/<buildKey>/
    manifest.json
    files/                  a copy of node_modules/.vite/deps: _metadata.json, one .js per dependency, chunks
  app-build/<package name>/<app version>/<target>-<platform>-<arch>-<envKey>-<sourceKey>/
    manifest.json           carries target, preflight, outDir and the keys of every source the build read
    files/record.json       the main or preload bundle, as the in-worktree reuse record keeps it
  addon-prebuilt/<asset name>/<release tag>/<platform>-<arch>/
    manifest.json           carries archiveSha256
    files/                  the verified .tar.gz of the SDL3 addon, as the release publishes it
  addon-installed/<asset name>/<release tag>/<platform>-<arch>/
    manifest.json           carries files (each path with its sha256) and source
    files/                  the extracted addon files as ensure-addon installs them
  .tmp/                     entries being built or deleted, and leftovers of a process that was cut off
```

- `<name>` is the package name with the scope slash as `+`: `@drizztdourden08+brock-core`. Electron is always `electron`, and a Vite pre-bundle is always `renderer`.
- `<version>` is the exact installed version, such as `0.115.3` or `42.11.8`.
- `<buildKey>` names everything that changes the output, so two variants of one version live side by side. A package key is `<platform>-<settings>-<input>`, for example `node-3f9a0c1d2e4b5a6c-9d8e7f6a5b4c`: `<settings>` hashes the output layout version of build-cache, the compiler and its version, the format (always ESM), the platform, the target and the `define` values; `<input>` is the first 12 characters of `inputHash`, so a patched copy of a version gets its own entry. An Electron key is `<platform>-<arch>`, such as `win32-x64`, taken from `ELECTRON_INSTALL_PLATFORM` and `ELECTRON_INSTALL_ARCH`, then `npm_config_platform` and `npm_config_arch`, then `platform` and `arch` in the nearest `.npmrc`, then the machine.
- A Vite pre-bundle has the Vite version as `<version>` and `<platform>-<arch>-<hash>` as its key, such as `win32-x64-5c0e1d9a7b3f2a64`. The hash covers the key layout version, the Vite version, the platform, the lockfile content (`node_modules/.pnpm/lock.yaml`) and Vite's own config hash with the worktree root taken out and the alias folders taken relative to it. An alias folder inside the package store (Vite's own `@vite/env` and `@vite/client` aliases point into its place in the store) is written as `@store/<path below the store>`, so the key does not change when the shared store is rebuilt under a new name or a worktree is cloned onto another one. That config hash holds what decides the optimized dependencies: `define` (`NODE_ENV` or the mode), `resolve` (conditions, aliases, dedupe), `assetsInclude`, the plugin names, `optimizeDeps.include` and `exclude` (sorted, no repeats) and the esbuild (Vite 8: Rolldown) options without their plugins.
- Each segment matches `[A-Za-z0-9_.+@-]+`. Anything else is refused.

## manifest.json

```json
{
  "schema": 1,
  "kind": "package",
  "name": "@drizztdourden08/brock-core",
  "version": "0.115.3",
  "buildKey": "node-3f9a0c1d2e4b5a6c-9d8e7f6a5b4c",
  "contentHash": "<sha256 of files/>",
  "sizeBytes": 812345,
  "builtAt": "2026-10-29T03:10:00.000Z",
  "lastUsedAt": "2026-10-29T05:42:00.000Z",
  "builtBy": "@drizztdourden08/build-cache@0.115.4",
  "inputHash": "<sha256 of the installed package source>",
  "buildSettings": { "layout": 1, "compiler": "esbuild@0.25.12", "format": "esm", "platform": "node", "target": "node22", "define": {}, "jsx": "automatic" },
  "imports": { ".": ["@electron-toolkit/utils"] }
}
```

- `contentHash` is a SHA-256 over every file under `files/`, in sorted relative path order, each as its path, its size and its bytes. It never depends on where the folder is.
- `sizeBytes` is the total size of `files/`.
- `lastUsedAt` is updated when a build or launch uses the entry, at most once per process for each entry, by an atomic rewrite of `manifest.json`.
- `inputHash` (packages) is the same hash over the installed package folder the entry was compiled from. `imports` (packages) lists, for each export, the packages its code loads at runtime. `distHash` (Electron) is the hash of `files/dist`.

## The Vite dependency entry

`files/` holds `node_modules/.vite/deps` as Vite wrote it, with one change to `_metadata.json`: each `src` inside the install folder (the folder that holds `node_modules/.pnpm/lock.yaml`) is written as `@root/<path>`, and the rest stay absolute. A source in the package store is written as `@root/node_modules/.pnpm/<path>` whether the install names the store by its link or by where the link points. The manifest has no `inputHash`.

- Vite starts from a cached `deps` folder only when `_metadata.json` carries the `lockfileHash` and `configHash` it computes for the current config, and `configHash` holds the worktree root. So a copy from another worktree is never accepted as it is. A restore copies the entry to a sibling folder and writes this worktree's `lockfileHash`, `configHash` and `hash` (rebuilt from Vite's formula for the resolved config) and absolute `src` paths into its `_metadata.json`. It checks that file against those three hashes, and that every pre-bundled file, chunk and source exists, then renames the folder to `deps`. The `browserHash` is kept.
- A store waits, in a process of its own, for a `deps` folder whose `_metadata.json` has exactly the three hashes the launching process computed. A folder that Vite wrote with other hashes (the formula and Vite disagree) is never stored. The copy is dropped when `_metadata.json` changed while it was copied. The wait ends after three minutes.
- A restore does nothing when `deps` already carries the right hashes. A store does nothing when the entry is there and its files hash to `contentHash`.

## The app build entry

`app-build` holds the dev `main` and `preload` bundles of one Brock app, so a fresh worktree skips the build. It is the in-worktree build reuse (`packages/build/src/build-reuse`) shared across worktrees. One entry holds one bundle (`<target>` is `main` or `preload`).

- `<package name>` and `<app version>` are the app's `package.json` name and version.
- `<envKey>` (16 characters) is everything but the source files: the app path inside its workspace, the package name, platform and architecture, the mode (`development`), Node's version, the Brock build code (its version when installed, a hash of its sources when linked), the Vite and electron-vite versions, the content of `package.json`, `brock.config.ts`, `electron.vite.config.ts` and the files they import, the lockfiles (`node_modules/.pnpm/lock.yaml` is the installed dependency versions), the `.env` files and the `VITE_*` variables. It is computed without loading Vite.
- `<sourceKey>` hashes the `repo`, `repoDirs`, `placed`, `files` and `dirs` tables the build recorded: Git blob ids (or content hashes for a changed or ignored file) of every repository file in the main or preload graph, the names in each of their folders, the compiled packages, and the files outside the repository. No table holds a file time or an absolute path. A file outside the repository is keyed by a SHA-1 of its bytes (read again only when its time or size changes in this process), and its folder by a hash of the names in it.
- `placed` lists the compiled `@drizztdourden08` packages the bundle imports from `node_modules/.build-cache/node_modules/<name>`. Each worktree copies them from the package entries, so the copies are not keyed as files: the table holds the content hash from the copy's `.build-cache.json` and the entry folder it came from, relative to the cache root. A lookup is current when the copy in the worktree has that hash, or, while it is not copied yet, when that package entry's manifest still has it. Entries with the same `<envKey>` and other sources live side by side; a lookup checks the newest eight.
- `manifest.json` repeats those tables, so a lookup reads manifests only and compares them with the Git index, the Git status and the lockfile. The first stale file is named in the log. `files/record.json` is read on a hit only.
- The out folder's path is stored relative to the app. A bundle that names the worktree (for example a file URL of the cached packages under `node_modules`) has the root replaced by a token, and the token by the restoring worktree's root. A bundle that still names the worktree in another spelling is not stored.

**Hit.** `brock prewarm` and `brock dev` (before `electron-vite dev`) call `restoreSharedBuild`. It reads Git and the cache only: Vite and electron-vite are never imported (a test asserts it). On a hit it writes the bundle into the out folder and the record into `node_modules/.vite/brock-build-reuse`, then touches the entry. A worktree whose own record already carries the same `preflight` key and current source keys counts as a hit with no copy. `brock prewarm` then still resolves the renderer config, which loads electron-vite and Vite, because the pre-bundle key needs Vite's resolved config. The `brock:shared-deps-cache` plugin restores the entry with this worktree's key during that step, and prewarm skips the pre-bundle only when it did; an entry for another key does not count. The log line is `reused the main and preload builds from the build cache in N ms, Vite not loaded.`

**Miss.** The log line says why: `no entry in the build cache`, or `changed file <path>` for the first file that differs from the newest entry (a dirty file counts). Vite then builds as before, and the build reuse plugin stores the result once its own record is written. The bundles are about a megabyte, so the store runs in the build process and never fails the build. A reused record is stored too when the cache lacks it.

**Still checked in the worktree.** A restored record is used only if the in-worktree reuse key (`reuseKey`, from the resolved Vite config) equals the stored one. `NODE_ENV` and the resolved `define`, `env` and `build` options are compared there, not in `<envKey>`. When they differ, `electron-vite dev` builds once, as before.

**Import guard.** `main-process-guard` runs inside every build and fails it when renderer-only code reaches main or preload. A stored bundle was built with the guard, and `<sourceKey>` covers every source in its graph, so a hit needs no new check.

An `app-build` entry is never named by a lockfile, so Argus keeps it by `lastUsedAt` and the grace period alone.

## How entries are written and read

- A new entry is built in `<root>/.tmp/<uuid>/`, its manifest written last, then the folder is renamed to its final path. A reader never sees half an entry. When two processes race, the first rename wins and the other uses it.
- A reader treats a missing folder, an unreadable manifest, another `schema`, `kind`, `name`, `version` or `buildKey`, another `inputHash`, or files that do not hash to `contentHash` as a miss. The writer then moves the broken folder into `.tmp/` and commits a new entry in its place.
- A package entry is checked against its hash on every use. An Electron entry is checked in full before a store counts it as present, so a damaged entry is replaced, and its copy is hashed against `distHash` on every restore. A mismatch discards the entry, so the next store builds it again.
- Nothing runs from the cache folder. A package entry is copied to `<app>/node_modules/.build-cache/node_modules/<name>/`, and an Electron entry to the installed `electron` package (`dist/` and `path.txt`, under a lock file in that package, so two launches never restore into it at once). Deleting an entry never breaks a running app or a worktree that already has its copy.

## The rule Argus applies

- Known projects are the portfolio roots Argus already lists. Their worktrees are what `git worktree list --porcelain` reports in each root. A path that no longer exists is not a project.
- Versions in use come from each project's and worktree's `pnpm-lock.yaml` (or `node_modules/.pnpm/lock.yaml`), every importer and package. A version is the text before the first `(`: `0.115.3(electron@42.11.8)` is `0.115.3`. A specifier of `link:`, `file:` or `workspace:` is a source checkout, not a version, and keeps nothing alive. For Electron, read the `electron` version the same way.
- An entry is in use when its name and version are in use (above) and its `lastUsedAt` is within the grace period. Every other entry may be deleted, including old build keys of a version that is still in use: the builds that need one touch it on every use.
- The grace period is 14 days, counted from `lastUsedAt`.
- A folder under `.tmp/` whose modification time is more than a day old was left by a process that was cut off and may be deleted.
- To delete an entry, rename the whole `<buildKey>` folder into `.tmp/<anything unique>` first, then remove it there, so a crash never leaves a manifest beside partial files. Never delete a single file inside an entry. Remove a `<version>` or `<name>` folder once it holds no entry.

## What uses it

- The Electron main process of a Brock app in `electron-vite dev`. Brock's Vite factory adds `buildCachePlugin` (`@drizztdourden08/build-cache/vite`), which compiles each installed `@drizztdourden08` package once per machine and imports it at runtime instead of bundling it. Linked packages (a `link:` or `workspace:` dependency, a Tessera override), packages installed in more than one version, UI packages (they depend on React and stay in the renderer) and any package that depends on one of those stay compiled in as before. The preload, the renderer and production builds are unchanged.
- The Electron binary. `brock dev`, `brock start`, `brock prewarm` and `<repo> worktree launch` restore it with `restoreElectron` instead of extracting it again. After the first install of a version, `storeElectronDetached` adds it to the cache from a process of its own, so a short command never cuts the copy in half.
- The dev main and preload bundles (`app-build`), through `restoreSharedBuild` and the build reuse plugin. See the section above.
- The renderer dependency pre-bundle. The `brock:shared-deps-cache` plugin of Brock's renderer config, on the dev server only, so `brock dev`, `brock prewarm` and `<repo> worktree launch` (which starts `brock prewarm`) all use it. Before Vite reads `node_modules/.vite/deps` the plugin restores a matching entry with `restoreViteDeps`. When it restored nothing it starts `storeViteDepsDetached`, which adds the folder Vite builds. A worktree that already has a current `deps` folder seeds the entry from it.
- The SDL3 addon of `@drizztdourden08/brock-input` (`addon-prebuilt`, imported through `@drizztdourden08/build-cache/store`). Its postinstall and `brock` prepare step look for the release archive here first, check its SHA-256 against `archiveSha256`, and unpack it with no network. In local mode (`~/.coord/remote.json` absent or set to local, `COORD_HOME` moves it) a miss never downloads: one line says so and the usual fallback runs (a source build, or the addon already on disk). In remote mode, or on GitHub Actions, a miss downloads the archive as before and stores it once its `.sha256` sidecar matched. An archive whose digest differs reads as a miss.
- The same addon as extracted files (`addon-installed`). Every install that ends with a current addon on disk (its marker matches the pins and the platform) stores one, unless an intact entry exists, and `pnpm --filter @drizztdourden08/brock-input addon:seed -- <installed brock-input folder>` stores one from a copy that already has the addon. In local mode a miss of the archive restores from it: every file is checked against its SHA-256 in the manifest, then copied to the addon folder. A file that differs reads as a miss.
- `brock cache list` prints every entry with its size and when it was last used.
