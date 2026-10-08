<!-- @layer docs @kind doc -->
# @drizztdourden08/brock-plugin-snes

The SNES PC-port bundle for the Brock thread CLI: everything a port of a SNES game needs and nothing a plain app does.

```
<repo> snes wasm build [--force]     build the C core to WebAssembly with the pinned Emscripten SDK
<repo> snes rom check <file>         SHA-1 against the ROMs the workspace lists
<repo> snes vault sync | status      the private save-state fixture vault
<repo> snes vault force-push "<msg>" one-sided overwrite; asks
```

Provision steps a workspace places itself: `snes.copyAssetBlob()` (the ROM and its extracted asset blob into the worktree's user data), `snes.seedSaveStates()` (the fixture saves into the profile). Build step: `snes.wasmBuild()`. Launch hook: `snes.saveStateOf` turns a state name or a quick-slot number into the app's launch flags and refuses a state that does not exist.

The wasm stale check and the build run are port kit's (`@drizztdourden08/brock-port-kit/ensure-wasm`), a dependency of this plugin; the plugin keeps its own defaults (`snes.wasm` in the workspace: the core under `core/`, the output in `apps/web/public/wasm`), the pinned SDK install, and the SDK folder of the main checkout, which every worktree builds with. The save-state fixtures the vault holds may be raw core states or port kit `PKSV` containers; port kit loads both.
