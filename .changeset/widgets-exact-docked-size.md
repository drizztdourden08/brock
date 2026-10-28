---
"@drizztdourden08/brock-react": patch
---

`widgets.dock(id, { size })` and `widgets.resize(id, px)` now give a docked widget the exact width asked for, also when the other side already holds a widget. Before, the size was a share of the window that Tessera applied to the inner side only, so a right widget asked for 300 px could end near 230 and the left one shrank when the right one was docked. Brock now measures the real stage, sets the width, and puts the other docked side back to its pixels. Both calls return `{ size, reason }`: the width the widget ended with, and a plain sentence when the 5% to 90% edge limit changed the request.
