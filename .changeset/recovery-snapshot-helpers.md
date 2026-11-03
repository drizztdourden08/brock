---
'@drizztdourden08/brock-electron': patch
---

The `/node` entry exports `recoveryDir(userDataDir, profileId)`, `listRecoverySnapshots(userDataDir, profileId?)` and `SNAPSHOT_EXT`, so an e2e test can poll for the first recovery snapshot without knowing the folder layout. Main and the helpers build the folder from the same functions.
