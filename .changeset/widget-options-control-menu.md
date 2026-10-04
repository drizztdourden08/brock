---
'@drizztdourden08/brock-react': patch
---

A popped widget window passes its options to Tessera's `Widget.options`, so the gear opens `WidgetOptions` in a `ControlMenu`, with the drag shortcuts as a `ShortcutList`. Its title strip is marked `data-app-region="drag"` and the Search button `no-drag`, in place of Brock's `-webkit-app-region` rules, so a click on the strip closes an open menu (tessera-66, I-61).
