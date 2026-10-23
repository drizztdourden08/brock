---
'@drizztdourden08/brock-react': minor
'@drizztdourden08/brock-core': minor
'@drizztdourden08/brock-build': minor
---

Breaking: `matchesShortcut`, `parseShortcut` and `ParsedShortcut` are removed from brock-react, and `Mod` now means only the platform key. Apps move to `commands.matches`, `commands.chords` and `formatChord`; migration `shortcut-helpers-removed` turns each use into a to-do.

A command keymap. Every shortcut is now a command in one registry: `{ id, label, icon?, group?, chord?, scope?, whileTyping?, when?, run }`. A chord is `'Mod+S'`, a list, or `{ mac, other }`, and `Mod` is Ctrl on Windows and Linux and Cmd on macOS. An app declares commands with `<BrockApp commands>`, `RendererModule.commands`, `useCommands(defs)` in a screen (with `scope` set to the screen id) or `commands.register(defs)`, and runs one with `commands.run(id)`.

One dispatcher resolves chords. A plain key does nothing while the user types in a field, a Mod chord still fires, and `whileTyping` changes that. A scoped command wins over a global one while its screen is open.

Users remap chords on the new `KeymapPage`, which an app adds as a settings page file. Remaps are stored per profile in the settings under `keymap` (`BaseSettings.keymap`, `KeymapOverrides` in brock-core). The page shows conflicts and resets one row, a group or all. `commands.remap`, `commands.reset` and `commands.conflicts` do the same from code.

Menus, title bar tooltips and the Ctrl+/ dialog read the current chord from the registry, so a remap shows everywhere at once. A menu entry takes `command`, and a title bar button spec takes `command` in place of `onSelect`; `brock-build` keeps `command` in a lazy title bar button.

Brock's own shortcuts moved onto the registry with the same defaults: Search (Mod+K), Keyboard shortcuts (Mod+/), Toggle fullscreen (Alt+Enter) and Go back (Alt+Left, now listed in the dialog). Screen and page shortcuts are `open:<route>` commands. `Mod` now means only the platform key, so Win+K no longer opens Search on Windows. `matchesShortcut`, `parseShortcut` and `ParsedShortcut` are removed; use `commands.matches(id, event)` and `formatChord`.
