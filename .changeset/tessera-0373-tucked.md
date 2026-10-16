---
'@drizztdourden08/brock-react': patch
'@drizztdourden08/brock-build': patch
---

Moves to Tessera ^0.37.3. With View hidden, the title bar now lists a tucked pin and full screen button in its own main menu, so Brock drops its own `window-pin` and `window-fullscreen` entries and stops reading the bar's markup for tucked buttons. Pin and full screen are plain actions with no check mark. The `window-pin` and `window-fullscreen` menu keys are still accepted without an unknown key warning, but Tessera takes no label or place for these rows, so the keys no longer rename, move or hide anything. `brock check` no longer warns when View, Pin on top and Full screen are all out of the menu, since the tucked buttons now always stay in the menu.
