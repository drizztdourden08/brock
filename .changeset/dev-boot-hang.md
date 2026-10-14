---
'@drizztdourden08/brock-build': patch
'@drizztdourden08/brock-electron': patch
---

A dev launch no longer gets stuck on the splash. The splash plugin loaded brock-core through `vite.runnerImport` on every `index.html` and `splash.html` request, which took over 20 s inside a busy dev server; it now works the look out once per dev server, starting when the server starts, and again only when `brock.config.ts` or a file it reads changes. When the renderer answers after the boot watchdog fired (a heartbeat, progress, or a late `boot:ready`), main clears the watchdog's failure, the splash goes back to the progress and the app is revealed as usual; the app window's `did-finish-load` now counts as a sign of life too. The development watchdog waits 120 s instead of 30 s.
