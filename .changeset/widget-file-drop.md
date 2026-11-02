---
'@drizztdourden08/brock-react': minor
'@drizztdourden08/brock-build': minor
---

Add `defineWidget({ drop })`, a file drop zone on a widget body that takes an OS drop or an app drag of paths, filters by extension, caps the files per drop, and reads them through the documents read port as bytes or text. `useFileDropZone` gives the same rules to any element. A widget file may set `drop` in its meta.
