---
'@drizztdourden08/brock-core': minor
'@drizztdourden08/brock-electron': minor
'@drizztdourden08/brock-react': minor
---

A destination folder field with a dry run of the write check. `documents.canWrite(folder)` (channel `document:canWrite`, optional on the port) runs the checks of a new file in that folder (grant, write classes, links, the app's own folders) and writes nothing and grants nothing. It answers `{ ok: true, path }` with the real folder, or `{ ok: false, reason }`. `DocumentFolderField` takes `value`, `onChange`, `label`, `roots` and `disabled`. It is a Tessera `PathInput` for folders: Browse opens the folder dialog, which grants the pick, a typed or dropped folder is checked with `canWrite` and the reason shows under the field, and `roots` are offered as a short list.
