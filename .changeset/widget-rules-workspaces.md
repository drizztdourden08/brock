---
'@drizztdourden08/brock-react': minor
---

Widgets and toolbars can follow the app's state, and layouts can be kept per workspace. Nothing existing changes.

- `defineWidget` takes `when` (a `ShowRule`) and `contexts` (a list) beside `context`. A widget with any of them is context-only and is available when one of its contexts is active and its rule passes. `widgets.list()` reports it in `available`.
- `defineToolbar` takes `when`. A toolbar whose rule fails is not drawn and is left out of the Toolbars menu, and the user's layout and hidden list are not touched. `toolbars.list()` has a new `available` field.
- `widgets.setTitle(id, text)` sets a dynamic title such as a count. `defineWidget` takes `empty`, drawn when a forced widget has no context.
- `defineWidget` takes `prefs`, setting items kept as widget prefs. They show in the widget's own options menu and in one Widgets tab of Settings, with the same value in both.
- `defineToolbar` takes `contextEntries(itemId)`. Mark an item with `toolbarItemZone(itemId)` and its menu shows those entries above Brock's.
- Workspaces: `defineWorkspace`, `registerWorkspaces` and the `workspaces` facade. A workspace with a `when` rule turns on by itself, keeps its own widget and toolbar layout in the profile views, and has Reset. The Widgets menu gets a Workspace sub-menu. The standard layout keeps its saved keys, so no profile data moves and no migration is needed. Widget kits take `when` too.
- `layout.focusMode(on)` hides every widget, toolbar and open kit and restores them. The command `brock.focus_mode` toggles it. The hidden state is never saved.

Not built: per-item toolbar visibility and `columns` in the toolbar layout, which wait for a Tessera `ToolbarLayout` change.
