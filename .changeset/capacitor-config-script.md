---
'@drizztdourden08/brock-build': patch
---

Brock keeps one Capacitor config, the managed `capacitor.config.json` at the app root, and supports no `capacitor.config.ts`. The Capacitor CLI loads a `.ts` or `.js` config before the JSON, so one left beside it would silently replace the managed file: `platform add android` now fails on its first step while either sits at the app root, and names what to do. docs/upgrading-an-app.md (Android) gives the move for an app with `apps/mobile/capacitor.config.ts`, as Relic of the Past has: the Android project into `mobile/android`, the plugins into the app's `package.json`, the `build.gradle` paths, version and signing variables, then `platform add android` and `cap sync`.
