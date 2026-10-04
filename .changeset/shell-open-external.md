---
'@drizztdourden08/brock-electron': minor
---

`openExternal(url)` from `@drizztdourden08/brock-electron/main` opens a link through the same protocol allow list as the renderer (`security.externalProtocols`), so app main code no longer calls Electron's `shell.openExternal` directly. A refused link is logged and resolves false.
