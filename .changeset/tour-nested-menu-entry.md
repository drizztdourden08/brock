---
'@drizztdourden08/brock-react': minor
---

A tour step can light an entry in a submenu. `target: { menuEntry }` takes a path, `{ menuEntry: ['Advanced', 'Take the tour'] }`, and a plain label is now searched for in the submenus too. Brock opens each parent submenu in order with a click, as a pointer would, before the step lights the entry, and the submenus close with the menu when the step ends. An entry that is not there leaves the step centred.
