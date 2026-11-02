---
'@drizztdourden08/create-brock': patch
'@drizztdourden08/brock-build': patch
---

A new app starts with a `.gitattributes` that holds `* text=auto eol=lf`, so a git worktree on Windows checks files out with LF like the main checkout. `brock adopt` writes the same file when the repo has none and keeps one that exists.
