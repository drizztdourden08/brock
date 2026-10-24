---
'@drizztdourden08/brock-input': minor
---

`input.mapping.list()` entries now carry `source` (`builtin`, `bundled` or `user`), the `mapping` string and `inputCount`, the number of bound inputs the line declares. Main works out the source from the bundled and user database files, so the addon is unchanged.
