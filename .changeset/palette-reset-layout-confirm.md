---
'@drizztdourden08/brock-react': patch
---

A menu entry with `confirm`, such as Widgets > Reset layout, asks before it runs from the Ctrl+K palette too. Its row carries a compact `ConfirmIconButton` (`size="xs"`) in the `action` slot; pressing it, the row or Enter asks with the check and the X. The check runs the entry and closes the palette, and the X or Escape cancels and leaves the palette open. Before, the palette ran Reset layout at once.
