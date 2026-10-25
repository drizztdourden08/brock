---
'@drizztdourden08/brock-react': minor
---

A settings row drawn by `renderControl` keeps the standard row chrome: the title, the description, the hint, the row actions and the lock, with the custom control in the control slot like a built-in control. A setting item takes `layout: 'wide'` to draw a wide editor at the full width of the row, below the title and description, and `chrome: false` to keep the old behaviour where `renderControl` owns the whole row. A hidden hub home page stays out of the side nav like any other hidden page and the hub still opens on it by route. When the home is the only page shown, it stays in the nav as before. The side nav is drawn once two pages are listed, not counting a hidden home.
