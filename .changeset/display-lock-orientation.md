---
'@drizztdourden08/brock-display': minor
---

`lockOrientation(mode)` from `brock-display/renderer` turns and holds the screen on Android: 'landscape' and 'portrait' lock to that orientation, 'any' follows the device again. It resolves to `true` when the lock applied and to `false` off Android, so desktop callers need no check. The `OrientationLock` type is exported with it.
