---
'@drizztdourden08/brock-thread': minor
---

`pr push` now pushes the base branch from the main checkout, for every repo of the family. Run it with no name on the base branch there, or name the base branch. It fetches origin first, refuses a diverged base with the commit counts of each side, never forces, and states the count, the range and the commit subjects before it pushes. A base branch checked out in a worktree is still refused.
