---
'@drizztdourden08/brock-electron': minor
---

The clipboard backend runs on the async clipboard of Electron 45 and on Electron 38 to 44. It picks the API the running Electron has: the sync calls up to 44, and `clipboard.read`, `clipboard.write` and `ClipboardItem` from 45. The clipboard watch never starts a poll while the previous one is still reading.
