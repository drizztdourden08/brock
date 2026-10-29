---
"@drizztdourden08/brock-thread": minor
---

Development can now stay on the machine. A local mode switch (`~/.coord/remote.json`, local when the file is missing) makes the thread verbs stop calling `gh` and stop fetching or pushing: `pr push`, `pr open` and `release` print what they would do and that it waits for replay. A new `ci` verb (`<repo> ci`, also `brock ci`) runs the repo's gate steps in a temporary worktree at a commit with an offline install and writes one check-run record per run to `~/.coord/ci/<project>/`, with a log file per step. A new `pr merge --local PR-n` merges a pull request with git, only when the newest check run of its head commit has every required step passing. `publish.requiredChecks` in `brock.workspace.mjs` names the required steps.
