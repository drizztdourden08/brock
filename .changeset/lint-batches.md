---
"@drizztdourden08/brock-build": patch
---

`brock lint` on the whole tree now runs eslint in batches of 1000 files, one process after the other, and exits with the worst code of all batches. The memory of a run no longer grows with the tree, which fixes the out of memory crash of the full-tree lint in CI. Each batch gets a 4096 MB heap ceiling (it was 2048 MB for the whole run), and each keeps its own cache file. A changed-files run and a run on named files stay one process at 2048 MB. `BROCK_LINT_BATCH_SIZE` sets another batch size, `BROCK_LINT_MEMORY_MB` and a heap flag in `NODE_OPTIONS` still win, and `BROCK_LINT_STATS=1` prints each batch's peak memory.
