---
'@drizztdourden08/brock-react': patch
---

The app review reads the saved widget layout where the app writes it. With a workspace active, the layout is saved under that workspace in `workspaces`, not as the profile's `widgetLayout`, so `pop-out-bounds-stored` and `pop-out-restart-restores` failed on apps with workspaces even though the bounds were saved. The checks now read the active workspace's layout.

`floating-widget-resizes` now expects the floating widget's edge to snap to the main view's edge when the grown edge lands within the float snap distance (10 pixels). The resize was right; the check ignored the snap.
