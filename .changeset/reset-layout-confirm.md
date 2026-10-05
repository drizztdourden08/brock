---
'@drizztdourden08/brock-react': patch
---

Reset layout in the Widgets menu asks first, in place, like Tessera's `ConfirmIconButton`: the first click turns the entry into Click again to reset and keeps the menu open, the second resets, and it goes back after 5 s. Any title bar menu item can do the same with `confirm: '<armed label>'` (`useMenuConfirmStore`).
