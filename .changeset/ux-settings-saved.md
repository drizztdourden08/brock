---
'@drizztdourden08/brock-react': minor
---

Settings saves report their state: the settings store adds `saveStatus`, `saveError`, `savedAt` and `retrySave()`, the settings and hub headers show Saved after a write or Not saved with Retry, and a failed write raises a danger toast.
