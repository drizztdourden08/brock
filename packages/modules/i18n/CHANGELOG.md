# @drizztdourden08/brock-i18n

## 0.123.0

### Minor Changes

- 4f09316: New `brock-i18n` module: the stored app and profile language, system detection, `window.api.i18n`, the `--lang` switch and a Language settings tab. `MainModule` gains a `beforeReady(ctx)` hook that runs before the app is ready, and `offeredLocales()` from `brock-electron/main` lists the tags the app ships.

### Patch Changes

- f111cf2: The README says how an app translates the Brock namespaces in its own tables, since Brock ships English only.
- b947306: brock sync now types the keys of package text tables. React, Electron and the i18n module declare their locale folder, so `msg('brock-app:...')`, `msg('brock-main:...')` and `msg('i18n:...')` pass the `keyof Messages` check in an app. An app table that overrides a package key gives one member, not two. The package base tables still load from the packages, so the bundle does not change.
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
