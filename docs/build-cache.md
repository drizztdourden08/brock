<!-- @layer docs @kind doc -->
# The build cache

One folder per user holds what a fresh worktree would otherwise build or download again: each `@drizztdourden08` package version compiled for a target, and each Electron binary. Every project and every worktree on the machine reads the same folder. The code is `@drizztdourden08/build-cache` (`packages/build-cache`), a package that imports no Brock or Tessera package, so Brock, Tessera and a Tessera-only site can all use it.

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
  .tmp/                     entries being built or deleted, and leftovers of a process that was cut off
```

- `<name>` is the package name with the scope slash as `+`: `@drizztdourden08+brock-core`. Electron is always `electron`.
- `<version>` is the exact installed version, such as `0.115.3` or `42.11.8`.
- `<buildKey>` names everything that changes the output, so two variants of one version live side by side. A package key is `<platform>-<settings>-<input>`, for example `node-3f9a0c1d2e4b5a6c-9d8e7f6a5b4c`: `<settings>` hashes the output layout version of build-cache, the compiler and its version, the format (always ESM), the platform, the target and the `define` values; `<input>` is the first 12 characters of `inputHash`, so a patched copy of a version gets its own entry. An Electron key is `<platform>-<arch>`, such as `win32-x64`, taken from `ELECTRON_INSTALL_PLATFORM` and `ELECTRON_INSTALL_ARCH`, then `npm_config_platform` and `npm_config_arch`, then `platform` and `arch` in the nearest `.npmrc`, then the machine.
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

## Who writes it

`buildCachePlugin` (`@drizztdourden08/build-cache/vite`) adds package entries during a Node build, and `restoreElectron` and `storeElectron` (`@drizztdourden08/build-cache/electron`) read and add Electron entries. `storeElectronDetached` runs the store in a process of its own when no entry is there yet, so a short command never cuts a copy in half. Brock wires them into `brock dev`, `brock start` and `worktree launch` in a follow-up change.
