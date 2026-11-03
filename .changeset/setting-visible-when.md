---
'@drizztdourden08/brock-react': patch
---

Add `visibleWhen` to a settings item: `{ key, equals }` or `{ key, notEquals }` shows the row only while another setting has (or lacks) a value. It is plain data, applies on the page, in search and in the settings catalog, and a hidden row keeps its stored value. It combines with `visible` (both must hold).
