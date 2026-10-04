---
'@drizztdourden08/brock-react': minor
---

A popped widget window mounts the standard overlays (the confirm dialog, the bug report dialog and the toasts) and registers the escape layers, so `confirmAction` and `toast` work there. `StandardOverlays` now holds the confirm dialog, and its `menu` is optional: without it the palette is left out. brock-react exports `useWindowKind()` (`{ kind: 'main' }` or `{ kind: 'widget', id }`) and `widgetWindowId()`.
