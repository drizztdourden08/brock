---
'@drizztdourden08/brock-thread': patch
---

`<repo> upgrade` writes its report to `.brock/upgrade-report.md` in the worktree instead of the tracked root, still excluded from git through `.git/info/exclude`, and prints its path. The `pr open` hint names the new path.
