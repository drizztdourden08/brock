---
'@drizztdourden08/brock-react': minor
---

An opt-in menu bar row. Pass `<BrockApp menuBar>` a list of `{ id, label, entries }` menus whose entries are command ids, `'separator'` or `{ label, entries }` submenus, and the app draws a row of menu buttons under the title bar. Labels, icons and chords come from the command registry, so a remap shows at once, and an entry is greyed out while the command's `when()` is false. Alt opens the first menu, the arrow keys move between menus and items, and Escape closes. The hamburger stays.
