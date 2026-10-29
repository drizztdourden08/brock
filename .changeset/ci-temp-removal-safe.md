---
'@drizztdourden08/brock-thread': patch
---

Make every delete in brock-thread safe against links, so removing a worktree can never delete files of the main checkout.

- Every delete goes through one function. It deletes only strictly inside the folder its caller owns, by path and by real path. It removes a symlink or a junction as a link and never follows it. It refuses a main checkout and a folder with a `.git` folder inside.
- `worktree remove`, `worktree finish`, the leftover and remnant removal, the `.user-data` delete and the `ci` temporary worktree removal remove every link in the worktree first, before `git worktree remove` runs. Git for Windows follows a junction when it deletes a folder.
- The git calls of a removal ignore `GIT_DIR`, `GIT_WORK_TREE` and the other variables that name a repository.
- `ci` keeps its temporary worktree in `<parent>/.brock-ci/<repo folder>`, outside the checkout. A step whose working directory leaves it is not run. A run that deleted a tracked file of the main checkout fails with a `DATA LOSS` summary.
