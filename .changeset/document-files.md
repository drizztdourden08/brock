---
'@drizztdourden08/brock-core': minor
'@drizztdourden08/brock-electron': minor
'@drizztdourden08/brock-react': minor
---

Document files at user paths. The renderer gets `usePlatform().documents` on Electron: `open`, `saveAs`, `read`, `readText`, `write` and `writeText`, over the new `document:*` channels (`documentOpen`, `documentSaveAs`, `documentRead`, `documentReadText`, `documentWrite`, `documentWriteText`). Open and Save As return the absolute path or null on cancel. A write is atomic: temp file beside the target, flush, rename over it, retried while Windows holds the target. The renderer may touch only a path the user picked in a dialog this session or one main code allows with the new `ctx.documents.allow(path)`. Data domain writes now flush before the rename too.
