---
"@drizztdourden08/brock-thread": patch
---

Fix `worktree remove` failing with "ENOENT lstat" when an ignored folder was already gone because its parent was deleted first. A vanished path is now skipped at every step of the delete, the ignored folders are listed once with children of a listed parent dropped, and the removal goes on to `git worktree remove` and prune. The check that a path stays inside the worktree is unchanged.
