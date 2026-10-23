---
'@drizztdourden08/brock-core': minor
'@drizztdourden08/brock-electron': minor
'@drizztdourden08/brock-react': minor
---

Recent documents and recovery snapshots for document apps. The documents port gains `recent()`, `clearRecent()` and `openRecent(path)`, a capped per-profile list that main fills on Open and on save, drops missing files from, feeds to the OS jump list and Dock menu, and reopens only through the document allowlist. It also gains opt-in `snapshot(key, data)`, `recoverable()`, `restoreSnapshot(key)` and `discardSnapshot(key)`, stored atomically in the profile folder and cleared on a clean save. brock-react adds `useRecentDocuments`, `useRecentMenu`, `useRecoverable` and an optional `RecoveryPrompt`.
