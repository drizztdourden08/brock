---
'@drizztdourden08/brock-react': minor
---

Brock moves to Tessera 0.68. A docked toolbar has a context menu: a right click, Shift+F10 or the Menu key opens Show labels, Move to (Top, Bottom, Left, Right) and Hide toolbar. They are three new commands, `toolbar.labels`, `toolbar.moveTo` and `toolbar.hide`, that take the toolbar id (and the side) as `args`, and the Toolbars menu now holds the same entries in a sub-menu for each shown toolbar. The labels flag and the side are saved in the toolbar layout, and `useToolbarLayoutStore` gains `hide`, `setLabels` and `moveToSide`. Pass `slot.labels` to Tessera's `Toolbar` as `labels`. `ToolbarHost` draws each toolbar inside a `display: contents` element that carries the zone `brock.toolbar` (`TOOLBAR_ZONE`); the command ids are `TOOLBAR_COMMANDS`.

Context menu items carry `data-menu-entry` (the command id, else the label), and an entry `reason` is now also the item's `aria-description`. Focus returns to the opener through Tessera's `ContextMenu`, so Brock's own focus code is gone. `contextMenuHandler(zone, data?)` returns an `onContextMenu` handler for the Tessera parts that report a right click with an id, such as `DocumentTabs` `onTabContextMenu` and `StatusBar` `onItemContextMenu`.
