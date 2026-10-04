---
'@drizztdourden08/brock-thread': patch
---

`worktree create` and `upgrade` start the new worktree from the local base branch when it is ahead of `origin`, instead of the older `origin/<base>`. When the two have diverged they stop and say so; `--from <ref>` still picks the start by hand.
