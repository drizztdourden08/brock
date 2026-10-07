---
'@drizztdourden08/brock-electron': patch
---

Two writes of the same data domain file at once no longer fail with ENOENT on the rename. Each write goes through a temp file of its own (`<file>.<uuid>.tmp`, removed when the write fails), and writes to one file run one at a time in call order, so the last call wins.
