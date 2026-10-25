---
'@drizztdourden08/brock-input': patch
---

`resolveDeviceFromEntry` and `recallControllerSdlType` are now exported from the root entry `@drizztdourden08/brock-input` too, so code with no UI, such as a worker, can use them without pulling React and Tessera through the renderer entry. The renderer entry keeps them.
