---
'@drizztdourden08/brock-build': minor
---

`packaging` in `brock.config.ts` adds to the managed electron-builder config and to `vpk pack`: `extraResources` from the app folder, an `afterPack` module of the app that runs after Brock's own hook, a macOS `role` and an `icon` per file association, and `velopackIcons` for the icon `vpk pack` takes on Windows and Linux.
