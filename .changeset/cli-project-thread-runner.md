---
'@drizztdourden08/brock': patch
---

The global brock no longer falls back to a stale bundled brock-build for thread verbs. With no project brock-build, it runs worktree, launch, pr, release and the other thread verbs through the project's own brock-thread. When the local remote mode is on and the chosen runner does not know it, release, pr, replay and publish are refused with one line that names the runner version and the fix.
