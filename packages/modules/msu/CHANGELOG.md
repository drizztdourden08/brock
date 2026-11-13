# @drizztdourden08/brock-msu

## 0.122.0

### Patch Changes

- Updated dependencies [3dedc49]
- Updated dependencies [fdc2c9e]
- Updated dependencies [9a2b877]
  - @drizztdourden08/brock-react@0.122.0
  - @drizztdourden08/brock-tools@0.122.0
  - @drizztdourden08/brock-core@0.122.0
  - @drizztdourden08/brock-electron@0.122.0

## 0.121.0

### Minor Changes

- 5031d68: New `@drizztdourden08/brock-msu/format` entry exposes the MSU-1 format constants (`MSU1_MAGIC_TEXT`, `MSU1_HEADER_BYTES`, `MSU1_SAMPLE_RATE`, `MSU1_CHANNELS`, `MSU1_BYTES_PER_FRAME`) and `msu1FrameCount`.
- 207e6af: New module brock-msu, the shared MSU-1 and MSU-L music module. The game supplies its track loops, music classifier, sound channels and save paths through `defineMsuGame`, and the core calls through an `MsuHost`.
- 12d5cb4: The MSU module gains its host side and the first part of its studio UI. A new `msu` IPC namespace carries `.msul` reading, the optimize measure and convert run with progress events, and the audio probe. The main entry holds the handlers and the ffmpeg tool definition, and the renderer entry holds `defineMsuStudio`, `MsuStudioProvider`, the music debugger widget, file audition and `useMsulOpen`. The renderer also exposes `createMsuStore(game, deps)`, the pack store behind the studio, and `useMsuStudio()`, which returns the game and the store.

### Patch Changes

- fc626de: New brock-core subpath `util` with the shared `mulberry32` and `itemAt`. The msu, input and randomizer modules now import them from core instead of keeping their own copies.
- b074ccb: The MSU renderer now has a default export so the host can load it. MsuStudioPage, MsuStudioProvider and createMsuStore accept any game built with defineMsuStudio, whatever its Ctx and Target.
- Updated dependencies [4fdf3fc]
- Updated dependencies [fc626de]
- Updated dependencies [eca6521]
- Updated dependencies [33ce702]
- Updated dependencies [a1382a3]
- Updated dependencies [11fca93]
- Updated dependencies [48bec99]
- Updated dependencies [de3e01a]
- Updated dependencies [8403f85]
- Updated dependencies [19f0362]
- Updated dependencies [9d171e3]
- Updated dependencies [2238ad1]
- Updated dependencies [24626e9]
- Updated dependencies [36c43fe]
- Updated dependencies [ad2d364]
- Updated dependencies [c56e771]
- Updated dependencies [2c06b16]
- Updated dependencies [054cf0c]
  - @drizztdourden08/brock-core@0.121.0
  - @drizztdourden08/brock-electron@0.121.0
  - @drizztdourden08/brock-react@0.121.0
  - @drizztdourden08/brock-tools@0.121.0
