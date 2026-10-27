---
'@drizztdourden08/brock-electron': minor
'@drizztdourden08/brock-core': minor
---

An app can now restart itself and hand a short note to its next run. `restartApp({ handoff, window })` from `brock-electron/main` relaunches the app with the same arguments and the same window mode (or `'show'` or `'background'`), and `takeRestartHandoff()` reads the note on the next boot. The note is a JSON value of at most 64 KB kept in a private file in the user data folder, deleted on the first read, ignored after 60 seconds and ignored when malformed. The renderer can read it once with `api.takeRestartHandoff()` (`app:takeHandoff`). It is not a secret store, only a short handoff. `brock-core/ipc` also exports `isJsonValue`.
