# @drizztdourden08/brock-port-kit

## 0.62.0

### Patch Changes

- Updated dependencies [16321f1]
- Updated dependencies [16321f1]
- Updated dependencies [9a154a7]
- Updated dependencies [16321f1]
  - @drizztdourden08/brock-react@0.62.0
  - @drizztdourden08/brock-electron@0.62.0
  - @drizztdourden08/brock-core@0.62.0

## 0.61.0

### Patch Changes

- Updated dependencies [1d810a5]
  - @drizztdourden08/brock-react@0.61.0
  - @drizztdourden08/brock-core@0.61.0
  - @drizztdourden08/brock-electron@0.61.0

## 0.60.1

### Patch Changes

- Updated dependencies [c8bfd82]
  - @drizztdourden08/brock-react@0.60.1
  - @drizztdourden08/brock-electron@0.60.1
  - @drizztdourden08/brock-core@0.60.1

## 0.60.0

### Patch Changes

- Updated dependencies [ebaabc3]
  - @drizztdourden08/brock-react@0.60.0
  - @drizztdourden08/brock-core@0.60.0
  - @drizztdourden08/brock-electron@0.60.0

## 0.59.0

### Minor Changes

- 4cdb713: Settings pushed before the core runs are no longer lost. `createLiveSettings(core)` listens to the core and applies the last pushed settings each time the core starts running, and again after a restart; a plain `{ calls, apply }` target can pass `subscribe` for the same. The new `dispose()` stops listening. `createPortSession` applies the settings pushed while the core loaded when it starts, and uses its `settings` option only when nothing was pushed, where it used to overwrite them with the option.

### Patch Changes

- Updated dependencies [ea30589]
- Updated dependencies [4cdb713]
- Updated dependencies [4cdb713]
- Updated dependencies [4cdb713]
- Updated dependencies [19b7a49]
- Updated dependencies [19b7a49]
- Updated dependencies [e886c2a]
- Updated dependencies [ea30589]
  - @drizztdourden08/brock-react@0.59.0
  - @drizztdourden08/brock-electron@0.59.0
  - @drizztdourden08/brock-core@0.59.0

## 0.58.0

### Patch Changes

- Updated dependencies [c4b9b7d]
  - @drizztdourden08/brock-react@0.58.0
  - @drizztdourden08/brock-core@0.58.0
  - @drizztdourden08/brock-electron@0.58.0

## 0.57.0

### Patch Changes

- Updated dependencies [2bf0884]
- Updated dependencies [0b699d7]
  - @drizztdourden08/brock-core@0.57.0
  - @drizztdourden08/brock-react@0.57.0
  - @drizztdourden08/brock-electron@0.57.0

## 0.56.0

### Patch Changes

- Updated dependencies [1c0b1b6]
  - @drizztdourden08/brock-react@0.56.0
  - @drizztdourden08/brock-core@0.56.0
  - @drizztdourden08/brock-electron@0.56.0

## 0.55.0

### Patch Changes

- Updated dependencies [d974d98]
  - @drizztdourden08/brock-react@0.55.0
  - @drizztdourden08/brock-core@0.55.0
  - @drizztdourden08/brock-electron@0.55.0

## 0.54.0

### Patch Changes

- Updated dependencies [c34bf5c]
- Updated dependencies [8a06415]
  - @drizztdourden08/brock-react@0.54.0
  - @drizztdourden08/brock-core@0.54.0
  - @drizztdourden08/brock-electron@0.54.0

## 0.53.0

### Patch Changes

- Updated dependencies [60cb320]
  - @drizztdourden08/brock-react@0.53.0
  - @drizztdourden08/brock-electron@0.53.0
  - @drizztdourden08/brock-core@0.53.0

## 0.52.1

### Patch Changes

- Updated dependencies [0856664]
  - @drizztdourden08/brock-react@0.52.1
  - @drizztdourden08/brock-core@0.52.1
  - @drizztdourden08/brock-electron@0.52.1

## 0.52.0

### Patch Changes

- Updated dependencies [1477d7f]
  - @drizztdourden08/brock-react@0.52.0
  - @drizztdourden08/brock-core@0.52.0
  - @drizztdourden08/brock-electron@0.52.0

## 0.51.1

### Patch Changes

