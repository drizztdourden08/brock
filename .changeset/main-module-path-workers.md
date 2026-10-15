---
'@drizztdourden08/brock-build': patch
---

A main process worker imported with `?modulePath` now builds. The managed main config named `electron/main.ts` as a library entry, which made electron-vite's worker bundle return one output per library format and stopped the build; it is now a build input, so `import workerPath from './job.worker?modulePath'` gives a file beside `main.js` that `new Worker(workerPath)` and port-kit's `runAssetWorkerJob` start. A test builds such a worker through the managed config and runs it.
