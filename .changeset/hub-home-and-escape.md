---
'@drizztdourden08/brock-react': patch
---

Hub navigation: the Home entry, and Escape with nothing open, always open the home hub on its home page (`nav.home(id)`, `open(id, params, { fresh: true })`, a menu item with `fresh: true`), while the hub switch and a hub's own menu entry still reopen the page it was left on. Escape goes up one level, a sub-page to its page and a page to the hub home, then closes the hub; Back, Alt+Left and the mouse Back button keep walking the whole history. The review checks Escape going up and then closing.