- Updated dependencies [024e1b8]
  - @drizztdourden08/brock-react@0.51.1
  - @drizztdourden08/brock-core@0.51.1
  - @drizztdourden08/brock-electron@0.51.1

## 0.51.0

### Minor Changes

- 692c83a: `runAssetWorkerJob` and `runAssetWebWorkerJob` take the job options `visible`, `forwardLog` and `onDuplicate` and pass them to the job they start.

### Patch Changes

- @drizztdourden08/brock-core@0.51.0
- @drizztdourden08/brock-electron@0.51.0
- @drizztdourden08/brock-react@0.51.0

## 0.50.0

### Patch Changes

- Updated dependencies [7230540]
  - @drizztdourden08/brock-react@0.50.0
  - @drizztdourden08/brock-core@0.50.0
  - @drizztdourden08/brock-electron@0.50.0

## 0.49.0

### Patch Changes

- Updated dependencies [a0eedd2]
- Updated dependencies [7f76f4f]
- Updated dependencies [9ff1b40]
- Updated dependencies [35fbe2d]
- Updated dependencies [f0510ca]
- Updated dependencies [a0eedd2]
  - @drizztdourden08/brock-react@0.49.0
  - @drizztdourden08/brock-core@0.49.0
  - @drizztdourden08/brock-electron@0.49.0

## 0.48.0

### Patch Changes

- Updated dependencies [367a4cb]
- Updated dependencies [33e371e]
  - @drizztdourden08/brock-react@0.48.0
  - @drizztdourden08/brock-core@0.48.0
  - @drizztdourden08/brock-electron@0.48.0

## 0.47.0

### Patch Changes

- d8d344e: A title bar action file may export `order` or `meta` beside its default export, as screen and widget files may. A ROM whose asset file is empty lists as having no assets (`hasAssets: false`, `assetBytes: 0`).
- Updated dependencies [6ead199]
- Updated dependencies [7923723]
- Updated dependencies [7923723]
  - @drizztdourden08/brock-core@0.47.0
  - @drizztdourden08/brock-react@0.47.0
  - @drizztdourden08/brock-electron@0.47.0

## 0.46.0

### Minor Changes

- b1026b9: `listNames()` entries carry `assetBytes`, the size of the ROM's asset blob read from the file store's `stat` (`null` when there is none or the stat fails), still with no read and no hash, so a Data Manager can show "Extracted (12 MB)". `hasAssets` now comes from the same stat.
- b1026b9: Asset jobs run in a renderer Web Worker too, with no main process. `runAssetWebWorkerJob(options)` from `@drizztdourden08/brock-port-kit/renderer` takes the options of `runAssetWorkerJob` with the worker constructor of a `?worker` import, and the Web Worker serves the steps with `serveAssetSteps` from the new `@drizztdourden08/brock-port-kit/web-worker` entry. One `AssetWorkerSteps` object serves both sides: each step now gets the job's `workerData` as a third argument (the thread's `workerData` in Node, posted once to a Web Worker). The job is a renderer job: `jobs.start(id, steps, options?)` from brock-react returns the same `JobHandle` as `ctx.job`, its snapshots go into the job store, so the job dialog and the title bar show it on every host, and `jobs.cancel` and `jobs.dismiss` reach it. The job registry moved to brock-core (`createJobRegistry` and the `JobHandle`, `StartJob`, `JobRegistry` types from `@drizztdourden08/brock-core/jobs`); brock-electron re-exports the types as before.

### Patch Changes

- Updated dependencies [3df3667]
- Updated dependencies [b1026b9]
- Updated dependencies [025bcf7]
- Updated dependencies [c68c54a]
- Updated dependencies [025bcf7]
- Updated dependencies [025bcf7]
- Updated dependencies [b1026b9]
- Updated dependencies [c68c54a]
- Updated dependencies [56201a6]
- Updated dependencies [025bcf7]
- Updated dependencies [c68c54a]
- Updated dependencies [3df3667]
  - @drizztdourden08/brock-electron@0.46.0
  - @drizztdourden08/brock-core@0.46.0
  - @drizztdourden08/brock-react@0.46.0

## 0.45.1

### Patch Changes

- Updated dependencies [4ec937c]
  - @drizztdourden08/brock-electron@0.45.1
  - @drizztdourden08/brock-core@0.45.1
  - @drizztdourden08/brock-react@0.45.1

