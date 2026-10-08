# @drizztdourden08/brock-port-kit

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
