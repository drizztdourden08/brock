---
'@drizztdourden08/brock-react': minor
---

Widgets and toolbars have a stable API for code that drives the layout, such as an assistant. `widgets.list()` returns a plain snapshot of every widget: visible, docked side, size and index, floating rect, popped, and whether its context is active. New calls: `widgets.dock(id, { side, size, index })`, `float(id, rect)`, `resize(id, size or rect)`, `focus(id)`, `presets()`, `applyPreset(name)` (plus `registerPresets` to name presets) and `subscribe(listener)`. The new `toolbars` object does the same for toolbars: `list`, `show`, `hide`, `moveToSide(id, side, row)`, `labels(id, on)`, `reset` and `subscribe`. An unknown id throws an error that names the known ones.