## 0.45.0

### Minor Changes

- bc553ba: `createGameCore(port, { watchCrashFrom: 'start' })` arms the crash watch when the core starts, before the glue script loads, so a WebAssembly runtime error while the core boots sets the `error` state and reaches `onCrash` instead of going unseen; the default `'running'` keeps today's behaviour. `watchCoreCrash` is exported for an app that loads its core itself.
- bc553ba: ensure-wasm finds the Emscripten SDK from a git worktree: when the worktree has none at a relative `emsdkDir`, the same folder of the main checkout is used, read from the worktree's `.git` file with no git call. `emsdkOf` reports `mainCheckout`, and `mainCheckoutOf(dir)` is exported. `$EMSDK` and an absolute `emsdkDir` still win.
- bc553ba: Save slots can write raw states: `createSaveSlots({ format: 'raw' })` and `createPortSession({ saveFormat: 'raw' })` write the core's state bytes as they are (after the save transform) instead of the PKSV container. Loading already took both.
- bc553ba: `RomStore.listNames()` (and the same call on each kind's store) lists the stored ROM files by name only, with no read and no hash: `{ file, label, hasAssets }`, for a listing that has to show at once.

### Patch Changes

- Updated dependencies [a85efb2]
- Updated dependencies [a85efb2]
- Updated dependencies [ef96908]
- Updated dependencies [a85efb2]
- Updated dependencies [aba2001]
- Updated dependencies [4caea84]
- Updated dependencies [fb41dd1]
  - @drizztdourden08/brock-react@0.45.0
  - @drizztdourden08/brock-core@0.45.0
  - @drizztdourden08/brock-electron@0.45.0

## 0.44.0

### Patch Changes

- Updated dependencies [716553d]
- Updated dependencies [716553d]
- Updated dependencies [126c8e8]
  - @drizztdourden08/brock-core@0.44.0
  - @drizztdourden08/brock-electron@0.44.0
  - @drizztdourden08/brock-react@0.44.0

## 0.43.0

### Patch Changes

- @drizztdourden08/brock-core@0.43.0
- @drizztdourden08/brock-electron@0.43.0
- @drizztdourden08/brock-react@0.43.0

## 0.42.0

### Patch Changes

- Updated dependencies [67c7a66]
  - @drizztdourden08/brock-react@0.42.0
  - @drizztdourden08/brock-core@0.42.0
  - @drizztdourden08/brock-electron@0.42.0

## 0.41.0

### Patch Changes

- Updated dependencies [8300ee8]
  - @drizztdourden08/brock-react@0.41.0
  - @drizztdourden08/brock-core@0.41.0
  - @drizztdourden08/brock-electron@0.41.0

## 0.40.0

### Patch Changes

- Updated dependencies
- Updated dependencies [9b081a6]
- Updated dependencies [ae74556]
- Updated dependencies [ae74556]
- Updated dependencies [efce654]
- Updated dependencies [efce654]
- Updated dependencies [efce654]
- Updated dependencies [ae74556]
- Updated dependencies [fb285af]
- Updated dependencies [73d8f8c]
- Updated dependencies [efce654]
- Updated dependencies [ae74556]
- Updated dependencies [1f778fd]
- Updated dependencies [ae74556]
  - @drizztdourden08/brock-core@0.40.0
  - @drizztdourden08/brock-electron@0.40.0
  - @drizztdourden08/brock-react@0.40.0

## 0.39.0

### Minor Changes

- 747028d: `runAssetWorkerJob(ctx, options)` (port-kit `/main`) runs an app's asset extraction steps in a worker thread as a `ctx.job`, with each step's progress, lines and log on the job and cancel ending the thread; the worker module serves its steps with `serveAssetSteps` from the new `/worker` entry.
- 7061680: The core's crash watch takes `crashArmDelayMs` (a runtime error that soon after a start is swallowed) and `onCrash({ message, error, event })` in `createGameCore` options, and reports only the first crash of a run.
- 7061680: ensure-wasm activates the Emscripten SDK on Windows through its `emsdk_env.bat` before the build script, and `skipWithoutSdk` (or `--skip-without-sdk`) skips a stale build when no SDK is found, resolving `'skipped'`; `emsdkOf` reports what it found.
- 747028d: Named saves rename, overwrite, prune and size: `rename` and `overwrite` keep the id, `prune` removes past the newest `keep` or older than `maxAgeMs`, `details` and `size` count each save's bytes, an entry carries an optional `meta`, and `createSaveStore(files, { companions })` removes a slot's companion files whenever it is written or removed.
- 7061680: `createLiveSettings({ calls, apply })` and `createSramSync({ read, store, profileId })` run without `createGameCore`, for an app that loads its core itself; `createCoreCalls(module)` is exported to build the calls of an Emscripten module.
- 7061680: `createGameCore(port, { precompiled })` instantiates a `WebAssembly.Module` the app compiled ahead (or a function resolving one) instead of fetching and compiling the core at each start; `compileCore(port)` compiles the core for such a warm-up.
- 747028d: The ROM store takes unknown dumps (`acceptUnknown`: stored under their SHA-1 and flagged `unknown` with their `hash`), zips (the single known dump inside, or with `acceptUnknown` a lone ROM file; any other zip is refused with a `message` listing what it held), a `maxBytes` limit and several ROM kinds (`rom.kinds`, each with its own known list, file rules and folder, through `store.of(kind)`); `remove` also deletes what the kind's `derived(file, files)` names and resolves the removed paths.
- 7061680: Save transform hooks: `createSaveSlots({ transform })` and `createPortSession({ saveTransform })` take `save(state, kind)`, which may be async, to change the core's state bytes before they are stored, and `load(state)` to change them back before the core loads them.

### Patch Changes

- Updated dependencies [6d7da6d]
- Updated dependencies [472754d]
- Updated dependencies [6d7da6d]
- Updated dependencies [6d7da6d]
- Updated dependencies [6d7da6d]
- Updated dependencies [bdfc457]
- Updated dependencies [bdfc457]
- Updated dependencies [c5fc205]
- Updated dependencies [0a63f1f]
  - @drizztdourden08/brock-react@0.39.0
  - @drizztdourden08/brock-core@0.39.0
  - @drizztdourden08/brock-electron@0.39.0

## 0.38.0

### Patch Changes

- @drizztdourden08/brock-core@0.38.0
- @drizztdourden08/brock-electron@0.38.0
- @drizztdourden08/brock-react@0.38.0

## 0.37.0

### Patch Changes

- Updated dependencies [12d3780]
- Updated dependencies [8eff741]
  - @drizztdourden08/brock-react@0.37.0
  - @drizztdourden08/brock-core@0.37.0
  - @drizztdourden08/brock-electron@0.37.0

## 0.36.0

### Minor Changes

- 1c018e1: Port kit can keep a ROM's original file name. `rom.keepFileName: true` in the port definition stores an imported ROM as `roms/<original name>` and its asset blob as `assets/<original stem><extension>` instead of `roms/<identity.id><ext>`, and `list()` then identifies each stored ROM by its SHA-1. Names with spaces, commas, brackets and parentheses are allowed; a name a disk would refuse is not. The default stays the identity id naming. The stored bytes are the normalized dump in both modes.
- 3c4c039: Port kit loads raw save states. A `.sav` that does not start with the `PKSV` header is no longer refused with `magic`: `decodeSaveSlot` reads it as the core's raw state, and `loadStateBytes`, `load` and `loadNamed` hand it to the core, so states and fixtures written before the kit keep loading. The decode result now carries `format` (`'pksv'` or `'raw'`), and `decodeSaveSlot(bytes, port, { acceptRaw: false })` keeps the strict check. A container cut inside its header is now `corrupt` instead of `magic`. Saving still writes the `PKSV` container.
- 1c967af: One wasm stale check, in port kit. `brock-plugin-snes` drops its own copy and now depends on `@drizztdourden08/brock-port-kit`: `snes.wasmBuild()` and `snes wasm build` ask port kit's `wasmStaleReason` and build through its `ensureWasm`, still with the plugin's defaults, the pinned SDK install and the main checkout's SDK folder. Port kit's `ensureWasm` takes `force: true` to build a current core, and `emsdkDir` may now be an absolute path. The SNES plugin's tests now run with the rest.

### Patch Changes

- Updated dependencies [273846f]
- Updated dependencies [e40fe59]
- Updated dependencies [aa74a6d]
- Updated dependencies [5289e5d]
- Updated dependencies [e40fe59]
- Updated dependencies [6f6977d]
- Updated dependencies [3063895]
- Updated dependencies [b42b735]
- Updated dependencies [b42b735]
- Updated dependencies [1ba51ae]
- Updated dependencies [0f4133a]
- Updated dependencies [cbbb865]
- Updated dependencies [524dcf3]
  - @drizztdourden08/brock-core@0.36.0
  - @drizztdourden08/brock-react@0.36.0
  - @drizztdourden08/brock-electron@0.36.0

## 0.35.0

### Patch Changes

- Updated dependencies [af0f5c5]
  - @drizztdourden08/brock-react@0.35.0
  - @drizztdourden08/brock-core@0.35.0
  - @drizztdourden08/brock-electron@0.35.0

## 0.34.0

### Patch Changes

- Updated dependencies [08e0cd1]
- Updated dependencies [80319dd]
- Updated dependencies [80319dd]
- Updated dependencies [80319dd]
- Updated dependencies [08e0cd1]
- Updated dependencies [80319dd]
- Updated dependencies [80319dd]
- Updated dependencies [b4dc453]
- Updated dependencies [6bdb953]
- Updated dependencies [80319dd]
  - @drizztdourden08/brock-electron@0.34.0
  - @drizztdourden08/brock-react@0.34.0
  - @drizztdourden08/brock-core@0.34.0

## 0.33.0

### Patch Changes

- Updated dependencies [274503e]
  - @drizztdourden08/brock-react@0.33.0
  - @drizztdourden08/brock-core@0.33.0
  - @drizztdourden08/brock-electron@0.33.0

## 0.32.1

### Patch Changes

- Updated dependencies [fb5fe3a]
  - @drizztdourden08/brock-react@0.32.1
  - @drizztdourden08/brock-core@0.32.1
  - @drizztdourden08/brock-electron@0.32.1

## 0.32.0

### Patch Changes

- Updated dependencies [92b662f]
  - @drizztdourden08/brock-core@0.32.0
  - @drizztdourden08/brock-react@0.32.0
  - @drizztdourden08/brock-electron@0.32.0

## 0.31.0

### Patch Changes

- Updated dependencies [6584277]
- Updated dependencies [6584277]
  - @drizztdourden08/brock-react@0.31.0
  - @drizztdourden08/brock-core@0.31.0
  - @drizztdourden08/brock-electron@0.31.0

## 0.30.0

### Patch Changes

- Updated dependencies [f0d71bd]
  - @drizztdourden08/brock-core@0.30.0
  - @drizztdourden08/brock-react@0.30.0
  - @drizztdourden08/brock-electron@0.30.0

## 0.29.1

### Patch Changes

- @drizztdourden08/brock-core@0.29.1
- @drizztdourden08/brock-electron@0.29.1
- @drizztdourden08/brock-react@0.29.1

## 0.29.0

### Patch Changes

- Updated dependencies [f3fd443]
- Updated dependencies [f3fd443]
  - @drizztdourden08/brock-react@0.29.0
  - @drizztdourden08/brock-core@0.29.0
  - @drizztdourden08/brock-electron@0.29.0

## 0.28.1

### Patch Changes

- Updated dependencies [8c8d415]
- Updated dependencies [8c8d415]
  - @drizztdourden08/brock-react@0.28.1
  - @drizztdourden08/brock-core@0.28.1
  - @drizztdourden08/brock-electron@0.28.1

## 0.28.0

### Patch Changes

- Updated dependencies [c426f9a]
- Updated dependencies [c426f9a]
- Updated dependencies [c426f9a]
- Updated dependencies [c426f9a]
  - @drizztdourden08/brock-react@0.28.0
  - @drizztdourden08/brock-core@0.28.0
  - @drizztdourden08/brock-electron@0.28.0

## 0.27.0

### Patch Changes

- Updated dependencies [f704655]
  - @drizztdourden08/brock-react@0.27.0
  - @drizztdourden08/brock-core@0.27.0
  - @drizztdourden08/brock-electron@0.27.0

## 0.26.0

### Patch Changes

- Updated dependencies [0204060]
  - @drizztdourden08/brock-react@0.26.0
  - @drizztdourden08/brock-core@0.26.0
  - @drizztdourden08/brock-electron@0.26.0

## 0.25.0

### Patch Changes

- Updated dependencies [8903da0]
- Updated dependencies [8903da0]
- Updated dependencies [8903da0]
- Updated dependencies [8903da0]
- Updated dependencies [8903da0]
  - @drizztdourden08/brock-react@0.25.0
  - @drizztdourden08/brock-core@0.25.0
  - @drizztdourden08/brock-electron@0.25.0

## 0.24.1

### Patch Changes

- Updated dependencies [0dd8c3c]
  - @drizztdourden08/brock-electron@0.24.1
  - @drizztdourden08/brock-react@0.24.1
  - @drizztdourden08/brock-core@0.24.1

## 0.24.0

### Patch Changes

- @drizztdourden08/brock-core@0.24.0
- @drizztdourden08/brock-electron@0.24.0
- @drizztdourden08/brock-react@0.24.0

## 0.23.0

### Patch Changes

- Updated dependencies [e769096]
- Updated dependencies [e769096]
- Updated dependencies [e769096]
  - @drizztdourden08/brock-react@0.23.0
  - @drizztdourden08/brock-core@0.23.0
  - @drizztdourden08/brock-electron@0.23.0

## 0.22.0

### Patch Changes

- Updated dependencies [73a287e]
- Updated dependencies [73a287e]
- Updated dependencies [73a287e]
- Updated dependencies [73a287e]
- Updated dependencies [73a287e]
- Updated dependencies [73a287e]
- Updated dependencies [73a287e]
- Updated dependencies [73a287e]
- Updated dependencies [73a287e]
  - @drizztdourden08/brock-react@0.22.0
  - @drizztdourden08/brock-core@0.22.0
  - @drizztdourden08/brock-electron@0.22.0

## 0.21.1

### Patch Changes

- Updated dependencies [0e425f6]
- Updated dependencies [0e425f6]
  - @drizztdourden08/brock-electron@0.21.1
  - @drizztdourden08/brock-core@0.21.1
  - @drizztdourden08/brock-react@0.21.1

## 0.21.0

### Patch Changes

- Updated dependencies [0999a18]
- Updated dependencies [6016488]
  - @drizztdourden08/brock-react@0.21.0
  - @drizztdourden08/brock-core@0.21.0
  - @drizztdourden08/brock-electron@0.21.0

## 0.20.0

### Patch Changes

- Updated dependencies [d700531]
  - @drizztdourden08/brock-react@0.20.0
  - @drizztdourden08/brock-core@0.20.0
  - @drizztdourden08/brock-electron@0.20.0

## 0.19.0

### Patch Changes

- Updated dependencies [df9c1df]
- Updated dependencies [df9c1df]
- Updated dependencies [df9c1df]
- Updated dependencies [df9c1df]
  - @drizztdourden08/brock-react@0.19.0
  - @drizztdourden08/brock-core@0.19.0
  - @drizztdourden08/brock-electron@0.19.0

## 0.18.0

### Patch Changes

- Updated dependencies [70d80cf]
- Updated dependencies [70d80cf]
- Updated dependencies [70d80cf]
- Updated dependencies [70d80cf]
- Updated dependencies [70d80cf]
- Updated dependencies [70d80cf]
- Updated dependencies [70d80cf]
- Updated dependencies [70d80cf]
- Updated dependencies [2473089]
- Updated dependencies [70d80cf]
- Updated dependencies [70d80cf]
- Updated dependencies [70d80cf]
- Updated dependencies [70d80cf]
- Updated dependencies [70d80cf]
- Updated dependencies [70d80cf]
- Updated dependencies [70d80cf]
- Updated dependencies [da0b1eb]
- Updated dependencies [70d80cf]
- Updated dependencies [70d80cf]
  - @drizztdourden08/brock-react@0.18.0
  - @drizztdourden08/brock-core@0.18.0
  - @drizztdourden08/brock-electron@0.18.0

## 0.17.1

### Patch Changes

- @drizztdourden08/brock-core@0.17.1
- @drizztdourden08/brock-electron@0.17.1
- @drizztdourden08/brock-react@0.17.1

## 0.17.0

### Patch Changes

- Updated dependencies [3a35c8e]
- Updated dependencies [3a35c8e]
- Updated dependencies [3a35c8e]
- Updated dependencies [3a35c8e]
- Updated dependencies [3a35c8e]
- Updated dependencies [d358df3]
- Updated dependencies [d358df3]
- Updated dependencies [d358df3]
- Updated dependencies [d358df3]
- Updated dependencies [d358df3]
- Updated dependencies [d358df3]
- Updated dependencies [055bb91]
- Updated dependencies [e70afc3]
- Updated dependencies [e70afc3]
- Updated dependencies [e70afc3]
- Updated dependencies [e70afc3]
- Updated dependencies [e70afc3]
- Updated dependencies [e70afc3]
- Updated dependencies [e70afc3]
- Updated dependencies [87fa9a3]
- Updated dependencies [87fa9a3]
- Updated dependencies [87fa9a3]
- Updated dependencies [87fa9a3]
  - @drizztdourden08/brock-core@0.17.0
  - @drizztdourden08/brock-electron@0.17.0
  - @drizztdourden08/brock-react@0.17.0

## 0.16.0

### Patch Changes

- Updated dependencies [7ef6122]
- Updated dependencies [7ef6122]
- Updated dependencies [7ef6122]
- Updated dependencies [7ef6122]
- Updated dependencies [7ef6122]
- Updated dependencies [7ef6122]
- Updated dependencies [9a3b1f6]
- Updated dependencies [7ef6122]
- Updated dependencies [55befe4]
- Updated dependencies [55befe4]
- Updated dependencies [55befe4]
- Updated dependencies [7ef6122]
- Updated dependencies [55befe4]
- Updated dependencies [7ef6122]
- Updated dependencies [7ef6122]
- Updated dependencies [7ef6122]
- Updated dependencies [7ef6122]
- Updated dependencies [55befe4]
- Updated dependencies [7ef6122]
- Updated dependencies [9a3b1f6]
- Updated dependencies [9a3b1f6]
- Updated dependencies [9a3b1f6]
- Updated dependencies [9a3b1f6]
- Updated dependencies [9a3b1f6]
- Updated dependencies [9a3b1f6]
- Updated dependencies [9a3b1f6]
- Updated dependencies [9a3b1f6]
- Updated dependencies [9a3b1f6]
- Updated dependencies [7ef6122]
- Updated dependencies [7ef6122]
  - @drizztdourden08/brock-react@0.16.0
  - @drizztdourden08/brock-core@0.16.0
  - @drizztdourden08/brock-electron@0.16.0

## 0.15.0

### Patch Changes

- Updated dependencies [96f7759]
- Updated dependencies [96f7759]
  - @drizztdourden08/brock-core@0.15.0
  - @drizztdourden08/brock-electron@0.15.0
  - @drizztdourden08/brock-react@0.15.0

## 0.14.0

### Patch Changes

- Updated dependencies [add0686]
  - @drizztdourden08/brock-electron@0.14.0
  - @drizztdourden08/brock-react@0.14.0
  - @drizztdourden08/brock-core@0.14.0

## 0.13.0

### Patch Changes

- Updated dependencies [33dc33c]
- Updated dependencies [4711645]
  - @drizztdourden08/brock-core@0.13.0
  - @drizztdourden08/brock-electron@0.13.0
  - @drizztdourden08/brock-react@0.13.0

## 0.12.0

### Patch Changes

- Updated dependencies [f751683]
- Updated dependencies [f751683]
- Updated dependencies [59c1c9d]
- Updated dependencies [f2b86ff]
  - @drizztdourden08/brock-react@0.12.0
  - @drizztdourden08/brock-core@0.12.0
  - @drizztdourden08/brock-electron@0.12.0

## 0.11.0

### Patch Changes

- Updated dependencies [48ca303]
- Updated dependencies [54d913a]
  - @drizztdourden08/brock-core@0.11.0
  - @drizztdourden08/brock-electron@0.11.0
  - @drizztdourden08/brock-react@0.11.0

## 0.10.0

### Patch Changes

- Updated dependencies [a265770]
- Updated dependencies [a265770]
- Updated dependencies [a265770]
- Updated dependencies [a265770]
  - @drizztdourden08/brock-react@0.10.0
  - @drizztdourden08/brock-core@0.10.0
  - @drizztdourden08/brock-electron@0.10.0

## 0.9.0

### Patch Changes

- Updated dependencies [28540bb]
  - @drizztdourden08/brock-core@0.9.0
  - @drizztdourden08/brock-electron@0.9.0
  - @drizztdourden08/brock-react@0.9.0

## 0.8.1

### Patch Changes

- @drizztdourden08/brock-core@0.8.1
- @drizztdourden08/brock-electron@0.8.1
- @drizztdourden08/brock-react@0.8.1

## 0.8.0

### Patch Changes

- Updated dependencies [b7c919a]
- Updated dependencies [dcdde4a]
  - @drizztdourden08/brock-electron@0.8.0
  - @drizztdourden08/brock-core@0.8.0
  - @drizztdourden08/brock-react@0.8.0

## 0.7.1

### Patch Changes

- Updated dependencies [e0ea131]
  - @drizztdourden08/brock-react@0.7.1
  - @drizztdourden08/brock-core@0.7.1
  - @drizztdourden08/brock-electron@0.7.1

## 0.7.0

### Patch Changes

- Updated dependencies [f6cfba5]
- Updated dependencies [6d32d18]
- Updated dependencies [f6cfba5]
  - @drizztdourden08/brock-core@0.7.0
  - @drizztdourden08/brock-react@0.7.0
  - @drizztdourden08/brock-electron@0.7.0

## 0.6.1

### Patch Changes

- Updated dependencies [227dadf]
  - @drizztdourden08/brock-react@0.6.1
  - @drizztdourden08/brock-core@0.6.1
  - @drizztdourden08/brock-electron@0.6.1

## 0.6.0

### Patch Changes

- Updated dependencies [0d9b68a]
  - @drizztdourden08/brock-react@0.6.0
  - @drizztdourden08/brock-core@0.6.0
  - @drizztdourden08/brock-electron@0.6.0

## 0.5.0

### Patch Changes

- Updated dependencies [ff027d0]
- Updated dependencies [241d164]
  - @drizztdourden08/brock-core@0.5.0
  - @drizztdourden08/brock-electron@0.5.0
  - @drizztdourden08/brock-react@0.5.0

## 0.4.0

### Patch Changes

- Updated dependencies [f90c7ee]
- Updated dependencies [babbff5]
  - @drizztdourden08/brock-react@0.4.0
  - @drizztdourden08/brock-core@0.4.0
  - @drizztdourden08/brock-electron@0.4.0

## 0.3.0

### Patch Changes

- Updated dependencies [dde5d7e]
  - @drizztdourden08/brock-react@0.3.0
  - @drizztdourden08/brock-core@0.3.0
  - @drizztdourden08/brock-electron@0.3.0

## 0.2.0

### Patch Changes

- Updated dependencies
- Updated dependencies [f818087]
- Updated dependencies [374cf2f]
  - @drizztdourden08/brock-react@0.2.0
  - @drizztdourden08/brock-core@0.2.0
  - @drizztdourden08/brock-electron@0.2.0

## 0.1.2

### Patch Changes

- Updated dependencies [db1a6be]
- Updated dependencies [25be8fe]
- Updated dependencies [f60b232]
  - @drizztdourden08/brock-react@0.1.2
  - @drizztdourden08/brock-core@0.1.2
  - @drizztdourden08/brock-electron@0.1.2

## 0.1.1

### Patch Changes

- 2cb1dd3: New port-kit module: runs a game compiled to WebAssembly from a typed port definition, with saves, SRAM, video, audio, live settings, a ROM source, an asset pipeline runner and ensure-wasm.
- Updated dependencies [0a52cd7]
- Updated dependencies [ade72f8]
- Updated dependencies [9a08468]
- Updated dependencies [c48024b]
- Updated dependencies [e406f70]
- Updated dependencies [fd0a736]
- Updated dependencies [8498845]
- Updated dependencies [f62f048]
- Updated dependencies [38edbcc]
- Updated dependencies [068a02d]
- Updated dependencies [b1fa12d]
- Updated dependencies [ae6b8e2]
- Updated dependencies [14c3674]
- Updated dependencies [2cc7040]
- Updated dependencies [7e039b6]
- Updated dependencies [9fdc2e1]
- Updated dependencies [d50bd75]
- Updated dependencies [23907ce]
- Updated dependencies [a8a87be]
- Updated dependencies [e2cf0ee]
  - @drizztdourden08/brock-core@0.1.1
  - @drizztdourden08/brock-electron@0.1.1
  - @drizztdourden08/brock-react@0.1.1
