---
'@drizztdourden08/brock-electron': minor
---

`@drizztdourden08/brock-electron/node` exports the data paths (`initPaths`, `getUserDataPath`, `getLegacyPath`, `ensureDataDirectories`, `resolveDataPath`), the JSON helpers (`readJsonFile`, `writeJsonFile`) and `createNodeFileStore` with no Electron import, so a test of main-side code runs under plain Node without mocking Electron.
