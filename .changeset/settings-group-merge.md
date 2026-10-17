---
'@drizztdourden08/brock-react': minor
'@drizztdourden08/brock-display': minor
---

A module settings tab now joins the app's settings group of the same name instead of drawing a second one. Before, an app whose settings bucket declared `{ id: 'app', label: 'App' }` showed two App groups once brock-display added its Display tab. `TabDef` takes `groupId`, a stable id for its group: a tab joins the nav group with that id, else the group whose label is its `group` (trimmed, any case). Inside the group the app's own pages come first, in their `meta.order`, then the tabs in the order the app's `settings.tabs` and the modules list them. A tab that matches no group starts one after the app's groups, and later tabs with the same id or label join it. The Display tab now has `groupId: 'app'`. The review's `buckets` step fails a hub whose nav shows two groups with the same label (`<bucket>-nav-groups`).
