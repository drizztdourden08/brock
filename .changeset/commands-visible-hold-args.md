---
'@drizztdourden08/brock-react': minor
---

Commands can hide on a surface, hold a key, take bound arguments and be opened from the palette with a query. Menus now read a command's gates.

- `CommandDef.visible()` hides a command that does not apply here. It does not fire, it is left out of `commands.list()` (pass `{ includeHidden: true }` to keep it), the palette search, the app menu and the context menu, and `commands.describe(id)` reports `visible: false`. `CommandDef.only` names the surface; two commands on one chord with different `only` values are no longer a conflict, and the Keyboard page shows both meanings and keeps a hidden command that has `only` so it can be rebound.
- A `MenuItem.command` entry is disabled with the command's reason as its description, and is dropped when hidden. A context menu command entry takes its description from the command's reason and drops a hidden command.
- `CommandDef.hold: { release, tapMs? }` runs on key down, ignores key repeat and calls `release` once on key up, on a lost modifier, on blur, on a hidden window and when the listeners go. The Keyboard page marks such a command. `commands.heldModifiers()` reads the modifiers now held, for a pointer drag.
- `CommandDef.args` is an argument schema. `commands.run` refuses bad arguments with `why: 'invalid'`. `commands.bind`, `unbind` and `bindings` bind a chord to fixed arguments; the binding is saved in the keymap setting and shows as its own row. A menu command with a missing option value opens a value picker in the palette.
- `palette.open({ query, scope })` and `palette.pick({ title, options, onPick })`.
- Context menus take a `selection` (a set of keys) from `openContextMenu`, from the new `contextMenu.openAt(element, data, options)` or from the config, and pass it to the command in the context.

Upgrade: `commands.run` can now resolve with `why: 'hidden'` or `why: 'invalid'`, and `CommandDescription` has a `visible` field. A `switch` over `why` that must cover every case (a `never` check) stops compiling until it handles `'hidden'` and `'invalid'`. A command with no `visible` is never hidden, so nothing changes at run time for an existing app.
