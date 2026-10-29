<!-- @layer docs @kind doc -->
# @drizztdourden08/build-cache

A per-user cache of compiled `@drizztdourden08` package versions and Electron binaries, shared by every project and worktree on the machine. It imports no Brock or Tessera package, so Brock, Tessera and a site that uses Tessera alone can all depend on it. The on-disk contract is in `docs/build-cache.md` of the Brock repo.

```js
import { buildCachePlugin } from '@drizztdourden08/build-cache/vite';
import { restoreElectron, storeElectron } from '@drizztdourden08/build-cache/electron';
import { cacheRoot, listEntries } from '@drizztdourden08/build-cache';
```

- `buildCachePlugin({ rootDir, when })` serves installed `@drizztdourden08` packages to a Node build from the cache: each version is compiled once with esbuild, copied to `<rootDir>/node_modules/.build-cache/node_modules/<name>/` and imported at runtime instead of bundled. `when(config)` picks the builds that use it; the default is a development SSR build. Brock's Vite factory wires it into the Electron main build of `electron-vite dev`.
- `restoreElectron(packageDir)` copies the Electron binary of the installed version from the cache, checked against its hash, and returns `restored`, `ready`, `missing` or `skipped`. `storeElectron(packageDir)` adds an installed binary to the cache when it has none.
- `listEntries(cacheRoot())` reads every entry and its manifest.

The cache never deletes an entry; Argus prunes it.
