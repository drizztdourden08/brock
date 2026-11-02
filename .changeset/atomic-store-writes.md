---
'@drizztdourden08/brock-electron': patch
'@drizztdourden08/brock-core': patch
---

The node file store now writes through the atomic write (temp file, then rename, one write at a time per path), so overlapping writes no longer leave broken JSON. readJson no longer hides a JSON parse error: it logs the path and the message, keeps the bad text in a `.corrupt-<time>` file beside it and returns the fallback.
