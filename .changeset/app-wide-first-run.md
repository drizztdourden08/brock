---
'@drizztdourden08/brock-core': minor
'@drizztdourden08/brock-react': minor
---

Guided tours belong to the app now, not to a profile. The app marks its first use once, in `app.json` (`firstRun`: `pending`, then `done`), and a `trigger: 'first-run'` tour starts once on that first use, after the boot and the splash, whichever profile is active; making another profile later never starts it again. Tour progress (finished tours and the step to resume at) is kept app-wide in `app.json` as `tours`, so a tour finished in one profile is finished in all of them.

An install that already has profiles or saved views is never on its first use: on the first launch after the upgrade the marker is set to `done`, so a first-run tour an app adds in a later version does not start by itself there; it is under Take the tour and in search. That launch also moves every profile's tour progress from `ui-views.json` (`profile:<id>.tours`) into the app-wide record, keeping any tour any profile started or finished, and removes the profile keys. Nothing in the app's source changes.

brock-core adds `updateAppState(files, change)`, which applies changes to `app.json` one after another so the profile switch and the tour progress never overwrite each other; the profile store's `setLast` and `remove` use it. `AppState` gains the optional `firstRun` and `tours`. brock-react exports `updateAppState(change)` from its profiles API, bound to the platform `FileStore`.
