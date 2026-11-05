---
'@drizztdourden08/brock-game-info': minor
---

`CheatsShell` is the frame of a cheats widget with no game in it: a tab bar, the active tab remembered per widget, and a gate that shows a reason in place of the tabs while cheats are off. The game passes its tabs as `{ id, label, render }` and the shell draws only the active one. `CheatsShell` and `CHEATS_WIDGET_ID` are exported from `./renderer`.

The block kind `described` is a game state section: rows with a label, a value, an optional tone and badge, and a description that opens when the label is clicked. The game supplies the rows as data, so a game info section can carry its game state with no game in the module.
