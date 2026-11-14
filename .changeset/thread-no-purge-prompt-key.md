---
'@drizztdourden08/brock-thread': patch
---

Worktree and upgrade installs pass `--config.confirm-modules-purge=false`. The old camelCase key was ignored by pnpm, so an install with no terminal still stopped on ERR_PNPM_ABORTED_REMOVE_MODULES_DIR_NO_TTY when it had to recreate node_modules.
