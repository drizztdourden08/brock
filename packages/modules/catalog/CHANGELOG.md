# @drizztdourden08/brock-catalog

## 0.39.0

### Minor Changes

- bdfc457: App code can tell an item is installing without its own copy of the job id: `CATALOG_JOB_PREFIX`, `catalogJobId(itemId)` and `isCatalogInstalling(itemId, jobs)` come from every entry of the catalog module. `jobs` is a job list (the renderer's job store, `ctx.jobs.list()`) or anything with a `list()`, such as `ctx.jobs`.
- bdfc457: `readInstalledRecords(source)` from `@drizztdourden08/brock-catalog/main` reads `catalog/installed.json` with no main context, for a boot task, a test or another process. `source` is a `FileStore` rooted at `Data/`, the `Data/` folder itself, or the path of the JSON file; a missing or damaged file reads as no records.
- bdfc457: `FileStore` has an optional `trash(path)`. The Node store behind `ctx.files` moves the path to the system trash (`shell.trashItem`) and skips one that is not there. A catalog uninstall or update hands its installer a store whose `remove` goes to the trash when the store has one, falling back to deleting when the trash refuses; `removeTo: 'delete'` in the catalog config deletes as before.
- bdfc457: `JobHandle.setCancellable(on)` turns cancel off (or back on) while a job runs; the snapshot's `cancellable` follows, so the job dialog hides Cancel and `jobs.cancel` is ignored. A catalog install and a tool install turn it off once the download is in, before the checks and the unpack, and `installBarProps` leaves out `onCancel` then, so `CatalogInstallBar` shows no Cancel past the download.

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

- 5289e5d: New module `@drizztdourden08/brock-catalog` (`brock add catalog`): a content catalogue client. The app configures it once with `configureCatalog(ctx, config)`: its endpoint and headers, its schema validators, its routes, an installer per container, a size cap, an install link scheme and release hooks. The renderer reads the home, the whole list and one item over `window.api.catalog`; installs run as Brock jobs (`catalog-install:<id>`: grant, download, verify, unpack) that stream the download to a temp file, check its size and sha256 against the grant before anything is unpacked, and can be cancelled while they download; an update installs the new copy before it releases and removes the old one. The installed record lives in `Data/catalog/installed.json`, and `useCatalogInstalled`, `installedRecordOf` and `installedByName` give every screen the installed guard. Install links (`<scheme>://install/<id>?v=<n>`) are parsed strictly, held until the renderer takes them with `useCatalogLinks`, and taken from `ctx.onOpen` for the scheme the product declares in `product.protocols`. `CatalogInstallBar` draws install, update, uninstall and the live progress with Tessera parts; the app tree gains its answer under actions.

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
