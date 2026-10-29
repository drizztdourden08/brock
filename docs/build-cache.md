<!-- @layer docs @kind doc -->
# The build cache

One folder per user holds what a fresh worktree would otherwise build or download again: each `@drizztdourden08` package version compiled for a target, and each Electron binary. Every project and every worktree on the machine reads the same folder. The code is `@drizztdourden08/build-cache` (`packages/build-cache`), a package that imports no Brock or Tessera package, so Brock, Tessera and a Tessera-only site can all use it.

Brock and Tessera tooling only add entries and record when an entry was used. They never delete one and keep no usage registry. Argus owns usage tracking and pruning, with the rule below.

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
  .tmp/                     entries being built, and anything left by a build that was cut off
```

- `<name>` is the package name with the scope slash as `+`: `@drizztdourden08+brock-core`. Electron is always `electron`.
- `<version>` is the exact installed version, such as `0.115.3` or `42.11.8`.
- `<buildKey>` names the settings that change the output. A package key is `<platform>-<hash>`, for example `node-3f9a0c1d2e4b5a6c`, where the hash covers the compiler and its version, the format (always ESM), the platform, the target and the `define` values. An Electron key is `<platform>-<arch>`, such as `win32-x64`.
- Each segment matches `[A-Za-z0-9_.+@-]+`. Anything else is refused.

## manifest.json

```json
{
  "schema": 1,
  "kind": "package",
  "name": "@drizztdourden08/brock-core",
  "version": "0.115.3",
  "buildKey": "node-3f9a0c1d2e4b5a6c",
  "contentHash": "<sha256 of files/>",
  "sizeBytes": 812345,
  "builtAt": "2026-10-29T03:10:00.000Z",
  "lastUsedAt": "2026-10-29T05:42:00.000Z",
  "builtBy": "@drizztdourden08/build-cache@0.1.0",
  "inputHash": "<sha256 of the installed package source>",
  "buildSettings": { "compiler": "esbuild@0.25.12", "format": "esm", "platform": "node", "target": "node22", "define": {}, "jsx": "automatic" },
  "imports": { ".": ["@electron-toolkit/utils"] }
}
```

- `contentHash` is a SHA-256 over every file under `files/`, in sorted relative path order, each as its path, its size and its bytes. It never depends on where the folder is.
- `sizeBytes` is the total size of `files/`.
- `lastUsedAt` is updated when a build or launch uses the entry, at most once per process for each entry, by an atomic rewrite of `manifest.json`.
- `inputHash` (packages) is the same hash over the installed package folder the entry was compiled from. `imports` (packages) lists, for each export, the packages its code loads at runtime. `distHash` (Electron) is the hash of `files/dist`.

## How entries are written and read

- A new entry is built in `<root>/.tmp/<uuid>/`, its manifest written last, then the folder is renamed to its final path. A reader never sees half an entry. When two processes race, the first rename wins and the other uses it.
- A reader treats a missing folder, an unreadable manifest, another `schema`, `kind`, `name`, `version` or `buildKey`, another `inputHash`, or files that do not hash to `contentHash` as a miss, and builds the entry again over the broken one.
- A package entry is checked against its hash on every use. An Electron entry is checked as it is copied: the copy is hashed and refused when it does not match `distHash`.
- Nothing runs from the cache folder. A package entry is copied to `<app>/node_modules/.build-cache/node_modules/<name>/`, and an Electron entry to the installed `electron` package (`dist/` and `path.txt`). Deleting an entry never breaks a running app or a worktree that already has its copy.

## The rule Argus applies

- An entry is in use when any known project or git worktree resolves that name at that exact version in its lockfile (`pnpm-lock.yaml`, or `node_modules/.pnpm/lock.yaml`). For Electron, that is the `electron` version.
- An entry not in use may be deleted after a grace period, counted from `lastUsedAt`.
- A folder under `.tmp/` older than a day is left over from a build that was cut off and may be deleted.
- Delete a whole `<buildKey>` folder, never a single file inside it. Delete a `<version>` or `<name>` folder once it holds no entry.

## Who writes it

`buildCachePlugin` (`@drizztdourden08/build-cache/vite`) adds package entries during a Node build, and `restoreElectron` and `storeElectron` (`@drizztdourden08/build-cache/electron`) read and add Electron entries. Brock wires them into `brock dev`, `brock start` and `worktree launch` in a follow-up change.
