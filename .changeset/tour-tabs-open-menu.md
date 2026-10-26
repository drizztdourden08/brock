---
'@drizztdourden08/brock-react': minor
---

A first-run tour step can light the page tab strip with `target: { shell: 'tabs' }`. A step also takes `openMenu`, which opens a title bar menu before the step lights its target and closes it when the step ends: `'menu'` is the app menu, and any other id is the title bar action menu with that id. A new target, `{ menuEntry: 'Take the tour' }`, lights the entry of an open menu by its label.
