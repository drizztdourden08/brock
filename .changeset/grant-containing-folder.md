---
'@drizztdourden08/brock-core': minor
'@drizztdourden08/brock-electron': minor
'@drizztdourden08/brock-react': minor
---

`documents.open` and `documents.saveAs` take `grantFolder: 'ask'` or `{ ask: true, levels }` to grant the folder of the picked file, after a native confirm that names the exact folder, with the refused-root checks and the remembered folders of `openFolder`; the answer then carries `folderGranted` and a reason.
