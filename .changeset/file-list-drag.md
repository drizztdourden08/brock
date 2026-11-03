---
'@drizztdourden08/brock-react': patch
---

Add `useFileListDrag`, which makes a list row a drag source of `dnd.paths` with `origin: 'app'`, so one `onDrop` takes an app drag and an OS drop. Add `dnd.indexAmong(selector, axis)`, an `index` callback that gives the insert index among the matching children, so an app tab strip can take a drop at a tab index.
