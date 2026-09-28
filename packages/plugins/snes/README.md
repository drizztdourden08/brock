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
