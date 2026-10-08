---
'@drizztdourden08/brock-thread': minor
'@drizztdourden08/brock-build': patch
---

Each worktree has its own base branch, so a repo can run a whole migration on an integration branch while its main branch keeps moving. `worktree create --base <branch>` sets it and starts the worktree there; a `--from` that names an origin branch makes that branch the base unless `--base` says otherwise. The base is stored in git config as `branch.<branch>.brockBase`, so it follows the branch through `finish`, a resume and a rename, and goes with `git branch -D`. `refresh --rebase` rebases on it, `pr open` opens the PR into it, `pr status` says when the PR targets another branch, and `finish` and `remove` treat the branch as landed once its commits are on the base, then delete it instead of leaving it behind. `worktree base [name] [<new base>]` shows or changes it. A branch that another branch names as its base is never deleted with a worktree. A worktree made before this has no entry and keeps the workspace base; after a fresh clone, resuming a branch takes the base of its open PR.
