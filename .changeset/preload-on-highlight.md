---
'@drizztdourden08/brock-react': patch
---

Screens now preload from Tessera 0.37.1's `onHighlight` instead of matching the hovered row's label text. Every title bar menu item that opens a screen, every hub nav entry, every hub switch pill and every search palette row with a target preloads the route it opens when it is pointed at, focused, reached with the arrow keys or, in the palette, becomes the active row. Two rows with the same label, a renamed menu entry and a moved one each load their own screen. `usePreloadOnHover` and its label lookup are gone.
