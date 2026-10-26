---
'@drizztdourden08/brock-react': minor
---

Four small additions for Bxel. A context menu entry takes `tone: 'danger'` and passes it to the drawn item. `SettingsPreviewLayout` and its props type are exported from the barrel, so a page outside settings can use the two column preview layout. The preview column is now a `complementary` landmark named by a `label` prop (default "Preview", `previewLabel` on `SettingsLayout`, `TabDef` and `meta`), and the rows column a `region` named "Settings"; both are F6 stops. `listContextMenus()` now lists every registered menu, mounted or not, with a `mounted` flag on each, and the new `defineContextMenu(id, source)` registers a menu at module scope so a test can inspect its entries before any zone mounts.
