---
'@drizztdourden08/brock-build': patch
'@drizztdourden08/brock-thread': patch
---

A dev launch (the review's included) leaves `dist/electron/main.js` without a built renderer, and a later `brock start` opened a blank window. `brock start` now spots that half build (no `dist/renderer/index.html`, or one older than main) and runs `brock build` first. `launchAppForTest` and `assertLaunchable` throw with the reason instead of opening a blank window, and `launch --prod` refuses with it.
