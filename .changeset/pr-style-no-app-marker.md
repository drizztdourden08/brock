---
'@drizztdourden08/brock-thread': patch
---

`worktree commit` and `pr open` no longer refuse a message that carries one app's commit hook marker. That marker meant something only in the repo whose hook reads it, so a repo that wants the refusal keeps it in its own hook. The attribution and co-author check stays.
