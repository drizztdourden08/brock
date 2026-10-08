---
'@drizztdourden08/brock-build': patch
---

The managed CI workflows (the app's, the workspace's and a site's) also run on a push to the default branch, `base` of `brock.workspace.mjs` else `main`, where releases and release notes land straight; a newer run cancels an older one of the same pull request only.
