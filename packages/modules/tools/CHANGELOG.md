# @drizztdourden08/brock-tools

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

- bdfc457: A tool installed while the app runs is found. `getTools` reads the PATH on each lookup (at most every 2 s): on Windows the process PATH merged with the saved machine and user PATH from the registry, elsewhere the process PATH. `ToolsEnv.pathEnv` takes a string or a function. Main sends `tools:changed` after an install (`window.api.tools.onChanged`), and `useTool(id, { refreshOnFocus? })` locates the tool again on that event and whenever the window gets focus (on by default), beside its `refresh()`.
- bdfc457: A registered tool can carry a `probe` and an `aroundRun` hook. `probe: { binary?, args?, timeoutMs?, read? }` runs the found binary (`--version` by default) and reads the result; the default reader passes on exit code 0 and takes the first dotted number as the version. `probe` can also be a function of the found paths. A copy that fails its probe counts as not found, so the lookup moves on to the next folder, and a passing one puts its `version` on `ToolState` and `ToolLocation`. A result is kept until the binary's size or time changes. `aroundRun(call, next)` wraps every run of the tool, the probe included, and may change the call or the result. `systemPath()` and `readVersion` are exported.

### Patch Changes

- bdfc457: `JobHandle.setCancellable(on)` turns cancel off (or back on) while a job runs; the snapshot's `cancellable` follows, so the job dialog hides Cancel and `jobs.cancel` is ignored. A catalog install and a tool install turn it off once the download is in, before the checks and the unpack, and `installBarProps` leaves out `onCancel` then, so `CatalogInstallBar` shows no Cancel past the download.
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

- 524dcf3: New module `@drizztdourden08/brock-tools` (`brock add tools`): external binaries an app declares, such as ffmpeg and ffprobe. `getTools(ctx).register({ id, label, binaries, version?, downloads?, resolveDownload?, usePath?, installHint? })` adds a tool; `state` finds it in `Data/tools/<id>/<version>` or on `PATH`, `install` runs the `tool:<id>` job (download through `net.fetch`, size and SHA-256 check, unpack from zip, tar or a bare file, one rename into the cache), and `run` spawns a binary with an argument array, a timeout and a line callback. The renderer gets `window.api.tools` and `useTool(id)`. brock-electron exposes its zip reader and writer as `@drizztdourden08/brock-electron/zip`, and `brock add` knows the `tools` id.

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
