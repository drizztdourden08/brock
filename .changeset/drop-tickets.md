---
'@drizztdourden08/brock-electron': patch
---

`document:vetDrop` now grants only paths that were really dropped in that window. The preload catches each trusted `drop` event, reads the paths with `webUtils.getPathForFile` and sends them to main on an internal channel that `window.api` never exposes. Main keeps those tickets per window (64 paths, 15 seconds, one use per path) and refuses any other path with `The path was not dropped`. Page script can no longer call `documentVetDrop` to get a folder grant without a user action.
