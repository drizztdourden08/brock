---
'@drizztdourden08/build-cache': patch
'@drizztdourden08/brock-build': patch
---

A renderer pre-bundle restored from the build cache no longer imports files from the checkout that built it. Vite writes each CSS import of a package as an absolute path into that checkout's package store. A fresh worktree loaded those files from the main checkout, and Vite could refuse them as outside its allow list, so the window never showed. The stored bundle files now keep paths into the package store and the install folder as tokens, and a restore points them at the worktree's own store. Entries of the old layout are no longer restored, and the pre-bundle key moves to a new version.
