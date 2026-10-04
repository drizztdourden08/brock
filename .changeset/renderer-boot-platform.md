---
'@drizztdourden08/brock-react': minor
---

Renderer boot tasks get `platform` (the resolved platform: `filePicker`, `files`, `storage`, `window`, `device`, `capabilities`) and `openExternal` beside `product` and `profile`, so a task that registers a search action can open the file picker or a link.
