---
'@drizztdourden08/brock-react': patch
---

Add `CommandDef.widget`: a command that fires only while that widget is the active one. The active widget is the one the user last pressed or focused, so its commands work although widgets never hold focus; a press in the main view or a close of the widget clears it, and a popped window's widget is active while its window has focus. A widget command ranks after a zone command and before a screen command, and two commands on one chord with different widgets are not a conflict. `activeWidget()` and `useActiveWidget()` read the active widget id.
