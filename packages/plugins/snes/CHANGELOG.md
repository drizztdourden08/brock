# @drizztdourden08/brock-plugin-snes

## 0.37.0

### Patch Changes

- Updated dependencies [38244b2]
- Updated dependencies [38244b2]
  - @drizztdourden08/brock-thread@0.37.0
  - @drizztdourden08/brock-port-kit@0.37.0

## 0.36.0

### Minor Changes

- e40fe59: The SNES plugin carries no game of its own. `snes.roms.sha1` is empty by default, so `snes rom check` knows no ROM until the workspace lists the hashes it accepts under `snes.roms.sha1` in `brock.workspace.mjs`. The core output defaults to port kit's `public/wasm` (the plugin now starts from port kit's `WASM_DEFAULTS`); a port whose core goes elsewhere sets `snes.wasm.output`. The flags `snes.saveStateOf` gives the app come from the new `snes.states.launchFlags`, `{ game: [...], save: [...] }` with `{state}` replaced by the save name or quick slot; the defaults are `--start-game` and `--load-state=<state>`, and an app whose main process reads other flags sets its own there. The plugin README documents the options with an example.
- 1c967af: One wasm stale check, in port kit. `brock-plugin-snes` drops its own copy and now depends on `@drizztdourden08/brock-port-kit`: `snes.wasmBuild()` and `snes wasm build` ask port kit's `wasmStaleReason` and build through its `ensureWasm`, still with the plugin's defaults, the pinned SDK install and the main checkout's SDK folder. Port kit's `ensureWasm` takes `force: true` to build a current core, and `emsdkDir` may now be an absolute path. The SNES plugin's tests now run with the rest.

### Patch Changes

- Updated dependencies [5a819b6]
- Updated dependencies [34ef26d]
- Updated dependencies [b8f4eed]
- Updated dependencies [e40fe59]
- Updated dependencies [1c018e1]
- Updated dependencies [3c4c039]
- Updated dependencies [e40fe59]
- Updated dependencies [0aaabeb]
- Updated dependencies [b42b735]
- Updated dependencies [1ba51ae]
- Updated dependencies [1c967af]
- Updated dependencies [7fc554a]
  - @drizztdourden08/brock-thread@0.36.0
  - @drizztdourden08/brock-port-kit@0.36.0

## 0.35.0

### Patch Changes

- @drizztdourden08/brock-thread@0.35.0

## 0.34.0

### Patch Changes

- Updated dependencies [08e0cd1]
  - @drizztdourden08/brock-thread@0.34.0

## 0.33.0

### Patch Changes

- @drizztdourden08/brock-thread@0.33.0

## 0.32.1

### Patch Changes

- @drizztdourden08/brock-thread@0.32.1

## 0.32.0

### Patch Changes

- @drizztdourden08/brock-thread@0.32.0

## 0.31.0

### Patch Changes

- @drizztdourden08/brock-thread@0.31.0

## 0.30.0

### Patch Changes

- @drizztdourden08/brock-thread@0.30.0

## 0.29.1

### Patch Changes

- @drizztdourden08/brock-thread@0.29.1

## 0.29.0

### Patch Changes

- @drizztdourden08/brock-thread@0.29.0

## 0.28.1

### Patch Changes

- @drizztdourden08/brock-thread@0.28.1

## 0.28.0

### Patch Changes

- @drizztdourden08/brock-thread@0.28.0

## 0.27.0

### Patch Changes

- @drizztdourden08/brock-thread@0.27.0

## 0.26.0

### Patch Changes

- @drizztdourden08/brock-thread@0.26.0

## 0.25.0

### Patch Changes

- @drizztdourden08/brock-thread@0.25.0

## 0.24.1

### Patch Changes

- @drizztdourden08/brock-thread@0.24.1

## 0.24.0

### Patch Changes

- @drizztdourden08/brock-thread@0.24.0

## 0.23.0

### Patch Changes

- @drizztdourden08/brock-thread@0.23.0

## 0.22.0

### Patch Changes

- Updated dependencies [73a287e]
  - @drizztdourden08/brock-thread@0.22.0

## 0.21.1

### Patch Changes

- @drizztdourden08/brock-thread@0.21.1

## 0.21.0

### Patch Changes

- @drizztdourden08/brock-thread@0.21.0

## 0.20.0

### Patch Changes

- @drizztdourden08/brock-thread@0.20.0

## 0.19.0

### Patch Changes

- @drizztdourden08/brock-thread@0.19.0

## 0.18.0

### Patch Changes

- Updated dependencies [70d80cf]
  - @drizztdourden08/brock-thread@0.18.0

## 0.17.1

### Patch Changes

- Updated dependencies [1ebfc4c]
- Updated dependencies [1ebfc4c]
  - @drizztdourden08/brock-thread@0.17.1

## 0.17.0

### Patch Changes

- @drizztdourden08/brock-thread@0.17.0

## 0.16.0

### Patch Changes

- Updated dependencies [7ef6122]
- Updated dependencies [55befe4]
- Updated dependencies [7ef6122]
  - @drizztdourden08/brock-thread@0.16.0

## 0.15.0

### Patch Changes

- @drizztdourden08/brock-thread@0.15.0

## 0.14.0

### Patch Changes

- @drizztdourden08/brock-thread@0.14.0

## 0.13.0

### Patch Changes

- @drizztdourden08/brock-thread@0.13.0

## 0.12.0

### Patch Changes

- @drizztdourden08/brock-thread@0.12.0

## 0.11.0

### Patch Changes

- @drizztdourden08/brock-thread@0.11.0

## 0.10.0

### Patch Changes

- @drizztdourden08/brock-thread@0.10.0

## 0.9.0

### Patch Changes

- @drizztdourden08/brock-thread@0.9.0

## 0.8.1

### Patch Changes

- Updated dependencies [03dcade]
  - @drizztdourden08/brock-thread@0.8.1

## 0.8.0

### Patch Changes

- Updated dependencies [98b5318]
  - @drizztdourden08/brock-thread@0.8.0

## 0.7.1

### Patch Changes

- @drizztdourden08/brock-thread@0.7.1

## 0.7.0

### Patch Changes

- @drizztdourden08/brock-thread@0.7.0

## 0.6.1

### Patch Changes

- @drizztdourden08/brock-thread@0.6.1

## 0.6.0

### Patch Changes

- @drizztdourden08/brock-thread@0.6.0

## 0.5.0

### Patch Changes

- @drizztdourden08/brock-thread@0.5.0

## 0.4.0

### Patch Changes

- @drizztdourden08/brock-thread@0.4.0

## 0.3.0

### Patch Changes

- @drizztdourden08/brock-thread@0.3.0

## 0.2.0

### Patch Changes

- Updated dependencies [1f2ce71]
- Updated dependencies [e19834d]
- Updated dependencies [374cf2f]
  - @drizztdourden08/brock-thread@0.2.0

## 0.1.2

### Patch Changes

- @drizztdourden08/brock-thread@0.1.2

## 0.1.1

### Patch Changes

- Updated dependencies [0a52cd7]
- Updated dependencies [568c900]
- Updated dependencies [f6a334e]
- Updated dependencies [8dec315]
- Updated dependencies [8498845]
- Updated dependencies [d78f430]
- Updated dependencies [a8a87be]
- Updated dependencies [97496b7]
  - @drizztdourden08/brock-thread@0.1.1
