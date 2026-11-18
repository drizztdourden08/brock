---
'@drizztdourden08/brock-i18n': minor
'@drizztdourden08/brock-electron': minor
---

New `brock-i18n` module: the stored app and profile language, system detection, `window.api.i18n`, the `--lang` switch and a Language settings tab. `MainModule` gains a `beforeReady(ctx)` hook that runs before the app is ready, and `offeredLocales()` from `brock-electron/main` lists the tags the app ships.
