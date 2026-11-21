# @drizztdourden08/brock-msu

## 0.123.0

### Minor Changes

- 37c4812: The tools, catalog, secrets and msu modules ship their strings as message keys in their own namespaces. `ToolDef.installHint`, `ToolState.hint` and the catalog install bar text are `Text`. Tessera object entries such as `anchor.names` and `toolbars.sides` render one key per sub-key and are read back the same way.
- 9d28100: A job line is a `Text`. `JobHandle.step`, `progress`, `line` and `done` take a string or a `msg` key with values, and `JobSnapshot.line` carries it. The job dialog, the catalog install bar and the MSU import form show it in the active language.

### Patch Changes

- 3ea4088: Widget, widget kit, kit overlay, kit requirement and job titles now accept message references and resolve them where they are shown.
- Updated dependencies [0fe02f3]
- Updated dependencies [3e043d7]
- Updated dependencies [5318153]
- Updated dependencies [5fb12dc]
- Updated dependencies [9901976]
- Updated dependencies [6136c5f]
- Updated dependencies [c9ba35d]
- Updated dependencies [373bb8c]
- Updated dependencies [6610b88]
- Updated dependencies [37c4812]
- Updated dependencies [5a6a830]
- Updated dependencies [4eb231d]
- Updated dependencies [b078210]
- Updated dependencies [4f09316]
- Updated dependencies [b947306]
- Updated dependencies [a546d43]
- Updated dependencies [8b666df]
- Updated dependencies [228e793]
- Updated dependencies [3ea4088]
- Updated dependencies [9d28100]
- Updated dependencies [1078faa]
- Updated dependencies [2237d1c]
- Updated dependencies [d92503d]
- Updated dependencies [61a5682]
  - @drizztdourden08/brock-electron@0.123.0
  - @drizztdourden08/brock-core@0.123.0
  - @drizztdourden08/brock-react@0.123.0
  - @drizztdourden08/brock-tools@0.123.0

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
