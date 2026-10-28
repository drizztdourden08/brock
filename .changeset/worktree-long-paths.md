---
"@drizztdourden08/brock-thread": patch
---

Make `worktree finish` and `worktree remove` work on Windows when `node_modules` holds paths past 260 characters. Git runs with long paths on, the ignored folders are deleted first through Node (links are removed, never followed, and nothing outside the worktree is touched), and a locked file is retried and then reported instead of hanging.
