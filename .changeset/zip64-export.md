---
'@drizztdourden08/brock-electron': patch
---

Zip exports write zip64 records past 65535 files or 4 GB, and the reader follows them, so a zip export has no practical limit.
