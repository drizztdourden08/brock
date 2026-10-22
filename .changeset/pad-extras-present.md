---
'@drizztdourden08/brock-input': patch
---

`PadState.extras` now lists only the controls the device has. An Xbox pad with no paddles no longer shows ten dead rows. The list comes from the device's `hasButton` capabilities, which the addon already reports, so no new addon is needed. The paddles get the names of the pad's family: P1 to P4 on Xbox, RB, LB and the two Fn buttons on PlayStation, GR and GL on Nintendo. The ids stay the same. `padStateOf` takes an optional third argument, a `DeviceEntry` or `{ family, hasButton }`. When a device sent no capabilities, all ten extras are listed as before.
