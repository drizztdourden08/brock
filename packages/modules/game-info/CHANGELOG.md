# @drizztdourden08/brock-game-info

## 0.122.0

### Patch Changes

- Updated dependencies [3dedc49]
- Updated dependencies [fdc2c9e]
- Updated dependencies [9a2b877]
  - @drizztdourden08/brock-react@0.122.0

## 0.121.0

### Minor Changes

- 054cf0c: `CheatsShell` is the frame of a cheats widget with no game in it: a tab bar, the active tab remembered per widget, and a gate that shows a reason in place of the tabs while cheats are off. The game passes its tabs as `{ id, label, render }` and the shell draws only the active one. `CheatsShell` and `CHEATS_WIDGET_ID` are exported from `./renderer`.

  The block kind `described` is a game state section: rows with a label, a value, an optional tone and badge, and a description that opens when the label is clicked. The game supplies the rows as data, so a game info section can carry its game state with no game in the module.

- e1be74a: New module brock-game-info: one game info widget shared by every game. The game supplies a provider (a snapshot reader, a section list, its core and lock signals) and the module polls, diffs and draws it.

### Patch Changes

- Updated dependencies [33ce702]
- Updated dependencies [a1382a3]
- Updated dependencies [11fca93]
- Updated dependencies [48bec99]
- Updated dependencies [19f0362]
- Updated dependencies [9d171e3]
- Updated dependencies [2238ad1]
- Updated dependencies [24626e9]
- Updated dependencies [36c43fe]
- Updated dependencies [ad2d364]
- Updated dependencies [c56e771]
- Updated dependencies [054cf0c]
  - @drizztdourden08/brock-react@0.121.0
