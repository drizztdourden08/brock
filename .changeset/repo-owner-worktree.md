---
'@drizztdourden08/brock-build': patch
---

`brock sync` finds the repo owner for `workflows.publish` in a linked git worktree too. It follows the `.git` file to the main repository's config instead of reading only a `.git` folder, so a worktree no longer falls back to the `repository` field of the root package.json.
