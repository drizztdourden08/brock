---
'@drizztdourden08/brock-react': minor
---

A user can hide single toolbar items and choose how many columns a vertical toolbar uses, and the app moves to Tessera 0.87, which is now the lowest supported version. Nothing else changes.

- `defineToolbar` takes `items`, a list of `{ id, label }`. The toolbar right-click menu lists them under Items, one check each, and a toolbar on the left or right also gets Columns (1 column, 2 columns, Auto). Both choices are saved in the toolbar layout and reach `render(slot)` as `slot.hiddenItems` and `slot.columns`; pass them to Tessera's `Toolbar` as `hiddenItems` and `columns`.
- New commands `toolbar.item` and `toolbar.columns`, and the facade calls `toolbars.items(id, hiddenIds)` and `toolbars.columns(id, count)`. `toolbars.list()` gains `hiddenItems` and `columns`.
- A toolbar ruled out by `when` leaves no bar, no border and no empty lane, and the saved layout is not changed.
